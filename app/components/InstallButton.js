"use client";

import { useEffect, useState } from "react";

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true);
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () =>
      window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (installed || !deferredPrompt) return null;

  return (
    <button
      className="px-4 py-2 bg-blue-600 text-white rounded"
      onClick={async () => {
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        setDeferredPrompt(null);
      }}
    >
      Install App
    </button>
  );
}
