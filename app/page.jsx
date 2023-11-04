"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import FriendList from "./component/friendList/FriendList";

export default function Home() {
  const router = useRouter();

  const { data: session, status } = useSession();
  const [user, setUser] = useState({});

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
    // <div>
    //   <div>this is root page</div>
    //   {session.data?.user ? <div>hello, {session.data.user.id}</div> : <div />}
    //   {session.data?.user ? (
    //     <input
    //       type="button"
    //       value="logout"
    //       onClick={() =>
    //         signOut({
    //           callbackUrl: "http://localhost:3000/login",
    //         })
    //       }
    //     />
    //   ) : (
    //     <div />
    //   )}
    // </div>
    <div className={styles.wrapper}>
      <div className={styles.left_wrapper}>left_wrapper</div>
      <div className={styles.right_wrapper}>
        <FriendList user={user} />
      </div>
    </div>
  );
}
