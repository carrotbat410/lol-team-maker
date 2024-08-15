/* mode의 return값 형태는 아래와 같아야함
  {
    finishedTeam1: team1List
    finishedTeam2: team2List
  }

  const result = {
  finishedTeam1
  finishedTeam1MmrSum
  finishedTeam1MmrAvg
  finishedTeam1TierRank

  finishedTeam2
  finishedTeam2MmrSum
  finishedTeam2MmrAvg
  finishedTeam2TierRank
  };

  return result;
*/
import { GetRandomNumber } from "./utils/apiUtils";

function TierCalculate(avgMmr) {
  if (avgMmr === 0) return "UNRANKED";
  if (avgMmr === 29) return "MASTER";
  if (avgMmr === 30) return "GRANDMASTER";
  if (avgMmr === 31) return "CHALLENGER";

  let avgTier;
  if (avgMmr <= 4) avgTier = "IRON";
  else if (avgMmr <= 8) avgTier = "BRONZE";
  else if (avgMmr <= 12) avgTier = "SILVER";
  else if (avgMmr <= 16) avgTier = "GOLD";
  else if (avgMmr <= 20) avgTier = "PLATINUM";
  else if (avgMmr <= 24) avgTier = "EMERALD";
  else if (avgMmr <= 28) avgTier = "DIAMOND";

  const remainMmr = avgMmr % 4;
  const avgRank = remainMmr === 0 ? 1 : 5 - remainMmr;
  return `${avgTier} ${avgRank}`;
}

function BalanceMode(team1List, team2List, noTeamList) {
  const n = noTeamList.length; // n(noTeamList 인원수)
  const m = 5 - team1List.length; // m(team1부족한 인원 수)
  let totalMmrSum = 0;
  let team1MmrSum = 0;
  let min = 1000;
  for (const x of team1List) {
    totalMmrSum += x.mmr;
    team1MmrSum += x.mmr;
  }
  for (const x of team2List) totalMmrSum += x.mmr;
  for (const x of noTeamList) totalMmrSum += x.mmr;

  const result = {};
  const tmp = Array.from({ length: m }, () => 0);

  // console.log(team1List, `필요한 인원 수-${m} : 대기 인원 수 -${n}`);

  function DFS(L, s, tmpTeam1MmrSum) {
    if (L === m) {
      const tmpTeam2MmrSum = totalMmrSum - tmpTeam1MmrSum;
//      console.log(`team1Mmr:${tmpTeam1MmrSum} || team2Mmr:${tmpTeam2MmrSum}`);
      if (min > Math.abs(tmpTeam1MmrSum - tmpTeam2MmrSum)) {
        min = Math.abs(tmpTeam1MmrSum - tmpTeam2MmrSum);
//        console.log("(더 밸런스있는거 발견) 두 팀간의 mmr 차이:", min);

        // const clonedTeam1 = team1List.slice()
        const clonedTeam1 = team1List.map((v) => {
          // return v.nickname;
          return v;
        });

        for (const i of tmp) {
          // clonedTeam1.push(noTeamList[i].nickname);
          clonedTeam1.push(noTeamList[i]);
        }
        result.finishedTeam1 = clonedTeam1;

        const remainingNoTeam = noTeamList.filter((v, i) => {
          return !tmp.includes(i);
        });

        result.finishedTeam2 = [...team2List, ...remainingNoTeam];

        result.finishedTeam1MmrSum = tmpTeam1MmrSum;
        result.finishedTeam2MmrSum = tmpTeam2MmrSum;

        const finishedTeam1MmrAvg = Math.round(tmpTeam1MmrSum / 5);
        const finishedTeam2MmrAvg = Math.round(tmpTeam2MmrSum / 5);
        result.finishedTeam1MmrAvg = finishedTeam1MmrAvg;
        result.finishedTeam2MmrAvg = finishedTeam2MmrAvg;
        result.finishedTeam1TierRank = TierCalculate(finishedTeam1MmrAvg);
        result.finishedTeam2TierRank = TierCalculate(finishedTeam2MmrAvg);
      }
    } else {
      for (let i = s; i < n; i++) {
        tmp[L] = i;
        DFS(L + 1, i + 1, tmpTeam1MmrSum + noTeamList[i].mmr);
      }
    }
  }

  DFS(0, 0, team1MmrSum);
  return result;
}

function BalanceMode2(team1List, team2List, noTeamList) {
  const numberCases = 10; // 경우의 수 갯수
  const n = noTeamList.length; // n(noTeamList 인원수)
  const m = 5 - team1List.length; // m(team1부족한 인원 수)
  let totalMmrSum = 0;
  let team1MmrSum = 0;

  for (const x of team1List) {
    totalMmrSum += x.mmr;
    team1MmrSum += x.mmr;
  }
  for (const x of team2List) totalMmrSum += x.mmr;
  for (const x of noTeamList) totalMmrSum += x.mmr;

  const tmpResult = {};
  const result = [];
  const userIndexFromNoTeamToTeam1 = Array.from({ length: m }, () => 0);

  function DFS(L, s, tmpTeam1MmrSum) {
    if (L === m) {
      // 결과부터 만들기
      const tmpTeam2MmrSum = totalMmrSum - tmpTeam1MmrSum;
      const tmpMin = Math.abs(tmpTeam1MmrSum - tmpTeam2MmrSum);

      const clonedTeam1 = team1List.map((v) => {
        return v;
      });

      for (const i of userIndexFromNoTeamToTeam1) {
        clonedTeam1.push(noTeamList[i]);
      }
      tmpResult.finishedTeam1 = clonedTeam1;


      const remainingNoTeam = noTeamList.filter((v, i) => {
        return !userIndexFromNoTeamToTeam1.includes(i);
      });

      tmpResult.finishedTeam2 = [...team2List, ...remainingNoTeam];

      tmpResult.finishedTeam1MmrSum = tmpTeam1MmrSum;
      tmpResult.finishedTeam2MmrSum = tmpTeam2MmrSum;

      const finishedTeam1MmrAvg = Math.round(tmpTeam1MmrSum / 5);
      const finishedTeam2MmrAvg = Math.round(tmpTeam2MmrSum / 5);
      tmpResult.finishedTeam1MmrAvg = finishedTeam1MmrAvg;
      tmpResult.finishedTeam2MmrAvg = finishedTeam2MmrAvg;
      tmpResult.finishedTeam1TierRank = TierCalculate(finishedTeam1MmrAvg);
      tmpResult.finishedTeam2TierRank = TierCalculate(finishedTeam2MmrAvg);

      if (result.length < numberCases) {
        // numberCases개 이하면 그냥 넣기(정렬은 하기)
        result.push({
          min: tmpMin,
          ...tmpResult,
        });
        if (result.length === numberCases) {
          result.sort((a, b) => a.min - b.min);
        }
      } else if (result.length === numberCases) {
        // 5개 이상이면 비교하고 넣기
        let idx = null;
        let isBestResult = false;
        for (let i = result.length - 1; i >= 0; i--) {
          if (tmpMin < result[i].min) {
            idx = i;
            isBestResult = true;
          } else {
            break;
          }
        }
        if (isBestResult) {
          const forConsole = result.map((v) => {
            return v.min;
          });
          result.splice(idx, 0, { min: tmpMin, ...tmpResult });
          result.pop();
          const forConsole2 = result.map((v) => {
            return v.min;
          });
        }
      }
    } else {
      for (let i = s; i < n; i++) {
        userIndexFromNoTeamToTeam1[L] = i;
        DFS(L + 1, i + 1, tmpTeam1MmrSum + noTeamList[i].mmr);
      }
    }
  }

  DFS(0, 0, team1MmrSum);
  let randomNumber = GetRandomNumber(numberCases);
  if (result.length < randomNumber) {
    randomNumber = GetRandomNumber(result.length);
  }

  return result[randomNumber - 1];
}

function GoldenBalanceMode(team1List, team2List, noTeamList) {
  const n = noTeamList.length; // n(noTeamList 인원수)
  const m = 5 - team1List.length; // m(team1부족한 인원 수)
  let totalMmrSum = 0;
  let team1MmrSum = 0;
  let min = 1000;
  for (const x of team1List) {
    totalMmrSum += x.mmr;
    team1MmrSum += x.mmr;
  }
  for (const x of team2List) totalMmrSum += x.mmr;
  for (const x of noTeamList) totalMmrSum += x.mmr;

  const result = {};
  const tmp = Array.from({ length: m }, () => 0);

  // console.log(team1List, `필요한 인원 수-${m} : 대기 인원 수 -${n}`);

  function DFS(L, s, tmpTeam1MmrSum) {
    if (L === m) {
      const tmpTeam2MmrSum = totalMmrSum - tmpTeam1MmrSum;
      if (min > Math.abs(tmpTeam1MmrSum - tmpTeam2MmrSum)) {
        min = Math.abs(tmpTeam1MmrSum - tmpTeam2MmrSum);

        // const clonedTeam1 = team1List.slice()
        const clonedTeam1 = team1List.map((v) => {
          // return v.nickname;
          return v;
        });

        for (const i of tmp) {
          // clonedTeam1.push(noTeamList[i].nickname);
          clonedTeam1.push(noTeamList[i]);
        }
        result.finishedTeam1 = clonedTeam1;

        const remainingNoTeam = noTeamList.filter((v, i) => {
          return !tmp.includes(i);
        });

        result.finishedTeam2 = [...team2List, ...remainingNoTeam];

        result.finishedTeam1MmrSum = tmpTeam1MmrSum;
        result.finishedTeam2MmrSum = tmpTeam2MmrSum;

        const finishedTeam1MmrAvg = Math.round(tmpTeam1MmrSum / 5);
        const finishedTeam2MmrAvg = Math.round(tmpTeam2MmrSum / 5);
        result.finishedTeam1MmrAvg = finishedTeam1MmrAvg;
        result.finishedTeam2MmrAvg = finishedTeam2MmrAvg;
        result.finishedTeam1TierRank = TierCalculate(finishedTeam1MmrAvg);
        result.finishedTeam2TierRank = TierCalculate(finishedTeam2MmrAvg);
      }
    } else {
      for (let i = s; i < n; i++) {
        tmp[L] = i;
        DFS(L + 1, i + 1, tmpTeam1MmrSum + noTeamList[i].mmr);
      }
    }
  }

  DFS(0, 0, team1MmrSum);

  return result;
}

// console.log(BalanceMode(5, 3)); // n(noTeamList 인원수), m(team1부족한 인원 수)

const RandomMode = (team1List, team2List, noTeamList) => {
  const needCnt = 5 - team1List.length;

  for (let i = 0; i < needCnt; i++) {
    const randomCnt = parseInt(Math.random() * noTeamList.length);
    team1List.push(noTeamList[randomCnt]);
    noTeamList.splice(randomCnt, 1);
  }

  team2List = [...team2List, ...noTeamList];

  const result = {};
  result.finishedTeam1 = team1List;
  result.finishedTeam2 = team2List;

  const finishedTeam1MmrSum = team1List.reduce(
    (acc, summoner) => acc + summoner.mmr,
    0,
  );
  const finishedTeam2MmrSum = team2List.reduce(
    (acc, summoner) => acc + summoner.mmr,
    0,
  );
  result.finishedTeam1MmrSum = finishedTeam1MmrSum;
  result.finishedTeam2MmrSum = finishedTeam2MmrSum;
  result.finishedTeam1MmrAvg = Math.round(finishedTeam1MmrSum / 5);
  result.finishedTeam2MmrAvg = Math.round(finishedTeam2MmrSum / 5);
  result.finishedTeam1TierRank = TierCalculate(result.finishedTeam1MmrAvg);
  result.finishedTeam2TierRank = TierCalculate(result.finishedTeam2MmrAvg);

//  console.log("RandomMode result", result);
  return result;
};


function GoldenBalanceModeWithMainLine(team1List, team2List, noTeamList) {
  console.log();console.log();console.log();console.log();
  console.log("---------------------새로운 요청-------------------------------------")
  //#1 한쪽만 배치된 라이너 넣기
  let team1BatchResult = {
    t: null, //{}
    j: null,
    m: null,
    a: null,
    s: null
  };
  let team2BatchResult = {
    t: null,
    j: null,
    m: null,
    a: null,
    s: null
  };
  let noTeamBatchResult = {
    t: [],
    j: [],
    m: [],
    a: [],
    s: []
  };
  let batchStatus = {
    t: 0,
    j: 0,
    m: 0,
    a: 0,
    s: 0,
  }
  for(const u of team1List) {
    team1BatchResult[u.line] = u;
    batchStatus[u.line]++;
  }
  for(const u of team2List) {
    team2BatchResult[u.line] = u;
    batchStatus[u.line]++;
  }
  const lineKeys = ["t", "j", "m", "a", "s"];

  //비어있는 라인 채우기
  for(const userLine of lineKeys) {
    if(team1BatchResult[userLine] && !team2BatchResult[userLine]) {
      // console.log("team2에는 배치안됨. 배치하기")
      for(const u of noTeamList) if(u.line === userLine) {
        team2BatchResult[userLine] = u;
        batchStatus[userLine]++;
      }
    } else if(!team1BatchResult[userLine] && team2BatchResult[userLine]) {
      // console.log("team2에는 배치안됨. 배치하기")
      for(const u of noTeamList) if(u.line === userLine) {
        team1BatchResult[userLine] = u;
        batchStatus[userLine]++;
      }
    }
  }

  for(const userLine of lineKeys) {
    if(batchStatus[userLine] == 0) {
      //해당 유저들 noTeamBatchResult에 넣기
      for(const user of noTeamList) {
        if(user.line == userLine) noTeamBatchResult[userLine].push(user);
      }
    }
  }

  //#2 배치 안된 라인 파악하기
  let noBatchedLineArr = [];
  for(const line of lineKeys) if(batchStatus[line] == 0) noBatchedLineArr.push(line);


  // console.log("team1BatchResult", team1BatchResult);
  // console.log("team2BatchResult", team2BatchResult);
  // console.log("noTeamBatchResult", noTeamBatchResult);
  // console.log("batchStatus", batchStatus);
  //#3 DFS실행
  /**
   * 배치 안된 라인수 만큼의 길이를 가진 tmp배열 만들기 e.g. const tmp = [0, 0]
   * if DFS L == noBatchedLineArr.length이면,
   * for(let i = 0; i < noBatchedLineArr.length; i++) 돌면서
   * const line = noBatchedLineArr[i];
   * team1[line]에는 tmp인덱스에 해당하는 유저를, team2[line]에는 1-tmp인덱스에 해당하는 유저를 넣기.
   *
   * 다 채웠으면, 판별하는 로직 동작
   */
  const n = noBatchedLineArr.length;
  let tmpTeam1IdxArr = Array.from({ length: n }, () => 0);
  let minMmrDiff = 1000;
  let result = {};
  function DFS(L) {
    if(L === n) {
      //tmp완성되었으니 유저들 분배하기
      const tmpTeam1BatchResult = JSON.parse(JSON.stringify(team1BatchResult));
      const tmpTeam2BatchResult = JSON.parse(JSON.stringify(team2BatchResult));
      // console.log("tmpTeam1IdxArr:", tmpTeam1IdxArr);
      for(let i = 0; i < n; i++) {
        const line = noBatchedLineArr[i];
        const team1Idx = tmpTeam1IdxArr[i];
        tmpTeam1BatchResult[line] = noTeamBatchResult[line][team1Idx];
        tmpTeam2BatchResult[line] = noTeamBatchResult[line][1 - team1Idx];
        // team1BatchResult[line] = noTeamBatchResult[line][team1Idx];
        // team2BatchResult[line] = noTeamBatchResult[line][1- team1Idx];
      }
      // console.log("L == n 도착. 배치 결과-----");
      // console.log("team1BatchResult: ", team1BatchResult);
      // console.log("team2BatchResult: ", team2BatchResult);

      //mmr 합산하기
      let team1MmrSum = 0;
      let team2MmrSum = 0;
      for(const line of lineKeys) {
        team1MmrSum += tmpTeam1BatchResult[line].mmr;
        team2MmrSum += tmpTeam2BatchResult[line].mmr;
      }
      const tmpMmrDiff = Math.abs(team1MmrSum - team2MmrSum);

      //mmr 결과 비교하고, 더 밸런스있는 결과면 result값 채우기
      // console.log("team1MmrSum:", team1MmrSum);
      // console.log("team2MmrSum:", team2MmrSum);
      if(tmpMmrDiff < minMmrDiff) {
        console.log("차이 적은거 발견", tmpMmrDiff, " < (기존)", minMmrDiff);
        minMmrDiff = tmpMmrDiff;

        result.mmrDiff = minMmrDiff;
        const finishedTeam1MmrAvg = Math.round(team1MmrSum / 5);
        result.finishedTeam1MmrSum = team1MmrSum;
        result.finishedTeam1MmrAvg = finishedTeam1MmrAvg;
        result.finishedTeam1TierRank = TierCalculate(finishedTeam1MmrAvg);

        result.finishedTeam2MmrSum = team2MmrSum;
        const finishedTeam2MmrAvg = Math.round(team2MmrSum / 5);
        result.finishedTeam2MmrAvg = finishedTeam2MmrAvg;
        result.finishedTeam2TierRank = TierCalculate(finishedTeam2MmrAvg);


        result.finishedTeam1 = tmpTeam1BatchResult;
        result.finishedTeam2 = tmpTeam2BatchResult;
        console.log("발견해서 나온 결과", result);
      }
    } else {
      for(let i = 0; i < 2; i++) {
        tmpTeam1IdxArr[L] = i;
        DFS(L + 1);
      }
    }
  }

  DFS(0);
  // console.log("new result -----------------------------------")
  console.log("최종결과:",result);
  return result;
}


export default async function handler(req, res) {
  const { method } = req;

  if (method === "POST") {
    const { selectedMode, team1List, team2List, noTeamList } = req.body;
    // validation
    if (
      !selectedMode ||
      !team1List ||
      !team2List ||
      !noTeamList ||
      team1List.length + team2List.length + noTeamList.length !== 10 ||
      team1List.length > 5 ||
      team2List.length > 5
    ) {
      return res.json({
        code: 400,
        message: "Bad Request",
      });
    }

    let result = {};
    const shuffledNoTeamListArray = shuffleArray(noTeamList);
    if (selectedMode === "random") {
      result = RandomMode(team1List, team2List, shuffledNoTeamListArray);
    } else if (selectedMode === "balance") {
      result = BalanceMode2(team1List, team2List, shuffledNoTeamListArray);
    } else if (selectedMode === "goldenBalance") {
      result = GoldenBalanceMode(team1List, team2List, shuffledNoTeamListArray);
    } else if (selectedMode === "lineBalance") {

      const lines = ["t","j","m","a","s"]
      let tmpError = false;
      for(const u of team1List) if(u.line == null || !lines.includes(u.line)) tmpError = true;
      for(const u of team2List) if(!tmpError && u.line == null || !lines.includes(u.line)) tmpError = true;
      for(const u of noTeamList) if(!tmpError && u.line == null || !lines.includes(u.line)) tmpError = true;
      if(tmpError) {
        return res.json({
          code: 400,
          message: "line error",
        });
      }

      function removeUnwantedProperties(list) {
        for (const u of list) {
          delete u.id;
          delete u.tagLine;
          delete u.tier;
          delete u.rank;
          delete u.level;
          delete u.wins;
          delete u.losses;
          delete u.iconId;
          delete u.updatedAt;
          delete u.tagLine;

        }
      }

      //! 보기편하려고 임시로 필요없는 속성들을 제거함
      removeUnwantedProperties(team1List);
      removeUnwantedProperties(team2List);
      removeUnwantedProperties(noTeamList);

      result = GoldenBalanceModeWithMainLine(team1List, team2List, shuffledNoTeamListArray);
    }

    return res.json({
      code: 200,
      message: "ok",
      selectedMode,
      result,
    });
  }

  return res.send("Not Allowed Method");
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}