import {
  ShieldCheck,
  Mail,
  Cookie,
  User,
  Lock,
  Eye,
  FileText,
  Users,
  Server,
  Globe,
  ChevronRight,
  Shield,
  CheckCircle,
  ArrowRight,
  Heart,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState(null);

  const sections = [
    {
      id: "collection",
      icon: User,
      title: "Information We Collect",
      points: [
        "Personal information: Name, Email, Phone, Date of Birth",
        "Professional information: Resume, Skills, Work Experience, Education",
        "Job application data: Applications, Proposals, Interview Status",
        "Technical data: IP Address, Browser Type, Device Information",
        "Usage data: Pages visited, Time spent, Interactions",
      ],
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "usage",
      icon: FileText,
      title: "How We Use Your Data",
      points: [
        "Match you with relevant job opportunities and freelancers",
        "Send OTPs, notifications, and important updates",
        "Personalize your experience and show relevant content",
        "Improve platform performance and user interface",
        "Comply with legal obligations and prevent fraud",
      ],
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "protection",
      icon: Lock,
      title: "Data Protection & Security",
      points: [
        "End-to-end encryption for all sensitive data",
        "Secure servers with regular security audits",
        "Role-based access controls for employees",
        "Regular data backups and disaster recovery plans",
        "Compliance with ISO 27001 security standards",
      ],
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "rights",
      icon: Shield,
      title: "Your Privacy Rights",
      points: [
        "Right to access and download your personal data",
        "Right to correct inaccurate information",
        "Right to delete your account and data",
        "Right to restrict or object to data processing",
        "Right to data portability between services",
      ],
      color: "from-orange-500 to-red-500",
    },
    {
      id: "cookies",
      icon: Cookie,
      title: "Cookies & Tracking",
      points: [
        "Essential cookies for platform functionality",
        "Analytics cookies to improve user experience",
        "Preference cookies to remember your settings",
        "Marketing cookies for personalized content",
        "Third-party cookies from trusted partners",
      ],
      color: "from-yellow-500 to-amber-500",
    },
    {
      id: "sharing",
      icon: Users,
      title: "Data Sharing",
      points: [
        "With employers when you apply for jobs",
        "With payment processors for transactions",
        "With analytics providers to improve service",
        "With legal authorities when required by law",
        "With your explicit consent for other purposes",
      ],
      color: "from-indigo-500 to-blue-500",
    },
    {
      id: "compliance",
      icon: Globe,
      title: "Compliance & Regulations",
      points: [
        "GDPR (General Data Protection Regulation)",
        "Indian IT Act and Digital Personal Data Protection Act",
        "California Consumer Privacy Act (CCPA)",
        "Industry best practices and standards",
        "Regular third-party security audits",
      ],
      color: "from-teal-500 to-green-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              At <span className="font-bold">WorkBridge</span>, we're committed
              to protecting your privacy and being transparent about how we
              handle your data.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                <CheckCircle className="w-4 h-4" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                <CheckCircle className="w-4 h-4" />
                <span>End-to-End Encryption</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                <CheckCircle className="w-4 h-4" />
                <span>Your Data, Your Control</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex overflow-x-auto gap-2 hide-scrollbar">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setActiveSection(section.id);
                  document
                    .getElementById(section.id)
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  activeSection === section.id
                    ? `bg-gradient-to-r ${section.color} text-white shadow-md`
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <section.icon className="w-4 h-4" />
                {section.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Table of Contents */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Quick Navigation
              </h3>
              <div className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id);
                      document
                        .getElementById(section.id)
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-all ${
                      activeSection === section.id
                        ? `bg-gradient-to-r ${section.color} text-white shadow-md`
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <section.icon className="w-4 h-4" />
                        <span className="font-medium">{section.title}</span>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${
                          activeSection === section.id ? "rotate-90" : ""
                        }`}
                      />
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <h4 className="font-semibold text-blue-900 mb-2">Need Help?</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Have questions about your privacy?
                </p>
                <a
                  href="mailto:its.freelancervibe@gmail.com"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  Contact Our Privacy Team <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Content - Sections */}
          <div className="lg:col-span-3 space-y-8">
            {sections.map((section, index) => (
              <motion.section
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onViewportEnter={() => setActiveSection(section.id)}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className={`h-2 bg-gradient-to-r ${section.color}`} />
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-r ${section.color} text-white`}
                    >
                      <section.icon className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {section.title}
                    </h2>
                  </div>

                  <ul className="space-y-4">
                    {section.points.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <div
                            className={`w-2 h-2 rounded-full bg-gradient-to-r ${section.color}`}
                          />
                        </div>
                        <span className="text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.section>
            ))}

            {/* Contact Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-xl p-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-bold mb-3">
                    Contact Our Privacy Team
                  </h2>
                  <p className="text-blue-100 max-w-xl">
                    Have questions about how we handle your data? Our privacy
                    team is here to help.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="mailto:its.freelancervibe@gmail.com"
                    className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:shadow-lg transition"
                  >
                    <Mail className="w-5 h-5" />
                    Email Us
                  </a>
                  <button className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/30 transition">
                    Download PDF
                    <FileText className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.section>

            {/* Last Updated */}
            <div className="text-center text-gray-500 text-sm">
              <p>
                Last Updated:{" "}
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="mt-1">Version 2.1</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">WorkBridge</h3>
                  <p className="text-gray-400 text-sm">Your Privacy Matters</p>
                </div>
              </div>
              <p className="text-gray-400 max-w-md">
                Building a trustworthy platform where your data is always secure
                and your privacy is respected.
              </p>
            </div>

            <div className="text-center md:text-right">
              <p className="text-gray-400 mb-2">
                © {new Date().getFullYear()} WorkBridge. All rights reserved.
              </p>
              <p className="text-gray-300 mb-4">
                Founder & CEO:{" "}
                <strong className="text-white">Nitesh Sharma</strong>
              </p>
              <div className="flex justify-center md:justify-end gap-4">
                {[
                  {
                    name: "Twitter",
                    icon: "twitter",
                    url: "https://twitter.com/",
                  },
                  {
                    name: "LinkedIn",
                    icon: "linkedin",
                    url: "https://linkedin.com/",
                  },
                  {
                    name: "GitHub",
                    icon: "github",
                    url: "https://github.com/",
                  },
                  {
                    name: "Instagram",
                    icon: "instagram",
                    url: "https://instagram.com/",
                  },
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition"
                    aria-label={social.name}
                  >
                    <img
                      src={`https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/${social.icon}.svg`}
                      alt={social.name}
                      className="w-5 h-5 invert"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400 text-sm">
              Made with <Heart className="inline w-4 h-4 text-red-400" /> for
              our users
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default PrivacyPolicy;
