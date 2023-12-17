import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import { getServerSession } from "next-auth";
import DB from "./utils/db";
import { IsUpdateNeeded } from "./utils/apiUtils";
import { UpsertSummoner } from "./utils/riot";
import { authOptions } from "./auth/[...nextauth]";
import { SendTelegramMessage } from "./utils/webhook";

dayjs.extend(timezone); // use plugin
dayjs.extend(utc); // use plugin

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions); // TODO expires 검사

  if (!session || !session.user) {
    return res.json({ code: 401, message: "Expired Session" });
  }

  const { id } = session.user;

  const { method } = req;

  if (method === "GET") {
    const db = DB();

    // 로그 저장 추가
    try {
      const { firstConnection } = req.query;

      if (firstConnection) {
        let ip;
        let message;
        if (req.headers["x-forwarded-for"]) {
          ip = req.headers["x-forwarded-for"];
          message = "x-forwarded-for";
        } else {
          ip = req.connection.remoteAddress;
          message = "remoteAddress";
        }

        const nowDate = dayjs().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");
        const startDate = dayjs(nowDate).format("YYYY-MM-DD 00:00:00");
        const endDate = dayjs(nowDate).format("YYYY-MM-DD 23:59:59");

        const existingSession = await db("session_logs")
          .select("no")
          .where("created_at", ">=", startDate)
          .where("created_at", "<=", endDate)
          .first();

        if (!existingSession) {
          await db("session_logs").insert({
            ip,
            message,
            created_at: nowDate,
          });
          SendTelegramMessage(200, "유저 접속함");
        }
      }
    } catch (err) {
      console.log("session_logs 저장 중 에러 발생:", err);
      SendTelegramMessage(500, "session_logs 저장 중 에러 발생");
    }

    const result = await db("friends as f")
      .where("f.id", id)
      .joinRaw(
        "INNER JOIN summoner_sessions as ss ON ss.tagLine = f.tagLine AND ss.nickname = f.friend_nickname",
      )
      .orderBy("f.created_at", "asc");

    for (const r of result) {
      r.nickname = `${r.nickname}#${r.tagLine}`;
      delete r.tagLine;
      delete r.friend_nickname;
      delete r.id;
      r.icon_img_url = `https://ddragon.leagueoflegends.com/cdn/13.24.1/img/profileicon/${r.icon_id}.png`;
      if (r.created_at) {
        r.created_at = dayjs(r.created_at).format("YYYY-MM-DD HH:mm:ss");
      }

      if (r.renewaled_at) {
        r.renewaled_at = dayjs(r.renewaled_at).format("YYYY-MM-DD HH:mm:ss");
      }
      r.from = "friend";
    }

    return res.json({ code: 200, message: "ok", result });
  }

  if (method === "POST") {
    let { nickname, tagLine } = req.body;

    if (!nickname || nickname.length > 20 || tagLine.length > 20)
      return res.json({
        code: 400,
        message: "Bad Request",
      });
    if (!tagLine) tagLine = "KR1";

    const db = DB();

    const friendCntInfo = await db("friends")
      .where("id", id)
      .count("no as cnt")
      .first();

    const friendCnt = friendCntInfo.cnt || 0;

    if (friendCnt >= 30) {
      return res.json({
        code: 403,
        message: "Exceeded the number of friends limit",
      });
    }

    const existingFriend = await db("friends")
      .where("id", id)
      .andWhereRaw('LOWER(REPLACE(friend_nickname, " ", "")) = ?', [
        nickname.toLowerCase().replace(/\s/g, ""),
      ])
      .where("tagLine", tagLine)
      .first();

    if (existingFriend) {
      console.log("친구 있음;", existingFriend);
      return res.json({
        code: 409,
        message: "Already added a friend",
      });
    }

    const sessionData = await db("summoner_sessions")
      .where("tagLine", tagLine)
      .andWhereRaw('LOWER(REPLACE(nickname, " ", "")) = ?', [
        nickname.toLowerCase().replace(/\s/g, ""),
      ])
      .first();

    // TODO 갱신해야하는지 체크하는 함수, 갱신하는 함수 만들기

    let realNickname;

    if (sessionData) {
      if (
        IsUpdateNeeded(
          dayjs(sessionData.renewaled_at).format("YYYY-MM-DD HH:mm:ss"),
        )
      ) {
        //* case-갱신한지 오래됨) 갱신후 친구테이블에 추가
        console.log("오래된 데이터 - 갱신해야함");
        const upsertResult = await UpsertSummoner(nickname, tagLine);
        realNickname = upsertResult.name;
        if (upsertResult.errorCode) {
          SendTelegramMessage(
            upsertResult.errorCode,
            upsertResult.errorMessage,
            id,
          );

          return res.json({
            code: 404,
            message: "User Not Found",
          });
        }
      } else {
        //* case-갱신할 필요 없는 경우) 친구 테이블에 추가만 하기
        console.log("갱신할 필요 없음");
        realNickname = sessionData.nickname;
      }
    } else {
      //* case-세션데이터에 없는 유저) 세션데이터에 생성 + 친구테이블에 추가
      console.log("세션데이터 존재x - 새로 생성");
      const upsertResult = await UpsertSummoner(nickname, tagLine);
      console.log("upsertResult 결과:", upsertResult);
      if (upsertResult.errorCode) {
        SendTelegramMessage(
          upsertResult.errorCode,
          upsertResult.errorMessage,
          id,
        );

        if (upsertResult.errorCode === 404) {
          return res.json({
            code: 404,
            message: "User Not Found",
          });
        }
        return res.json({
          code: 400,
          message: "Bad Request",
        });
      }
      realNickname = upsertResult.name;
    }

    await db("friends")
      .insert({
        id: session.user.id,
        friend_nickname: realNickname,
        tagLine,
        created_at: dayjs().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
      })
      .onConflict(["id", "friend_nickname", "tagLine"])
      .merge();

    // TODO 조회 쿼리 없이 직접 데이터 만들어 프론트에게 주면 더 빠름 (삭제는 no 없어도 아이디, 친구닉네임조합으로 가능)
    const newFriend = await db("friends as f")
      .where("f.id", id)
      .where("f.friend_nickname", realNickname)
      .where("f.tagLine", tagLine)
      .join("summoner_sessions as ss", function () {
        this.on("f.friend_nickname", "=", "ss.nickname").andOn(
          "f.tagLine",
          "=",
          "ss.tagLine",
        );
      })
      .first();

    if (!newFriend) {
      return res.json({
        code: 400,
        message: "Bad Request - no newFriend",
      });
    }

    newFriend.icon_img_url = `https://ddragon.leagueoflegends.com/cdn/13.24.1/img/profileicon/${newFriend.icon_id}.png`;
    newFriend.nickname = `${newFriend.nickname}#${tagLine}`;
    newFriend.from = "friend";
    newFriend.renewaled_at = dayjs(newFriend.renewaled_at).format(
      "YYYY-MM-DD HH:mm:ss",
    );

    return res.json({
      code: 200,
      message: "ok",
      newFriend,
    });
  }

  if (method === "DELETE") {
    const { no } = req.body;
    if (!no) return res.json({ code: 200, message: "ok" });

    const db = DB();

    await db("friends").where("id", id).where("no", no).delete();
  }

  if (method === "PATCH") {
    const { nickname, tagLine } = req.body;
    if (!nickname || !tagLine) {
      return res.json({ code: 400, message: "Bad Request" });
    }

    const db = DB();

    const userInfo = await db("summoner_sessions")
      .where("nickname", nickname)
      .where("tagLine", tagLine)
      .first();

    if (!userInfo) {
      return res.json({
        code: 404,
        message: "already deleted user",
      });
    }

    if (
      !IsUpdateNeeded(
        dayjs(userInfo.renewaled_at).format("YYYY-MM-DD HH:mm:ss"),
      )
    ) {
      // console.log("갱신 시간 아직 안됨", userInfo.renewaled_at);
      // SendTelegramMessage(204, userInfo.renewaled_at);
      return res.json({
        code: 204,
        message: `already renewed user (renewaled_at:${userInfo.renewaled_at})`,
        tmp: dayjs(userInfo.renewaled_at).format("YYYY-MM-DD HH:mm:ss"),
        if: !IsUpdateNeeded(
          dayjs(userInfo.renewaled_at).format("YYYY-MM-DD HH:mm:ss"),
        ),
      });
    }

    const upsertResult = await UpsertSummoner(nickname, tagLine);
    console.log("upsertResult:", upsertResult);

    if (upsertResult.errorCode) {
      SendTelegramMessage(
        upsertResult.errorCode,
        upsertResult.errorMessage,
        id,
      );

      if (upsertResult.errorCode === 404) {
        return res.json({
          code: 404,
          message: "User Not Found",
        });
      }
      return res.json({
        code: 400,
        message: "Bad Request",
      });
    }

    delete upsertResult.id;

    upsertResult.nickname = `${nickname}#${tagLine}`;
    upsertResult.icon_img_url = `https://ddragon.leagueoflegends.com/cdn/13.24.1/img/profileicon/${upsertResult.profileIconId}.png`;
    upsertResult.from = "friend";
    if (upsertResult.created_at) {
      upsertResult.created_at = dayjs(upsertResult.created_at).format(
        "YYYY-MM-DD HH:mm:ss",
      );
    }

    if (upsertResult.renewaled_at) {
      upsertResult.renewaled_at = dayjs(upsertResult.renewaled_at).format(
        "YYYY-MM-DD HH:mm:ss",
      );
    }

    return res.json({
      code: 200,
      message: "ok",
      result: upsertResult,
    });
  }

  return res.send("Not Allowed Method");
}
