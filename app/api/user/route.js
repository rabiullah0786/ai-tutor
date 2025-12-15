// import connectDB from "@/lib/mongodb";
// import User from "@/models/User";

// export async function POST(req) {
//   try {
//     await connectDB(); // 👈 Bas ye call karo

//     const { name, email } = await req.json();

//     const newUser = await User.create({
//       name,
//       email,
//       createdAt: new Date(),
//     });

//     return new Response(
//       JSON.stringify({ success: true, user: newUser }),
//       { status: 200 }
//     );

//   } catch (error) {
//     console.error("API USER ERROR:", error);
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//     });
//   }
// }



import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { message: "User API working" },
    { status: 200 }
  );
}

export async function POST(req) {
  try {
    await connectDB();

    const { name, email } = await req.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email required" },
        { status: 400 }
      );
    }

    const newUser = await User.create({
      name,
      email,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { success: true, user: newUser },
      { status: 201 }
    );

  } catch (error) {
    console.error("API USER ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
