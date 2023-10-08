import './globals.css'


export const metadata = {
  title: '진짜사나이들을 위한 롤 팀짜기',
  description: '롤 내전할떄, 팀짜는것에 도움주기 위한 사이트',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
      {children}
      </body>
    </html>
  )
}
