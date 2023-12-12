import axios from "axios";

export function SendTelegramMessage(errorCode, errorMessage, userId) {
  const telegramApiKey = process.env.TELEGRAM_API_KEY;
  const telegramChatId = process.env.TELEGRAM_CHAT_ID;
  const lineBreak = encodeURI("\n");
  const text = `[에러발생]${lineBreak}유저 아이디:${userId}${lineBreak}에러코드: ${errorCode}${lineBreak}에러 내용: ${errorMessage}`;
  axios.get(
    `https://api.telegram.org/bot${telegramApiKey}/sendMessage?chat_id=${telegramChatId}&text=${text}`,
  );
}
