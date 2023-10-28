import { getSession } from "next-auth/react";
import DB from "./utils/db";
import { IsUpdateNeeded } from "./utils/apiUtils";
import { UpsertSummoner } from "./utils/riot";

export default async function handler(req, res) {
  const session = await getSession({ req });
  console.log("session info:", session);
  if (!session || !session.user) {
    return res.json({ code: 401, message: "Expired Session" });
  }

  const { method } = req;

  if (method === "GET") {
    const { nickname } = req.query;

    if (!nickname) {
      return res.json({ code: 400, message: "Bad Request" });
    }

    return res.json({ code: 200, message: "ok" });
  }

  if (method === "POST") {
    const { nickname } = req.body;

    if (!nickname) return res.json({ code: 400, message: "Bad Request" });

    const db = DB();

    const sessionData = await db("summoner_sessions")
      .where("nickname", nickname)
      .first();

    // TODO 갱신해야하는지 체크하는 함수, 갱신하는 함수 만들기

    if (sessionData) {
      if (IsUpdateNeeded(sessionData.renewaled_at)) {
        //* case-갱신한지 오래됨) 갱신후 친구테이블에 추가
        console.log("오래된 데이터 - 갱신해야함");
        const summoner = await UpsertSummoner(nickname);

        // 친구 테이블에 insert하는 로직
      } else {
        //* case-갱신할 필요 없는 경우) 친구 테이블에 추가만 하기
        console.log("갱신할 필요 없음");

        // 친구 테이블에 insert하는 로직
      }
    } else {
      //* case-세션데이터에 없는 유저) 세션데이터에 생성 + 친구테이블에 추가
      console.log("세션데이터 존재x - 새로 생성");
      const summoner = await UpsertSummoner(nickname);

      // 친구 테이블에 insert하는 로직
    }

    return res.json({
      code: 200,
      message: "ok",
    });
  }

  return res.send("Not Allowed Method");
}
