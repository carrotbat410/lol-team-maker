import CryptoJS from "crypto-js";
import DB from "../utils/db";

export default async function handler(req, res) {
  const { method } = req;

  if (method === "POST") {
    const { id, password, confirmPassword } = req.body;

    if (!id || !password || !confirmPassword || password !== confirmPassword)
      return res.json({
        code: 400,
        message: "bad request",
      });

    const hashedPassword = CryptoJS.algo.HMAC.create(
      CryptoJS.algo.SHA256,
      process.env.HASH_KEY,
    )
      .update(password)
      .finalize()
      .toString(CryptoJS.enc.Hex);

    const db = DB();

    const user = await db("users")
      .where("id", id)
      .where("password", hashedPassword)
      .first();

    if (user) return res.json({ code: 409, message: "id already in use" });

    const inData = {
      id,
      password: hashedPassword,
    };

    await db("users").insert(inData);

    return res.json({
      code: 202,
      message: "ok",
    });
  }

  return res.send("Not Allowed Method");
}
