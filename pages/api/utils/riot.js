import axios from "axios";
import DB from "./db";

const riotUrl = process.env.RIOT_URL;
const apiKey = process.env.RIOT_DEV_API_KEY;

export function GetRiotApiKey() {
  return apiKey;
}

export async function renewalSummoner(nickname) {
  // TODO 닉네임 받으면, 라이엇 api 여러곳에 요청해 데이터 가져온후 sessionData에 upSert하는 함수

  if (!riotUrl || !apiKey) return;

  const db = DB();

  const existingSummoner = await db("summoner_sessions")
    .where("nickname", nickname)
    .first();

  // if (existingSummoner && existingSummoner.updated_at)

  let summoner;

  try {
    const response = await axios.get(
      `${riotUrl}/lol/summoner/v4/summoners/by-name/${nickname}?api_key=${apiKey}`,
    );
    summoner = response.data;
  } catch (err) {
    console.log("err:", err);
  }
  console.log("summoner info:", summoner);

  if (!summoner) return;

  // TODO 소환사 존재하면 다른 정보들도 가져와서 업데이트하기

  return summoner;
}
