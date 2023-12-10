"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import styles from "./page.module.css";
import { instance } from "../../lib/axios";

export default function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoginBox, setIsLoginBox] = useState(true);

  const router = useRouter();

  const session = useSession();

  if (session && session.status !== "loading") {
    if (session.status === "authenticated") {
      router.push("/");
      console.log("로그인 되어있음, session info:", session.data.user);
    }
  }

  const onChangeIdHandler = (event) => {
    if (event.target.value.length < 21) setId(event.target.value);
  };
  const onChangePasswordHandler = (event) => {
    if (event.target.value.length < 21) {
      setPassword(event.target.value);
    }
  };

  const onChangeConfirmHandler = (event) => {
    if (event.target.value.length < 21) {
      setConfirmPassword(event.target.value);
    }
  };

  const onClickLoginBtnHandler = async (event) => {
    if (!id || !password) return;
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

  const onClickRegisterBtnHandler = async () => {
    if (!id || !password || !confirmPassword) return;
    if (password !== confirmPassword) {
      return alert("비밀번호가 일치하지 않습니다.");
    }
    const regExp = /^[a-zA-Z0-9]*$/;
    if (!regExp.test(id)) {
      return alert("아이디는 영문, 숫자만 사용 가능합니다.");
    }

    if (!regExp.test(password)) {
      return alert("비밀번호는 영문, 숫자만 사용 가능합니다.");
    }

    const response = await instance.post("/user", {
      id,
      password,
    });
    const statusCode = response.data.code;
    if (statusCode === 200) {
      alert("회원가입에 성공하였습니다.");
      setIsLoginBox(true);
      setPassword("");
      setConfirmPassword("");
      return;
    }
    if (statusCode === 409) {
      return alert("이미 사용중인 아이디입니다.");
    }
    return alert("bad reqeust");
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
        {isLoginBox ? (
          <div className={styles.login_box}>
            <div className={styles.header}>
              <span>계정 로그인</span>
            </div>
            <div className={styles.content_wrapper_login}>
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
                  {id && password ? (
                    <input
                      className={styles.login_btn_enabled}
                      type="button"
                      value="로그인"
                      onClick={onClickLoginBtnHandler}
                    />
                  ) : (
                    <input
                      className={styles.login_btn_disabled}
                      type="button"
                      value="로그인"
                      disabled
                    />
                  )}
                </div>
              </div>
            </div>
            <div className={styles.footer}>
              <div>
                아직 계정이 없으신가요?{" "}
                <span
                  onClick={() => {
                    setIsLoginBox(false);
                    setId("");
                    setPassword("");
                  }}
                >
                  지금 가입하세요!
                </span>
              </div>
              <div>
                <span
                  onClick={() => {
                    return alert("개발중인 기능입니다.");
                  }}
                >
                  계정이름을 잊으셨나요?
                </span>
              </div>
              <div>
                <span
                  onClick={() => {
                    return alert("개발중인 기능입니다.");
                  }}
                >
                  비밀번호를 잊으셨나요?
                </span>
              </div>
              <div>
                <span
                  onClick={() => {
                    return alert("카톡링크걸기");
                  }}
                >
                  문의사항이 있나요?
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.login_box}>
            <div className={styles.header}>
              <span>계정 등록</span>
            </div>
            <div className={styles.content_wrapper_register}>
              <div className={styles.content}>
                <span className={styles.name_span}>
                  계정 이름{" "}
                  <span className={styles.validation_text}>
                    (영문, 숫자 허용. 6글자 이상 20글자 이하.)
                  </span>
                </span>
                <input type="text" value={id} onChange={onChangeIdHandler} />
                <span className={styles.password_span}>
                  비밀번호{" "}
                  <span className={styles.validation_text}>
                    (영문, 숫자 허용. 6글자 이상 20글자 이하.)
                  </span>
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={onChangePasswordHandler}
                />
                <span className={styles.password_span}>비밀번호 확인</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={onChangeConfirmHandler}
                />
                <div className={styles.login_btn_wrapper}>
                  {id &&
                  id.length > 5 &&
                  password &&
                  password.length > 5 &&
                  confirmPassword &&
                  confirmPassword.length > 5 ? (
                    <input
                      className={styles.login_btn_enabled}
                      type="button"
                      value="회원가입"
                      onClick={onClickRegisterBtnHandler}
                    />
                  ) : (
                    <input
                      className={styles.login_btn_disabled}
                      type="button"
                      value="회원가입"
                      disabled
                    />
                  )}
                </div>
              </div>
            </div>
            <div className={styles.footer}>
              <div>
                <span
                  onClick={() => {
                    setIsLoginBox(true);
                    setId("");
                    setPassword("");
                    setConfirmPassword("");
                  }}
                >
                  로그인 화면으로 돌아가기
                </span>
              </div>
            </div>
          </div>
        )}
        <div className={styles.description}>
          ~는 내전~ 팀짜기 제공, ~팬메이드, 라이엇 공식 서비스가 아님을 밝힘.
        </div>
      </div>
    </div>
  );
}
