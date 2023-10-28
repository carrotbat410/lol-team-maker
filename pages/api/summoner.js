import { getSession } from "next-auth/react";
import DB from "./utils/db";
import { IsUpdateNeeded } from "./utils/apiUtils";
import { UpsertSummoner } from "./utils/riot";

export default async function handler(req, res) {
  // const session = await getSession({ req }); // TODO 백엔드 테스트하려고 임의로 박음, 나중에 지우기 + expires 검사
  const session = { user: { id: "dlckdals04" } };

  if (!session || !session.user) {
    return res.json({ code: 401, message: "Expired Session" });
  }

  const { id } = session.user;

  const { method } = req;

  if (method === "GET") {
    const db = DB();

    const result = await db("friends as f")
      .where("f.id", id)
      .join("summoner_sessions as ss", "f.friend_nickname", "ss.nickname");

    return res.json({ code: 200, message: "ok", result });
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
        UpsertSummoner(nickname);
      } else {
        //* case-갱신할 필요 없는 경우) 친구 테이블에 추가만 하기
        console.log("갱신할 필요 없음");
      }
    } else {
      //* case-세션데이터에 없는 유저) 세션데이터에 생성 + 친구테이블에 추가
      console.log("세션데이터 존재x - 새로 생성");
      UpsertSummoner(nickname);
    }

    await db("friends")
      .insert({
        id: session.user.id,
        friend_nickname: nickname,
      })
      .onConflict(["id", "friend_nickname"])
      .merge();

    return res.json({
      code: 200,
      message: "ok",
    });
  }

  return res.send("Not Allowed Method");
}
