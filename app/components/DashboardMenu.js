"use client";

import { useState, useRef, useEffect } from "react";
import {
  Menu,
  Settings,
  BookOpen,
  BadgeCheck,
  LogOut,
  Sun,
  Moon
} from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function UserProfile() {
  const { data: session } = useSession();

  const [image, setImage] = useState(session?.user?.image || null);

  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const [openSheet, setOpenSheet] = useState(false);

  const [open, setOpen] = useState(false);
  const [comfort, setComfort] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();


  // Handle image change
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(URL.createObjectURL(file)); // Preview
  };

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

  if (!session) return null; // Prevent undefined session error

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

            {/* User Profile */}
            <li className="p-3 rounded-xl flex items-center gap-3 hover:bg-black/5">

              {/* Profile Icon */}
              <div
                className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold cursor-pointer overflow-hidden"
                onClick={() => setOpenSheet(true)}
              >
                {image ? (
                  <img src={image} className="w-full h-full object-cover" />
                ) : (
                  session.user?.name?.charAt(0)
                )}
              </div>

              <div>
                <p className="font-medium">{session.user?.name}</p>
                <p className="text-xs text-gray-500">{session.user?.email}</p>
              </div>
            </li>

            {/* Hidden Inputs */}
            <input
              type="file"
              accept="image/*"
              ref={galleryInputRef}
              className="hidden"
              onChange={handleImage}
            />
            <input
              type="file"
              accept="image/*"
              capture="environment"
              ref={cameraInputRef}
              className="hidden"
              onChange={handleImage}
            />

            {/* Bottom Sheet */}
            {openSheet && (
              <div
                className="fixed inset-0 bg-black/40 flex items-end z-50"
                onClick={() => setOpenSheet(false)}
              >
                <div
                  className="bg-white w-full p-5 rounded-t-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h2 className="text-center font-semibold text-lg mb-4">
                    Select Option
                  </h2>

                  {/* Camera */}
                  <button
                    onClick={() => {
                      setOpenSheet(false);
                      cameraInputRef.current.click();
                    }}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-100"
                  >
                    📸 Take photo
                  </button>

                  {/* Gallery */}
                  <button
                    onClick={() => {
                      setOpenSheet(false);
                      galleryInputRef.current.click();
                    }}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-100"
                  >
                    🖼️ Select From Gallery
                  </button>

                  {/* Remove */}
                  {image && (
                    <button
                      onClick={() => {
                        setImage(null);
                        setOpenSheet(false);
                      }}
                      className="w-full text-left p-3 rounded-lg hover:bg-gray-100 text-red-600"
                    >
                      ❌ Remove photo
                    </button>
                  )}
                </div>
              </div>
            )}

          

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

            <li 
              className="p-3 rounded-xl flex items-center gap-2 hover:bg-black/5 cursor-pointer">
              <Link href="/exam" className="flex items-center gap-2">
              <BookOpen size={18} />
              ExamMode
              </Link>
            </li>


            {session && (
              <li
                onClick={() => { signOut(); setOpen(false); }}
                className="p-3 rounded-xl flex items-center gap-2 hover:bg-red-100 text-red-600 cursor-pointer transition mt-2 border-t pt-3"
              >
                <LogOut size={18} />
                Logout
              </li>
            )}

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