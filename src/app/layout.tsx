"use client";

import { Source_Code_Pro, Readex_Pro, Inter } from "next/font/google";
import localFont from 'next/font/local'
import hljs from "highlight.js";

const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-source-code-pro",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const readexPro = Readex_Pro({
  subsets: ["latin"],
  variable: "--font-readex-pro",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const consola = localFont({
  src: [
    {
      path: "./fonts/consola.ttf",
      weight: "400",
      style: "normal",
    }
  ],
  variable: "--font-consola",
})

import layout from "./layout.module.scss";
import "./globals.scss";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (

    <html lang="ja">

      <body className={readexPro.variable + " " + sourceCodePro.variable + " " + inter.className + " " + inter.variable + " " + consola.variable}>

        <nav>

          <h2>W Course</h2>

        </nav>

        <div className={layout.main}>

          {children}

        </div>

      </body>

    </html>

  );

}
