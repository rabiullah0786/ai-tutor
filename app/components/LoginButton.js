
"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginButton() {
  const { data: session } = useSession();

  const getInitial = (name) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="flex flex-col items-center">

      {/* 👇 If NOT logged in → Show Login Button */}
      {!session ? (
        <button
          onClick={() => signIn("google")}
          className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-100 transition"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span>Login with Google</span>
        </button>
      ) : (
        /* 👇 If logged in → Show User + Logout */
        <div className="flex flex-col items-center space-y-3 w-full p-2">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg">
              {getInitial(session.user?.name)}
            </div>

            <p className="text-gray-800 font-medium">
              Welcome, {session.user?.name}
            </p>
          </div>

          {/* Logout */}
          <button
            onClick={() => signOut()}
            className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
