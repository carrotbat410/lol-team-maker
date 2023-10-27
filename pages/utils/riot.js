import axios from "axios";
import DB from "./db";

const riotUrl = process.env.RIOT_URL;
const apiKey = process.env.RIOT_DEV_API_KEY;

export function GetRiotApiKey() {
  return apiKey;
}

export async function renewalSummoner(nickname) {
  if (!riotUrl || !apiKey) return;

  //* front에서 created_at 비교후 갱신하기
  //* A유저가 E크에크파이크 갱신 , B유저가 기존에 있던 E크에크파이크 가지고 있을 수 있으니 아래 절차 거치기
  //* 먼저 DB에 갱신된거 있는지 확인 -> (날짜가 지났다면 갱신하면서) 소환사 정보 가져오기
  //* session 갱신할떄마다 friend table updated_at도 갱신하기

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
