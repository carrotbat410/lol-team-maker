"use client";

// import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import { authOptions } from "@/pages/api/auth/[...nextauth].js";

export default function Home() {
  const router = useRouter();

  console.log("---------");

  const session = useSession();
  if (session && session.status !== "loading") {
    if (session.status === "authenticated") {
      alert(`로그인 성공${session.data.user.id}`);
      console.log("로그인 성공");
    } else {
      alert("로그인후 이용 가능합니다.");
      router.push("/login");
    }
  }
  // if (session.status === "authenticated" && cnt === 0) {
  //   console.log(cnt === 0);
  //   console.log("session info:", session, cnt);
  //   setId(session.data);
  // }

  return (
    <div>
      <div>this is root page</div>
    </div>
  );
}
