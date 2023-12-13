"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import FriendList from "./component/friendList/FriendList";
import { Main } from "./component/main/Main";
import { instance } from "../lib/axios";

export default function Home() {
  const router = useRouter();

  const { data: session, status } = useSession();
  const [user, setUser] = useState({});

  const [team1List, setTeam1List] = useState([]);
  const [team2List, setTeam2List] = useState([]);
  const [noTeamList, setNoTeamList] = useState([]);
  const [friendList, setFriendList] = useState([]);
  const [emptyTeam1, setEmptyTeam1] = useState([0, 0, 0, 0, 0]);
  const [emptyTeam2, setEmptyTeam2] = useState([0, 0, 0, 0, 0]);

  useEffect(() => {
    instance.get("/summoner").then((res) => {
      if (res.data.code === 200) {
        setFriendList(res.data.result);
      }
    });
  }, []);

  const onClickResetHandler = () => {
    setTeam1List([]);
    setTeam2List([]);
    setNoTeamList([]);
    setEmptyTeam1([0, 0, 0, 0, 0]);
    setEmptyTeam2([0, 0, 0, 0, 0]);

    instance.get("/summoner").then((res) => {
      if (res.data.code === 200) {
        setFriendList(res.data.result);
      }
    });
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
        />
      </div>
    </div>
  );
}
