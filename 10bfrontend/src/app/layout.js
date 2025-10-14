import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ScreenShotProtect from "./ScreenshotProtect";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CodeTrack - Protected Environment",
  description: "Practice programming exercises for CS010B",
};


export default function RootLayout({ children }) {

  const isStudent = false;
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <ScreenShotProtect> */}
          {children}
        {/* </ScreenShotProtect> */}
      </body>
    </html>
  );
}
