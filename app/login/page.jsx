"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import styles from "./page.module.css";

export default function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const session = useSession();

  if (session && session.status !== "loading") {
    if (session.status === "authenticated") {
      router.push("/");
      console.log("로그인 되어있음, session info:", session.data.user);
    }
  }

  const onChangeIdHandler = (event) => {
    setId(event.target.value);
  };
  const onChangePasswordHandler = (event) => {
    setPassword(event.target.value);
  };

  const onClickLoginBtnHandler = async (event) => {
    if (!id) return alert("no - id");
    if (!password) return alert("no - password");

    await signIn("credentials", {
      id,
      password,
      redirect: true,
      callbackUrl: "/",
    })
      .then((res) => {
        // console.log("login res info:", res);
        if (res.data.code >= 400) {
          return alert(res.data.message);
        }
        router.push("/");
      })
      .catch((err) => {
        console.log("err info:", err);
      });
  };

  return (
    <div className={styles.background}>
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
      <div className={styles.wrapper}>
        <div className={styles.login_box}>
          <div className={styles.header}>
            <span>계정 로그인</span>
          </div>
          <div className={styles.content_wrapper}>
            <div className={styles.content}>
              <span className={styles.name_span}>계정 이름</span>
              <input type="text" value={id} onChange={onChangeIdHandler} />
              <span className={styles.password_span}>비밀번호</span>
              <input
                type="password"
                value={password}
                onChange={onChangePasswordHandler}
              />
              <div className={styles.login_btn_wrapper}>
                <input
                  type="button"
                  value="로그인"
                  onClick={onClickLoginBtnHandler}
                />
              </div>
            </div>
          </div>
          <div className={styles.footer}>
            <div>
              아직 계정이 없으신가요? <span>지금 가입하세요!</span>
            </div>
            <div>
              <span>계정이름을 잊으셨나요?</span>
            </div>
            <div>
              <span>비밀번호를 잊으셨나요?</span>
            </div>
          </div>
        </div>
        <div className={styles.description}>
          ~는 내전~ 팀짜기 제공, ~팬메이드, 라이엇 공식 서비스가 아님을 밝힘.
        </div>
      </div>
    </div>
  );
}
