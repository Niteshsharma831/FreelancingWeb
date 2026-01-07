import React, { useEffect, useState } from "react";
import {
  Briefcase,
  FileText,
  Users,
  TrendingUp,
  Clock,
  DollarSign,
  Calendar,
  Award,
  Star,
  Sparkles,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboardOverview = () => {
  const navigate = useNavigate();
  const [freelancer, setFreelancer] = useState(null);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    uniqueApplicants: 0,
    activeJobs: 0,
    totalEarnings: 0,
    avgResponseTime: 0,
  });
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("freelancer_token");
    if (!token) {
      navigate("/freelancer-auth");
      return;
    }

    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    // Load freelancer data
    const freelancerData = JSON.parse(
      localStorage.getItem("freelancer_user") || "{}"
    );
    setFreelancer(freelancerData);

    // Fetch dashboard stats (you can replace this with actual API call)
    fetchDashboardStats();
  }, [navigate]);

  const fetchDashboardStats = async () => {
    try {
      // You would replace this with actual API calls
      // For now, using mock data
      const mockStats = {
        totalJobs: 5,
        totalApplications: 12,
        uniqueApplicants: 8,
        activeJobs: 3,
        totalEarnings: 4250,
        avgResponseTime: 4,
      };
      setStats(mockStats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Jobs Posted",
      value: stats.totalJobs,
      icon: Briefcase,
      color: "blue",
      change: "+2",
      description: "from last month",
    },
    {
      title: "Applications Received",
      value: stats.totalApplications,
      icon: FileText,
      color: "green",
      change: "+24%",
      description: "from last month",
    },
    {
      title: "Unique Applicants",
      value: stats.uniqueApplicants,
      icon: Users,
      color: "purple",
      change: "+8%",
      description: "from last month",
    },
    {
      title: "Active Jobs",
      value: stats.activeJobs,
      icon: TrendingUp,
      color: "orange",
      description: "last 30 days",
    },
    {
      title: "Avg Response Time",
      value: `${stats.avgResponseTime}h`,
      icon: Clock,
      color: "red",
      description: "to applications",
    },
    {
      title: "Total Earnings",
      value: `₹${stats.totalEarnings.toLocaleString()}`,
      icon: DollarSign,
      color: "emerald",
      description: "lifetime",
    },
  ];

  const recentApplications = [
    {
      id: 1,
      clientName: "John Doe",
      jobTitle: "Website Redesign",
      status: "pending",
      date: "2024-01-15",
    },
    {
      id: 2,
      clientName: "Jane Smith",
      jobTitle: "Mobile App UI",
      status: "accepted",
      date: "2024-01-14",
    },
    {
      id: 3,
      clientName: "Tech Corp",
      jobTitle: "Backend API",
      status: "reviewed",
      date: "2024-01-13",
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="text-green-500" size={16} />;
      case "rejected":
        return <XCircle className="text-red-500" size={16} />;
      case "pending":
        return <AlertCircle className="text-yellow-500" size={16} />;
      default:
        return <AlertCircle className="text-gray-500" size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl shadow h-32"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="text-yellow-500" size={24} />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {greeting}
                {freelancer?.name ? `, ${freelancer.name.split(" ")[0]}` : "!"}
              </h1>
            </div>
            <p className="text-gray-600">
              Welcome to your freelancer dashboard. Here's your performance
              overview.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
            <Calendar size={16} />
            <span>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Performance Badge */}
        {stats.totalJobs > 0 && (
          <div className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg px-4 py-2">
            <Award className="text-yellow-600" size={18} />
            <span className="text-yellow-800 font-medium">
              {stats.totalJobs > 5
                ? "Top Rated Freelancer"
                : "Active Freelancer"}
            </span>
            <Star className="text-yellow-600 ml-2" size={14} />
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-${card.color}-50`}>
                <card.icon className={`text-${card.color}-600`} size={24} />
              </div>
              {card.change && (
                <span
                  className={`text-sm font-semibold text-${card.color}-600 bg-${card.color}-50 px-3 py-1 rounded-full`}
                >
                  {card.change}
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {card.title}
            </h3>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {card.value}
            </p>
            <p className="text-sm text-gray-500">{card.description}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Applications */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Recent Applications
            </h2>
            <button
              onClick={() => navigate("/FreelancerDashboard/applications")}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View all →
            </button>
          </div>

          {recentApplications.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto text-gray-300 mb-3" size={48} />
              <p className="text-gray-500">No applications yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Applications will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentApplications.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg border border-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold">
                        {app.clientName?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {app.jobTitle}
                      </h4>
                      <p className="text-sm text-gray-500">{app.clientName}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(app.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(app.status)}
                    <span
                      className={`text-sm font-medium capitalize ${
                        app.status === "accepted"
                          ? "text-green-600"
                          : app.status === "pending"
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Performance Overview */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Performance Overview
          </h2>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Response Rate</span>
                <span className="font-bold text-green-600">98%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full w-11/12"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Job Completion</span>
                <span className="font-bold text-blue-600">92%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full w-9/12"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Client Satisfaction</span>
                <span className="font-bold text-purple-600">4.8/5</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full w-full"></div>
              </div>
            </div>
          </div>

          {/* Weekly Activity Chart */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="font-semibold text-gray-800 mb-4">
              Weekly Activity
            </h3>
            <div className="flex items-end justify-between h-32">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                (day, i) => (
                  <div key={day} className="flex flex-col items-center">
                    <div
                      className={`w-8 rounded-t-lg ${
                        i % 2 === 0 ? "bg-blue-500" : "bg-blue-300"
                      }`}
                      style={{ height: `${30 + i * 10}px` }}
                    ></div>
                    <span className="text-xs text-gray-500 mt-2">{day}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Tips */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Quick Stats */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-blue-100">Avg. Application Time</p>
              <p className="text-2xl font-bold">24 hours</p>
            </div>
            <div>
              <p className="text-sm text-blue-100">Profile Views</p>
              <p className="text-2xl font-bold">1,247</p>
            </div>
            <div>
              <p className="text-sm text-blue-100">Repeat Clients</p>
              <p className="text-2xl font-bold">12</p>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/10 rounded-xl">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Pro Tip of the Day</h3>
              <p className="text-gray-300 mb-3">
                Complete your profile with portfolio items and skills to
                increase your visibility by 40%. Freelancers with complete
                profiles receive 3x more job applications!
              </p>
              <button
                onClick={() => navigate("/profile")}
                className="px-4 py-2 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Complete Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
