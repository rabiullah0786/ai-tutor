import { MongoClient } from "mongodb";

export async function POST(req) {
  try {
    const { userId, role, content } = await req.json();

    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db("aitutor");

    await db.collection("messages").insertOne({
      userId,
      role,
      content,
      createdAt: new Date()
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
