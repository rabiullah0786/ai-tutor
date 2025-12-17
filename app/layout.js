import Provider from "./provider";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL("https://televora.in"),

  title: {
    default: "Televora-AI",
    template: "%s | Televora-AI",
  },

  description:
    "Televora-AI is your smart learning assistant. Practice exams, study notes, AI chatbot, and personalized suggestions to boost your learning speed.",

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    url: "/icon-192.png", sizes: "192x192", type: "image/png",
    apple: "/apple-icon.png",

  },
  manifest: "/manifest.json",


  keywords: [
    "Televora",
    "AI learning",
    "exam preparation",
    "notes",
    "study tools",
    "online exam",
    "smart learning",
  ],

  authors: [{ name: "Televora-AI" }],

  openGraph: {
    title: "Televora-AI",
    description:
      "Study faster with AI-powered tools: notes, practice exams, chatbot, and personalized learning.",
    url: "https://televora.in",
    siteName: "Televora-AI",
    images: [
      {
        url: "https://televora.in/og-image.png",

        width: 192,
        height: 192,
      },
    ],
    locale: "en_US",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "https://televora.in",
  },

};


export default function RootLayout({ children }) {
  return (
    <html lang="en" className="transition-colors duration-300">
      <body
        className={`${inter.className} bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen transition-colors duration-300`}
      >
        <Provider>{children}</Provider>
        {/* Razorpay Checkout */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />


      </body>
    </html>
  );
}




