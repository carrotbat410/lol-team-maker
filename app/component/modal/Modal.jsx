import styles from "./Modal.module.css";

function Modal({ closeModal }) {
  let imageTrue = true;

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
          style={{
            backgroundImage: "url(/images/icon_reading_glasses.png)",
          }}
          type="text"
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
          }}
        />
      </div>
    </div>
  );
}

export default Modal;
