export default function handler(req, res) {
  const method = req.method
  if(method === "GET") {
    return res.send("test api - GET")
  }

  if(method === "POST") {
    return res.send("test api - POST")
  }

  return res.send("Not Allowed Method")
}