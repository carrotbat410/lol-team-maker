"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const session = useSession();
  if (session && session.status !== "loading") {
    if (session.status === "authenticated") {
      console.log("로그인 성공, session info:", session.data.user);
    } else {
      alert("로그인후 이용 가능합니다.");
      router.push("/login");
    }
  }

  return (
    <div>
      <div>this is root page</div>
      {session.data?.user ? <div>hello, {session.data.user.id}</div> : <div />}
      {session.data?.user ? (
        <input
          type="button"
          value="logout"
          onClick={() =>
            signOut({
              callbackUrl: "http://localhost:3000/login",
            })
          }
        />
      ) : (
        <div />
      )}
    </div>
  );
}
