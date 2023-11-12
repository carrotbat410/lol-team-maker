import { useState } from "react";
import styles from "./Main.module.css";

export function Main({ onDrop }) {
  const [resultMode, setResultMode] = useState(false);
  const [noTeamList, setNoTeamList] = useState([
    { id: 1, nickname: "E크에크파이크" },
    { id: 2, nickname: "통티모바배큐" },
    { id: 3, nickname: "쏠킬땃을떄따봉좀" },
    { id: 4, nickname: "구민상담소" },
    { id: 5, nickname: "구민상담소" },
    { id: 6, nickname: "구민상담소" },
    { id: 7, nickname: "구민상담소" },
    { id: 8, nickname: "구민상담소" },
    { id: 9, nickname: "구민상담소" },
    { id: 10, nickname: "구민상담소" },
  ]);

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedData = event.dataTransfer.getData("text/plain");
    console.log("droppedData:", droppedData);
    onDrop(droppedData);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.setting_container}>setting_container</div>
      <div className={styles.content_container}>content_container</div>
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
              onDrop={handleDrop}
            >
              {noTeamList.map((v) => {
                return (
                  <div key={v.id} className={styles.no_team_summoner}>
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
