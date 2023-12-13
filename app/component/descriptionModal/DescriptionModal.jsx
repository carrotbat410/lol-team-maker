import { useState } from "react";
import Image from "next/image";
import styles from "./DescriptionModal.module.css";
import desc1 from "../../../public/images/desc1.png";
import desc2 from "../../../public/images/desc2.png";
import desc3 from "../../../public/images/desc3.png";

function DescriptionModal({ closeDescModal }) {
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
        <button onClick={onClickLeftBtn}>◁</button> <span>{pageNo}</span> / 3{" "}
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
    width = 400;
    height = 350;
  } else if (pageNo === 2) {
    image = desc2;
    width = 580;
    height = 300;
  } else if (pageNo === 3) {
    image = desc3;
    width = 400;
    height = 350;
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
  let description;
  if (pageNo === 1) {
    description = "pageNo 1 설명 ~$!@#%ㅎ~~~";
  } else if (pageNo === 2) {
  } else if (pageNo === 3) {
  }

  return <div className={styles.description_div}>설명~~~~~~~~~~~</div>;
}
