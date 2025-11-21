import { MongoClient } from "mongodb";

export async function POST(req) {
  try {
    const { name, email } = await req.json();

    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db("aitutor");

    const existing = await db.collection("users").findOne({ email });

    if (!existing) {
      await db.collection("users").insertOne({
        name,
        email,
        createdAt: new Date()
      });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
