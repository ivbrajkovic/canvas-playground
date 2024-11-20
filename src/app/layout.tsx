import type { Metadata } from 'next';
import localFont from 'next/font/local';

import './globals.css';

import { AppShell } from '@/components/app-shell';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Canvas Playground',
  description: '2024 @ Ivan Brajković - Canvas Playground',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        // className={`${geistSans.variable} ${geistMono.variable} dark flex min-h-screen flex-col antialiased`}
        className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
