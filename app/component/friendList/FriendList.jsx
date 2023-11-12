import axios from "axios";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import styles from "./FriendList.module.css";
import Modal from "../modal/Modal";

export default function FriendList(props) {
  const { user } = props;
  const id = user.id || undefined;

  const [friendList, setFriendList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    if (friendList.length >= 30) {
      return alert("친구 추가는 최대 30명까지 가능합니다.");
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const addFriend = (newFriend) => {
    setFriendList([...friendList, newFriend]);
  };

  useEffect(() => {
    axios.get("http://localhost:3000/api/summoner").then((res) => {
      if (res.data.code === 200) {
        setFriendList(res.data.result);
      }
    });
  }, []);

  const onClickDeleteFriendBtn = (no) => {
    const newFriendList = friendList.filter((v) => v.no !== no);
    setFriendList([...newFriendList]);
  };

  const handleDragStart = (event) => {
    const data = event.target.getAttribute("data");
    event.dataTransfer.setData("text/plain", data); // 필수
  };

  return (
    <div>
      <div className={styles.header}>
        {id ? (
          <div>
            {`${id}님 즐거운 내전 되세요 :)`}{" "}
            <input
              type="button"
              value="logout"
              onClick={() =>
                signOut({
                  callbackUrl: "http://localhost:3000/login",
                })
              }
            />
          </div>
        ) : (
          <div>로딩중</div>
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.btn_container}>
          <input type="button" value="내전 인원 추가" onClick={openModal} />
          <input type="button" value="검색 공간?" />
        </div>
        <div className={styles.friend_list_container}>
          {friendList.map((v) => {
            const tmpTier = v.tier;
            const tmpRank = v.rank;

            const tier = tmpTier ? `${tmpTier} ${tmpRank}` : "UNRANKED";

            return (
              <div
                className={styles.friend_box}
                key={v.no}
                data={JSON.stringify(v)}
                draggable="true"
                onDragStart={handleDragStart}
              >
                <div className={styles.friend_box_profile}>
                  <img
                    draggable="false"
                    src={v.icon_img_url}
                    alt="profile_img"
                    className={styles.profile_img}
                  />
                </div>
                <div className={styles.friend_box_content} draggable="false">
                  <div>{v.nickname}</div>
                  <div>{tier}</div>
                </div>
                <input
                  type="button"
                  value="x"
                  className={styles.friend_box_delete_btn}
                  onClick={() => onClickDeleteFriendBtn(v.no)}
                  // TODO db에 delete 요청하는 코드 짜기
                  draggable="false"
                />
              </div>
            );
          })}
        </div>
      </div>
      {/* <div className={styles.footer}>i'm footer</div> */}
      {isModalOpen && <Modal onAddFriend={addFriend} closeModal={closeModal} />}
    </div>
  );
}
