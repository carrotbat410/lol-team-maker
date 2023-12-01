// function CalculateMmrDifference2(n, m) {
//   const team1 = [{ id: 10 }, { id: 11 }];
//   const noTeamList = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];
//   const answer = [];
//   const tmp = Array.from({ length: m }, () => 0);
//
//   function DFS(L, s) {
//     if (L === m) {
//       const clonedTeam1 = team1.slice();
//       for (const i of tmp) {
//         clonedTeam1.push(noTeamList[i]);
//       }
//       console.log("Cloned team", clonedTeam1);
//     } else {
//       for (let i = s; i < n; i++) {
//         tmp[L] = i;
//         DFS(L + 1, i + 1);
//       }
//     }
//   }
//
//   DFS(0, 0);
//   return "hi";
// }
// console.log(CalculateMmrDifference2(5, 3)); // n(noTeamList 인원수), m(team1부족한 인원 수)

const RandomMode = (team1List, team2List, noTeamList) => {
  const needCnt = 5 - team1List.length;
  console.log("needCnt", needCnt);

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
