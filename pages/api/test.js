import DB from "./utils/db";

export default function handler(req, res) {
  const { method } = req;
  if (method === "GET") {
    const db = DB();
    db.raw("SHOW STATUS LIKE 'Threads_connected'")
      .then((result) => {
        const threadsConnected = result[0][0].Value;
        console.log(`현재 연결 수: ${threadsConnected}`);
      })
      .catch((error) => {
        console.error("Error fetching Threads_connected:", error);
      });

    return res.send("test api - GET");
  }

  if (method === "POST") {
    return res.send("test api - POST");
  }

  return res.send("Not Allowed Method");
}
