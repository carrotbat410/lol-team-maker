import DB from "../utils/db";
import { renewalSummoner } from "../utils/riot";

export default async function handler(req, res) {
  const { method } = req;

  if (method === "GET") {
    const { nickname } = req.query;

    if (!nickname) {
      return res.json({
        code: 400,
        message: "Bad Request",
      });
    }

    const summoner = await renewalSummoner(nickname);

    if (!summoner) {
      return res.json({
        code: 404,
        message: "Not Found a Summoner",
      });
    }

    const db = DB();

    // await db("updated_summoners").onConflict().merge();

    return res.json({
      code: 200,
      message: "ok",
      result: summoner,
    });
  }

  if (method === "POST") {
    return res.json({
      code: 200,
      message: "ok",
    });
  }

  return res.send("Not Allowed Method");
}
