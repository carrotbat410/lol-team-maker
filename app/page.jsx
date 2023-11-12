"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import FriendList from "./component/friendList/FriendList";
import { Main } from "./component/main/Main";

export default function Home() {
  const router = useRouter();

  const { data: session, status } = useSession();
  const [user, setUser] = useState({});

  const handleDrop = (droppedData) => {
    console.log("Dropped into the designated area!", droppedData);
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
        <Main onDrop={handleDrop} />
      </div>
      <div className={styles.right_wrapper}>
        <FriendList user={user} />
      </div>
    </div>
  );
}
