export default function PrivacyPolicyPage() {
    return (
        <main className="container mx-auto px-4 py-8 max-w-3xl text-black">
            <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
            <p className="mb-4">
                <strong>Last updated:</strong> June 11, 2025
            </p>
            {/* <p className="mb-4">
                Welcome to AI Tools Cover (<a href="https://aitoolscover.com" className="text-blue-600 underline">aitoolscover.com</a>). Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our website.
            </p> */}

            <h2 className="text-2xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
            <ul className="list-disc ml-6 mb-4">
                <li>
                    <strong>Personal Information:</strong> We may collect personal information such as your name, email address, and any other information you provide when contacting us or subscribing to our newsletter.
                </li>
                <li>
                    <strong>Usage Data:</strong> We collect information about how you use our website, including your IP address, browser type, pages visited, and time spent on our site.
                </li>
                <li>
                    <strong>Cookies:</strong> We use cookies and similar technologies to enhance your experience and analyze site usage.
                </li>
            </ul>

            <h2 className="text-2xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
            <ul className="list-disc ml-6 mb-4">
                <li>To provide and maintain our website and services.</li>
                <li>To improve and personalize your experience.</li>
                <li>To communicate with you, including responding to inquiries and sending updates.</li>
                <li>To analyze usage and trends to improve our website.</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-6 mb-2">3. Sharing Your Information</h2>
            <p className="mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share information with trusted service providers who assist us in operating our website, as long as they agree to keep your information confidential.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-2">4. Data Security</h2>
            <p className="mb-4">
                We take reasonable measures to protect your information from unauthorized access, alteration, or disclosure. However, no method of transmission over the Internet is 100% secure.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-2">5. Third-Party Links</h2>
            <p className="mb-4">
                Our website may contain links to third-party sites. We are not responsible for the privacy practices or content of those sites.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-2">6. Children’s Privacy</h2>
            <p className="mb-4">
                Our website is not intended for children under 13. We do not knowingly collect personal information from children under 13.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-2">7. Changes to This Policy</h2>
            <p className="mb-4">
                We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-2">8. Contact Us</h2>
            <p>
                If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@aitoolscover.com" className="text-blue-600 underline">support@aitoolscover.com</a>.
            </p>
        </main>
    );
}