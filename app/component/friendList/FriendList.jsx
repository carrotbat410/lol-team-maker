import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import styles from "./FriendList.module.css";
import Modal from "../modal/Modal";
import { instance } from "../../../lib/axios";

export const handleDragStart = (event) => {
  console.log("드래그 시작");
  const data = event.target.getAttribute("data");
  event.dataTransfer.setData("text/plain", data); // 필수
};

export default function FriendList({
  onDrop,
  user,
  friendList,
  setFriendList,
}) {
  const id = user.id || undefined;

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDropFriend = (event) => {
    // event.target.style.display = "none";
    event.preventDefault();
    const droppedData = event.dataTransfer.getData("text/plain");
    const data = JSON.parse(droppedData);
    if (!data) return; // 드래그해서 전체 끌어 넣을경우 아무 반응 없도록
    if (data.from === "friend") return; // 같은 곳에 드롭하는 경우.
    data.to = "friend";
    console.log("friendList에서 받음 - data:", data);

    onDrop(data);
  };

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
    instance.get("/api/summoner").then((res) => {
      if (res.data.code === 200) {
        setFriendList(res.data.result);
      }
    });
  }, []);

  const onClickDeleteFriendBtn = (no) => {
    const newFriendList = friendList.filter((v) => v.no !== no);
    setFriendList([...newFriendList]);
  };

  const handleDragEnd = (event) => {
    // event.target.style.display = "none";
  };

  return (
    <div>
      <div className={styles.header}>
        {id ? (
          <div>
            {`${id}님 즐거운 내전 되세요 :)`}{" "}
            <input
              className={styles.btn}
              type="button"
              value="로그아웃"
              onClick={() =>
                signOut({
                  callbackUrl:
                    process.env.NODE_ENV === "development"
                      ? "http://localhost:3000/login"
                      : "https://lolteammaker.vercel.app/login",
                })
              }
            />
            <input
              className={styles.btn}
              type="button"
              value="문의 등록"
              onClick={() => alert("개발중")}
            />
          </div>
        ) : (
          <div>로딩중</div>
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.btn_container}>
          <input type="button" value="내전 인원 추가" onClick={openModal} />
          {/* <input type="button" value="검색 공간?" /> */}
        </div>
        <div
          className={styles.friend_list_container}
          onDragOver={handleDragOver}
          onDrop={handleDropFriend}
        >
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
                onDragEnd={handleDragEnd}
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
