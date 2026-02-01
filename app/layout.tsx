import React from "react"
import type { Metadata } from "next"
import { Geist } from "next/font/google"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Quippi - Anonymous Employee Feedback",
  description:
    "Your voice matters. Share your feedback anonymously and help improve your workplace.",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // #region agent log
  if (typeof window !== 'undefined') {
    console.log('[LAYOUT DEBUG] RootLayout rendering');
    fetch('http://127.0.0.1:7242/ingest/94295a68-58c0-4c7f-a369-b8d6564b2c9c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/layout.tsx:33',message:'RootLayout rendering',data:{pathname:window.location.pathname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I'})}).catch(()=>{});
  }
  // #endregion
  
  return (
    <html lang="en" className={_geist.className}>
      <body className="font-sans antialiased">
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
