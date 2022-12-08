import clientPromise from "./mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  
  const db = client.db("openai-images");
  switch (req.method) {
    case "POST":
      let newPost = await db.collection("openai-images").insertOne(req.body);
      res.json(newPost);
      break;
    case "GET":
      const posts = await db.collection("openai-images").find({}).toArray();
      res.json({ status: 200, data: posts });
      break;
  }
}
