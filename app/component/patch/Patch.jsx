import styles from "./Patch.module.css";

function PatchModal({ closePatchModal }) {
  return (
    <div className={styles.modal}>
      <div onClick={closePatchModal}>닫기</div>
    </div>
  );
}

export default PatchModal;
