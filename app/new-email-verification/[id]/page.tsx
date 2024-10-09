import { FC } from "react";
import { NewEmailVerificationForm } from "@/components/protected/new-email-verification-form";
import { FuzzyOverlay } from "@/components/framer-motion/fuzzy-overlay";
export const metadata = {
  title: "Verify Your Email",
  description:
    "Verify your new email address to complete the update process and secure your Linktide account. Ensure you're receiving important notifications and updates.",
};

const NewEmailVerificationPage: FC = () => {
  return (
    <main className=" relative overflow-hidden min-h-dvh w-full flex items-center justify-center px-[5%] py-[80px]">
      <NewEmailVerificationForm />
      <FuzzyOverlay />
    </main>
  );
};
export default NewEmailVerificationPage;
