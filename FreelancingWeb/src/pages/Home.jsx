import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { FaMapMarkerAlt, FaMoneyBillWave } from "react-icons/fa";

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
      },
      {
        id: 2,
        title: "UI/UX Designer",
        company: "Designify",
        location: "New York, USA",
        salary: "$50k - $70k",
        tags: ["Figma", "UX Research", "Prototyping"],
      },
      {
        id: 3,
        title: "Backend Developer",
        company: "CloudWorks",
        location: "Berlin, Germany",
        salary: "$70k - $90k",
        tags: ["Node.js", "MongoDB", "AWS"],
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
  const trainings = [
    {
      title: "MERN Stack Development",
      description:
        "Learn MongoDB, Express, React, and Node.js from scratch and build real-world web apps.",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    },
    {
      title: "Flutter Mobile App Development",
      description:
        "Create cross-platform mobile apps with a single codebase using Flutter & Dart.",
      image: "https://images.unsplash.com/photo-1556157382-97eda2d62296",
    },
    {
      title: "Digital Marketing Mastery",
      description:
        "Master SEO, social media, content marketing, and ads to grow businesses online.",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0",
    },
    {
      title: "Cyber Security Fundamentals",
      description:
        "Protect networks, prevent attacks, and secure applications with hands-on training.",
      image: "https://images.unsplash.com/photo-1593720219276-c64b1a21e7f4",
    },
    {
      title: "AI & Machine Learning",
      description:
        "Dive into AI, ML algorithms, and data analysis with Python to create intelligent apps.",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
    },
    {
      title: "UI/UX Design Bootcamp",
      description:
        "Design beautiful and user-friendly websites & apps with Figma, Adobe XD, and more.",
      image: "https://images.unsplash.com/photo-1581090700227-4c4e1b4a1b4f",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800 pt-16">
      {/* Announcement */}
      <div className="fixed top-16 left-0 w-full bg-yellow-300 text-yellow-900 font-semibold px-4 py-2 shadow-md border border-yellow-500 z-40 text-center">
        <marquee>
          Note: Your profile will be visible only after you refresh the page.
          Contact us if you have questions.
        </marquee>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Find Work. Hire Talent. Build Careers.
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Join a global community of professionals connecting for success.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Link
              to="/alljobs"
              className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-100 transition"
            >
              Get Started
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                alert("You are not eligible to see freelancers");
              }}
              className="border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition"
            >
              Explore Freelancers
            </button>
          </motion.div>
        </div>
        <div className="absolute inset-0 opacity-10 bg-[url('/hero-bg-pattern.svg')] bg-cover"></div>
      </section>

      {/* Stats Section (Animated) */}
      <section className="bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 text-center gap-6">
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-3xl font-bold text-blue-600">
              {Math.floor(counts.jobs).toLocaleString()}+
            </h3>
            <p className="text-gray-600">Jobs Posted</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-3xl font-bold text-blue-600">
              {Math.floor(counts.freelancers).toLocaleString()}+
            </h3>
            <p className="text-gray-600">Freelancers</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-3xl font-bold text-blue-600">
              {Math.floor(counts.companies).toLocaleString()}+
            </h3>
            <p className="text-gray-600">Companies</p>
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">
            Latest Job Openings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <motion.div
                key={job.id}
                className="p-6 bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition"
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="text-xl font-semibold text-blue-600 mb-1">
                  {job.title}
                </h3>
                <p className="text-gray-800 font-medium">{job.company}</p>
                <div className="flex items-center text-gray-600 text-sm mt-2">
                  <FaMapMarkerAlt className="mr-1" /> {job.location}
                </div>
                <div className="flex items-center text-gray-700 font-semibold mt-1">
                  <FaMoneyBillWave className="mr-1" /> {job.salary}
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {job.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition">
                  Apply Now
                </button>
              </motion.div>
            ))}
          </div>
        </div>
        <div class="flex justify-end mt-6 mb-6">
          <button class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
            More Jobs
          </button>
        </div>
      </section>
      {/* Featured Categories */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Explore Categories
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {[
              { name: "Web Development", icon: "💻" },
              { name: "Mobile Apps", icon: "📱" },
              { name: "Data Entry", icon: "⌨️" },
              { name: "UI/UX Design", icon: "🎨" },
              { name: "Marketing", icon: "📢" },
              { name: "Content Writing", icon: "✍️" },
              { name: "Cybersecurity", icon: "🔐" },
              { name: "All Categories", icon: "🌍" },
            ].map((cat, idx) => (
              <div
                key={idx}
                className="p-5 bg-white rounded-xl shadow hover:shadow-lg transition text-center cursor-pointer"
              >
                <div className="text-4xl">{cat.icon}</div>
                <h3 className="mt-3 font-semibold">{cat.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6">
            Trusted by Leading Companies
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
            <img src="/logo1.png" alt="Company 1" className="h-10" />
            <img src="/logo2.png" alt="Company 2" className="h-10" />
            <img src="/logo3.png" alt="Company 3" className="h-10" />
            <img src="/logo4.png" alt="Company 4" className="h-10" />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
              <div className="text-blue-600 text-4xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">Create Profile</h3>
              <p className="text-gray-600">
                Sign up and tell us about your skills and experience.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
              <div className="text-green-600 text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">Find Opportunities</h3>
              <p className="text-gray-600">
                Search jobs and projects that match your profile.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
              <div className="text-purple-600 text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-2">Get Hired</h3>
              <p className="text-gray-600">
                Apply, connect, and start your career journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah M.",
                text: "This platform helped me land my dream job in just 2 weeks!",
                img: "/user1.jpg",
              },
              {
                name: "James L.",
                text: "I found amazing freelancers for my startup in days!",
                img: "/user2.jpg",
              },
              {
                name: "Priya K.",
                text: "The job alerts are a game changer for my career.",
                img: "/user3.jpg",
              },
            ].map((t, i) => (
              <div
                key={i}
                className="p-6 bg-gray-50 rounded-lg shadow hover:shadow-lg transition"
              >
                <img
                  src={t.img}
                  alt={t.name}
                  className="w-16 h-16 mx-auto rounded-full mb-4"
                />
                <p className="italic text-gray-600 mb-2">"{t.text}"</p>
                <p className="font-semibold">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            🔥 New Trainings for You
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {trainings.map((training, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition duration-300"
              >
                <img
                  src={training.image}
                  alt={training.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {training.title}
                  </h3>
                  <p className="text-gray-600 mt-2">{training.description}</p>
                  <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Enroll Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
