"use client";
import { FC } from "react";
import { motion } from "framer-motion";
import { usePathname } from 'next/navigation';

export const FuzzyOverlay: FC = () => {
  const pathname = usePathname();

  if (pathname !== "/" && !pathname.startsWith("/auth")) return null;

  return (
    <motion.div
      initial={{ transform: "translateX(-10%) translateY(-10%)" }}
      animate={{
        transform: "translateX(10%) translateY(10%)",
      }}
      transition={{
        repeat: Infinity,
        duration: 0.2,
        ease: "linear",
        repeatType: "mirror",
      }}
      style={{
        backgroundImage: 'url("/assets/black-noise.png")',
      }}
      className="pointer-events-none absolute -inset-[100%] z-[-10] opacity-[15%]"
    />
  );
};
