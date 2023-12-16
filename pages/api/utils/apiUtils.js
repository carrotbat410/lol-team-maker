import dayjs from "dayjs";
import { SendTelegramMessage } from "./webhook";

export function IsUpdateNeeded(renewaledAt) {
  const nowDateObject = dayjs();

  const diff = nowDateObject.diff(renewaledAt, "day");

  if (diff > 0 || diff == "NaN") return true; // 하루 지나서 갱신해야함

  return false; // 갱신할 필요 없음
}
