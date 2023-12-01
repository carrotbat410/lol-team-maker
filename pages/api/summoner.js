import { getSession } from "next-auth/react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import DB from "./utils/db";
import { IsUpdateNeeded } from "./utils/apiUtils";
import { UpsertSummoner } from "./utils/riot";

dayjs.extend(timezone); // use plugin
dayjs.extend(utc); // use plugin

export default async function handler(req, res) {
  // const session = await getSession({ req }); // TODO 백엔드 테스트하려고 임의로 박음, 나중에 지우기 + expires 검사
  const session = { user: { id: "test1" } };

  return res.json({
    code: 200,
    message: "test",
    isSession: session,
    sessionUser: session?.user,
  });

  if (!session || !session.user) {
    return res.json({ code: 401, message: "Expired Session" });
  }

  const { id } = session.user;

  const { method } = req;

  if (method === "GET") {
    const db = DB();

    const result = await db("friends as f")
      .where("f.id", id)
      .join("summoner_sessions as ss", "f.friend_nickname", "ss.nickname")
      .orderBy("f.created_at", "asc");

    for (const r of result) {
      delete r.friend_nickname;
      r.icon_img_url = `http://ddragon.leagueoflegends.com/cdn/13.21.1/img/profileicon/${r.icon_id}.png`;
      if (r.created_at) {
        r.created_at = dayjs(r.created_at)
          .tz("Asia/Seoul")
          .format("YYYY-MM-DD HH:mm:ss");
      }

      if (r.renewaled_at) {
        r.renewaled_at = dayjs(r.renewaled_at)
          .tz("Asia/Seoul")
          .format("YYYY-MM-DD HH:mm:ss");
      }
      r.from = "friend";
    }

    return res.json({ code: 200, message: "ok", result });
  }

  if (method === "POST") {
    const { nickname } = req.body;

    if (!nickname) return res.json({ code: 400, message: "Bad Request" });

    const db = DB();

    const friendInfo = await db("friends")
      .where("id", id)
      .count("no as cnt")
      .first();

    const friendCnt = friendInfo.cnt || 0;

    if (friendCnt >= 30) {
      return res.json({
        code: 403,
        message: "Exceeded the number of friends limit",
      });
    }

    const existingFriend = await db("friends")
      .where("id", id)
      .whereRaw('LOWER(REPLACE(friend_nickname, " ", "")) = ?', [
        nickname.toLowerCase().replace(/\s/g, ""),
      ])
      .first();

    if (existingFriend) {
      console.log("친구 있음;", existingFriend);
      return res.json({
        code: 409,
        message: "Already added a friend",
      });
    }

    const sessionData = await db("summoner_sessions")
      .where("nickname", nickname)
      .first();

    // TODO 갱신해야하는지 체크하는 함수, 갱신하는 함수 만들기

    let realNickname;

    if (sessionData) {
      if (
        IsUpdateNeeded(
          dayjs(sessionData.renewaled_at)
            .tz("Asia/Seoul")
            .format("YYYY-MM-DD HH:mm:ss"),
        )
      ) {
        //* case-갱신한지 오래됨) 갱신후 친구테이블에 추가
        console.log("오래된 데이터 - 갱신해야함");
        const upsertResult = await UpsertSummoner(nickname);
        if (upsertResult.isError) {
          return res.json({
            code: 404,
            message: "User Not Found",
          });
        }
      } else {
        //* case-갱신할 필요 없는 경우) 친구 테이블에 추가만 하기
        console.log("갱신할 필요 없음");
      }
    } else {
      //* case-세션데이터에 없는 유저) 세션데이터에 생성 + 친구테이블에 추가
      console.log("세션데이터 존재x - 새로 생성");
      const upsertResult = await UpsertSummoner(nickname);
      if (upsertResult.errorCode) {
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
      })
      .onConflict(["id", "friend_nickname"])
      .merge();

    // TODO 조회 쿼리 없이 직접 데이터 만들어 프론트에게 주면 더 빠름 (삭제는 no 없어도 아이디, 친구닉네임조합으로 가능)
    const newFriend = await db("friends as f")
      .where("f.id", id)
      .whereRaw('LOWER(REPLACE(f.friend_nickname, " ", "")) = ?', [
        nickname.toLowerCase().replace(/\s/g, ""),
      ])
      .join("summoner_sessions as ss", "f.friend_nickname", "ss.nickname")
      .first();

    if (newFriend) {
      newFriend.icon_img_url = `http://ddragon.leagueoflegends.com/cdn/13.21.1/img/profileicon/${newFriend.icon_id}.png`;
    }

    return res.json({
      code: 200,
      message: "ok",
      newFriend,
    });
  }

  return res.send("Not Allowed Method");
}
