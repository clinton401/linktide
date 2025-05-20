import { ParentLayout } from "@/components/protected/parent-layout";
import { ThemeProvider } from "@/components/theme-provider";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
<ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        <ParentLayout>
          
          {children}
        </ParentLayout>
        </ThemeProvider>
      
  );
}
