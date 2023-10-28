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

  let mmr = 0;

  if (result.tier && result.rank) {
    const tierArr = [
      "IRON", // 1~4
      "BRONZE",
      "SILVER",
      "GOLD",
      "PLATINUM",
      "EMERALD", // 21 22 23 24
      "DIAMOND", // 25~28
      "MASTER", // 29
      "GRANDMASTER", // 30
      "CHALLENGER", // 31
    ];

    const { tier, rank } = result;

    const index = tierArr.indexOf(tier);

    if (index < 7) {
      mmr = index * 4 + (5 - rank);
    } else if (index === 7) mmr = 29;
    else if (index === 8) mmr = 30;
    else if (index === 9) mmr = 30;

    console.log(tier, rank);
    console.log("index:", index, " ||  mmr:", mmr);
  }

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
      mmr,
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
      "mmr",
    ]);

  return result;
}
