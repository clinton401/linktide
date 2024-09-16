import type { Metadata } from "next";
import "./globals.css";
import {ThemeProvider} from "@/components/theme-provider"
import { SessionProvider } from "next-auth/react";
import { Oswald } from "next/font/google";

import {auth} from "@/auth";
const oswald = Oswald({ subsets: ["latin"], weight: ["300" , "400" , "500" , "600" , "700" ] });



export const metadata: Metadata = {
  title: {
    default: 'Linktide', 
    template: '%s | Linktide', 
  },
  description: '"Linktide is a powerful social media manager that lets you easily post, track analytics, and manage multiple social media accounts from one platform."',
  
  // TODO: add graphql and twitter metadata 
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
      <body
        className={`${oswald.className}  antialiased`}
        id="body"
      >
          {/* <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          > */}
            {children}
          {/* </ThemeProvider> */}
       
       
    
      </body>
    </html>
    </SessionProvider>
  );
}
