import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Briefcase,
  ClipboardList,
  UserCheck,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";

const tabs = [
  { key: "freelancers", label: "Freelancers", icon: <Users size={18} /> },
  { key: "clients", label: "Clients", icon: <UserCheck size={18} /> },
  { key: "jobs", label: "Jobs", icon: <Briefcase size={18} /> },
  {
    key: "applications",
    label: "Applications",
    icon: <ClipboardList size={18} />,
  },
];

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("freelancers");
  const [data, setData] = useState([]);
  const [counts, setCounts] = useState({
    freelancers: 0,
    clients: 0,
    jobs: 0,
    applications: 0,
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchCounts();
    fetchData();
  }, [activeTab]);

  const fetchCounts = async () => {
    try {
      const res = await fetch("/api/admin/counts");
      const result = await res.json();
      setCounts(result);
    } catch (err) {
      console.error("Error fetching counts", err);
    }
  };

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/admin/${activeTab}`);
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const renderTable = () => {
    if (!data || data.length === 0) {
      return <p className="text-gray-500 mt-4">No data found.</p>;
    }

    const keys = Object.keys(data[0]);

    return (
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-auto mt-4"
      >
        <table className="w-full text-sm border border-gray-200 shadow-md bg-white rounded-lg">
          <thead className="bg-blue-50">
            <tr>
              {keys.map((key) => (
                <th
                  key={key}
                  className="px-4 py-2 border capitalize text-gray-700"
                >
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((entry, index) => (
              <tr key={index} className="hover:bg-blue-50 transition">
                {keys.map((key) => (
                  <td key={key} className="px-4 py-2 border text-gray-600">
                    {String(entry[key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    );
  };

  const Card = ({ icon, label, count, color }) => (
    <motion.div
      className={`flex items-center justify-between p-4 rounded-xl shadow-md ${color} text-white`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <h4 className="text-lg font-medium">{label}</h4>
        <p className="text-2xl font-bold">{count}</p>
      </div>
      <div className="opacity-80">{icon}</div>
    </motion.div>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar - Large Screens */}
      <motion.aside
        className={`hidden lg:block w-64 bg-gray-900 text-white p-5`}
      >
        <div className="flex items-center gap-2 mb-8">
          <LayoutDashboard size={24} className="text-blue-400" />
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>
        <nav className="flex flex-col gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-200 ${
                activeTab === tab.key
                  ? "bg-blue-600 text-white"
                  : "text-gray-200 hover:bg-gray-800"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </motion.aside>

      {/* Sidebar - Mobile Drawer */}
      {sidebarOpen && (
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          transition={{ type: "spring", stiffness: 80 }}
          className="fixed z-50 top-0 left-0 w-64 h-full bg-gray-900 text-white p-5 shadow-lg lg:hidden"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <LayoutDashboard size={24} /> Admin Panel
            </h2>
            <X
              size={24}
              className="cursor-pointer text-white"
              onClick={() => setSidebarOpen(false)}
            />
          </div>
          <nav className="flex flex-col gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setSidebarOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-200 ${
                  activeTab === tab.key
                    ? "bg-blue-600 text-white"
                    : "text-gray-200 hover:bg-gray-800"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </motion.div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-6 relative w-full">
        {/* Mobile Menu Icon */}
        <div className="lg:hidden mb-4">
          <Menu
            size={28}
            className="text-gray-700 cursor-pointer"
            onClick={() => setSidebarOpen(true)}
          />
        </div>

        <motion.h1
          key={activeTab + "-title"}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="text-2xl font-semibold mb-6 capitalize text-gray-800"
        >
          {tabs.find((t) => t.key === activeTab)?.label} Management
        </motion.h1>

        {/* Count Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card
            label="Freelancers"
            count={counts.freelancers}
            icon={<Users size={32} />}
            color="bg-blue-500"
          />
          <Card
            label="Clients"
            count={counts.clients}
            icon={<UserCheck size={32} />}
            color="bg-green-500"
          />
          <Card
            label="Jobs"
            count={counts.jobs}
            icon={<Briefcase size={32} />}
            color="bg-indigo-500"
          />
          <Card
            label="Applications"
            count={counts.applications}
            icon={<ClipboardList size={32} />}
            color="bg-purple-500"
          />
        </div>

        {/* Data Table */}
        {renderTable()}
      </main>
    </div>
  );
};

export default SuperAdminDashboard;
