import React from 'react';
import Link from "next/link";
export const metadata = {
    title: 'Terms of Service',
    description: "Read the terms and conditions that govern the use of Linktide, including user rights, responsibilities, and platform policies.",
  };
  
export default function TermsOfService() {
    return (
        <div className="container  relative overflow-hidden text-white mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-6 text-center">Terms of Service</h1>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                <p className="text-base leading-relaxed">
                    Welcome to Linktide. By using our services, you agree to comply with and be bound by the following terms. 
                    Please review these terms carefully, as they govern your use of our platform.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">2. Use of Services</h2>
                <p className="text-base leading-relaxed">
                    You are granted a limited, non-exclusive, non-transferable license to access and use the Linktide platform for managing and viewing basic social media analytics and user data. You agree not to misuse our services, attempt to access unauthorized areas, or violate any applicable laws while using the platform.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
                <p className="text-base leading-relaxed">
                    You are responsible for maintaining the confidentiality of your account information, including your password. You agree to notify us immediately if you suspect any unauthorized use of your account.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">4. Data and Privacy</h2>
                <p className="text-base leading-relaxed">
                    Your use of Linktide is subject to our <Link href="/policy" className="mx-1 underline">Privacy Policy</Link>. By using the platform, you agree to the terms outlined in our Privacy Policy, including how we collect, store, and use your data.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">5. Termination</h2>
                <p className="text-base leading-relaxed">
                    We reserve the right to suspend or terminate your access to Linktide at our sole discretion if we believe you are in violation of these terms, abusing the platform, or engaging in illegal activities.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
                <p className="text-base leading-relaxed">
                    Linktide is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We do not guarantee uninterrupted or error-free use of our platform. Linktide is not liable for any indirect, incidental, or consequential damages arising from your use of the platform.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">7. Changes to Terms</h2>
                <p className="text-base leading-relaxed">
                    We may update these terms from time to time. Any changes will be posted on this page, and continued use of Linktide after such changes constitutes acceptance of the new terms.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
                <p className="text-base leading-relaxed">
                    If you have any questions or concerns about these terms, please contact us at 
                    <Link href="mailto:clintonphillips464@gmail.com" className="underline ml-1">clintonphillips464@gmail.com</Link>.
                </p>
            </section>
        </div>
    );
}
