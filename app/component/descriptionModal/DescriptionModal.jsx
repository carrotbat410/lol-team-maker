import { useState } from "react";
import Image from "next/image";
import styles from "./DescriptionModal.module.css";
import desc1 from "../../../public/images/desc1.png";
import desc2 from "../../../public/images/desc2.png";
import desc3 from "../../../public/images/desc3.png";
import desc4 from "../../../public/images/desc4.png";

function DescriptionModal({ closeDescModal }) {
  const [pageNo, setPageNo] = useState(1);

  const onClickLeftBtn = () => {
    if (pageNo === 1) return;
    setPageNo(pageNo - 1);
  };
  const onClickRightBtn = () => {
    if (pageNo === 4) return;
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
        <button onClick={onClickLeftBtn}>◁</button> <span>{pageNo}</span> / 4{" "}
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
    width = 350;
    height = 350;
  } else if (pageNo === 2) {
    image = desc2;
    width = 580;
    height = 300;
  } else if (pageNo === 3) {
    image = desc3;
    width = 430;
    height = 300;
  } else if (pageNo === 4) {
    image = desc4;
    width = 580;
    height = 300;
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
          <li>내전에 참여하는 총 10명의 유저의 정보를 불러옵니다.</li>
        </ul>
      </div>
    );
  }
  if (pageNo === 2) {
    return (
      <div className={styles.description_div}>
        <ul>
          <li>
            불러온 유저 정보를 해당 구역(1팀, 2팀, 팀 미정 인원)에
            드래그&드랍합니다.
          </li>
          <li>총 10명의 인원을 배치해야 합니다.</li>
          <li>
            A유저와 B유저가 같은팀인 상태의 결과를 얻으려면, 같은 팀에 배정하면
            됩니다.
          </li>
        </ul>
      </div>
    );
  }
  if (pageNo === 3) {
    return (
      <div className={styles.description_div}>
        <ul>
          <li>왼쪽 상단의 모드를 선택합니다.</li>
          <ul>
            <li>Random : 팀을 무작위로 섞습니다.</li>
            <li>
              Balance(패치 예정) : 티어의 차이가 가장 적은 결과를 반환합니다.
            </li>
            {/* <li>Golden Balance(추가 예정) : 흠...</li> */}
          </ul>
        </ul>
        <div className={styles.description_tip_div}>
          * Balance Mode 측정 기준 ( 개선될 예정이며, 자세한 사항은 패치노트를
          확인해주세요 )
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
}
