import { MongoClient } from "mongodb";

export async function GET() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db("aitutor");

    const count = await db.collection("users").countDocuments();

    return new Response(JSON.stringify({ totalUsers: count }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
