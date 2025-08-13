import React from "react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";

const ClientDashboard = () => {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg hidden md:block">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-blue-600">Client Panel</h2>
        </div>
        <nav className="p-6 space-y-4">
          <a href="#" className="block text-gray-700 hover:text-blue-600">
            📝 Dashboard
          </a>
          <a href="#" className="block text-gray-700 hover:text-blue-600">
            📂 My Jobs
          </a>
          <a href="#" className="block text-gray-700 hover:text-blue-600">
            📬 Applications
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Welcome, Client!
          </h1>
          <button className="md:hidden bg-white p-2 rounded shadow">
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-lg font-semibold text-gray-700">
              Total Jobs Posted
            </h2>
            <p className="text-3xl font-bold text-blue-600 mt-2">12</p>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-lg font-semibold text-gray-700">
              Applications Received
            </h2>
            <p className="text-3xl font-bold text-green-600 mt-2">45</p>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-lg font-semibold text-gray-700">
              Active Freelancers
            </h2>
            <p className="text-3xl font-bold text-purple-600 mt-2">7</p>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          className="bg-white rounded-xl shadow p-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Applications
          </h2>
          <ul className="space-y-3">
            <li className="text-gray-700">
              ✅ John Doe applied for{" "}
              <span className="font-medium">Landing Page Design</span>
            </li>
            <li className="text-gray-700">
              ✅ Jane Smith applied for{" "}
              <span className="font-medium">Mobile App UI/UX</span>
            </li>
            <li className="text-gray-700">
              ✅ Mike Johnson applied for{" "}
              <span className="font-medium">Full Stack Development</span>
            </li>
          </ul>
        </motion.div>
      </main>
    </div>
  );
};

export default ClientDashboard;
