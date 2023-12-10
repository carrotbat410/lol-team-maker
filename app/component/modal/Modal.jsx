import { useState } from "react";
import styles from "./Modal.module.css";
import { instance } from "../../../lib/axios";

function Modal({ closeModal, onAddFriend }) {
  // TODO 모달창 띄우면 뒷배경 검하게 + 클릭 안되도록 수정하기
  // const imageTrue = true;

  const [nickname, setNickname] = useState("");
  const [tagLine, setTagLine] = useState("");
  const [addUserCode, setAddUserCode] = useState(0);

  const onClickAddBtn = async () => {
    if (!nickname) {
      return setAddUserCode(4001);
    }

    if (nickname.length > 20) {
      return setAddUserCode(4002);
    }

    if (tagLine.length > 20) {
      return setAddUserCode(4003);
    }

    let handledTagLine;

    if (tagLine) {
      handledTagLine = tagLine.replace(/#/g, "");
    } else {
      handledTagLine = "KR1";
    }

    const apiRequest = await instance.post("/summoner", {
      nickname,
      tagLine: handledTagLine,
    });

    const result = apiRequest.data;

    if (result.code === 200) {
      console.log("200 message:", result.message);
      setAddUserCode(200);
      onAddFriend(result.newFriend);
      // return alert("추가되었습니다.");
    } else if (result.code === 401) {
      setAddUserCode(401);
    } else if (result.code === 403) {
      setAddUserCode(403);
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
      <div className={styles.modal_content_text_div}>
        <div>추가할 유저의 닉네임과 태그라인을 입력해주세요.</div>
        <div>(태그라인 생략시 태그라인은 KR1으로 검색됩니다.)</div>
        <div />
      </div>
      <div className={styles.input_div}>
        <div>
          <span>닉네임</span>
          <input
            className={styles.nickname_input_bar}
            // style={{ backgroundImage: "url(/images/icon_reading_glasses.png)"}}
            placeholder="e.g. Hide on bush"
            type="text"
            value={nickname}
            onChange={(event) => {
              // if (imageTrue && event.target.value.length > 0) {
              //   event.target.style.backgroundImage = "none";
              //   imageTrue = false;
              // } else if (!imageTrue && event.target.value.length === 0) {
              //   event.target.style.backgroundImage =
              //     "url(/images/icon_reading_glasses.png)";
              //   // js로 접근시 /public 생략한 위 경로로 접근해야함
              //   imageTrue = true;
              // }
              setNickname(event.target.value);
            }}
          />
        </div>
        <div>
          <span>태그라인</span>
          <input
            className={styles.tagline_input_bar}
            value={tagLine}
            placeholder="e.g. KR1"
            onChange={(event) => {
              setTagLine(event.target.value);
            }}
          />
        </div>
      </div>
      <div className={styles.modal_result_text_div}>
        <span>
          {addUserCode === 200
            ? "유저를 추가했습니다"
            : addUserCode === 400
            ? "서버에 에러가 발생했습니다. 잠시후 다시 시도해주세요."
            : addUserCode === 4001
            ? "닉네임을 입력해주세요."
            : addUserCode === 4002
            ? "너무 긴 닉네임입니다."
            : addUserCode === 4003
            ? "너무 긴 태그라인입니다."
            : addUserCode === 401
            ? "세션이 만료되었습니다. 다시 로그인 후 시도해주세요."
            : addUserCode === 403
            ? "친구 추가는 최대 30명까지 가능합니다."
            : addUserCode === 404
            ? "존재하지 않는 유저입니다."
            : addUserCode === 409
            ? "이미 추가한 유저입니다."
            : null}
        </span>
      </div>
      <div className={styles.btn_div}>
        <div className={styles.btns_wrapper}>
          <input type="button" value="닫기" onClick={closeModal} />
          <input
            type="button"
            value="추가"
            className={styles.add_btn}
            onClick={onClickAddBtn}
          />
        </div>
      </div>
    </div>
  );
}

export default Modal;
