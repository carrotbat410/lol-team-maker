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
          <span className={styles.now_version}>(현재 버전: 0.2)</span>
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
          <span className={styles.patch_version}>#0.2 패치</span>&nbsp;&nbsp;
          {/* <span className={styles.created_at}>(패치 예상일: 2023-12-19)</span> */}
        </h3>
        <ul>
          <li>티어 변경 기능 추가</li>
          <ul>
            <li>
              "현 시즌 UNRANKED인 유저(전 시즌 MASTER)가 포함된 경우, IRON4보다
              더 전력이 약한 유저로 측정하는 상황"에 대한 해결책으로, 티어 변경
              기능을 추가할 예정입니다.
            </li>
          </ul>
        </ul>
        <h3 className={styles.patch_log_title}>
          <span className={styles.patch_version}>#0.3 패치</span>&nbsp;&nbsp;
          <span className={styles.created_at}>(패치 예상일: 2023-12-20)</span>
        </h3>
        <ul>
          <li>Balance 모드 결과의 경우의 수 추가</li>
          <ul>
            <li>
              Balance 모드일떄, 가장 전력 차이가 적게 나는 상위 결과 최대10개 중
              1개를 보여주도록 수정될 예정입니다.
            </li>
          </ul>
          <br />
          <li>Gold Balance 모드 추가</li>
          <ul>
            <li>
              가장 전력 차이가 적게 나는 최상위 결과 1개만 보여주는 모드를
              추가할 예정입니다.
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
          <li>티어 뿐만 아니라 주 라인까지 고려하여 결과에 반영하기</li>
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
