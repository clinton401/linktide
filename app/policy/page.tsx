import {FC} from 'react';
import Link from "next/link";
import {FuzzyOverlay} from "@/components/framer-motion/fuzzy-overlay";
export const metadata = {
    title: 'Privacy Policy',
    description: "Learn how Linktide handles your data, protects your privacy, and ensures the security of your personal information.",
  };
  
const PrivacyPolicy: FC = ()  => {
    return (
        <div className="container relative overflow-hidden text-white  mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy</h1>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
                <p className="text-base leading-relaxed">
                    We at Linktide value your privacy and are committed to protecting your personal information. 
                    This privacy policy explains how we collect, use, and protect the data we gather when you use our services.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Data Collection</h2>
                <h3 className="text-xl font-medium mb-2">What Data is Collected</h3>
                <p className="text-base leading-relaxed">
                    When you use Linktide, we collect limited information such as:
                </p>
                <ul className="list-disc pl-5 my-4">
                    <li>Social media account data (e.g., usernames, profile pictures).</li>
                    <li>Basic analytics (e.g., followers, engagement metrics, post performance).</li>
                    <li>Personal information provided by you, such as your email address.</li>
                </ul>

                <h3 className="text-xl font-medium mb-2">How the Data is Collected</h3>
                <p className="text-base leading-relaxed">
                    We collect data in the following ways:
                </p>
                <ul className="list-disc pl-5 my-4">
                    <li>When you connect your social media accounts via API.</li>
                    <li>When you interact with our platform to view analytics and user data.</li>
                    <li>When you voluntarily provide information (e.g., signing up, filling out forms).</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Use of Data</h2>
                <p className="text-base leading-relaxed">
                    We use the data collected to:
                </p>
                <ul className="list-disc pl-5 my-4">
                    <li>Provide access to basic social media analytics and user data on our platform.</li>
                    <li>Help you monitor your social media performance and activity.</li>
                    <li>Send notifications related to your account or service updates (only if you opt-in).</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Data Sharing</h2>
                <p className="text-base leading-relaxed">
                    We do not sell or share your data with third parties, except for essential service providers 
                    (e.g., API integrations with social media platforms) or when required by law.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Data Protection</h2>
                <p className="text-base leading-relaxed">
                    We take reasonable steps to protect your data from unauthorized access, misuse, or disclosure. 
                    However, please note that no method of transmission over the internet is completely secure.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
                <p className="text-base leading-relaxed">
                    You have the right to:
                </p>
                <ul className="list-disc pl-5 my-4">
                    <li>Access and review the data we collect about you.</li>
                    <li>Request deletion or correction of your data.</li>
                    <li>Withdraw consent for data collection at any time by disconnecting your accounts.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Changes to this Privacy Policy</h2>
                <p className="text-base leading-relaxed">
                    We may update this privacy policy from time to time. Any changes will be posted on this page, 
                    and we encourage you to review it periodically.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                <p className="text-base leading-relaxed">
                    If you have any questions or concerns about our privacy policy, please contact us at 
                    <Link  href="mailto:clintonphillips464@gmail.com" className="underline ml-1">clintonphillips464@gmail.com</Link>.
                </p>
            </section>
            <FuzzyOverlay/>
        </div>
    );
}
export default PrivacyPolicy
