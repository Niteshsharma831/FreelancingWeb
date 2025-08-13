import { ShieldCheck, Mail, Cookie, User, Lock } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-gray-800">
      <div className="bg-white shadow-md rounded-xl p-8">
        <h1 className="text-4xl font-bold text-blue-600 mb-6 flex items-center gap-2">
          <ShieldCheck size={28} /> Privacy Policy
        </h1>

        <p className="text-gray-600 mb-6 text-lg">
          At <strong>WorkBridge</strong>, we prioritize your privacy. This
          policy explains how we collect, use, protect, and respect your
          information.
        </p>

        {/* Section 1 */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <User size={20} /> 1. Information We Collect
          </h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>Personal data like Name, Email, Date of Birth</li>
            <li>Job-related data such as Applications, Skills, Resume</li>
            <li>Device and usage data including cookies</li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Mail size={20} /> 2. How We Use Your Data
          </h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>Match you with relevant jobs or freelancers</li>
            <li>Send OTPs, status updates, and notifications</li>
            <li>Enhance platform performance and UX</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Lock size={20} /> 3. Data Protection
          </h2>
          <p className="text-gray-700">
            We implement encryption, secure servers, and access control to keep
            your data safe.
          </p>
        </div>

        {/* Section 4 */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            4. Your Rights
          </h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>Request to view or delete your data</li>
            <li>Control communication preferences</li>
            <li>Withdraw consent at any time</li>
          </ul>
        </div>

        {/* Section 5 */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Cookie size={20} /> 5. Cookies
          </h2>
          <p className="text-gray-700">
            Cookies help us personalize your experience and improve the site.
            You may disable them from your browser settings.
          </p>
        </div>

        {/* Section 6 */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            6. Compliance
          </h2>
          <p className="text-gray-700">
            We adhere to GDPR, IT Act, and other global privacy standards to
            keep your information protected.
          </p>
        </div>

        {/* Section 7 */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            7. Contact Us
          </h2>
          <p className="text-gray-700">
            If you have any concerns or questions:
          </p>
          <a
            href="mailto:its.freelancervibe@gmail.com"
            className="text-blue-600 hover:underline inline-flex items-center gap-1 mt-2"
          >
            <Mail size={18} /> its.freelancervibe@gmail.com
          </a>
        </div>

        <hr className="my-8 border-gray-300" />

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} WorkBridge. All rights reserved.</p>
          <p className="mt-2">
            Founder & CEO: <strong>Nitesh Sharma</strong>
          </p>
          <div className="flex justify-center mt-3 gap-4">
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/twitter.svg"
                alt="Twitter"
                className="w-5 h-5"
              />
            </a>
            <a
              href="https://linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linkedin.svg"
                alt="LinkedIn"
                className="w-5 h-5"
              />
            </a>
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/github.svg"
                alt="GitHub"
                className="w-5 h-5"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
