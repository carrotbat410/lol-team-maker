import { useState } from "react";
import axios from "axios";
import styles from "./Main.module.css";
import { handleDragStart } from "../friendList/FriendList";

export function Main({ onDrop, team1List, team2List, noTeamList }) {
  const [resultMode, setResultMode] = useState(false);
  const [finishedTeam1, setFinishedTeam1] = useState([]);
  const [finishedTeam2, setFinishedTeam2] = useState([]);

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDropNoTeam = (event) => {
    // event.target.style.display = "none";
    event.preventDefault();
    const droppedData = event.dataTransfer.getData("text/plain");
    const data = JSON.parse(droppedData);
    if (!data) return; // 드래그해서 전체 끌어 넣을경우 아무 반응 없도록
    if (data.from === "noTeam") return; // 같은 곳에 드롭하는 경우.
    data.to = "noTeam";
    console.log("noTeamList에서 받음 - data:", data);

    onDrop(data);
  };

  const handleDropTeam1 = (event) => {
    if (team1List.length >= 5) {
      return alert("한 팀에 최대 인원은 5명 입니다.");
    }
    event.preventDefault();
    const droppedData = event.dataTransfer.getData("text/plain");
    const data = JSON.parse(droppedData);
    if (!data) return; // 드래그해서 전체 끌어 넣을경우 아무 반응 없도록
    if (data.from === "team1") return; // 같은 곳에 드롭하는 경우.
    data.to = "team1";
    console.log("team1 List에서 받음 - data:", data);
    onDrop(data);
  };

  const handleDropTeam2 = (event) => {
    if (team2List.length >= 5) {
      return alert("한 팀에 최대 인원은 5명 입니다.");
    }
    event.preventDefault();
    const droppedData = event.dataTransfer.getData("text/plain");
    const data = JSON.parse(droppedData);
    if (!data) return; // 드래그해서 전체 끌어 넣을경우 아무 반응 없도록
    if (data.from === "team2") return; // 같은 곳에 드롭하는 경우.
    data.to = "team2";
    console.log("team2 List에서 받음 - data:", data);
    onDrop(data);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.setting_container}>setting_container</div>
      <div>
        {resultMode ? (
          <ContentComponent
            team1List={finishedTeam1}
            team2List={finishedTeam2}
            resultMode={resultMode}
            // handleDragOver={handleDragOver}
            // handleDropTeam1={handleDropTeam1}
            // handleDropTeam2={handleDropTeam2}
          />
        ) : (
          <ContentComponent
            team1List={team1List}
            team2List={team2List}
            resultMode={resultMode}
            handleDragOver={handleDragOver}
            handleDropTeam1={handleDropTeam1}
            handleDropTeam2={handleDropTeam2}
          />
        )}
      </div>
      <div className={styles.result_container}>
        {resultMode ? (
          <div className={styles.result_mode_true_container}>
            <input type="button" value="결과 복사하기" />
            <input
              type="button"
              value="다시 짜기"
              onClick={() => {
                setResultMode(!resultMode);
              }}
            />
          </div>
        ) : (
          <div className={styles.result_mode_false_container}>
            <div
              className={styles.no_team_summoner_List}
              onDragOver={handleDragOver}
              onDrop={handleDropNoTeam}
            >
              {noTeamList.map((v) => {
                return (
                  <div
                    key={v.no}
                    className={styles.no_team_summoner}
                    data={JSON.stringify(v)}
                    draggable="true"
                    onDragStart={handleDragStart}
                  >
                    {v.nickname}
                  </div>
                );
              })}
            </div>
            <input
              type="button"
              className={styles.make_result_btn}
              value="팀 짜기"
              onClick={async () => {
                if (
                  team1List.length + team2List.length + noTeamList.length !==
                  10
                ) {
                  return alert("10명 채우셈");
                }

                const result = await axios.post(
                  "http://localhost:3000/api/makeResult",
                  {
                    selectMode: "random",
                    team1List,
                    team2List,
                    noTeamList,
                  },
                );
                if (result.data?.code === 200) {
                  setFinishedTeam1(result.data.result.finishedTeam1);
                  setFinishedTeam2(result.data.result.finishedTeam2);
                  setResultMode(!resultMode);
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function ContentComponent({
  team1List,
  team2List,
  handleDragOver,
  handleDropTeam1,
  handleDropTeam2,
  resultMode,
}) {
  console.log("resultMode:", resultMode);

  return (
    <div className={styles.content_container}>
      <div
        className={styles.content_container_team_div}
        id="team1"
        onDragOver={handleDragOver}
        onDrop={handleDropTeam1}
      >
        Team 1
        {team1List.map((v) => {
          if (resultMode) {
            return (
              <TeamedSummoner
                key={v.no}
                resultMode={resultMode}
                data={JSON.stringify(v)}
              />
            );
          }
          return (
            <TeamedSummoner
              resultMode={resultMode}
              key={v.no}
              data={JSON.stringify(v)}
            />
          );
        })}
      </div>
      <div
        className={styles.content_container_team_div}
        id="team2"
        onDragOver={handleDragOver}
        onDrop={handleDropTeam2}
      >
        Team 2
        {team2List.map((v) => {
          if (resultMode) {
            return (
              <TeamedSummoner
                key={v.no}
                resultMode={resultMode}
                data={JSON.stringify(v)}
              />
            );
          }
          return (
            <TeamedSummoner
              resultMode={resultMode}
              key={v.no}
              data={JSON.stringify(v)}
            />
          );
        })}
      </div>
    </div>
  );
}

function TeamedSummoner({ resultMode, data }) {
  data = JSON.parse(data);
  const noRankArr = ["MASTER", "GRANDMASTER", "CHALLENGE"];
  let tierString;
  if (noRankArr.includes(data.tier)) {
    tierString = data.tier;
  } else {
    tierString = `${data.tier} ${data.rank}`;
  }
  if (resultMode) {
    return (
      <div
        className={styles.teamed_summoner_div}
        key={data.no}
        data={JSON.stringify(data)}
      >
        <div className={styles.teamed_summoner_level}>124</div>
        <img src={data.icon_img_url} />
        <div className={styles.teamed_summoner_nickname}>{data.nickname}</div>
        <div className={styles.teamed_summoner_tier}>
          <div>{data.rank ? tierString : "UNRANKED"}</div>
          <div>승률: 50%</div>
        </div>
      </div>
    );
  }
  return (
    <div
      className={styles.teamed_summoner_div}
      key={data.no}
      data={JSON.stringify(data)}
      draggable="true"
      onDragStart={handleDragStart}
    >
      <div className={styles.teamed_summoner_level}>124</div>
      <img src={data.icon_img_url} />
      <div className={styles.teamed_summoner_nickname}>{data.nickname}</div>
      <div className={styles.teamed_summoner_tier}>
        <div>{data.rank ? tierString : "UNRANKED"}</div>
        <div>승률: 50%</div>
      </div>
    </div>
  );
}
