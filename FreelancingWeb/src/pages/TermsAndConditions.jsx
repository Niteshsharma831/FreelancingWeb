import {
  FileText,
  Users,
  ShieldCheck,
  CheckCircle,
  Lock,
  Mail,
  AlertCircle,
  Scale,
  Globe,
  BookOpen,
  ChevronRight,
  ArrowRight,
  Shield,
  Eye,
  Clock,
  Zap,
  Heart,
  ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";

const TermsAndConditions = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [readProgress, setReadProgress] = useState(0);

  const sections = [
    {
      id: "accounts",
      icon: Users,
      title: "User Accounts & Registration",
      points: [
        "You must provide accurate and complete information during registration",
        "Keep your login credentials confidential and secure",
        "You are responsible for all activities under your account",
        "Minimum age requirement: 18 years or legal age in your jurisdiction",
        "We reserve the right to suspend accounts with suspicious activity",
      ],
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "acceptable-use",
      icon: CheckCircle,
      title: "Acceptable Use Policy",
      points: [
        "No posting of illegal, offensive, or harmful content",
        "No spamming, phishing, or malicious activities allowed",
        "Respect intellectual property rights of others",
        "No automated scraping or data collection without permission",
        "Compliance with all applicable laws and regulations",
      ],
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "intellectual-property",
      icon: ShieldCheck,
      title: "Intellectual Property Rights",
      points: [
        "WorkBridge retains all rights to platform content and branding",
        "Users retain rights to their submitted content and portfolios",
        "By posting, you grant us license to display your content",
        "No unauthorized use of WorkBridge trademarks or logos",
        "Report copyright infringement via designated channels",
      ],
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "privacy",
      icon: Lock,
      title: "Privacy & Data Protection",
      points: [
        "We handle data as described in our Privacy Policy",
        "We implement industry-standard security measures",
        "Your data may be processed in compliance with global regulations",
        "You can request data deletion or modification",
        "We never sell your personal information to third parties",
      ],
      color: "from-orange-500 to-red-500",
    },
    {
      id: "termination",
      icon: AlertCircle,
      title: "Termination & Suspension",
      points: [
        "We may terminate accounts violating these terms",
        "Users may delete their accounts at any time",
        "Content may remain after account deletion as required by law",
        "Suspensions may occur during investigations",
        "Right to appeal termination decisions",
      ],
      color: "from-yellow-500 to-amber-500",
    },
    {
      id: "liability",
      icon: Scale,
      title: "Limitation of Liability",
      points: [
        "We are not liable for indirect or consequential damages",
        "Maximum liability limited to amount paid for services",
        "No warranty for uninterrupted or error-free service",
        "We mediate disputes but are not legally responsible",
        "Users agree to indemnify WorkBridge against claims",
      ],
      color: "from-indigo-500 to-blue-500",
    },
    {
      id: "payments",
      icon: Shield,
      title: "Payments & Fees",
      points: [
        "Clear disclosure of all fees before transactions",
        "Refund policies vary by service type",
        "Taxes are responsibility of users where applicable",
        "Secure payment processing through trusted partners",
        "Dispute resolution process for payment issues",
      ],
      color: "from-teal-500 to-green-500",
    },
    {
      id: "disputes",
      icon: Globe,
      title: "Dispute Resolution",
      points: [
        "Attempt amicable resolution before legal action",
        "Governing law: Jurisdiction-specific as applicable",
        "Mediation is preferred method for dispute resolution",
        "Class action waivers where legally permissible",
        "Contact information for legal notices provided",
      ],
      color: "from-red-500 to-orange-500",
    },
  ];

  const handleScroll = (e) => {
    const container = e.target;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight - container.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    setReadProgress(progress);
  };

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
              <FileText className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Terms & Conditions
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Welcome to <span className="font-bold">WorkBridge</span>. These
              terms govern your use of our platform and services.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                <Eye className="w-4 h-4" />
                <span>
                  Last Updated:{" "}
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                <BookOpen className="w-4 h-4" />
                <span>Version 2.1</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                <Clock className="w-4 h-4" />
                <span>Estimated reading time: 8 minutes</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="sticky top-0 z-20 bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-1">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Reading Progress</span>
            <span>{Math.round(readProgress)}%</span>
          </div>
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden mt-1">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${readProgress}%` }}
              transition={{ type: "spring", stiffness: 100 }}
            />
          </div>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="sticky top-14 z-10 bg-white/95 backdrop-blur-sm border-b shadow-sm">
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
                {section.title.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12" onScroll={handleScroll}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Table of Contents */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Table of Contents
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
                        <span className="font-medium text-sm">
                          {section.title}
                        </span>
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
                <h4 className="font-semibold text-blue-900 mb-2">
                  Important Notice
                </h4>
                <p className="text-sm text-blue-700 mb-3">
                  By using WorkBridge, you agree to these terms. Please read
                  them carefully.
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 text-blue-600" />
                  <span>These terms affect your legal rights</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Sections */}
          <div className="lg:col-span-3 space-y-8">
            {/* Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Introduction
              </h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  Welcome to WorkBridge. These Terms and Conditions ("Terms")
                  govern your access to and use of our website, mobile
                  applications, and services (collectively, the "Services").
                </p>
                <p>
                  By accessing or using our Services, you agree to be bound by
                  these Terms. If you disagree with any part of the terms, you
                  may not access the Services.
                </p>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-900 mb-1">
                        Updates to Terms
                      </h4>
                      <p className="text-yellow-700 text-sm">
                        We may modify these terms at any time. We'll notify you
                        of significant changes. Continued use after changes
                        constitutes acceptance.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Sections */}
            {sections.map((section, index) => (
              <motion.section
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
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
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-start gap-3"
                      >
                        <div className="flex-shrink-0 mt-1">
                          <div
                            className={`w-2 h-2 rounded-full bg-gradient-to-r ${section.color}`}
                          />
                        </div>
                        <span className="text-gray-700">{point}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.section>
            ))}

            {/* Acceptance Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-xl p-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-bold mb-3">
                    Acceptance of Terms
                  </h2>
                  <p className="text-blue-100 max-w-xl">
                    By creating an account or using our services, you
                    acknowledge that you have read, understood, and agree to be
                    bound by these Terms & Conditions.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="mailto:its.freelancervibe@gmail.com"
                    className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:shadow-lg transition"
                  >
                    <Mail className="w-5 h-5" />
                    Contact Legal Team
                  </a>
                  <Link
                    to="/privacy"
                    className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/30 transition"
                  >
                    <ShieldCheck className="w-5 h-5" />
                    Privacy Policy
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Last Updated */}
            <div className="text-center text-gray-500 text-sm space-y-2">
              <p>Effective Date: January 1, 2024</p>
              <p>Version 2.1 • Document ID: WB-TOS-2024-02</p>
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
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">WorkBridge Legal</h3>
                  <p className="text-gray-400 text-sm">Terms & Conditions</p>
                </div>
              </div>
              <p className="text-gray-400 max-w-md">
                These terms constitute a legally binding agreement between you
                and WorkBridge.
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
              our community
            </p>
            <p className="text-gray-500 text-xs mt-2">
              This document is for informational purposes and does not
              constitute legal advice.
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

export default TermsAndConditions;
