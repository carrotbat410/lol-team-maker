import { useState } from "react";
import styles from "./Main.module.css";

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
    data.location = "noTeam";
    console.log("noTeamList에서 받음 - data:", data);

    setNoTeamList([...noTeamList, data]);
    onDrop(data);
  };

  const handleDropTeam1 = (event) => {
    if (team1List.length >= 5) {
      return;
    }
    event.preventDefault();
    const droppedData = event.dataTransfer.getData("text/plain");
    const data = JSON.parse(droppedData);
    data.location = "team1";
    console.log("team1 List에서 받음 - data:", data);
    onDrop(data);
    setTeam1List([...team1List, data]);
  };

  const handleDropTeam2 = (event) => {
    event.preventDefault();
    const droppedData = event.dataTransfer.getData("text/plain");
    const data = JSON.parse(droppedData);
    data.location = "team2";
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
          {team1List.map((v) => {
            return <div key={v.no}>{v.nickname}</div>;
          })}
        </div>
        <div
          className={styles.content_container_team_div}
          id="team2"
          onDragOver={handleDragOver}
          onDrop={handleDropTeam2}
        >
          team2
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
                  <div key={v.no} className={styles.no_team_summoner}>
                    {v.nickname}
                  </div>
                );
              })}
            </div>
            <input
              type="button"
              className={styles.make_result_btn}
              value="팀 짜기"
              onClick={() => {
                setResultMode(!resultMode);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
