import { useState } from "react";
import Image from "next/image";
import styles from "./DescriptionModal.module.css";
import desc1 from "../../../public/images/desc1.webp";
import desc2 from "../../../public/images/desc2.webp";
import desc3 from "../../../public/images/desc3.webp";
import desc4 from "../../../public/images/desc4.webp";
import desc5 from "../../../public/images/desc5.webp";

function DescriptionModal({ closeDescModal }) {
  const [pageNo, setPageNo] = useState(1);

  const onClickLeftBtn = () => {
    if (pageNo === 1) return;
    setPageNo(pageNo - 1);
  };
  const onClickRightBtn = () => {
    if (pageNo === 5) return;
    setPageNo(pageNo + 1);
  };

  return (
    <div className={styles.modal}>
      <div className={styles.header}>
        <div className={styles.close_btn_div} />
        <span className={styles.title}>롤 내전 도우미 사용법</span>
        <div className={styles.close_btn_div}>
          <button className={styles.close_btn} onClick={closeDescModal}>
            ✕
          </button>
        </div>
      </div>
      <div className={styles.image_div}>
        <DescriptionImage pageNo={pageNo} />
      </div>
      <DescriptionText pageNo={pageNo} />
      <div className={styles.btn_div}>
        <button onClick={onClickLeftBtn}>◁</button> <span>{pageNo}</span> / 5{" "}
        <button onClick={onClickRightBtn}>▷</button>
      </div>
    </div>
  );
}

export default DescriptionModal;

function DescriptionImage({ pageNo }) {
  let image;
  let width;
  let height;
  if (pageNo === 1) {
    image = desc1;
    width = 360;
    height = 350;
  } else if (pageNo === 2) {
    image = desc2;
    width = 580;
    height = 300;
  } else if (pageNo === 3) {
    image = desc3;
    width = 330;
    height = 200;
  } else if (pageNo === 4) {
    image = desc4;
    width = 580;
    height = 300;
  } else if (pageNo === 5) {
    image = desc5;
    width = 500;
    height = 100;
  }

  return (
    <Image
      src={image}
      width={width}
      height={height}
      alt="Picture for Description"
    />
  );
}

function DescriptionText({ pageNo }) {
  if (pageNo === 1) {
    return (
      <div className={styles.description_div}>
        <ul>
          <li>
            내전 인원 추가 버튼을 눌러 닉네임과 태그라인을 입력하고,
            <br />
            추가 버튼을 클릭하여 내전에 참여할 유저의 정보를 불러옵니다.
          </li>
        </ul>
      </div>
    );
  }
  if (pageNo === 2) {
    return (
      <div className={styles.description_div}>
        <ul>
          <li>
            왼쪽 상단의 모드를 선택합니다.
            <br />
            Random : 팀을 무작위로 섞습니다.
            <br />
            Balance : 전력 차이가 적게 나는 최상위 결과10개 중 1개를 반환합니다.
            <br />
            Golden Balance : 전력 차이가 적게 나는 최상위 결과 1개를 반환합니다.
            <br />
            Line Balance : 라인도 고려한  전력 차이가 적게 나는 최상위 결과 1개를 반환합니다. (라인 설정 필요!)
          </li>
        </ul>
        <div className={styles.description_tip_div}>
          * 전력 측정 기준
          <br />
          &nbsp;&nbsp;&nbsp;UNRAKED = 0점&nbsp;&nbsp;&nbsp;IRON 4 =
          1점&nbsp;&nbsp; ... &nbsp;&nbsp;DIAMOND 2 =
          27&nbsp;&nbsp;&nbsp;DIAMOND 1 = 28
          <br />
          &nbsp;&nbsp;&nbsp;MASTER = 29&nbsp;&nbsp;&nbsp;GRANDMASTER=
          30&nbsp;&nbsp;&nbsp;CHALLENGER = 31점
        </div>
      </div>
    );
  }
  if (pageNo === 3) {
    return (
      <div className={styles.description_div}>
        <ul>
          <li>
            불러온 유저 정보를 해당 구역(1팀, 2팀, 팀 미정 인원)에
            드래그&드랍합니다.
          </li>
          <li>총 10명의 인원을 배치해야 합니다.</li>
          <li>만약 Line Balance 모드라면, 참가 유저의 주라인을 선택해야 하며,<br/>
            탑/미드/정글/원딜/서폿 라인별로 각각 2명이 존재해야합니다.</li>
        </ul>
        <div className={styles.description_tip_div}>
          TIP - 불러온 유저의 티어를 필요시에 임의로 변경할 수 있습니다.
        </div>
        <div className={styles.description_tip_div}>
          TIP - A, B유저가 같은팀인 결과를 얻으려면, 같은 팀에 배치하면 됩니다.
        </div>
      </div>
    );
  }
  if (pageNo === 4) {
    return (
      <div className={styles.description_div}>
        <ul>
          <li>팀 짜기 버튼을 클릭하여, 결과를 확인합니다.</li>
          <li>
            결과 복사하기 버튼을 클릭한다면, 결과를 채팅창에 붙여넣기할 수
            있습니다.
          </li>
        </ul>
      </div>
    );
  }
  if (pageNo === 5) {
    return (
      <div className={styles.description_div}>
        <ul>
          <li>갱신된지 24시간이 지나면 갱신하기 버튼이 생깁니다.</li>
        </ul>
        <div className={styles.description_tip_div}>
          TIP - 24시간이 지나도 갱신버튼이 안생긴다면, 다른 유저에 의해 이미
          갱신되었을수도 있습니다.
        </div>
      </div>
    );
  }
}
