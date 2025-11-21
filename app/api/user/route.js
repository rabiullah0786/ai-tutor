import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB(); // 👈 Bas ye call karo

    const { name, email } = await req.json();

    const newUser = await User.create({
      name,
      email,
      createdAt: new Date(),
    });

    return new Response(
      JSON.stringify({ success: true, user: newUser }),
      { status: 200 }
    );

  } catch (error) {
    console.error("API USER ERROR:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
