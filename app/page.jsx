"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./page.module.css";
import FriendList from "./component/friendList/FriendList";
import { Main } from "./component/main/Main";

export default function Home() {
  const router = useRouter();

  const { data: session, status } = useSession();
  const [user, setUser] = useState({});

  const [team1List, setTeam1List] = useState([]);
  const [team2List, setTeam2List] = useState([]);
  const [noTeamList, setNoTeamList] = useState([]);
  const [friendList, setFriendList] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/summoner").then((res) => {
      if (res.data.code === 200) {
        setFriendList(res.data.result);
      }
    });
  }, []);

  const handleDrop = (droppedData) => {
    // console.log("Dropped into the designated area!", droppedData);
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
        />
      </div>
      <div className={styles.right_wrapper}>
        <FriendList
          user={user}
          friendList={friendList}
          setFriendList={setFriendList}
        />
      </div>
    </div>
  );
}
