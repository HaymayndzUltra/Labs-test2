export const metadata = {
  title: 'Commerce Analytics',
  description: 'E-commerce analytics dashboard'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

