"use client";

import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Gothic_A1, IBM_Plex_Sans_KR, Noto_Sans_KR } from "next/font/google";
import Script from 'next/script';

// const nextFont = Gothic_A1({
//   subsets: ["latin"],
//   weight: ["300"],
// });
// const nextFont = IBM_Plex_Sans_KR({
//   subsets: ["latin"],
//   weight: ["400"],
// });
const nextFont = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400"],
});

// export const metadata = {
//   title: "진짜사나이들을 위한 롤 팀짜기",
//   description: "롤 내전할떄, 팀짜는것에 도움주기 위한 사이트",
// };

const currentDomain =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:3000"
    : "https://lolcivilwarhelper.vercel.app";

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
          <title>
            롤 내전 도우미 - 라이엇 데이터 연동을 통해 편리한 내전 팀 짜기
            서비스를 제공
          </title>
          <meta charSet="utf-8" />
          <link rel="icon" href="./favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#000000" />
          <meta
            name="description"
            content="롤 내전 도우미는 밸런스있게 팀짜기 서비스를 제공하는 사이트 입니다."
          />
          <meta
            name="google-site-verification"
            content="zpqMeJo6gDqt-wfxgyYwTaxTkbfN8nFIM2oJt3XmHG4"
          />
          <meta
            name="naver-site-verification"
            content="dd4149668ace286f33596182023d3a71914aebf3"
          />
          <meta property="og:type" content="website" />
          <meta
            name="title"
            content="롤 내전 도우미 - 내전할 떄 유용하게 사용할 수 있는 밸런스있게 팀 짜기 서비스를 제공합니다."
          />
          <meta property="og:title" content="롤 내전 도우미" />
          <meta
            property="og:description"
            content="내전할 떄 유용한, 밸런스있게 팀 짜기 서비스를 이용해보세요!"
          />
          <meta
            property="og:image"
            content={`${currentDomain}/images/timo.jpeg`}
          />
          <meta
            property="og:url"
            content="https://lolcivilwarhelper.vercel.app"
          />
          <link
            rel="apple-touch-icon"
            href="https://lolcivilwarhelper.vercel.app/favicon.ico"
          />
          <link
            rel="canonical"
            href="https://lolcivilwarhelper.vercel.app"
            key="canonical"
          />
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4896335676316065"
            crossOrigin="anonymous"
          />
          <Script
            id="kakao-ad-script"
            strategy="lazyOnload"
            src="//t1.daumcdn.net/kas/static/ba.min.js"
          />
        </head>
        <body>
          {children}
          <div style={{ display: "none" }}>
            <h1>롤 내전 도우미</h1>
            <h2>롤 내전 팀짜기</h2>
            <h3>롤 내전 팀 메이커</h3>
            <h4>롤 내전 팀 밸런스</h4>
          </div>
          <ins className="kakao_ad_area" data-ad-unit="DAN-ORivCADP9Eqlyos9" data-ad-width="728" data-ad-height="90"/>
        </body>
      </html>
    </SessionProvider>
  );
}
