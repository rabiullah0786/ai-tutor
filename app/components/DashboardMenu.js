// "use client";

// import { useState } from "react";
// import { Menu, Settings } from "lucide-react";
// import Link from "next/link";

// export default function DashboardMenu() {
//   const [open, setOpen] = useState(false);

//   return (
//     <div className="relative inline-block text-left">

//       {/* Hamburger Button */}
//       <button
//         onClick={() => setOpen(!open)}
//         className="p-2 rounded-full hover:bg-gray-200 transition"
//       >
//         <Menu size={24} />
//       </button>

//       {/* Dropdown */}
//       {open && (
//         <div className="absolute right-0 mt-2 w-48 bg-white border shadow-xl rounded-xl p-2 z-50">
//           <ul className="space-y-1">

//             {/* MCQ */}
//             <li className="p-2 hover:bg-gray-100 rounded-md cursor-pointer w-full">
//               MCQ Questions
//             </li>

//             {/* Upgrade (same size as others) */}
//             <li className="p-2 hover:bg-gray-100 rounded-md cursor-pointer w-full">
//               <Link href="/upgrade" className="block w-full text-left">
//                 Upgrade
//               </Link>
//             </li>

//             {/* User Account */}
//             <li className="p-2 hover:bg-gray-100 rounded-md cursor-pointer w-full">
//               User Account
//             </li>

//             {/* Education */}
//             <li className="p-2 hover:bg-gray-100 rounded-md cursor-pointer w-full">
//               Education
//             </li>


//             {/* Settings replaced with icon */}
//             <li className="p-2 hover:bg-gray-100 rounded-md cursor-pointer flex items-center gap-2 w-full">
//               <Settings size={18} /> Settings
//             </li>

//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }




"use client";

import { useState, useRef, useEffect } from "react";
import {
  Menu,
  Settings,
  User,
  BookOpen,
  BadgeCheck,
  LogOut,
  Sun,
  Moon
} from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function DashboardMenu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [comfort, setComfort] = useState(false);
  const menuRef = useRef(null);

  // CLOSE WHEN CLICK OUTSIDE + ESCAPE
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function handleEscape(e) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* Menu Button */}
      <button
        onClick={() => setOpen(!open)}
        className={`p-2 rounded-full transition backdrop-blur-lg 
        ${comfort ? "bg-white/20 hover:bg-white/30" : "hover:bg-gray-200"}`}
      >
        <Menu size={24} />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className={`
            absolute right-0 mt-3 w-65 rounded-2xl border p-3 z-50
            transition-all origin-top-right
            animate-[fade_0.15s_ease-out,scale_0.15s_ease-out]
            ${comfort
              ? "bg-white/40 backdrop-blur-xl border-white/30 shadow-2xl"
              : "bg-white border-gray-200 shadow-xl"}
          `}
        >
          <ul className="space-y-1">

            {/* 👇 User Profile (Only When Logged In) */}
            {session && (
              <li className="p-3 rounded-xl flex items-center gap-3 hover:bg-black/5">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  {session.user?.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{session.user?.name}</p>
                  <p className="text-xs text-gray-500">{session.user?.email}</p>
                </div>
              </li>
            )}

            <li className="p-3 rounded-xl cursor-pointer flex items-center gap-2 hover:bg-black/5">
              <BadgeCheck size={18} />
              MCQ Questions
            </li>

            <li className="p-3 rounded-xl hover:bg-black/5 cursor-pointer">
              <Link href="/upgrade" className="flex items-center gap-2">
                <BadgeCheck size={18} />
                Upgrade
              </Link>
            </li>

        

            <li className="p-3 rounded-xl flex items-center gap-2 hover:bg-black/5 cursor-pointer">
              <Settings size={18} />
              Settings
            </li>

            <li className="p-3 rounded-xl flex items-center gap-2 hover:bg-black/5 cursor-pointer">
              <BookOpen size={18} />
              Education
            </li>

            {/* ⭐ LOGOUT OPTION - Only if Logged In */}
            {session && (
              <li
                onClick={() => { signOut(); setOpen(false); }}
                className="p-3 rounded-xl flex items-center gap-2 hover:bg-red-100 text-red-600 cursor-pointer transition mt-2 border-t pt-3"
              >
                <LogOut size={18} />
                Logout
              </li>
            )}

            {/* Comfort Mode Toggle */}
            <li
              onClick={() => setComfort(!comfort)}
              className="p-3 rounded-xl cursor-pointer flex items-center gap-2 hover:bg-black/5 transition"
            >
              {comfort ? <Sun size={18} /> : <Moon size={18} />}
              {comfort ? "Comfort Mode: On" : "Comfort Mode: Off"}
            </li>

          </ul>
        </div>
      )}
    </div>
  );
}
