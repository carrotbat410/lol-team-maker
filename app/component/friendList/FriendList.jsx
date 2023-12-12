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

  const onClickDeleteFriendBtn = (no) => {
    const newFriendList = friendList.filter((v) => v.no !== no);
    setFriendList([...newFriendList]);

    instance.delete("/summoner", {
      data: { no },
    });
  };

  const handleDragEnd = (event) => {
    // event.target.style.display = "none";
  };

  return (
    <div>
      <div className={styles.header}>
        {id ? (
          <div className={styles.header_wrapper}>
            <div className={styles.header_hello_div}>
              <div>{`${id}님`}</div>
              <div>즐거운 내전 되세요 :)</div>
            </div>
            <div className={styles.btn_wrapper}>
              <input
                className={styles.btn}
                type="button"
                value="로그아웃"
                onClick={() =>
                  signOut({
                    callbackUrl:
                      process.env.NODE_ENV === "development"
                        ? "http://localhost:3000/login"
                        : "https://lolcivilwarhelper.vercel.app/login",
                  })
                }
              />
            </div>
          </div>
        ) : (
          <div>로딩중</div>
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.btn_container}>
          <div>
            <input
              type="button"
              value="내전 인원 추가"
              onClick={openModal}
              className={styles.btn}
            />
          </div>
          <div>
            <input
              className={styles.btn}
              type="button"
              value="사용법 보기"
              onClick={() => alert("개발중인 기능입니다.")}
            />
          </div>
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
            console.log(tmpTier, tmpRank);
            let tier;
            if (tmpTier) {
              if (["MASTER", "GRANDMASTER", "CHALLENGER"].includes(tmpTier)) {
                tier = tmpTier;
              } else {
                tier = `${tmpTier} ${tmpRank}`;
              }
            } else {
              tier = "UNRANKED";
            }
            // const tier = tmpTier ? `${tmpTier} ${tmpRank}` : "UNRANKED";

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
                  draggable="false"
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.footer}>
        <div>
          <input
            className={styles.btn}
            type="button"
            value="문의 등록"
            onClick={() => {
              window.open("https://open.kakao.com/o/suvzT5Wf");
            }}
          />
        </div>
        <div>
          <input
            className={styles.btn}
            type="button"
            value="회원 탈퇴"
            onClick={async () => {
              if (id === "test1") {
                return alert("test계정은 탈퇴가 불가능합니다.");
              }

              if (
                confirm(
                  "정말로 회원 탈퇴하시겠습니까? \n회원 정보는 전부 즉시 파기됩니다.",
                )
              ) {
                const result = await instance.delete("/user");
                console.log("result.data info:", result.data);
                const { code } = result.data;
                if (code === 200) {
                  alert("이용해주셔서 감사합니다.");
                  await signOut({
                    callbackUrl:
                      process.env.NODE_ENV === "development"
                        ? "http://localhost:3000/login"
                        : "https://lolcivilwarhelper.vercel.app/login",
                  });
                  return;
                }
                if (code === 401) {
                  return alert(
                    "세션이 만료되었습니다. 로그인후 다시 시도해주세요.",
                  );
                }
                return alert(
                  "서버에 문제가 발생하였습니다. 관리자에게 문의해주세요.",
                );
              }
              alert("회원 탈퇴를 취소하였습니다.");
            }}
          />
        </div>
        <div>
          <input
            type="button"
            className={styles.btn}
            value="패치 노트"
            onClick={() => {
              alert("개발중인 기능입니다.");
            }}
          />
        </div>
      </div>
      {isModalOpen && <Modal onAddFriend={addFriend} closeModal={closeModal} />}
    </div>
  );
}
