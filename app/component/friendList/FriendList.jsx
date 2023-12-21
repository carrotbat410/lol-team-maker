import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import dayjs from "dayjs";
import styles from "./FriendList.module.css";
import Modal from "../modal/Modal";
import { instance } from "../../../lib/axios";
import DescriptionModal from "../descriptionModal/DescriptionModal";
import PatchModal from "../patch/Patch";
import updateIcon from "../../../public/images/update_icon.png";

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
  friendListForReset,
  setFriendListForReset,
}) {
  const id = user.id || undefined;

  const IsUpdateNeeded = (renewaledAt) => {
    const nowDateObject = dayjs();
    const diff = nowDateObject.diff(renewaledAt, "hours");

    if (diff >= 24 || diff == "NaN") return true; // 하루 지나서 갱신해야함

    return false; // 갱신할 필요 없음
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDropFriend = (event) => {
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
  const [isDescModalOpen, setIsDescModalOpen] = useState(false);
  const [isPatchModalOpen, setIsPatchModalOpen] = useState(false);
  const openModal = () => {
    if (friendList.length >= 30) {
      return alert("친구 추가는 최대 30명까지 가능합니다.");
    }
    if (isDescModalOpen) {
      setIsDescModalOpen(false);
    }
    if (isPatchModalOpen) {
      setIsPatchModalOpen(false);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openDescModal = () => {
    if (isModalOpen) {
      setIsModalOpen(false);
    }
    if (isPatchModalOpen) {
      setIsPatchModalOpen(false);
    }
    setIsDescModalOpen(true);
  };

  const closeDescModal = () => {
    setIsDescModalOpen(false);
  };

  const openPatchModal = () => {
    if (isModalOpen) {
      setIsModalOpen(false);
    }
    if (isDescModalOpen) {
      setIsDescModalOpen(false);
    }
    setIsPatchModalOpen(true);
  };

  const closePatchModal = () => {
    setIsPatchModalOpen(false);
  };

  const addFriend = (newFriend) => {
    setFriendList([...friendList, newFriend]);
  };

  const onClickDeleteFriendBtn = (no) => {
    const newFriendList = friendList.filter((v) => v.no !== no);
    setFriendList([...newFriendList]);
    const newFriendListForReset = friendListForReset.filter((v) => v.no !== no);
    setFriendListForReset([...newFriendListForReset]);

    instance.delete("/summoner", {
      data: { no },
    });
  };

  const onClickRenwalFriendBtn = (userName, no, renewaledAt) => {
    if (IsUpdateNeeded(renewaledAt)) {
      const [nickname, tagLine] = userName.split("#");
      instance
        .patch("/summoner", { nickname, tagLine })
        .then((res) => {
          const { code } = res.data;
          if (code === 200) {
            const renewaledFriend = res.data.result;
            renewaledFriend.no = no;
            renewaledFriend.level = renewaledFriend.summonerLevel;
            const newFriendList = friendList.map((friend) => {
              if (friend.no === no) {
                return renewaledFriend;
              }
              return friend;
            });
            console.log("newFriendList:", newFriendList);
            setFriendList(newFriendList);

            const newFriendListForReset = friendListForReset.map((friend) => {
              if (friend.nickname === userName) {
                return renewaledFriend;
              }
              return friend;
            });

            setFriendListForReset(
              JSON.parse(JSON.stringify(newFriendListForReset)),
            );
          } else {
            // TODO 이 부분 처리하기 else if (code === 204) {백엔드에서 renewaled정보 주고, 프론트애서 이걸로 갈아 끼는 코드}
            // else if (code === 404) {프론트에서 갱신 버튼만 없애기(새로고침하면 없어지도록)}
            // else if (code === 400) {알럿?으로 서버에러, 잠시후 다시 시도해달라하기}
          }
        })
        .catch((err) => {
          console.log("갱신 중 에러", err);
        });
      // return alert("갱신 가능");
      return;
    }
    return alert("갱신 불가능");
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
              value="인원 추가"
              onClick={openModal}
              className={styles.btn}
            />
          </div>
          <div>
            <input
              className={styles.btn}
              type="button"
              value="사용법 보기"
              onClick={openDescModal}
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

            const isPossibleRenewal = !!IsUpdateNeeded(
              dayjs(v.renewaled_at).format("YYYY-MM-DD HH:mm:ss"),
            );

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
                  <Image
                    draggable="false"
                    src={v.icon_img_url}
                    alt="profile_img"
                    className={styles.profile_img}
                    width={35}
                    height={35}
                  />
                </div>
                <div className={styles.friend_box_content} draggable="false">
                  {v.nickname.length > 16 ? (
                    <div className={styles.long_nickname}>{v.nickname}</div>
                  ) : (
                    <div>{v.nickname}</div>
                  )}
                  <SelectBox
                    options={OPTIONS}
                    mmr={v.mmr}
                    friendList={friendList}
                    setFriendList={setFriendList}
                    nickname={v.nickname}
                  />
                </div>
                <div
                  className={styles.friend_box_delete_btn}
                  onClick={() => onClickDeleteFriendBtn(v.no)}
                  draggable="false"
                >
                  ✕
                </div>
                {isPossibleRenewal ? (
                  <div
                    className={styles.friend_box_renewal_btn}
                    onClick={() =>
                      onClickRenwalFriendBtn(v.nickname, v.no, v.renewaled_at)
                    }
                    draggable="false"
                  >
                    <Image
                      src={updateIcon}
                      alt="renewal button for user info"
                      width={30}
                      height={30}
                      draggable="false"
                    />
                  </div>
                ) : null}
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
            onClick={openPatchModal}
          />
        </div>
      </div>
      {isModalOpen ? (
        <Modal
          onAddFriend={addFriend}
          closeModal={closeModal}
          friendListForReset={friendListForReset}
          setFriendListForReset={setFriendListForReset}
        />
      ) : null}
      {isDescModalOpen ? (
        <DescriptionModal closeDescModal={closeDescModal} />
      ) : null}
      {isPatchModalOpen ? (
        <PatchModal closePatchModal={closePatchModal} />
      ) : null}
    </div>
  );
}

const OPTIONS = [
  { mmr: "0", tierString: "UNRANKED" },
  { mmr: "1", tierString: "IRON 4" },
  { mmr: "2", tierString: "IRON 3" },
  { mmr: "3", tierString: "IRON 2" },
  { mmr: "4", tierString: "IRON 1" },
  { mmr: "5", tierString: "BRONZE 4" },
  { mmr: "6", tierString: "BRONZE 3" },
  { mmr: "7", tierString: "BRONZE 2" },
  { mmr: "8", tierString: "BRONZE 1" },
  { mmr: "9", tierString: "SILVER 4" },
  { mmr: "10", tierString: "SILVER 3" },
  { mmr: "11", tierString: "SILVER 2" },
  { mmr: "12", tierString: "SILVER 1" },
  { mmr: "13", tierString: "GOLD 4" },
  { mmr: "14", tierString: "GOLD 3" },
  { mmr: "15", tierString: "GOLD 2" },
  { mmr: "16", tierString: "GOLD 1" },
  { mmr: "17", tierString: "PLATINUM 4" },
  { mmr: "18", tierString: "PLATINUM 3" },
  { mmr: "19", tierString: "PLATINUM 2" },
  { mmr: "20", tierString: "PLATINUM 1" },
  { mmr: "21", tierString: "EMERALD 4" },
  { mmr: "22", tierString: "EMERALD 3" },
  { mmr: "23", tierString: "EMERALD 2" },
  { mmr: "24", tierString: "EMERALD 1" },
  { mmr: "25", tierString: "DIAMOND 4" },
  { mmr: "26", tierString: "DIAMOND 3" },
  { mmr: "27", tierString: "DIAMOND 2" },
  { mmr: "28", tierString: "DIAMOND 1" },
  { mmr: "29", tierString: "MASTER" },
  { mmr: "30", tierString: "GRANDMASTER" },
  { mmr: "31", tierString: "CHALLENGER" },
];

function SelectBox({ options, mmr, friendList, setFriendList, nickname }) {
  const [selectedMmr, setSelectedMmr] = useState(mmr);

  useEffect(() => {
    setSelectedMmr(mmr);
  }, [mmr]);

  const onChangeHandler = (event) => {
    const newSelectedMmr = event.target.value;
    setSelectedMmr(newSelectedMmr);

    const selectedTier = options.find(
      (option) => option.mmr === newSelectedMmr,
    )?.tierString;
    const [tier, rank] = selectedTier?.split(" ") || [null, null];

    const newFriendList = friendList.map((v) => {
      if (v.nickname === nickname) {
        v.mmr = parseInt(newSelectedMmr);
        if (!v.rank) v.rank = null;
        if (newSelectedMmr === "0") {
          v.tier = null;
          v.rank = null;
        } else {
          v.tier = tier;
          v.rank = rank;
        }
        return v;
      }
      return v;
    });
    setFriendList(newFriendList);
  };

  return (
    <select
      value={selectedMmr}
      onChange={onChangeHandler}
      className={styles.tier_select_box}
    >
      {options.map((option) => (
        <option key={option.mmr} value={option.mmr}>
          {option.tierString}
        </option>
      ))}
    </select>
  );
}
