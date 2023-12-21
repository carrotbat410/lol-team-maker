import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(timezone); // use plugin
dayjs.extend(utc); // use plugin

export function IsUpdateNeeded(renewaledAt) {
  const nowDateObject = dayjs();
  const diff = nowDateObject.diff(renewaledAt, "hours");

  if (diff >= 24 || diff == "NaN") return true; // 하루 지나서 갱신해야함

  return false; // 갱신할 필요 없음
}

export function GetRandomNumber(maxNumber = 10) {
  return Math.floor(Math.random() * maxNumber) + 1;
}
