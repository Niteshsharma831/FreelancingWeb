import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import {
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaBuilding,
  FaSearch,
  FaChevronRight,
  FaStar,
  FaFire,
  FaRocket,
  FaUsers,
  FaBriefcase,
  FaChartLine,
} from "react-icons/fa";
import { FiTrendingUp, FiAward, FiClock } from "react-icons/fi";

const HomePage = () => {
  const [jobs, setJobs] = useState([]);
  const { user } = useAuth();

  // Animated numbers state
  const [counts, setCounts] = useState({
    jobs: 0,
    freelancers: 0,
    companies: 0,
  });

  useEffect(() => {
    const dummyJobs = [
      {
        id: 1,
        title: "Frontend Developer",
        company: "TechCorp",
        location: "Remote",
        salary: "$60k - $80k",
        tags: ["React", "TailwindCSS", "JavaScript"],
        type: "Full-time",
        featured: true,
        posted: "2 days ago",
      },
      {
        id: 2,
        title: "UI/UX Designer",
        company: "Designify",
        location: "New York, USA",
        salary: "$50k - $70k",
        tags: ["Figma", "UX Research", "Prototyping"],
        type: "Contract",
        featured: true,
        posted: "1 day ago",
      },
      {
        id: 3,
        title: "Backend Developer",
        company: "CloudWorks",
        location: "Berlin, Germany",
        salary: "$70k - $90k",
        tags: ["Node.js", "MongoDB", "AWS"],
        type: "Full-time",
        featured: false,
        posted: "3 days ago",
      },
      {
        id: 4,
        title: "Full Stack Developer",
        company: "Innovatech",
        location: "London, UK",
        salary: "$65k - $85k",
        tags: ["React", "Node.js", "Express", "MongoDB"],
        type: "Full-time",
        featured: true,
        posted: "5 hours ago",
      },
      {
        id: 5,
        title: "Data Analyst",
        company: "DataHive",
        location: "San Francisco, USA",
        salary: "$55k - $75k",
        tags: ["Python", "SQL", "Excel", "Tableau"],
        type: "Part-time",
        featured: false,
        posted: "1 week ago",
      },
      {
        id: 6,
        title: "Digital Marketing Specialist",
        company: "MarketGurus",
        location: "Remote",
        salary: "$45k - $60k",
        tags: ["SEO", "Google Ads", "Social Media"],
        type: "Full-time",
        featured: true,
        posted: "Just now",
      },
    ];

    setJobs(dummyJobs);
  }, []);

  // Animate numbers on load
  useEffect(() => {
    const targets = { jobs: 5000, freelancers: 1000, companies: 500 };
    const duration = 3000;
    const frameRate = 16;
    const steps = duration / frameRate;
    const increments = {
      jobs: targets.jobs / steps,
      freelancers: targets.freelancers / steps,
      companies: targets.companies / steps,
    };

    let current = { jobs: 0, freelancers: 0, companies: 0 };
    const timer = setInterval(() => {
      current = {
        jobs: Math.min(current.jobs + increments.jobs, targets.jobs),
        freelancers: Math.min(
          current.freelancers + increments.freelancers,
          targets.freelancers
        ),
        companies: Math.min(
          current.companies + increments.companies,
          targets.companies
        ),
      };
      setCounts({ ...current });
      if (
        current.jobs === targets.jobs &&
        current.freelancers === targets.freelancers &&
        current.companies === targets.companies
      ) {
        clearInterval(timer);
      }
    }, frameRate);

    return () => clearInterval(timer);
  }, []);

  const categories = [
    {
      name: "Web Development",
      icon: "💻",
      jobs: 1240,
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Mobile Apps",
      icon: "📱",
      jobs: 850,
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "UI/UX Design",
      icon: "🎨",
      jobs: 620,
      color: "from-orange-500 to-red-500",
    },
    {
      name: "Marketing",
      icon: "📢",
      jobs: 930,
      color: "from-green-500 to-emerald-500",
    },
    {
      name: "Data Science",
      icon: "📊",
      jobs: 750,
      color: "from-indigo-500 to-blue-500",
    },
    {
      name: "Cybersecurity",
      icon: "🔐",
      jobs: 420,
      color: "from-gray-800 to-gray-600",
    },
    {
      name: "Content Writing",
      icon: "✍️",
      jobs: 680,
      color: "from-yellow-500 to-orange-500",
    },
    {
      name: "DevOps",
      icon: "⚙️",
      jobs: 540,
      color: "from-teal-500 to-green-500",
    },
  ];

  const features = [
    {
      icon: <FaRocket className="w-6 h-6" />,
      title: "Fast Hiring",
      description: "Connect with employers in under 48 hours",
    },
    {
      icon: <FiAward className="w-6 h-6" />,
      title: "Verified Companies",
      description: "Work with trusted, verified employers",
    },
    {
      icon: <FaChartLine className="w-6 h-6" />,
      title: "Career Growth",
      description: "Access to upskilling and advancement opportunities",
    },
    {
      icon: <FiClock className="w-6 h-6" />,
      title: "Flexible Work",
      description: "Choose from remote, hybrid, or onsite roles",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-800">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center lg:text-left lg:flex items-center justify-between">
            <div className="lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6">
                  <FaFire className="mr-2" /> 500+ New Jobs This Week
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                  Find Your{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    Dream Job
                  </span>{" "}
                  Today
                </h1>

                <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                  Join thousands of professionals finding their perfect match
                  with our AI-powered job matching platform.
                </p>
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <Link
                  to="/alljobs"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  <FaSearch className="w-5 h-5" />
                  Explore Jobs
                  <FaChevronRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    alert("You are not eligible to see freelancers");
                  }}
                  className="px-8 py-4 border-2 border-gray-300 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300"
                >
                  Post a Job
                </button>
              </motion.div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6">
                {[
                  { label: "Active Jobs", value: "5,000+" },
                  { label: "Companies", value: "500+" },
                  { label: "Success Rate", value: "95%" },
                ].map((stat, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-ping" />
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image/Illustration */}
            <div className="lg:w-1/2 mt-12 lg:mt-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="relative"
              >
                <div className="relative bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl p-8 transform rotate-1">
                  <div className="absolute -top-4 -right-4 bg-yellow-500 text-white px-4 py-2 rounded-lg font-bold transform rotate-3">
                    🔥 Trending
                  </div>

                  {jobs.slice(0, 3).map((job, index) => (
                    <div
                      key={job.id}
                      className={`p-4 rounded-xl mb-4 border-l-4 ${
                        index === 0
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">{job.title}</h3>
                          <p className="text-gray-600">{job.company}</p>
                        </div>
                        {job.featured && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full flex items-center gap-1">
                            <FaStar className="w-3 h-3" /> Featured
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="flex items-center gap-1">
                          <FaMapMarkerAlt /> {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaMoneyBillWave /> {job.salary}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gradient-to-r from-gray-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaBriefcase className="w-8 h-8" />,
                count: counts.jobs,
                label: "Jobs Posted",
                suffix: "+",
              },
              {
                icon: <FaUsers className="w-8 h-8" />,
                count: counts.freelancers,
                label: "Freelancers",
                suffix: "+",
              },
              {
                icon: <FaBuilding className="w-8 h-8" />,
                count: counts.companies,
                label: "Companies",
                suffix: "+",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center p-8 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-6">
                  {stat.icon}
                </div>
                <div className="text-5xl font-bold mb-2">
                  {Math.floor(stat.count).toLocaleString()}
                  {stat.suffix}
                </div>
                <div className="text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Why Choose <span className="text-blue-600">Our Platform</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We're changing the way professionals connect with opportunities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-4">
                Featured <span className="text-blue-600">Jobs</span>
              </h2>
              <p className="text-gray-600">
                Hand-picked opportunities from top companies
              </p>
            </div>
            <Link
              to="/alljobs"
              className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl border border-gray-300 hover:border-blue-500 hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              View All Jobs
              <FaChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.slice(0, 6).map((job) => (
              <motion.div
                key={job.id}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden border ${
                  job.featured ? "border-blue-500" : "border-gray-200"
                } hover:shadow-xl transition-all duration-300`}
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                {job.featured && (
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 text-sm font-bold flex items-center gap-2">
                    <FaStar className="w-4 h-4" />
                    Featured Job
                  </div>
                )}

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaBuilding className="w-4 h-4" />
                        {job.company}
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                      {job.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <FaMapMarkerAlt className="w-4 h-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <FaMoneyBillWave className="w-4 h-4" />
                      {job.salary}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {job.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <FiClock className="w-4 h-4" />
                      {job.posted}
                    </span>
                    <Link
                      to={`/job/${job.id}`}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Apply Now
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Browse by <span className="text-blue-600">Category</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Find jobs in your area of expertise
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}
                >
                  {category.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{category.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{category.jobs} jobs</span>
                  <FaChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-2 transition-all" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-32 -translate-x-32" />

            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-6">
                Ready to Start Your Journey?
              </h2>
              <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">
                Join thousands of professionals who found their dream job
                through our platform
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  Create Free Account
                </Link>
                <Link
                  to="/alljobs"
                  className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  Browse Jobs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Action Buttons */}
      {user && !user.profileCompleted && (
        <motion.div
          className="fixed bottom-6 right-6 z-50"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="relative group">
            <button
              onClick={() => (window.location.href = "/profile")}
              className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center gap-3 group-hover:scale-105"
            >
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <FiTrendingUp className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-bold">Complete Profile</div>
                <div className="text-sm opacity-90">
                  Increase your chances by 70%
                </div>
              </div>
            </button>
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full animate-ping" />
          </div>
        </motion.div>
      )}

      {/* Announcement Banner (Improved) */}
      <div className="fixed top-16 left-0 w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-semibold px-4 py-3 shadow-lg z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full">
            <span className="animate-pulse">📢</span>
            <span className="text-sm">Important</span>
          </div>
          <div className="text-sm sm:text-base">
            Note: Your profile will be visible only after you refresh the page.
            Contact us if you have questions.
          </div>
          <button className="hidden sm:block px-4 py-1 bg-white text-gray-900 rounded-full text-sm font-bold hover:bg-gray-100 transition">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
