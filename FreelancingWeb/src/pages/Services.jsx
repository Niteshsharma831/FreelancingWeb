import {
  Briefcase,
  Users,
  Mail,
  Laptop,
  ShieldCheck,
  FileText,
  Star,
  Zap,
  Globe,
  Target,
  Clock,
  Award,
  ChevronRight,
  Heart,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Rocket,
  LineChart,
  UsersIcon,
  Building,
  Code,
  Paintbrush,
  Megaphone,
  Database,
  Cloud,
  Smartphone,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";

const allServices = [
  {
    title: "Freelancer Hiring Platform",
    description:
      "Connect with top-tier freelancers across 50+ skill categories. Verified profiles, ratings, and portfolio reviews.",
    icon: <Users size={32} />,
    category: "Hiring",
    color: "from-blue-500 to-cyan-500",
    features: [
      "AI Matching",
      "Verified Profiles",
      "Portfolio Reviews",
      "Rating System",
    ],
    popular: true,
  },
  {
    title: "Smart Job Posting",
    description:
      "Post jobs and reach thousands of qualified candidates. Advanced filtering and applicant tracking.",
    icon: <Briefcase size={32} />,
    category: "Jobs",
    color: "from-green-500 to-emerald-500",
    features: [
      "AI Optimization",
      "Analytics Dashboard",
      "Bulk Posting",
      "ATS Integration",
    ],
    popular: true,
  },
  {
    title: "Project Management Suite",
    description:
      "Complete project management tools with real-time collaboration, time tracking, and milestone management.",
    icon: <Laptop size={32} />,
    category: "Tools",
    color: "from-purple-500 to-pink-500",
    features: [
      "Real-time Chat",
      "File Sharing",
      "Time Tracking",
      "Milestone Tracking",
    ],
    popular: false,
  },
  {
    title: "Secure Payment Gateway",
    description:
      "Protected transactions with escrow services, milestone payments, and automatic invoicing.",
    icon: <ShieldCheck size={32} />,
    category: "Finance",
    color: "from-red-500 to-orange-500",
    features: [
      "Escrow Protection",
      "Milestone Payments",
      "Auto Invoicing",
      "Tax Support",
    ],
    popular: true,
  },
  {
    title: "Career Development",
    description:
      "Resume building, portfolio optimization, and skill assessment tools for professional growth.",
    icon: <FileText size={32} />,
    category: "Support",
    color: "from-yellow-500 to-amber-500",
    features: [
      "Resume Builder",
      "Portfolio Hosting",
      "Skill Tests",
      "Career Analytics",
    ],
    popular: false,
  },
  {
    title: "24/7 Premium Support",
    description:
      "Round-the-clock assistance with dedicated account managers and priority response times.",
    icon: <Mail size={32} />,
    category: "Support",
    color: "from-indigo-500 to-blue-500",
    features: [
      "Dedicated Manager",
      "Phone Support",
      "Email Support",
      "Live Chat",
    ],
    popular: false,
  },
  {
    title: "AI Talent Matching",
    description:
      "Advanced AI algorithms to match the perfect freelancer with your project requirements.",
    icon: <Target size={32} />,
    category: "Hiring",
    color: "from-teal-500 to-green-500",
    features: [
      "Smart Matching",
      "Skill Analysis",
      "Compatibility Scoring",
      "Recommendations",
    ],
    popular: true,
  },
  {
    title: "Global Workforce Access",
    description:
      "Access talent from across the globe with localization tools and multi-language support.",
    icon: <Globe size={32} />,
    category: "Hiring",
    color: "from-blue-600 to-purple-600",
    features: [
      "Global Network",
      "Multi-language",
      "Currency Support",
      "Time Zone Tools",
    ],
    popular: false,
  },
  {
    title: "Performance Analytics",
    description:
      "Comprehensive analytics dashboard to track project performance and team productivity.",
    icon: <LineChart size={32} />,
    category: "Tools",
    color: "from-orange-500 to-red-500",
    features: [
      "Real-time Dashboards",
      "Performance Metrics",
      "ROI Calculator",
      "Report Generation",
    ],
    popular: false,
  },
];

const Services = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hoveredService, setHoveredService] = useState(null);

  const filteredServices =
    selectedCategory === "All"
      ? allServices
      : allServices.filter((s) => s.category === selectedCategory);

  const categories = ["All", "Hiring", "Jobs", "Tools", "Finance", "Support"];

  const stats = [
    {
      value: "10,000+",
      label: "Freelancers",
      icon: <UsersIcon className="w-6 h-6" />,
    },
    {
      value: "5,000+",
      label: "Companies",
      icon: <Building className="w-6 h-6" />,
    },
    {
      value: "50+",
      label: "Skills Categories",
      icon: <Code className="w-6 h-6" />,
    },
    {
      value: "98%",
      label: "Satisfaction Rate",
      icon: <Heart className="w-6 h-6" />,
    },
  ];

  const skillCategories = [
    { icon: <Code className="w-6 h-6" />, name: "Development", count: 2500 },
    { icon: <Paintbrush className="w-6 h-6" />, name: "Design", count: 1800 },
    { icon: <Megaphone className="w-6 h-6" />, name: "Marketing", count: 1200 },
    {
      icon: <Database className="w-6 h-6" />,
      name: "Data Science",
      count: 900,
    },
    { icon: <Cloud className="w-6 h-6" />, name: "Cloud & DevOps", count: 700 },
    { icon: <Smartphone className="w-6 h-6" />, name: "Mobile", count: 600 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-24 px-6 text-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=2070')] opacity-10 mix-blend-overlay bg-cover"></div>
        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">Professional Services</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Power Your Projects With
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
                Premium Services
              </span>
            </h1>

            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10">
              From finding the perfect talent to managing projects seamlessly,
              WorkBridge provides comprehensive solutions for businesses and
              freelancers alike.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/alljobs"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-white to-gray-100 text-blue-600 font-bold rounded-xl hover:shadow-2xl transition-all hover:scale-105"
              >
                <Rocket className="w-5 h-5" />
                Explore Jobs
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/internships"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-bold rounded-xl hover:bg-white/30 transition"
              >
                <Briefcase className="w-5 h-5" />
                Find Talent
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto px-4 -mt-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-r ${
                    allServices[index]?.color || "from-gray-500 to-gray-700"
                  } text-white`}
                >
                  {stat.icon}
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Categories Filter */}
      <div className="max-w-6xl mx-auto mt-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Service Categories
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Choose from our carefully curated service categories to find exactly
            what you need
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "bg-white text-gray-700 shadow hover:shadow-md hover:bg-gray-50"
              }`}
            >
              {cat}
              {cat !== "All" && (
                <span className="ml-2 px-2 py-1 text-xs bg-white/20 rounded-full">
                  {allServices.filter((s) => s.category === cat).length}
                </span>
              )}
            </motion.button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              onMouseEnter={() => setHoveredService(index)}
              onMouseLeave={() => setHoveredService(null)}
              className="relative group"
            >
              <div
                className={`bg-gradient-to-br ${service.color} p-0.5 rounded-2xl h-full`}
              >
                <div className="bg-white rounded-2xl p-8 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-6">
                    <div
                      className={`p-4 rounded-xl bg-gradient-to-br ${service.color} text-white`}
                    >
                      {service.icon}
                    </div>
                    <div className="flex gap-1">
                      {service.popular && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full flex items-center gap-1">
                          <Star className="w-3 h-3" /> Popular
                        </span>
                      )}
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                        {service.category}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {service.title}
                  </h3>

                  <p className="text-gray-600 mb-6 flex-grow">
                    {service.description}
                  </p>

                  <div className="mb-6">
                    <div className="text-sm font-semibold text-gray-700 mb-2">
                      Key Features:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {service.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg text-xs"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-gray-100">
                    <button className="w-full py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 font-semibold rounded-xl hover:shadow-md transition flex items-center justify-center gap-2 group-hover:from-blue-50 group-hover:to-blue-100">
                      Learn More
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Skill Categories */}
      <div className="max-w-6xl mx-auto mt-24 px-4">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-12 border border-blue-100">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Expertise Across All Domains
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Find specialized talent across 50+ skill categories
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {skillCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-6 rounded-2xl text-center shadow-sm hover:shadow-xl transition"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white mb-4">
                  {category.icon}
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  {category.name}
                </h4>
                <div className="text-sm text-gray-600">
                  {category.count}+ Experts
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto mt-24 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold mb-4">
                <Zap className="w-4 h-4" /> Why Choose WorkBridge
              </span>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Built for Success, Designed for Growth
              </h2>
            </div>

            {[
              {
                icon: <ShieldCheck />,
                title: "Secure & Reliable",
                desc: "Bank-level security with 99.9% uptime guarantee",
              },
              {
                icon: <Clock />,
                title: "Fast & Efficient",
                desc: "Connect with talent in under 48 hours",
              },
              {
                icon: <Award />,
                title: "Quality Assured",
                desc: "Verified professionals with proven track records",
              },
              {
                icon: <Globe />,
                title: "Global Reach",
                desc: "Access talent from 100+ countries worldwide",
              },
            ].map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    {feature.icon}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-10 text-white">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-3">
                  Ready to Transform Your Work?
                </h3>
                <p className="text-blue-100">
                  Join thousands of successful businesses and freelancers
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-300" />
                  <span>No hidden fees or charges</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-300" />
                  <span>14-day free trial for businesses</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-300" />
                  <span>Dedicated account manager</span>
                </div>
              </div>

              <div className="mt-10">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-3 w-full py-4 bg-white text-blue-600 font-bold rounded-xl hover:shadow-2xl transition"
                >
                  <Rocket className="w-5 h-5" />
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <p className="text-center text-blue-200 text-sm mt-3">
                  Free for freelancers. No credit card required.
                </p>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl -rotate-12 shadow-2xl flex items-center justify-center">
              <div className="text-center p-4">
                <div className="text-2xl font-bold">4.9</div>
                <div className="text-sm font-semibold">Rating</div>
                <div className="flex gap-1 justify-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-6xl mx-auto mt-24 px-4 mb-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-32 -translate-x-32"></div>

          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Join thousands of professionals who trust WorkBridge for their
              hiring and project needs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-10 py-4 bg-white text-blue-600 font-bold rounded-xl hover:shadow-2xl transition hover:scale-105"
              >
                Create Free Account
              </Link>
              <Link
                to="/contact"
                className="px-10 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition"
              >
                Schedule a Demo
              </Link>
            </div>

            <p className="mt-6 text-blue-200 text-sm">
              🎉 Free for freelancers • 14-day trial for businesses • No setup
              fees
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
