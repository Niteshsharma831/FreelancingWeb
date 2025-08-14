import React from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-gray-900 via-gray-800 to-gray-900 text-gray-200 py-12 shadow-inner">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Logo and Contact Info */}
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-bold text-white mb-2">WorkBridge</h2>
          <p className="text-gray-300 text-sm">
            Connecting freelancers and clients seamlessly.
          </p>
          {/* <p className="text-gray-300 text-sm">
            📞 Contact:{" "}
            <a
              href="tel:+919572861917"
              className="hover:text-blue-400 underline"
            >
              +91 95728 61917
            </a>
          </p> */}
          <p className="text-gray-300 text-sm">
            📧 Email:{" "}
            <a
              href="mailto:its.freelancervibes@gmail.com"
              className="hover:text-blue-400 underline"
            >
              its.freelancervibes@gmail.com
            </a>
          </p>
          <div className="flex gap-4 mt-3 text-2xl">
            <a
              href="https://github.com/niteshsharma831"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white hover:bg-gray-700 p-2 rounded-full transition transform hover:scale-110"
              title="GitHub"
            >
              <FaGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/niteshsharma831"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white hover:bg-blue-600 p-2 rounded-full transition transform hover:scale-110"
              title="LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a
              href="mailto:niteshkumarsharma831@gmail.com"
              className="hover:text-white hover:bg-red-600 p-2 rounded-full transition transform hover:scale-110"
              title="Email"
            >
              <FaEnvelope />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <Link to="/about" className="hover:text-blue-400 transition">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-blue-400 transition">
                Services
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-blue-400 transition">
                Contact
              </Link>
            </li>
            <li>
              <Link
                to="/ternandconditions"
                className="hover:text-blue-400 transition"
              >
                Terms of Service
              </Link>
            </li>
            <li>
              <Link
                to="/privacy-policy"
                className="hover:text-blue-400 transition"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Email Subscription */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-3">
            Subscribe for Updates
          </h3>
          <p className="text-gray-300 text-sm mb-3">
            Stay updated with our latest job posts and news.
          </p>
          <form
            action="mailto:niteshkumarsharma831@gmail.com"
            method="POST"
            encType="text/plain"
            className="flex flex-col gap-3"
          >
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg text-gray-800 border border-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition text-sm"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center text-gray-400 mt-10 border-t border-gray-700 pt-4 text-sm">
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
