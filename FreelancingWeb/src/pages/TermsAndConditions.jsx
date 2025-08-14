import {
  FileText,
  Users,
  ShieldCheck,
  CheckCircle,
  Lock,
  Mail,
} from "lucide-react";

const TermsAndConditions = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center">
          <FileText className="mx-auto text-blue-600 w-12 h-12 mb-4" />
          <h1 className="text-4xl font-bold text-gray-900">
            Terms & Conditions
          </h1>
          <p className="mt-2 text-gray-600 text-lg">
            Welcome to <strong>WorkBridge</strong>. By using our platform, you
            agree to these terms. Please read them carefully.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {/* 1. User Accounts */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <Users size={22} /> 1. User Accounts
            </h2>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              <li>
                Users must provide accurate information while registering.
              </li>
              <li>Keep your account credentials confidential.</li>
              <li>
                We are not responsible for unauthorized access to your account.
              </li>
            </ul>
          </section>

          {/* 2. Acceptable Use */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <CheckCircle size={22} /> 2. Acceptable Use
            </h2>
            <p className="text-gray-700">
              You agree not to misuse the platform, post illegal content, or
              engage in activities that disrupt services.
            </p>
          </section>

          {/* 3. Intellectual Property */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <ShieldCheck size={22} /> 3. Intellectual Property
            </h2>
            <p className="text-gray-700">
              All content, logos, and materials on WorkBridge are the property
              of WorkBridge and protected by intellectual property laws.
            </p>
          </section>

          {/* 4. Privacy */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <Lock size={22} /> 4. Privacy
            </h2>
            <p className="text-gray-700">
              Your privacy is important. Please review our Privacy Policy to
              understand how your data is handled.
            </p>
          </section>

          {/* 5. Termination */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <FileText size={22} /> 5. Termination
            </h2>
            <p className="text-gray-700">
              We reserve the right to suspend or terminate accounts that violate
              our terms or engage in harmful activities.
            </p>
          </section>

          {/* 6. Limitation of Liability */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <ShieldCheck size={22} /> 6. Limitation of Liability
            </h2>
            <p className="text-gray-700">
              WorkBridge is not liable for any damages resulting from your use
              of the platform, including data loss or service interruptions.
            </p>
          </section>

          {/* 7. Contact */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Contact Us
            </h2>
            <p className="text-gray-700 mb-2">
              For any questions regarding our Terms & Conditions:
            </p>
            <a
              href="mailto:its.freelancervibe@gmail.com"
              className="inline-flex items-center gap-2 text-blue-600 hover:underline font-medium"
            >
              <Mail size={18} /> its.freelancervibe@gmail.com
            </a>
          </section>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm mt-12 space-y-2">
          <p>© {new Date().getFullYear()} WorkBridge. All rights reserved.</p>
          <p>
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
        </footer>
      </div>
    </div>
  );
};

export default TermsAndConditions;
