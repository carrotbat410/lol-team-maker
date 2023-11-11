import { useState } from "react";
import styles from "./Main.module.css";

export function Main() {
  const [resultMode, setResultMode] = useState(false);

  return (
    <div className={styles.wrapper}>
      <div className={styles.setting_container}>setting_container</div>
      <div className={styles.content_container}>content_container</div>
      <div className={styles.result_container}>
        {resultMode ? (
          <div>
            <input type="button" value="결과 복사하기" />
            <input
              type="button"
              value="다시 짜기"
              onClick={() => {
                setResultMode(!resultMode);
              }}
            />
          </div>
        ) : (
          <div>
            <div>팀 미정 인원 목록 박스</div>
            <input
              type="button"
              className={styles.make_result_btn}
              value="팀 짜기"
              onClick={() => {
                setResultMode(!resultMode);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
