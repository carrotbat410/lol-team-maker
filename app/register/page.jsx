"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onChangeIdHandler = (event) => {
    setId(event.target.value);
  };
  const onChangePasswordHandler = (event) => {
    setPassword(event.target.value);
  };
  const onChangeConfirmPasswordHandler = (event) => {
    setConfirmPassword(event.target.value);
  };
  const onClickBtnHandler = (event) => {
    if (!id) return alert("no - id");
    if (!password) return alert("no - password");
    if (!confirmPassword) return alert("no - confirm password");

    if (password !== confirmPassword)
      return alert("Password and confirmPassword do not match.");

    const body = {
      id,
      password,
    };

    axios
      .post("http://localhost:3000/api/register", body)
      .then((res) => {
        if (res.data.code >= 400) {
          return alert(res.data.message);
        }
        router.push("/login");
      })
      .catch((err) => {
        console.log("err info:", err);
      });
  };

  return (
    <div className="wrapper">
      <div className="login_box">
        <div>
          id : <input value={id} onChange={onChangeIdHandler} />
        </div>
        <div>
          password :{" "}
          <input
            type="password"
            value={password}
            onChange={onChangePasswordHandler}
          />
        </div>
        <div>
          confirm password :{" "}
          <input
            type="password"
            value={confirmPassword}
            onChange={onChangeConfirmPasswordHandler}
          />
        </div>
        <input type="button" value="send" onClick={onClickBtnHandler} />
      </div>
    </div>
  );
}
