import { useState } from "react";
import axios from "axios";
import styles from "./Main.module.css";
import { handleDragStart } from "../friendList/FriendList";

export function Main({
  onDrop,
  team1List,
  setTeam1List,
  team2List,
  setTeam2List,
  noTeamList,
  setNoTeamList,
}) {
  const [resultMode, setResultMode] = useState(false);

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
      <div className={styles.content_container}>
        <div
          className={styles.content_container_team_div}
          id="team1"
          onDragOver={handleDragOver}
          onDrop={handleDropTeam1}
        >
          Team 1
          {team1List.map((v) => {
            return (
              <div
                key={v.no}
                data={JSON.stringify(v)}
                draggable="true"
                onDragStart={handleDragStart}
              >
                {v.nickname}
              </div>
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
            return (
              <div
                key={v.no}
                data={JSON.stringify(v)}
                draggable="true"
                onDragStart={handleDragStart}
              >
                {v.nickname}
              </div>
            );
          })}
        </div>
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
                setResultMode(!resultMode);
                const result = await axios.post(
                  "http://localhost:3000/api/makeResult",
                  {
                    selectMode: "random",
                    team1List,
                    team2List,
                    noTeamList,
                  },
                );
                console.log("axios result:", result.data);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
