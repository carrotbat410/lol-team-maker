import dayjs from "dayjs";
// import utc from "dayjs/plugin/utc.js";
// import timezone from "dayjs/plugin/timezone.js"; // use plugin
import { SendTelegramMessage } from "./webhook";

// dayjs.extend(timezone); // use plugin
// dayjs.extend(utc);

export function IsUpdateNeeded(renewaledAt) {
  const nowDateObject = dayjs().tz("Asia/Seoul");
  console.log("nowDateObject", nowDateObject);
  console.log("renewaledAt", renewaledAt);
  const diff = nowDateObject.diff(renewaledAt, "hours");
  console.log("diff:", diff);

  if (diff >= 25) {
    SendTelegramMessage(200, diff);
  }

  if (diff > 0 || diff == "NaN") return true; // 하루 지나서 갱신해야함

  return false; // 갱신할 필요 없음
}
