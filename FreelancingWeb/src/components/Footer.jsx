import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaHeart,
  FaArrowRight,
  FaShieldAlt,
  FaBriefcase,
  FaUsers,
  FaRocket,
  FaChevronUp,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { FiMail, FiChevronRight } from "react-icons/fi";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      // Simulate subscription
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socialLinks = [
    {
      icon: <FaGithub />,
      href: "https://github.com/niteshsharma831",
      color: "hover:bg-gray-800",
      label: "GitHub",
    },
    {
      icon: <FaLinkedin />,
      href: "https://www.linkedin.com/in/niteshsharma831",
      color: "hover:bg-blue-600",
      label: "LinkedIn",
    },
    {
      icon: <FaTwitter />,
      href: "https://twitter.com/",
      color: "hover:bg-sky-500",
      label: "Twitter",
    },
    {
      icon: <FaInstagram />,
      href: "https://instagram.com/",
      color: "hover:bg-pink-600",
      label: "Instagram",
    },
    {
      icon: <FaYoutube />,
      href: "https://youtube.com/",
      color: "hover:bg-red-600",
      label: "YouTube",
    },
    {
      icon: <FaEnvelope />,
      href: "mailto:niteshkumarsharma831@gmail.com",
      color: "hover:bg-red-500",
      label: "Email",
    },
  ];

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Jobs", path: "/alljobs" },
    { name: "Internships", path: "/internships" },
    { name: "My Applications", path: "/myjobs" },
    { name: "Post a Job", path: "/post-job" },
  ];

  const companyLinks = [
    { name: "About Us", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" },
    { name: "Careers", path: "/careers" },
    { name: "Blog", path: "/blog" },
  ];

  const legalLinks = [
    { name: "Terms & Conditions", path: "/terms" },
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Cookie Policy", path: "/cookies" },
    { name: "Security", path: "/security" },
    { name: "GDPR Compliance", path: "/gdpr" },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 to-black text-gray-300 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <FaBriefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">WorkBridge</h2>
                <p className="text-sm text-blue-300">Connect • Work • Grow</p>
              </div>
            </div>

            <p className="text-gray-400 leading-relaxed">
              Bridging talent with opportunity. We're building India's most
              trusted platform for professionals and businesses to connect.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <FaMapMarkerAlt className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-sm">Remote • India & Global</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <FaClock className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-sm">24/7 Support Available</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <FiChevronRight className="text-blue-400" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  onHoverStart={() => setHoveredLink(link.name)}
                  onHoverEnd={() => setHoveredLink(null)}
                >
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 group text-gray-400 hover:text-white transition-colors"
                  >
                    <div
                      className={`w-1 h-1 rounded-full transition-all ${
                        hoveredLink === link.name
                          ? "bg-blue-500 w-3"
                          : "bg-gray-600"
                      }`}
                    ></div>
                    {link.name}
                    {hoveredLink === link.name && (
                      <FaArrowRight className="w-3 h-3 text-blue-400 ml-auto opacity-0 group-hover:opacity-100 transition" />
                    )}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <FiChevronRight className="text-purple-400" />
              Company
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                  >
                    <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                    {link.name}
                    <FiChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FiMail className="text-green-400" />
                Stay Updated
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Get the latest job opportunities and platform updates.
              </p>

              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    subscribed
                      ? "bg-green-600 text-white"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg"
                  }`}
                >
                  {subscribed ? (
                    <>
                      <FaHeart className="w-4 h-4" />
                      Subscribed!
                    </>
                  ) : (
                    <>
                      Subscribe
                      <FaRocket className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </form>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-3">
                Connect With Us
              </h4>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-gray-300 transition-all ${social.color} hover:text-white`}
                    aria-label={social.label}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legal Links & Stats */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-wrap gap-6">
              {legalLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="text-sm text-gray-500 hover:text-gray-300 transition flex items-center gap-2"
                >
                  {link.name === "Security" && (
                    <FaShieldAlt className="w-3 h-3" />
                  )}
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <FaUsers className="w-4 h-4 text-blue-400" />
                <span>100,000+ Professionals</span>
              </div>
              <div className="flex items-center gap-2">
                <FaBriefcase className="w-4 h-4 text-green-400" />
                <span>30,000+ Jobs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright & Back to Top */}
        <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} WorkBridge. All rights reserved.
            </p>
            <p className="text-gray-600 text-xs mt-1">
              Developed with <FaHeart className="inline w-3 h-3 text-red-400" />{" "}
              by{" "}
              <span className="font-semibold text-gray-300">
                Nitesh Kumar Sharma
              </span>{" "}
              — Founder & CEO
            </p>
          </div>

          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm font-medium transition"
          >
            Back to Top
            <FaChevronUp className="w-3 h-3" />
          </motion.button>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-gray-900/50 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <FaShieldAlt className="w-4 h-4 text-blue-400" />
              <span>GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>ISO 27001 Standards</span>
            </div>
            <div className="flex items-center gap-2">
              <FaHeart className="w-4 h-4 text-red-400" />
              <span>Made in India</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
