import axios from "axios";
import dayjs from "dayjs";
import DB from "./db";

const riotUrl = process.env.RIOT_URL;
const apiKey = process.env.RIOT_DEV_API_KEY;

export async function UpsertSummoner(nickname, tagLine) {
  let result = {
    errorCode: null,
  };

  let summonerInfo = {};
  let puuid;
  let realNickname;
  try {
    const accountInfo = await axios.get(
      `https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${nickname}/${tagLine}?api_key=${apiKey}`,
    );
    puuid = accountInfo.data.puuid;
    realNickname = accountInfo.data.gameName;
  } catch (err) {
    result.errorCode = err.response?.data?.status.status_code || 400;
    result.errorMessage = err.response?.data?.status.message || "에러 발생1";
  }
  if (result.errorCode) {
    return result;
  }

  try {
    const tmpSummonerInfo = await axios.get(
      `${riotUrl}/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${apiKey}`,
    );
    summonerInfo = tmpSummonerInfo.data;
  } catch (err) {
    result.errorCode = err.response?.data?.status.status_code || 400;
    result.errorMessage = err.response?.data?.status.message || "에러 발생2";
  }
  if (result.errorCode) {
    return result;
  }

  let leagueInfo;
  try {
    leagueInfo = await axios.get(
      `${riotUrl}/lol/league/v4/entries/by-summoner/${summonerInfo.id}?api_key=${apiKey}`,
    );
  } catch (err) {
    result.errorCode = err.response?.data?.status.status_code || 400;
    result.errorMessage = err.response?.data?.status.message || "에러 발생3";
  }
  if (result.errorCode) {
    return result;
  }

  result = summonerInfo;
  result.name = realNickname;

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
    else if (index === 9) mmr = 31;

    result.mmr = mmr;
  }

  result.renewaled_at = dayjs().format("YYYY-MM-DD HH:mm:ss");
  await db("summoner_sessions")
    .insert({
      nickname: realNickname,
      tagLine,
      tier: result.tier,
      rank: result.rank,
      wins: result.wins,
      losses: result.losses,
      main_position: "tmp",
      icon_id: result.profileIconId,
      level: result.summonerLevel,
      renewaled_at: result.renewaled_at,
      mmr,
    })
    .onConflict(["nickname", "tagLine"])
    .merge([
      "tier",
      "rank",
      "wins",
      "losses",
      "main_position",
      "icon_id",
      "renewaled_at",
      "mmr",
      "level",
    ]);

  return result;
}
