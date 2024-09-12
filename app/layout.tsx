import type { Metadata } from "next";
import localFont from "next/font/local";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import {ThemeProvider} from "@/components/theme-provider"
const openSans = Open_Sans({ subsets: ["latin"], weight: ["300" , "400" , "500" , "600" , "700" , "800"] });
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
  title: {
    default: 'Linktide', 
    template: '%s | Linktide', 
  },
  description: '"Linktide is a powerful social media manager that lets you easily post, track analytics, and manage multiple social media accounts from one platform."',
  
  // TODO: add graphql and twitter metadata 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${openSans.className}  antialiased`}
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
  );
}
