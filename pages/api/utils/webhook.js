import axios from "axios";

export function SendTelegramMessage(code, message, userId) {
  const telegramApiKey = process.env.TELEGRAM_API_KEY;
  const telegramChatId = process.env.TELEGRAM_CHAT_ID;
  const lineBreak = encodeURI("\n");

  const title = code >= 400 ? "에러 발생" : "정보 알림";
  const text = `[${title}]${lineBreak}유저 아이디:${userId}${lineBreak}에러코드: ${code}${lineBreak}에러 내용: ${message}`;
  if (code && code !== 404) {
    axios.get(
      `https://api.telegram.org/bot${telegramApiKey}/sendMessage?chat_id=${telegramChatId}&text=${text}`,
    );
  }
}
