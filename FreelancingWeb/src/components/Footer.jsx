import React from "react";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#1F2937] text-gray-200 py-10 mt-10 shadow-lg">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo and Contact Info */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-3">WorkBridge</h2>
          <p className="text-sm mb-2">
            Connecting freelancers and clients seamlessly.
          </p>
          <p className="text-sm mb-1">
            📞 Contact:{" "}
            <a href="tel:+919572861917" className="hover:underline">
              +91 95728 61917
            </a>
          </p>
          <p className="text-sm mb-4">
            📧 Email:{" "}
            <a
              href="mailto:niteshkumarsharma831@gmail.com"
              className="hover:underline"
            >
              niteshkumarsharma831@gmail.com
            </a>
          </p>
          <div className="flex gap-4 text-2xl mt-2">
            <a
              href="https://github.com/niteshsharma831"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-transform transform hover:scale-110"
              title="GitHub"
            >
              <FaGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/niteshsharma831"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-transform transform hover:scale-110"
              title="LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a
              href="mailto:niteshkumarsharma831@gmail.com"
              className="hover:text-blue-400 transition-transform transform hover:scale-110"
              title="Email"
            >
              <FaEnvelope />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/about" className="hover:text-blue-400">
                About Us
              </a>
            </li>
            <li>
              <a href="/services" className="hover:text-blue-400">
                Services
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-blue-400">
                Contact
              </a>
            </li>
            <li>
              <a href="/terms" className="hover:text-blue-400">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="/privacy" className="hover:text-blue-400">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Email Subscription */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-3">
            Subscribe for Updates
          </h3>
          <p className="text-sm mb-3">
            Stay updated with our latest job posts and news.
          </p>
          <form
            action="mailto:niteshkumarsharma831@gmail.com"
            method="POST"
            encType="text/plain"
          >
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email"
              className="w-full px-3 py-2 rounded-lg text-gray-800 mb-3 text-sm border border-gray-200 focus:border-white focus:ring-0 text-white"
            />

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition text-sm"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center text-sm text-gray-400 mt-10 border-t border-gray-600 pt-4">
        &copy; {new Date().getFullYear()} WorkBridge. All rights reserved.{" "}
        <br />
        Developed by{" "}
        <span className="font-semibold text-white">Nitesh Kumar Sharma</span> —
        Founder & CEO
      </div>
    </footer>
  );
};

export default Footer;
