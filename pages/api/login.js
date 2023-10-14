import {sendJson} from "@/pages/utils/sendJson";
import DB from "@/pages/utils/db";

export default async function handler(req, res) {
  const method = req.method

  if(method === "POST") {
    const {id, password} = req.body

    const db = DB()

    // await db('users').insert({
    //   id: 'test1',
    //   name: 'test1',
    //   password: 'asd123'
    // })

    const user = await db('users')

    return res.json({
      code: 200,
      message: 'ok'
    })
    return sendJson(200, 'ok', user)
    // return sendJson(200, 'ok', user)
  }
  return res.send("Not Allowed Method")
}