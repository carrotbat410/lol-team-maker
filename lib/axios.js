import axios from "axios";

export const instance = axios.create({
  baseURL:
    process.env.MODE === "prod"
      ? "https://lolteammaker.vercel.app"
      : "http://localhost:3000",
});
