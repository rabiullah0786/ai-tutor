"use client";

import { useEffect, useState } from "react";

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if prompt already shown or app installed
    const promptShown = localStorage.getItem("pwa_prompt_shown");
    if (promptShown) return;

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    if (isStandalone) return;

    // Listen for beforeinstallprompt event
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;

    // Mark banner as shown
    localStorage.setItem("pwa_prompt_shown", "true");
    setShowBanner(false);
  };

  const handleDismiss = () => {
    localStorage.setItem("pwa_prompt_shown", "true");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 right-4 left-4 md:left-auto md:right-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg flex flex-col md:flex-row items-center gap-3 z-50">
      <p className="text-sm text-black dark:text-white flex-1">
        Download our app for a better experience!
      </p>
      <div className="flex gap-2">
        <button
          onClick={handleInstall}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Install App
        </button>
        <button
          onClick={handleDismiss}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
