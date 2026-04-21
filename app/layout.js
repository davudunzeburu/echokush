export const metadata = {
  title: 'EchoKush',
  description: 'Eserini Evrenle Buluştur',
}

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  )
}
