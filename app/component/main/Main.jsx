import { useState } from "react";
import copy from "clipboard-copy";
import Image from "next/image";
import styles from "./Main.module.css";
import { handleDragStart } from "../friendList/FriendList";
import { instance } from "../../../lib/axios";

export function Main({
  onDrop,
  team1List,
  team2List,
  noTeamList,
  onClickResetHandler,
  emptyTeam1,
  emptyTeam2,
}) {
  const [selectedMode, setSelectedMode] = useState("random");
  const [resultMode, setResultMode] = useState(false);
  const [finishedTeam1, setFinishedTeam1] = useState([]);
  const [finishedTeam2, setFinishedTeam2] = useState([]);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = async () => {
    try {
      let team1Text = "1팀:";
      let team2Text = "2팀:";
      for (const t of finishedTeam1) team1Text += ` ${t.nickname}`;
      for (const t of finishedTeam2) team2Text += ` ${t.nickname}`;
      await copy(`${team1Text}\n${team2Text}`);
      if (!isCopied) {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1500);
      }
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

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
      <div className={styles.setting_container}>
        <div className={styles.mode_select_div}>
          <span>모드 선택</span>
          <select
            defaultValue="random"
            onChange={(event) => {
              setSelectedMode(event.target.value);
            }}
          >
            <option value="random">Random</option>
            <option value="balance">Balance</option>
            {/* <option value="goldBalance">황금밸런스</option> */}
          </select>
        </div>
        <div className={styles.reset_btn_div}>
          <input
            type="button"
            value="리셋"
            onClick={() => {
              if (
                !team1List.length &&
                !team2List.length &&
                !noTeamList.length
              ) {
                return;
              }
              onClickResetHandler();
              if (resultMode === true) setResultMode(false);
            }}
          />
        </div>
      </div>
      <div>
        {resultMode ? (
          <ContentComponent
            team1List={finishedTeam1}
            team2List={finishedTeam2}
            resultMode={resultMode}
            // handleDragOver={handleDragOver}
            // handleDropTeam1={handleDropTeam1}
            // handleDropTeam2={handleDropTeam2}
            emptyTeam1={emptyTeam1}
            emptyTeam2={emptyTeam2}
          />
        ) : (
          <ContentComponent
            team1List={team1List}
            team2List={team2List}
            resultMode={resultMode}
            handleDragOver={handleDragOver}
            handleDropTeam1={handleDropTeam1}
            handleDropTeam2={handleDropTeam2}
            emptyTeam1={emptyTeam1}
            emptyTeam2={emptyTeam2}
          />
        )}
      </div>
      <div className={styles.result_container}>
        {resultMode ? (
          <div />
        ) : (
          <div className={styles.result_container_header}>팀 미정 인원</div>
        )}
        {/* <div className={styles.result_container_header}>팀 미정 인원</div> */}
        {resultMode ? (
          <div className={styles.result_mode_true_container}>
            <div>
              {isCopied ? (
                <input
                  type="button"
                  value="복사 완료 :)"
                  className={styles.copy_btn}
                  onClick={handleCopyClick}
                />
              ) : (
                <input
                  type="button"
                  value="결과 복사하기"
                  className={styles.copy_btn}
                  onClick={handleCopyClick}
                />
              )}
            </div>
            <div>
              <input
                type="button"
                value="다시 하기"
                className={styles.again_btn}
                onClick={() => {
                  setResultMode(!resultMode);
                  setIsCopied(false);
                }}
              />
            </div>
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
                  return alert("팀 생성을 위해 10명을 채워주세요.");
                }

                const result = await instance.post("/makeResult", {
                  selectedMode,
                  team1List,
                  team2List,
                  noTeamList,
                });
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
  emptyTeam1,
  emptyTeam2,
}) {
  return (
    <div className={styles.content_container}>
      <div
        className={styles.content_container_team_div}
        id="team1"
        onDragOver={handleDragOver}
        onDrop={handleDropTeam1}
      >
        1팀
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
        {emptyTeam1.map((v, i) => {
          const index = 10 + i;
          if (!resultMode) {
            return (
              <div
                className={styles.empty_teamed_summoner_div}
                draggable={false}
                key={index}
              >
                <span>비어 있음</span>
              </div>
            );
          }
        })}
      </div>
      <div
        className={styles.content_container_team_div}
        id="team2"
        onDragOver={handleDragOver}
        onDrop={handleDropTeam2}
      >
        2팀
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
        {emptyTeam2.map((v, i) => {
          const index = 20 + i;
          if (!resultMode) {
            return (
              <div
                className={styles.empty_teamed_summoner_div}
                draggable={false}
                key={index}
              >
                <span>비어 있음</span>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}

function TeamedSummoner({ resultMode, data }) {
  data = JSON.parse(data);

  let tierString;
  if (data.tier) {
    if (["MASTER", "GRANDMASTER", "CHALLENGER"].includes(data.tier)) {
      tierString = data.tier;
    } else {
      tierString = `${data.tier} ${data.rank}`;
    }
  } else {
    tierString = "UNRANKED";
  }

  const wins = data.wins || 0;
  const losses = data.losses || 0;
  let winsRate;
  if (wins === 0 && losses === 0) winsRate = 0;
  else if (wins === 0 && losses !== 0) winsRate = 0;
  else if (wins !== 0 && losses === 0) winsRate = 100;
  else winsRate = parseInt((wins / (wins + losses)) * 100);

  if (resultMode) {
    return (
      <div
        className={styles.teamed_summoner_div}
        key={data.no}
        data={JSON.stringify(data)}
      >
        <div className={styles.teamed_summoner_level}>{data.level}</div>
        <Image
          src={data.icon_img_url}
          draggable={false}
          width={35}
          height={35}
          alt="profile_img"
        />
        <div className={styles.teamed_summoner_nickname}>{data.nickname}</div>
        <div className={styles.teamed_summoner_tier}>
          <div>{data.rank ? tierString : "UNRANKED"}</div>
          <div>{`승률: ${winsRate}%`}</div>
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
      <div className={styles.teamed_summoner_level}>{data.level}</div>
      <Image
        src={data.icon_img_url}
        draggable={false}
        width={35}
        height={35}
        alt="profile_img"
      />
      <div className={styles.teamed_summoner_nickname}>{data.nickname}</div>
      <div className={styles.teamed_summoner_tier}>
        <div>{data.rank ? tierString : "UNRANKED"}</div>
        <div>{`승률: ${winsRate}%`}</div>
      </div>
    </div>
  );
}
