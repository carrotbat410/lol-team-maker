import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(timezone); // use plugin
dayjs.extend(utc); // use plugin

export function IsUpdateNeeded(renewaledAt) {
  const nowDateObject = dayjs();
  console.log("nowDateObject", nowDateObject);
  console.log("renewaledAt", renewaledAt);
  const diff = nowDateObject.diff(renewaledAt, "hours");
  console.log("diff:", diff);

  if (diff >= 24 || diff == "NaN") return true; // 하루 지나서 갱신해야함

  return false; // 갱신할 필요 없음
}
