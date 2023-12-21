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

  const avgRank = 4 - (avgMmr % 4);
  return `${avgTier} ${avgRank}`;
}

function BalanceMode(team1List, team2List, noTeamList) {
  console.log("BalanceMode 실행됨");
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
      console.log(`team1Mmr:${tmpTeam1MmrSum} || team2Mmr:${tmpTeam2MmrSum}`);
      if (min > Math.abs(tmpTeam1MmrSum - tmpTeam2MmrSum)) {
        min = Math.abs(tmpTeam1MmrSum - tmpTeam2MmrSum);
        console.log("(더 밸런스있는거 발견) 두 팀간의 mmr 차이:", min);

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
  // console.log("finishedTeam1 info:", result.finishedTeam1);
  console.log("finishedTeam2 info:", result.finishedTeam2.length);
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

      if (result.length === numberCases) {
        console.log(
          "tmpMin",
          tmpMin,
          "마지막 결과의 min:",
          result[result.length - 1].min,
        );
      }

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
        console.log(result.length, "개 넣었음");
        if (result.length === numberCases) {
          result.sort((a, b) => a.min - b.min);
          console.log("정렬 함:", result);
        }
      } else if (result.length === numberCases) {
        // 5개 이상이면 비교하고 넣기
        let idx = null;
        let isBestResult = false;
        for (let i = result.length - 1; i >= 0; i--) {
          if (tmpMin < result[i].min) {
            console.log(
              "tmpMin < result[i].min:",
              tmpMin < result[i].min,
              "tmpMin:",
              tmpMin,
              "result[i].min",
              result[i].min,
            );
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
          console.log("idx 발견", idx, forConsole);
          // console.log("더 적은거 발견함, tmp:", tmpMin);
          result.splice(idx, 0, { min: tmpMin, ...tmpResult });
          result.pop();
          const forConsole2 = result.map((v) => {
            return v.min;
          });
          console.log("바뀐결과", idx, forConsole2);
          // console.log("교체 결과")
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
  //! 테스트용 코드
  // console.log(randomNumber, "번쨰 결과 당첨");
  // for (let i = 0; i < result.length; i++) {
  //   const cnt = i + 1;
  //   console.log(
  //     `---------------------------${cnt}번쨰 결과----------------------------------`,
  //   );
  //
  //   result[i].finishedTeam1 = result[i].finishedTeam1.map((v) => {
  //     return {
  //       nickname: v.nickname,
  //       tier: v.tier,
  //       rank: v.rank,
  //       mmr: v.mmr,
  //     };
  //   });
  //
  //   result[i].finishedTeam2 = result[i].finishedTeam2.map((v) => {
  //     return {
  //       nickname: v.nickname,
  //       tier: v.tier,
  //       rank: v.rank,
  //       mmr: v.mmr,
  //     };
  //   });
  //
  //   console.log(result[i]);
  // }

  return result[randomNumber - 1];
}

function GoldenBalanceMode(team1List, team2List, noTeamList) {
  console.log("GoldenBalanceMode 실행됨");
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
        console.log("(더 밸런스있는거 발견) 두 팀간의 mmr 차이:", min);

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

  //! 테스트용 코드
  // result.finishedTeam1 = result.finishedTeam1.map((v) => {
  //   return {
  //     nickname: v.nickname,
  //     tier: v.tier,
  //     rank: v.rank,
  //     mmr: v.mmr,
  //   };
  // });
  //
  // result.finishedTeam2 = result.finishedTeam2.map((v) => {
  //   return {
  //     nickname: v.nickname,
  //     tier: v.tier,
  //     rank: v.rank,
  //     mmr: v.mmr,
  //   };
  // });
  // console.log("golden balance result:", result);

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

  console.log("RandomMode result", result);
  return result;
};

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
    if (selectedMode === "random") {
      result = RandomMode(team1List, team2List, noTeamList);
    } else if (selectedMode === "balance") {
      result = BalanceMode2(team1List, team2List, noTeamList);
    } else if (selectedMode === "goldenBalance") {
      result = GoldenBalanceMode(team1List, team2List, noTeamList);
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
