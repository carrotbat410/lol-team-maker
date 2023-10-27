import axios from "axios";
import dayjs from "dayjs";
import DB from "./db";

const riotUrl = process.env.RIOT_URL;
const apiKey = process.env.RIOT_DEV_API_KEY;

// export function GetRiotApiKey() {
//   return apiKey;
// }

export async function UpsertSummoner(nickname) {
  let result = {};

  const summonerInfo = await axios.get(
    `${riotUrl}/lol/summoner/v4/summoners/by-name/${nickname}?api_key=${apiKey}`,
  );

  const encryptedId = summonerInfo.data.id;

  const leagueInfo = await axios.get(
    `${riotUrl}/lol/league/v4/entries/by-summoner/${encryptedId}?api_key=${apiKey}`,
  );

  result = { ...result, ...summonerInfo.data };

  if (leagueInfo.data.length > 0) {
    // 데이터가 있다면,
    for (const d of leagueInfo.data) {
      if (d.queueType === "RANKED_SOLO_5x5") {
        d.rank = d.rank.length;
        result = { ...result, ...d };
      }
    }
  }

  delete result.revisionDate;
  delete result.summonerName;
  delete result.queueType;
  delete result.summonerId;
  delete result.veteran;
  delete result.inactive;
  delete result.freshBlood;
  delete result.hotStreak;
  delete result.accountId;
  delete result.puuid;
  delete result.leagueId;

  const db = DB();

  await db("summoner_sessions")
    .insert({
      nickname: result.name,
      tier: result.tier,
      rank: result.rank,
      wins: result.wins,
      losses: result.losses,
      main_position: "tmp",
      icon_id: result.profileIconId,
      renewaled_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    })
    .onConflict(["nickname"])
    .merge([
      "tier",
      "rank",
      "wins",
      "losses",
      "main_position",
      "icon_id",
      "renewaled_at",
    ]);

  return result;
}

export async function renewalSummoner(nickname) {
  // TODO 닉네임 받으면, 라이엇 api 여러곳에 요청해 데이터 가져온후 sessionData에 upSert하는 함수

  if (!riotUrl || !apiKey) return;

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
