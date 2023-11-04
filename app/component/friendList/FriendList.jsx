import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./FriendList.module.css";

export default function FriendList(props) {
  const { user } = props;
  const id = user.id || undefined;

  const [friendList, setFriendList] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/summoner").then((res) => {
      if (res.data.code === 200) {
        setFriendList(res.data.result);
      }
    });
  }, []);

  return (
    <div>
      <div className={styles.header}>
        {id ? <div>{`${id}님 즐거운 내전 되세요 :)`}</div> : <div>로딩중</div>}
      </div>
      <div className={styles.content}>
        <div className={styles.btn_container}>
          <input type="button" value="내전 인원 추가" />
          <input type="button" value="검색 공간?" />
        </div>
        <div className={styles.friend_list_container}>
          {friendList.map((v) => {
            const tmpTier = v.tier;
            const tmpRank = v.rank;

            const tier = tmpTier ? `${tmpTier} ${tmpRank}` : "UNRANKED";

            return (
              <div className={styles.friend_box} key={v.no}>
                <div className={styles.friend_box_profile}>
                  <img
                    src={v.icon_img_url}
                    alt="profile_img"
                    className={styles.profile_img}
                  />
                </div>
                <div className={styles.friend_box_content}>
                  <div>{v.nickname}</div>
                  <div>{tier}</div>
                </div>
                <div className={styles.friend_box_delete}>
                  <div>X</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* <div className={styles.footer}>i'm footer</div> */}
    </div>
  );
}
