import { useState } from "react";
import styles from "./Patch.module.css";

function PatchModal({ closePatchModal }) {
  const [pageNo, setPageNo] = useState(1);

  const onClickLeftBtn = () => {
    if (pageNo === 1) return;
    setPageNo(pageNo - 1);
  };
  const onClickRightBtn = () => {
    if (pageNo === 2) return;
    setPageNo(pageNo + 1);
  };

  return (
    <div className={styles.modal}>
      <div className={styles.header}>
        <div className={styles.close_btn_div} />
        <span className={styles.title}>
          패치 노트&nbsp;
          <span className={styles.now_version}>(현재 버전: 0.1)</span>
        </span>
        <div className={styles.close_btn_div}>
          <button className={styles.close_btn} onClick={closePatchModal}>
            ✕
          </button>
        </div>
      </div>
      <DescriptionText pageNo={pageNo} />
      <div className={styles.btn_div}>
        <button onClick={onClickLeftBtn}>◁</button> <span>{pageNo}</span> / 2{" "}
        <button onClick={onClickRightBtn}>▷</button>
      </div>
    </div>
  );
}

function DescriptionText({ pageNo }) {
  if (pageNo === 1) {
    return (
      <div className={styles.patch_log_div}>
        <h3 className={styles.patch_log_title}>
          <span className={styles.patch_version}>0.2 패치</span>&nbsp;&nbsp;
          <span className={styles.created_at}>(작성일 : 2023-12-16)</span>
        </h3>
        <ul>
          <li>팀 섞는 모드 개선</li>
          <ul>
            <li>
              Balance 모드일떄, 가장 전력 차이가 적게 나는 결과 3개 중 1개를
              보여주도록 수정될 예정입니다.
            </li>
          </ul>
          <br />
          <li>결과 화면에 추가적인 정보 제공</li>
          <ul>
            <li>각 팀의 평균 티어를 보여줄 예정입니다.</li>
          </ul>
        </ul>
      </div>
    );
  }
  if (pageNo === 2) {
    return (
      <div className={styles.patch_log_div}>
        <h3>개발자의 할일 (일정 미정)</h3>
        <ul>
          <li>
            전력 비교를 단순 티어 비교가 아닌, mmr(티어, 승률 등의 요소를 계산한
            점수)을 계산하여 비교하도록 수정
          </li>
          <li>티어 뿐만 아니라 라인까지 고려하여 결과에 반영하기</li>
          <li>
            결과 화면에 평균 티어, 유저들의 주 라인 및 모스트 챔피언등의 정보
            보여주기
          </li>
        </ul>
      </div>
    );
  }
}

export default PatchModal;
