"use client";

import "./globals.css";
import { SessionProvider } from "next-auth/react";

// export const metadata = {
//   title: "진짜사나이들을 위한 롤 팀짜기",
//   description: "롤 내전할떄, 팀짜는것에 도움주기 위한 사이트",
// };

export default function RootLayout({ children }) {
  const globalCss = {
    background: "#061018",

    width: "100%",
    height: "100%",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <SessionProvider>
      <html lang="ko" style={globalCss}>
        <body>{children}</body>
      </html>
    </SessionProvider>
  );
}
