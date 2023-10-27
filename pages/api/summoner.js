import DB from "./utils/db";
import { renewalSummoner } from "./utils/riot";
import { IsUpdateNeeded } from "./utils/apiUtils";

export default async function handler(req, res) {
  const { method } = req;

  if (method === "GET") {
    const { nickname } = req.query;

    if (!nickname) {
      return res.json({
        code: 400,
        message: "Bad Request",
      });
    }

    const summoner = await renewalSummoner(nickname);

    if (!summoner) {
      return res.json({
        code: 404,
        message: "Not Found a Summoner",
      });
    }

    return res.json({
      code: 200,
      message: "ok",
      result: summoner,
    });
  }

  if (method === "POST") {
    const { nickname } = req.body;
    if (!nickname) {
      return res.json({
        code: 400,
        message: "Bad Request",
      });
    }

    const db = DB();

    const sessionData = await db("summoner_sessions")
      .where("nickname", nickname)
      .first();

    // TODO 갱신해야하는지 체크하는 함수, 갱신하는 함수 만들기

    if (sessionData) {
      if (IsUpdateNeeded(sessionData.renewaled_at)) {
        //* case-갱신한지 오래됨) 갱신후 친구테이블에 추가
      } else {
        //* case-갱신할 필요 없는 경우) 친구 테이블에 추가만 하기
        await db("friends").insert({
          id: "??",
          friend_nickname: "??",
        });
      }
    } else {
      //* case-세션데이터에 없는 유저) 세션데이터에 생성 + 친구테이블에 추가
    }

    return res.json({
      code: 200,
      message: "ok",
    });
  }

  return res.send("Not Allowed Method");
}
