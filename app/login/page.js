"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import styles from "./page.module.css";

export default function Login() {
  // const [id, setId] = useState("");
  // const [password, setPassword] = useState("");

  const router = useRouter();
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const id = event.target.id.value;
    const password = event.target.password.value;

    const result = await signIn("credentials", {
      id,
      password,
      redirect: true,
      callbackUrl: "/",
    });
    console.log("result info:", result);

    // const options = {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: { id, password },
    // };
    //
    // fetch(`http://localhost:3000/login`, options)
    //   .then((res) => res.json())
    //   .then((result) => {
    //     // console.log(result) // {title: 'sss', body: 'ss', id: 3}
    //     const lastId = result.id;
    //     router.push(`/read/${lastId}`); // 생성후 생성된 페이지로 이동하기
    //   });
  };

  return (
    <div>
      <img src="/images/logo.png" className={styles.logo} />
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          objectFit: "cover",
          width: "100%",
          height: "100%",
        }}
      >
        <source src="/videos/login_background.mp4" type="video/mp4" />
        Your browser does not support the video tag. Please try again in a
        different browser.
      </video>
      <form onSubmit={onSubmitHandler} className={styles.login_box}>
        <p>계정 로그인</p>
        <p>계정 이름</p>
        <input type="text" name="id" />
        <p>비밀번호</p>
        <input type="password" name="password" />
        <p>
          <input type="submit" value="로그인" />
        </p>
        <p>
          아직 계정이 없으신가요? <span>지금 가입하세요!</span>
        </p>
        <p>
          <span>계정이름을 잊으셨나요?</span>
        </p>
        <p>
          <span>비밀번호를 잊으셨나요?</span>
        </p>
        <p>
          <span>회원가입후 자동 내전 팀짜기 서비스를 이용할 수 있습니다.</span>
        </p>
      </form>
    </div>
  );
}
