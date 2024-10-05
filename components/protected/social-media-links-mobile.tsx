"use client";
import { FC, useState, useEffect } from "react";
import { Twirl as Hamburger } from "hamburger-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { LiaFacebookSquare } from "react-icons/lia";
import { CiInstagram } from "react-icons/ci";
import { RiTwitterXLine } from "react-icons/ri";
import { SlSocialLinkedin } from "react-icons/sl";
import { PiTiktokLogo } from "react-icons/pi";
import { usePathname } from "next/navigation";
const navMenuAnimation = {
  hidden: {
    x: "100vw",
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      // delay: 0.5,
      staggerChildren: 0.3,
      mass: 0.4,
      damping: 8,
      when: "beforeChildren",
      ease: "easeInOut",
    },
  },
  exit: {
    opacity: 0,
    x: "-100vw",
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};
const navLinks = {
  hidden: {
    y: -30,
    opacity: 0,
    scale: 0.7,
  },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};
export const SocialMediaLinksMobile: FC = () => {
  const [isOpen, setOpen] = useState(false);
  const pathname = usePathname();
  const socialMediaPlatforms = [
    {
      name: "LinkedIn",
      url: "/analytics/linkedin",
      icon: <SlSocialLinkedin className="mr-2" />,
    },
    {
      name: "Twitter",
      url: "/analytics/twitter",
      icon: <RiTwitterXLine className="mr-2" />,
    },
    {
      name: "TikTok",
      url: "/analytics/tiktok",
      icon: <PiTiktokLogo className="mr-2" />,
    },
    {
      name: "Facebook",
      url: "/analytics/facebook",
      icon: <LiaFacebookSquare className="mr-2" />,
    },
    {
      name: "Instagram",
      url: "/analytics/instagram",
      icon: <CiInstagram className="mr-2" />,
    },
  ];
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100dvh";
    } else {
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
    }
  }, [isOpen]);
  return (
    <>
      <div
        id="ham"
        className="*:text-foreground z-20 absolute top-[14px] right-[5%]"
      >
        <Hamburger
          toggled={isOpen}
          rounded
          duration={0.3}
          toggle={setOpen}
          label="Show menu"
          size={20}
          distance="md"
          easing="ease-in"
        />
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.section
            variants={navMenuAnimation}
            initial="hidden"
            animate={"visible"}
            exit="exit"
            key="modal"
            className="fixed px-[5%] py-6 social_links_mobile z-[5] inset-0 w-full h-dvh overflow-y-auto flex items-center justify-center"
          >
            <ul className=" w-full flex flex-col gap-4 items-center justify-center">
              {socialMediaPlatforms.map((platform) => {
                const icon = platform.icon;
                return (
                  <motion.li
                    variants={navLinks}
                    key={platform.name}
                    className="w-full  max-w-[300px]"
                    onClick={() => setOpen(!isOpen)}
                  >
                    <Link
                      href={platform.url}
                      className={`w-full flex hover:bg-secondary ${
                        pathname === platform.url ? "bg-secondary" : ""
                      } text-center justify-center items-center rounded-md border transition-color duration-300 ease-in  p-4 `}
                    >
                      {icon}
                      {platform.name}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
};
