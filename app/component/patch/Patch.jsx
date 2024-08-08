import { useState } from "react";
import styles from "./Patch.module.css";

function PatchModal({ closePatchModal }) {
  const [pageNo, setPageNo] = useState(1);

  const onClickLeftBtn = () => {
    if (pageNo === 1) return;
    setPageNo(pageNo - 1);
  };
  const onClickRightBtn = () => {
    if (pageNo === 3) return;
    setPageNo(pageNo + 1);
  };

  return (
    <div className={styles.modal}>
      <div className={styles.header}>
        <div className={styles.close_btn_div} />
        <span className={styles.title}>
          공지 사항&nbsp;
          <span className={styles.now_version}>(작성일: 2024-08-08)</span>
        </span>
        <div className={styles.close_btn_div}>
          <button className={styles.close_btn} onClick={closePatchModal}>
            ✕
          </button>
        </div>
      </div>
      <DescriptionText pageNo={pageNo} />
      <div className={styles.btn_div}>
        <button onClick={onClickLeftBtn}>◁</button> <span>{pageNo}</span> / 3{" "}
        <button onClick={onClickRightBtn}>▷</button>
      </div>
    </div>
  );
}

function DescriptionText({ pageNo }) {
  if (pageNo === 1) {
    return (
      <div className={styles.patch_log_div}>
        {/*제목!*/}
        <h4 className={styles.patch_log_title}>
          안녕하세요! 롤 내전 도우미 개발자입니다.
          {/*<span className={styles.patch_version}>#0.2 패치</span>&nbsp;&nbsp;*/}
          {/* <span className={styles.created_at}>(패치 예상일: 2023-12-19)</span> */}
        </h4>
        앞으로 업데이트 될 부분에 대해서 설명드릴려고 합니다.<br/>
        꼭 읽어주시면 감사하겠습니다:)
        <br/>
        <h2>1. 주라인 옵션 도입</h2>
        많은 분들이 "주 라인도 고려해서 팀 결과가 나왔으면 좋겠다" 의견을 주셨습니다.<br/>
        그래서 유저분들의 의견과 고민끝에 나온 방안은 다음과 같습니다.<br/>
        <br/>
        1. 모드 선택에 주라인 고려 모드(줄여서 주라인 모드라 하겠습니다)를 추가합니다.<br/><br/>
        2. 다른 모드에서 주라인 모드로 변경시 화면이 초기화되고 (리셋 버튼 한번 누른것처럼)<br/><br/>
        3. 티어 설정 옆에 주 라인 설정칸이 생깁니다.<br/><br/>
        4. 포지션이 설정 된 유저만 배치할 수 있습니다.<br/><br/>
        5. 각 라인별로 2명이 충족되어합니다.<br/>
        예시1) 팀1에 top 라이너가 배치되어있는데, 또 팀1에 top 라이너를 배치하는 경우 → 에러 문구 발생<br/>
        예시2) 팀 미정 인원에 top 라이너 2명을 배치했는데, 1팀에 top 라이너를 배치하는 경우 → 에러 문구 발생<br/>


        {/*<h3 className={styles.patch_log_title}>*/}
        {/*  <span className={styles.patch_version}>#0.3 패치</span>&nbsp;&nbsp;*/}
          {/* <span className={styles.created_at}>(패치 예상일: 2023-12-20)</span> */}
        {/*</h3>*/}
      </div>
    );
  }
  if (pageNo === 2) {
    return (
      <div className={styles.patch_log_div}>
        <h2>2. 로그인 화면 수정 예정</h2>
        현재 모니터 화면 크기에 따라, 로그인 화면 구성이 이상한데, 이를 개선할 예정입니다.<br/>

        <h2>3. 버그 수정 예정</h2>
        1. 동시에 여러 소환사정보를 갱신할 경우 이상해지는 현상<br/>
        → 임시방편으로 새로고침하시면 됩니다. (부끄럽따!)<br/><br/>

        2. 동시에 많은 유저들이 사용하는 경우 발생하는 에러

        <h2>4. 팀 분배 기준에 대한 설명 페이지 추가</h2>
        사이트 사용법에 대해 좀 더 자세히, 여러 정보들을 가독성 좋게 제공하겠습니다. (크롬 브라우저 권장, 팀 나누는 기준 등...)

        <h2>5. 광고 및 커피 후원 도입</h2>
        그...👉👈 변명을 하자면... 서버 운영 비용이 나가고 있고... 앞으로 사용자들이<br/>
        더 많아지면 Riot 정보 가져오는것을 유료 버전으로 바꿔서 제한을 늘려야합니다...<br/>


        {/*<ul>*/}
        {/*  <li>*/}
        {/*    전력 비교를 단순 티어 비교가 아닌, mmr(티어, 승률 등의 요소를 계산한*/}
        {/*    점수)을 계산하여 비교하도록 수정*/}
        {/*  </li>*/}
        {/*  <li>티어 뿐만 아니라 주 라인까지 고려하여 결과에 반영하기</li>*/}
        {/*  <li>*/}
        {/*    결과 화면에 평균 티어, 유저들의 주 라인 및 모스트 챔피언등의 정보*/}
        {/*    보여주기*/}
        {/*  </li>*/}
        {/*</ul>*/}
      </div>
    );
  }
  if (pageNo === 3) {
    return (
      <div className={styles.patch_log_div}>
        <h2>하고싶은말</h2>
        빠르게 기능들을 추가하고 더 멋지게 꾸미고 싶었지만, 회사일에 시간 + 체력이 없네요 ㅠㅠ<br/>
        느리지만 하나씩 개선하겠습니다. <br/>
        다른 것들은 언제 업데이트 할 지 모르지만, 주라인 모드만큼은 최대한 빠르게 도입하려 합니다.<br/>
        또한 사이트 이용에 관해서(버그, 이용법, 피드백등...) 정말 편하게 문의글 남겨주셔도 좋습니다~!<br/><br/>
        개인적으로 힘든 시기에, 유저분들의 "애정섞인 피드백과 응원글"이 큰 힘이 되었던 경험이 있네요!<br/><br/>
        두서 없이 적었습니다ㅎㅎ.. 이용해주셔서 감사하고, 즐거운 내전 시간 보내시길 바랍니다!<br/><br/>
        <br/><br/>
        들숨에는 건강과 재력이, 날숨에는 팀운이 있기를...


      </div>
    );
  }
}

export default PatchModal;
