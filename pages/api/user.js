import DB from "@/pages/utils/db";

export default async function handler(req, res) {
  const method = req.method

  if(method === "POST") {
    const {id, password, confirmPassword } = req.body

    if(!id || !password || !confirmPassword || password !== confirmPassword) {
      return res.json({code: 400, message: "bad request"})
    }

    const db = DB()

    const user = await db('users')

    return res.json({
      code: 202,
      message: 'ok'
    })
  }
  return res.send("Not Allowed Method")
}