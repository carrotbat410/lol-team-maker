import { useState } from "react";
import axios from "axios";
import styles from "./Modal.module.css";

function Modal({ closeModal }) {
  let imageTrue = true;

  const [nickname, setNickname] = useState("");
  const [addUserCode, setAddUserCode] = useState(0);

  const onClickAddBtn = async () => {
    if (!nickname) {
      return alert("닉네임을 입력해주세요.");
    }

    const apiRequest = await axios.post("http://localhost:3000/api/summoner", {
      nickname,
    });

    const result = apiRequest.data;

    if (result.code === 200) {
      console.log("200 message:", result.message);
      setAddUserCode(200);
      // return alert("추가되었습니다.");
    } else if (result.code === 404) {
      // console.log("404 error:", result.message);
      setAddUserCode(404);
      // return alert("존재하지 않는 유저입니다.");
    } else if (result.code === 409) {
      // console.log("409:", result.message);
      setAddUserCode(409);
    } else {
      // 400 Bad Request
      setAddUserCode(400);
      // console.log("else error:", result);
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modal_close}>
        <span onClick={closeModal}>&times;</span>
      </div>
      <div className={styles.modal_content_text_div}>
        <p>추가할 유저의 닉네임을 롤 닉네임을 입력해주세요.</p>
      </div>
      <div className={styles.modal_content_input_div}>
        <input
          className={styles.modal_content_search_bar}
          style={{
            backgroundImage: "url(/images/icon_reading_glasses.png)",
          }}
          type="text"
          value={nickname}
          onChange={(event) => {
            if (imageTrue && event.target.value.length > 0) {
              event.target.style.backgroundImage = "none";
              imageTrue = false;
            } else if (!imageTrue && event.target.value.length === 0) {
              event.target.style.backgroundImage =
                "url(/images/icon_reading_glasses.png)";
              // js로 접근시 /public 생략한 위 경로로 접근해야함
              imageTrue = true;
            }
            setNickname(event.target.value);
          }}
        />
        <input
          type="button"
          value="추가"
          className={styles.modal_content_add_btn}
          onClick={onClickAddBtn}
        />
      </div>
      <div className={styles.modal_result_text_div}>
        <span>
          {addUserCode === 200
            ? "유저를 추가했습니다 "
            : addUserCode === 404
            ? "존재하지 않는 유저입니다."
            : addUserCode === 400
            ? "현재 서버에 문제가 있습니다."
            : addUserCode === 409
            ? "이미 추가한 유저입니다."
            : null}
        </span>
      </div>
    </div>
  );
}

export default Modal;
