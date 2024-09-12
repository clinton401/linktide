
import {FuzzyOverlay} from "@/components/framer-motion/fuzzy-overlay"
export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="relative overflow-hidden    min-h-dvh px-p-half py-8 flex items-center justify-center " id="auth">
        
        {children}
         
        <FuzzyOverlay/>
      </main>
    );
  }
  