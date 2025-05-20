import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Oswald } from "next/font/google";
import { Toaster } from "@/components/ui/toaster"
import {auth} from "@/auth";
// import { Analytics } from "@vercel/analytics/next";
const oswald = Oswald({ subsets: ["latin"], weight: ["300" , "400" , "500" , "600" , "700" ] });



export const metadata: Metadata = {
  title: {
    default: 'Linktide',
    template: '%s | Linktide',
  },
  description: 'Linktide is a powerful social media manager that lets you easily post, track analytics, and manage multiple social media accounts from one platform.',
  
  openGraph: {
    title: 'Linktide',
    description: 'Linktide is a powerful social media manager that lets you easily post, track analytics, and manage multiple social media accounts from one platform.',
    url: 'https://linktide.org',  // Update with your website URL
    images: [
      {
        url: '/assets/website-thumbnail.png',  // Update with your image URL
        width: 1200,
        height: 627,
        alt: 'Linktide Social Media Manager',
      },
    ],
    type: 'website', 
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'Linktide',
    description: 'Linktide helps you manage all your social media accounts from one powerful platform.',
    images: [
      {
        url: '/assets/website-thumbnail.png', 
        alt: 'Linktide Social Media Manager',
      },
    ],
  },
  
  
  // TODO: Add GraphQL metadata or other integrations as needed
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="en" suppressHydrationWarning>
        <body className={`${oswald.className}  antialiased`} id="body">
          {children}
          <Toaster />

          {/* <Analytics /> */}
        </body>
      </html>
    </SessionProvider>
  );
}
