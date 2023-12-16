"use client";

import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Gothic_A1, IBM_Plex_Sans_KR } from "next/font/google";

// const nextFont = Gothic_A1({
//   subsets: ["latin"],
//   weight: ["300"],
// });
const nextFont = IBM_Plex_Sans_KR({
  subsets: ["latin"],
  weight: ["400"],
});

// export const metadata = {
//   title: "진짜사나이들을 위한 롤 팀짜기",
//   description: "롤 내전할떄, 팀짜는것에 도움주기 위한 사이트",
// };

export default function RootLayout({ children }) {
  const globalCss = {
    // background: "#151b21",
    backgroundColor: "#0f101c",

    width: "100%",
    height: "100%",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <SessionProvider>
      <html lang="ko" style={globalCss} className={nextFont.className}>
        <head>
          <meta charSet="utf-8" />
          <link rel="icon" href="./favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#000000" />
          <meta
            name="description"
            content="롤 내전 도우미는 내전 팀짜기 서비스를 제공하는 사이트 입니다."
          />
          <meta
            name="google-site-verification"
            content="zpqMeJo6gDqt-wfxgyYwTaxTkbfN8nFIM2oJt3XmHG4"
          />
          {/* <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" /> */}
          {/* <link rel="manifest" href="%PUBLIC_URL%/manifest.json" /> */}
          <title>롤 내전 도우미</title>
        </head>
        <body>{children}</body>
      </html>
    </SessionProvider>
  );
}
