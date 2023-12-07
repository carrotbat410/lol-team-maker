/* mode의 return값 형태는 아래와 같아야함
  {
    finishedTeam1: team1List
    finishedTeam2: team2List
  }

  const result = {};
  result.finishedTeam1 = team1List;
  result.finishedTeam2 = team2List;
  return result;
*/

function BalanceMode(team1List, team2List, noTeamList) {
  console.log("BalanceMode 실행됨");
  const n = noTeamList.length; // n(noTeamList 인원수)
  const m = 5 - team1List.length; // m(team1부족한 인원 수)
  let totalMmrSum = 0;
  let team1MmrSum = 0;
  let max = 0;
  for (const x of team1List) totalMmrSum += x.mmr;
  for (const x of team2List) totalMmrSum += x.mmr;
  for (const x of noTeamList) totalMmrSum += x.mmr;
  for (const x of team1List) team1MmrSum += x.mmr;

  // console.log("totalMmrSum:", totalMmrSum);
  // console.log("team1MmrSum:", team1MmrSum);
  const result = {};
  const tmp = Array.from({ length: m }, () => 0);

  // console.log(team1List, `필요한 인원 수-${m} : 대기 인원 수 -${n}`);

  function DFS(L, s, mmrSum) {
    if (L === m) {
      const tmpTeam2MmrSum = totalMmrSum - mmrSum;
      console.log(`team1Mmr:${mmrSum} || team2Mmr:${tmpTeam2MmrSum}`);
      if (max < Math.abs(totalMmrSum - mmrSum)) {
        max = Math.abs(totalMmrSum - mmrSum);
        console.log("더 밸런스있는거 발견- team2MmrSum:", max);

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
          // if (!tmp.includes(i)) return v;
        });
        console.log("team2List:", team2List);
        console.log("remainingNoTeam:", remainingNoTeam);
        result.finishedTeam2 = [...team2List, ...remainingNoTeam];
      }

      // // const clonedTeam1 = team1List.slice()
      // const clonedTeam1 = team1List.map((v) => {
      //   return v.nickname;
      // });
      //
      // for (const i of tmp) {
      //   clonedTeam1.push(noTeamList[i].nickname);
      // }
      // console.log(`만들어진 팀: ${mmrSum}-${clonedTeam1}`);
    } else {
      for (let i = s; i < n; i++) {
        tmp[L] = i;
        DFS(L + 1, i + 1, mmrSum + noTeamList[i].mmr);
      }
    }
  }

  DFS(0, 0, team1MmrSum);
  // console.log("finishedTeam1 info:", result.finishedTeam1);
  console.log("finishedTeam2 info:", result.finishedTeam2.length);
  return result;
}

// console.log(BalanceMode(5, 3)); // n(noTeamList 인원수), m(team1부족한 인원 수)

const RandomMode = (team1List, team2List, noTeamList) => {
  const needCnt = 5 - team1List.length;
  // console.log("needCnt", needCnt);

  for (let i = 0; i < needCnt; i++) {
    const randomCnt = parseInt(Math.random() * noTeamList.length);
    team1List.push(noTeamList[randomCnt]);
    noTeamList.splice(randomCnt, 1);
  }

  team2List = [...team2List, ...noTeamList];

  const result = {};
  result.finishedTeam1 = team1List;
  result.finishedTeam2 = team2List;

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
      result = BalanceMode(team1List, team2List, noTeamList);
      // result = RandomMode(team1List, team2List, noTeamList);
    } else {
      result = {};
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
