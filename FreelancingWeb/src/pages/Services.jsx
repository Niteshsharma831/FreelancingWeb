import {
  Briefcase,
  Users,
  Mail,
  Laptop,
  ShieldCheck,
  FileText,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";

const allServices = [
  {
    title: "Freelancer Hiring",
    description:
      "Connect with skilled freelancers for your projects quickly and efficiently.",
    icon: <Users size={28} className="text-blue-500" />,
    category: "Hiring",
  },
  {
    title: "Job Posting",
    description:
      "Post job opportunities and find the perfect talent for your organization.",
    icon: <Briefcase size={28} className="text-green-500" />,
    category: "Jobs",
  },
  {
    title: "Project Management Tools",
    description:
      "Manage your projects, track progress, and communicate effectively with your team.",
    icon: <Laptop size={28} className="text-purple-500" />,
    category: "Tools",
  },
  {
    title: "Secure Payments",
    description:
      "Ensure safe and timely payments for freelancers and clients with our secure gateway.",
    icon: <ShieldCheck size={28} className="text-red-500" />,
    category: "Finance",
  },
  {
    title: "Resume & Portfolio Support",
    description:
      "Provide guidance and templates for freelancers to showcase their work effectively.",
    icon: <FileText size={28} className="text-yellow-500" />,
    category: "Support",
  },
  {
    title: "24/7 Customer Support",
    description:
      "Our support team is available around the clock to assist you with any queries.",
    icon: <Mail size={28} className="text-indigo-500" />,
    category: "Support",
  },
];

const Services = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredServices =
    selectedCategory === "All"
      ? allServices
      : allServices.filter((s) => s.category === selectedCategory);

  const categories = ["All", "Hiring", "Jobs", "Tools", "Finance", "Support"];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 px-6 text-center rounded-b-3xl shadow-lg relative overflow-hidden">
        <h1 className="text-5xl font-bold mb-4">Our Services</h1>
        <p className="text-lg max-w-2xl mx-auto mb-6">
          At <strong>WorkBridge</strong>, we offer a wide range of services to
          connect freelancers and clients efficiently, ensuring quality and
          reliability in every project.
        </p>
        {/* <Link
          to="/contact"
          className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-gray-100 transition"
        >
          Get Started
        </Link> */}
        {/* Decorative Circle */}
        <div className="absolute top-[-50px] left-[-50px] w-72 h-72 bg-white/10 rounded-full animate-pulse"></div>
      </div>

      {/* Categories */}
      <div className="max-w-6xl mx-auto mt-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full font-medium transition ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-800 shadow hover:bg-blue-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition cursor-pointer flex flex-col items-start"
            >
              <div className="mb-4">{service.icon}</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {service.title}
              </h2>
              <p className="text-gray-700 text-sm mb-4">
                {service.description}
              </p>
              <span className="text-xs px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                {service.category}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Testimonials Section */}
        <div className="mt-20 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">What Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg text-left"
              >
                <div className="flex items-center mb-3 gap-3">
                  <Star size={20} className="text-yellow-400" />
                  <Star size={20} className="text-yellow-400" />
                  <Star size={20} className="text-yellow-400" />
                  <Star size={20} className="text-yellow-400" />
                  <Star size={20} className="text-yellow-400" />
                </div>
                <p className="text-gray-700 mb-3">
                  "WorkBridge helped us find the perfect freelancer in no time.
                  The process was smooth and professional."
                </p>
                <p className="font-semibold text-gray-900">— John Doe</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        {/* <div className="text-center mt-16">
          <Link
            to="/contact"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-10 py-4 rounded-full shadow-lg transition text-lg"
          >
            Contact Us Today
          </Link>
        </div> */}
      </div>    
    </div>
  );
};

export default Services;
