"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dayjs from "dayjs"; // use plugin
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import isBetween from "dayjs/plugin/isBetween";
import styles from "./page.module.css";
import FriendList from "./component/friendList/FriendList";
import { Main } from "./component/main/Main";
import { instance } from "../lib/axios";

dayjs.extend(timezone); // use plugin
dayjs.extend(utc);
dayjs.extend(isBetween); // 플러그인 사용

export default function Home() {
  const router = useRouter();

  const { data: session, status } = useSession();
  const [user, setUser] = useState({});

  const [team1List, setTeam1List] = useState([]);
  const [team2List, setTeam2List] = useState([]);
  const [noTeamList, setNoTeamList] = useState([]);
  const [friendList, setFriendList] = useState([]);
  const [friendListForReset, setFriendListForReset] = useState([]);
  const [emptyTeam1, setEmptyTeam1] = useState([0, 0, 0, 0, 0]);
  const [emptyTeam2, setEmptyTeam2] = useState([0, 0, 0, 0, 0]);

  useEffect(() => {
    let firstConnection = false;
    const logDate = localStorage.getItem("logDate");
    const startDate = dayjs().tz("Asia/Seoul").startOf("day");
    const endDate = dayjs().tz("Asia/Seoul").endOf("day");
    const nowDate = dayjs().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");
    if (logDate) {
      const isLogDateBetween = dayjs(logDate).isBetween(startDate, endDate);
      if (isLogDateBetween) {
        // console.log("만료 안됨");
      } else {
        // console.log("만료됨 새로 갱신하기");
        localStorage.setItem("logDate", nowDate);
        firstConnection = true;
      }
    } else {
      firstConnection = true;
      localStorage.setItem("logDate", nowDate);
    }
    instance
      .get(`/summoner`, {
        params: {
          firstConnection,
        },
      })
      .then((res) => {
        if (res.data.code === 200) {
          const data = res.data.result;
          setFriendList([...data]);
          setFriendListForReset(JSON.parse(JSON.stringify(data)));
        }
      });
  }, []);

  const onClickResetHandler = () => {
    setTeam1List([]);
    setTeam2List([]);
    setNoTeamList([]);
    setEmptyTeam1([0, 0, 0, 0, 0]);
    setEmptyTeam2([0, 0, 0, 0, 0]);

    setFriendList(JSON.parse(JSON.stringify(friendListForReset)));
  };

  const handleDrop = (droppedSummoner) => {
    if (!droppedSummoner) {
      return;
    }

    const addedSummonerCnt =
      team1List.length + team2List.length + noTeamList.length;
    if (addedSummonerCnt === 10 && droppedSummoner.from === "friend") {
      return alert(`내전 인원이 전부 찼습니다.`);
    }

    // console.log("Dropped into the designated area!", droppedSummoner);

    const { from, to } = droppedSummoner;

    // from
    if (from === "friend") {
      const deletedList = friendList.filter((v) => {
        return v.no !== droppedSummoner.no;
      });
      setFriendList([...deletedList]);
    } else if (from === "noTeam") {
      const deletedList = noTeamList.filter((v) => {
        return v.no !== droppedSummoner.no;
      });
      setNoTeamList([...deletedList]);
    } else if (from === "team1") {
      const deletedList = team1List.filter((v) => {
        return v.no !== droppedSummoner.no;
      });
      setTeam1List([...deletedList]);
      setEmptyTeam1([...emptyTeam1, 0]);
    } else if (from === "team2") {
      const deletedList = team2List.filter((v) => {
        return v.no !== droppedSummoner.no;
      });
      setTeam2List([...deletedList]);
      setEmptyTeam2([...emptyTeam2, 0]);
    }

    // to
    droppedSummoner.from = to; //! state 추가할 떄 from값 변경해서 저장하기

    if (to === "friend") {
      setFriendList([...friendList, droppedSummoner]);
    } else if (to === "noTeam") {
      setNoTeamList([...noTeamList, droppedSummoner]);
    } else if (to === "team1") {
      setTeam1List([...team1List, droppedSummoner]);
      const deletedEmpty1 = emptyTeam1.slice(1);
      setEmptyTeam1(deletedEmpty1);
    } else if (to === "team2") {
      setTeam2List([...team2List, droppedSummoner]);
      const deletedEmpty2 = emptyTeam2.slice(1);
      setEmptyTeam2(deletedEmpty2);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUser({ ...session.user });
    } else if (status === "loading") {
      // 로딩 중에 할 작업
    } else {
      alert("로그인 후 이용 가능합니다.");
      router.push("/login");
    }
  }, [session, status]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.left_wrapper}>
        <Main
          onDrop={handleDrop}
          team1List={team1List}
          setTeam1List={setTeam1List}
          team2List={team2List}
          setTeam2List={setTeam2List}
          noTeamList={noTeamList}
          setNoTeamList={setNoTeamList}
          onClickResetHandler={onClickResetHandler}
          emptyTeam1={emptyTeam1}
          emptyTeam2={emptyTeam2}
        />
      </div>
      <div className={styles.right_wrapper}>
        <FriendList
          onDrop={handleDrop}
          user={user}
          friendList={friendList}
          setFriendList={setFriendList}
          friendListForReset={friendListForReset}
          setFriendListForReset={setFriendListForReset}
        />
      </div>
    </div>
  );
}
