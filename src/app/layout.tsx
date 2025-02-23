import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import '../styles/editor.css'
import ClientRootLayout from '@/components/layouts/ClientRootLayout';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scrollbar-gutter-stable" style={{ scrollBehavior:'auto' }}> 
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientRootLayout>
          {children}
        </ClientRootLayout>
      </body>
    </html>
  );
}
