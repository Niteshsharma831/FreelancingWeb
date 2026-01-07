// import React, { useState, useEffect } from "react";
// import {
//   NavLink,
//   Routes,
//   Route,
//   useNavigate,
//   useLocation,
// } from "react-router-dom";
// import {
//   Menu,
//   X,
//   LayoutDashboard,
//   Briefcase,
//   FileText,
//   Users,
//   LogOut,
//   Bell,
//   User,
//   Settings,
//   HelpCircle,
//   ChevronRight,
//   Search,
//   Eye,
//   CheckCircle,
//   Zap,
//   TrendingUp,
//   MessageSquare,
//   Calendar,
//   DollarSign,
//   FileCheck,
//   Target,
// } from "lucide-react";
// import PostJobPage from "./PostJobPage";
// import ManageJobsPage from "./ManageJobsPage";
// import ApplicationsPage from "./ApplicationsPage";
// import DashboardOverview from "./DashboardOverview";
// import EditJobPage from "./EditJobPage";

// const FreelancerDashboard = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [notificationsOpen, setNotificationsOpen] = useState(false);
//   const [userMenuOpen, setUserMenuOpen] = useState(false);

//   // 🚫 Protect Route on Load - CHECK FOR FREELANCER TOKEN
//   useEffect(() => {
//     const freelancerToken = localStorage.getItem("freelancer_token");

//     // Check for freelancer token specifically
//     if (!freelancerToken) {
//       navigate("/freelancer-auth", { replace: true });
//       return;
//     }
//   }, [navigate]);

//   const handleLogout = () => {
//     localStorage.removeItem("freelancer_token");
//     localStorage.removeItem("freelancer_user");
//     localStorage.removeItem("freelancerId");
//     navigate("/freelancer-auth", { replace: true });
//   };

//   // Get freelancer user data
//   const freelancerUser = JSON.parse(
//     localStorage.getItem("freelancer_user") || "{}"
//   );

//   // Get user role
//   const userRole = freelancerUser.role || "Freelancer";

//   // Navigation items
//   const navItems = [
//     {
//       path: "/FreelancerDashboard/dashboard",
//       icon: <LayoutDashboard size={20} />,
//       label: "Dashboard",
//       color: "text-blue-500",
//       bgColor: "bg-blue-100",
//       description: "Overview & Analytics",
//     },
//     {
//       path: "/FreelancerDashboard/post-job",
//       icon: <FileText size={20} />,
//       label: "Post Job",
//       color: "text-emerald-500",
//       bgColor: "bg-emerald-100",
//       badge: "New",
//       description: "Create new job",
//     },
//     {
//       path: "/FreelancerDashboard/manage-jobs",
//       icon: <Briefcase size={20} />,
//       label: "Manage Jobs",
//       color: "text-purple-500",
//       bgColor: "bg-purple-100",
//       badge: "12",
//       description: "View & edit jobs",
//     },
//     {
//       path: "/FreelancerDashboard/applications",
//       icon: <Users size={20} />,
//       label: "Applications",
//       color: "text-amber-500",
//       bgColor: "bg-amber-100",
//       badge: "24",
//       description: "Manage applicants",
//     },
//   ];

//   // Quick links
//   const quickLinks = [
//     {
//       icon: <DollarSign size={18} />,
//       label: "Earnings",
//       color: "text-green-500",
//     },
//     {
//       icon: <Calendar size={18} />,
//       label: "Calendar",
//       color: "text-orange-500",
//     },
//     {
//       icon: <MessageSquare size={18} />,
//       label: "Messages",
//       color: "text-purple-500",
//     },
//     { icon: <FileCheck size={18} />, label: "Reports", color: "text-cyan-500" },
//   ];

//   // Notifications data
//   const notifications = [
//     {
//       id: 1,
//       text: "New application for Senior Developer role",
//       time: "2 min ago",
//       read: false,
//     },
//     {
//       id: 2,
//       text: "Your job post has been approved",
//       time: "1 hour ago",
//       read: true,
//     },
//     {
//       id: 3,
//       text: "Weekly summary report is ready",
//       time: "3 hours ago",
//       read: true,
//     },
//     {
//       id: 4,
//       text: "Profile verification completed",
//       time: "1 day ago",
//       read: true,
//     },
//   ];

//   // Stats data
//   const stats = [
//     {
//       label: "Active Jobs",
//       value: "12",
//       change: "+2",
//       icon: <Briefcase className="text-blue-600" size={20} />,
//     },
//     {
//       label: "Applications",
//       value: "156",
//       change: "+24",
//       icon: <Users className="text-emerald-600" size={20} />,
//     },
//     {
//       label: "Interviews",
//       value: "8",
//       change: "+3",
//       icon: <MessageSquare className="text-purple-600" size={20} />,
//     },
//     {
//       label: "Hired",
//       value: "4",
//       change: "+1",
//       icon: <CheckCircle className="text-amber-600" size={20} />,
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Mobile Sidebar Backdrop */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Sidebar - Fixed full height */}
//       <aside
//         className={`
//         fixed md:fixed
//         top-0 left-0 bottom-0 z-50 w-72
//         transform transition-transform duration-300 ease-in-out
//         ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
//         md:translate-x-0
//         flex flex-col
//         bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800
//         text-white
//         shadow-2xl
//       `}
//       >
//         {/* Sidebar Header */}
//         <div className="p-6 border-b border-gray-700/50">
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
//                 <Briefcase size={22} className="text-white" />
//               </div>
//               <div>
//                 <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
//                   FreelancerPro
//                 </h2>
//                 <p className="text-xs text-gray-400">Professional Suite</p>
//               </div>
//             </div>
//             <button
//               onClick={() => setSidebarOpen(false)}
//               className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 md:hidden"
//             >
//               <X size={20} />
//             </button>
//           </div>

//           {/* User Profile Card */}
//           <div className="p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl border border-gray-700/50 shadow-lg">
//             <div className="flex items-center space-x-3">
//               <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center shadow-md">
//                 <User size={20} />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="font-semibold truncate">
//                   {freelancerUser.name || "Freelancer"}
//                 </p>
//                 <p className="text-xs text-gray-400 truncate">
//                   {freelancerUser.email || "freelancer@example.com"}
//                 </p>
//                 <div className="flex items-center mt-1">
//                   <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
//                   <span className="text-xs text-gray-400 capitalize">
//                     {userRole}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Navigation - Scrollable area */}
//         <div className="flex-1 overflow-y-auto py-4 px-3">
//           <nav className="space-y-1">
//             <h3 className="px-3 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
//               Main Navigation
//             </h3>

//             {navItems.map((item) => (
//               <NavLink
//                 key={item.path}
//                 to={item.path}
//                 onClick={() => setSidebarOpen(false)}
//                 className={({ isActive }) => `
//                   group flex items-center justify-between p-3 rounded-xl transition-all duration-200
//                   ${
//                     isActive
//                       ? "bg-gradient-to-r from-blue-600/20 to-blue-700/20 border-l-4 border-blue-500 shadow-lg"
//                       : "hover:bg-gray-800/50 hover:border-l-4 hover:border-gray-700"
//                   }
//                   border-l-4 border-transparent
//                 `}
//               >
//                 {({ isActive }) => (
//                   <>
//                     <div className="flex items-center space-x-3">
//                       <div
//                         className={`
//                         p-2 rounded-lg transition-all duration-200
//                         ${
//                           isActive
//                             ? "bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg"
//                             : "bg-gray-800 group-hover:bg-gray-700"
//                         }
//                       `}
//                       >
//                         {React.cloneElement(item.icon, {
//                           size: 18,
//                           className: isActive ? "text-white" : "text-gray-300",
//                         })}
//                       </div>
//                       <div className="text-left">
//                         <p className="font-medium text-sm">{item.label}</p>
//                         <p className="text-xs text-gray-400">
//                           {item.description}
//                         </p>
//                       </div>
//                     </div>

//                     {item.badge && (
//                       <span
//                         className={`
//                         px-2 py-1 text-xs rounded-full font-semibold
//                         ${
//                           isActive
//                             ? "bg-blue-500 text-white"
//                             : "bg-gray-800 text-gray-300"
//                         }
//                       `}
//                       >
//                         {item.badge}
//                       </span>
//                     )}

//                     <ChevronRight
//                       size={16}
//                       className={`
//                         transition-transform duration-200
//                         ${
//                           isActive
//                             ? "text-blue-400"
//                             : "text-gray-500 group-hover:text-gray-300"
//                         }
//                         ${isActive ? "rotate-90" : ""}
//                       `}
//                     />
//                   </>
//                 )}
//               </NavLink>
//             ))}

//             {/* Quick Links Section */}
//             <div className="pt-6 border-t border-gray-700/50 mt-6">
//               <h3 className="px-3 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
//                 Quick Access
//               </h3>

//               <div className="space-y-1">
//                 {quickLinks.map((link, index) => (
//                   <button
//                     key={index}
//                     className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-800/50 w-full text-left transition-colors group"
//                   >
//                     <div
//                       className={`p-2 rounded-lg bg-gray-800 group-hover:bg-gray-700 ${link.color}`}
//                     >
//                       {link.icon}
//                     </div>
//                     <span className="text-sm">{link.label}</span>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Performance Section */}
//             <div className="mt-8 px-3">
//               <div className="p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl border border-gray-700/50">
//                 <div className="flex items-center space-x-2 mb-3">
//                   <TrendingUp size={16} className="text-green-400" />
//                   <span className="text-sm font-medium">Performance Score</span>
//                 </div>
//                 <div className="space-y-2">
//                   <div className="flex justify-between text-xs">
//                     <span className="text-gray-400">This Month</span>
//                     <span className="text-green-400">94%</span>
//                   </div>
//                   <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
//                     <div
//                       className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
//                       style={{ width: "94%" }}
//                     ></div>
//                   </div>
//                   <div className="flex justify-between text-xs mt-2">
//                     <span className="text-gray-400">Target: 85%</span>
//                     <span className="text-green-400">+9%</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </nav>
//         </div>

//         {/* Sidebar Footer - Fixed at bottom */}
//         <div className="p-4 border-t border-gray-700/50">
//           <div className="mb-4 p-3 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg">
//             <div className="flex items-center space-x-2">
//               <Target size={16} className="text-blue-400" />
//               <span className="text-sm font-medium">Daily Goal</span>
//             </div>
//             <div className="mt-2">
//               <div className="flex justify-between text-xs">
//                 <span className="text-gray-400">Applications Reviewed</span>
//                 <span className="text-blue-400">12/20</span>
//               </div>
//               <div className="w-full bg-gray-700 h-1.5 rounded-full mt-1">
//                 <div className="w-3/5 bg-gradient-to-r from-blue-500 to-cyan-400 h-1.5 rounded-full"></div>
//               </div>
//             </div>
//           </div>

//           <button
//             onClick={handleLogout}
//             className="flex items-center justify-center space-x-2 w-full p-3 rounded-xl
//                      bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800
//                      border border-gray-700 transition-all duration-200 group"
//           >
//             <LogOut
//               size={18}
//               className="group-hover:rotate-12 transition-transform"
//             />
//             <span className="font-medium">Logout</span>
//           </button>

//           <div className="mt-4 text-center">
//             <p className="text-xs text-gray-500">
//               © 2024 FreelancerPro • v2.1.0
//             </p>
//           </div>
//         </div>
//       </aside>

//       {/* Main Content Area - With margin for sidebar */}
//       <div className="md:ml-72 min-h-screen bg-gray-50">
//         {/* Top Header */}
//         <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-lg border-b border-gray-200/80 shadow-sm">
//           <div className="px-4 sm:px-6 lg:px-8">
//             <div className="flex items-center justify-between h-16">
//               {/* Left Section */}
//               <div className="flex items-center">
//                 <button
//                   onClick={() => setSidebarOpen(!sidebarOpen)}
//                   className="p-2 rounded-lg hover:bg-gray-100 transition-colors md:hidden"
//                 >
//                   <Menu size={24} />
//                 </button>

//                 <div className="flex items-center ml-4 md:ml-0 space-x-3">
//                   <div className="hidden sm:block p-2 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100">
//                     {navItems.find((item) => item.path === location.pathname)
//                       ?.icon || (
//                       <LayoutDashboard size={20} className="text-blue-600" />
//                     )}
//                   </div>
//                   <div>
//                     <h1 className="text-xl font-bold text-gray-900">
//                       {navItems.find((item) => item.path === location.pathname)
//                         ?.label || "Dashboard"}
//                     </h1>
//                     <p className="text-sm text-gray-600 hidden md:block">
//                       {navItems.find((item) => item.path === location.pathname)
//                         ?.description || "Manage your freelance job postings"}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Right Section */}
//               <div className="flex items-center space-x-3">
//                 {/* Search Bar */}
//                 <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-64">
//                   <Search size={18} className="text-gray-400" />
//                   <input
//                     type="text"
//                     placeholder="Search jobs, applicants..."
//                     className="ml-2 bg-transparent border-none focus:outline-none w-full text-sm"
//                   />
//                 </div>

//                 {/* Notifications */}
//                 <div className="relative">
//                   <button
//                     onClick={() => setNotificationsOpen(!notificationsOpen)}
//                     className="relative p-2.5 rounded-lg hover:bg-gray-100 transition-colors"
//                   >
//                     <Bell size={20} className="text-gray-700" />
//                     <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
//                   </button>

//                   {/* Notifications Dropdown */}
//                   {notificationsOpen && (
//                     <>
//                       <div
//                         className="fixed inset-0 z-20"
//                         onClick={() => setNotificationsOpen(false)}
//                       />
//                       <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg py-2 z-30 border border-gray-200">
//                         <div className="px-4 py-3 border-b border-gray-100">
//                           <p className="font-semibold text-gray-900">
//                             Notifications
//                           </p>
//                           <p className="text-xs text-gray-500">
//                             You have{" "}
//                             {notifications.filter((n) => !n.read).length} unread
//                           </p>
//                         </div>

//                         <div className="max-h-80 overflow-y-auto">
//                           {notifications.map((notification) => (
//                             <div
//                               key={notification.id}
//                               className={`px-4 py-3 hover:bg-gray-50 border-l-4 ${
//                                 notification.read
//                                   ? "border-transparent"
//                                   : "border-blue-500"
//                               }`}
//                             >
//                               <p className="text-sm text-gray-900">
//                                 {notification.text}
//                               </p>
//                               <p className="text-xs text-gray-500 mt-1">
//                                 {notification.time}
//                               </p>
//                             </div>
//                           ))}
//                         </div>

//                         <div className="px-4 py-2 border-t border-gray-100">
//                           <button className="text-sm text-blue-600 hover:text-blue-700">
//                             View all notifications
//                           </button>
//                         </div>
//                       </div>
//                     </>
//                   )}
//                 </div>

//                 {/* User Menu */}
//                 <div className="relative">
//                   <button
//                     onClick={() => setUserMenuOpen(!userMenuOpen)}
//                     className="flex items-center space-x-3 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
//                   >
//                     <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
//                       <span className="text-white font-semibold text-sm">
//                         {freelancerUser.name?.charAt(0) || "F"}
//                       </span>
//                     </div>
//                     <div className="hidden lg:block text-left">
//                       <p className="text-sm font-semibold text-gray-900">
//                         {freelancerUser.name || "Freelancer"}
//                       </p>
//                       <p className="text-xs text-gray-500 capitalize">
//                         {userRole} Account
//                       </p>
//                     </div>
//                     <ChevronRight
//                       size={16}
//                       className={`text-gray-500 transition-transform ${
//                         userMenuOpen ? "rotate-90" : ""
//                       }`}
//                     />
//                   </button>

//                   {/* User Dropdown */}
//                   {userMenuOpen && (
//                     <>
//                       <div
//                         className="fixed inset-0 z-20"
//                         onClick={() => setUserMenuOpen(false)}
//                       />
//                       <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 z-30 border border-gray-200">
//                         <div className="px-4 py-3 border-b border-gray-100">
//                           <p className="font-semibold text-gray-900">
//                             {freelancerUser.name || "Freelancer"}
//                           </p>
//                           <p className="text-xs text-gray-500 capitalize">
//                             {userRole}
//                           </p>
//                         </div>

//                         <button className="flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-gray-50">
//                           <User size={16} className="text-gray-500" />
//                           <span>Profile</span>
//                         </button>
//                         <button className="flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-gray-50">
//                           <Settings size={16} className="text-gray-500" />
//                           <span>Settings</span>
//                         </button>
//                         <button className="flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-gray-50">
//                           <HelpCircle size={16} className="text-gray-500" />
//                           <span>Help & Support</span>
//                         </button>

//                         <div className="border-t border-gray-100 my-1"></div>
//                         <button
//                           onClick={handleLogout}
//                           className="flex items-center space-x-3 w-full px-4 py-3 text-left text-red-600 hover:bg-red-50"
//                         >
//                           <LogOut size={16} />
//                           <span>Logout</span>
//                         </button>
//                       </div>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Main Content */}
//         <main className="p-4 sm:p-6 lg:p-8">
//           <div className="max-w-7xl mx-auto">
//             {/* Welcome Banner */}
//             <div className="mb-8 p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg text-white">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h2 className="text-2xl font-bold mb-2">
//                     Welcome back, {freelancerUser.name || userRole}! 👋
//                   </h2>
//                   <p className="text-blue-100">
//                     Here's what's happening with your job postings today.
//                   </p>
//                 </div>
//                 <Zap size={32} className="text-yellow-300" />
//               </div>
//               <div className="mt-4 flex flex-wrap gap-3">
//                 <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
//                   Active Jobs: 12
//                 </span>
//                 <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
//                   Applications: 156
//                 </span>
//                 <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
//                   Response Rate: 92%
//                 </span>
//                 <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
//                   Today's Goal: 60%
//                 </span>
//               </div>
//             </div>

//             {/* Quick Stats Grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//               {stats.map((stat, index) => (
//                 <div
//                   key={index}
//                   className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
//                 >
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm text-gray-600 font-medium">
//                         {stat.label}
//                       </p>
//                       <p className="text-2xl font-bold text-gray-900 mt-2">
//                         {stat.value}
//                       </p>
//                     </div>
//                     <div className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100">
//                       {stat.icon}
//                     </div>
//                   </div>
//                   <div className="flex items-center mt-4">
//                     <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
//                       {stat.change}
//                     </span>
//                     <span className="text-xs text-gray-500 ml-2">
//                       from last month
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Content Area */}
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[500px]">
//               <div className="p-6">
//                 <Routes>
//                   <Route path="dashboard" element={<DashboardOverview />} />
//                   <Route path="post-job" element={<PostJobPage />} />
//                   <Route path="manage-jobs" element={<ManageJobsPage />} />
//                   <Route path="applications" element={<ApplicationsPage />} />
//                   <Route path="edit-job/:id" element={<EditJobPage />} />
//                   <Route path="*" element={<DashboardOverview />} />
//                 </Routes>
//               </div>
//             </div>

//             {/* Recent Activity Section */}
//             <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
//               <div className="lg:col-span-2">
//                 <div className="bg-white rounded-xl border border-gray-200 p-6">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                     Recent Activity
//                   </h3>
//                   <div className="space-y-4">
//                     <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
//                       <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
//                         <Eye size={16} className="text-blue-600" />
//                       </div>
//                       <div>
//                         <p className="text-sm text-gray-900">
//                           New application received for Senior Developer
//                         </p>
//                         <p className="text-xs text-gray-500 mt-1">
//                           2 minutes ago
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
//                       <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
//                         <CheckCircle size={16} className="text-emerald-600" />
//                       </div>
//                       <div>
//                         <p className="text-sm text-gray-900">
//                           Job post "Frontend Engineer" published successfully
//                         </p>
//                         <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                   Quick Tips
//                 </h3>
//                 <div className="space-y-4">
//                   <div className="p-4 bg-white/70 rounded-lg">
//                     <p className="text-sm font-medium text-gray-900">
//                       🚀 Boost Visibility
//                     </p>
//                     <p className="text-xs text-gray-600 mt-1">
//                       Use specific keywords in your job titles
//                     </p>
//                   </div>
//                   <div className="p-4 bg-white/70 rounded-lg">
//                     <p className="text-sm font-medium text-gray-900">
//                       💡 Quick Responses
//                     </p>
//                     <p className="text-xs text-gray-600 mt-1">
//                       Respond to applicants within 24 hours
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Footer */}
//             <div className="mt-8 pt-6 border-t border-gray-200">
//               <div className="flex flex-col md:flex-row justify-between items-center">
//                 <p className="text-sm text-gray-600">
//                   © 2024 FreelancerPro. All rights reserved.
//                 </p>
//                 <div className="flex space-x-6 mt-4 md:mt-0">
//                   <a
//                     href="#"
//                     className="text-sm text-gray-500 hover:text-gray-700"
//                   >
//                     Privacy
//                   </a>
//                   <a
//                     href="#"
//                     className="text-sm text-gray-500 hover:text-gray-700"
//                   >
//                     Terms
//                   </a>
//                   <a
//                     href="#"
//                     className="text-sm text-gray-500 hover:text-gray-700"
//                   >
//                     Help
//                   </a>
//                   <a
//                     href="#"
//                     className="text-sm text-gray-500 hover:text-gray-700"
//                   >
//                     Contact
//                   </a>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default FreelancerDashboard;

import React, { useState, useEffect } from "react";
import {
  NavLink,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Outlet,
} from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  Briefcase,
  FileText,
  Users,
  LogOut,
  Bell,
  User,
  Settings,
  HelpCircle,
  ChevronRight,
  Search,
  Eye,
  CheckCircle,
  Zap,
  TrendingUp,
  MessageSquare,
  Calendar,
  DollarSign,
  FileCheck,
  Target,
} from "lucide-react";
import DashboardOverview from "./DashboardOverview";
import PostJobPage from "./PostJobPage";
import ManageJobsPage from "./ManageJobsPage";
import ApplicationsPage from "./ApplicationsPage";
import EditJobPage from "./EditJobPage";

const FreelancerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [freelancerUser, setFreelancerUser] = useState(null);

  // 🚫 Protect Route on Load - CHECK FOR FREELANCER TOKEN
  useEffect(() => {
    const checkFreelancerAuth = () => {
      const freelancerToken = localStorage.getItem("freelancer_token");
      const storedUser = localStorage.getItem("freelancer_user");

      if (!freelancerToken || !storedUser) {
        console.log("No freelancer token or user found, redirecting...");
        navigate("/freelancer-auth", { replace: true });
        return;
      }

      try {
        const userData = JSON.parse(storedUser);
        setFreelancerUser(userData);
      } catch (error) {
        console.error("Error parsing freelancer user data:", error);
        localStorage.removeItem("freelancer_token");
        localStorage.removeItem("freelancer_user");
        navigate("/freelancer-auth", { replace: true });
      }
    };

    checkFreelancerAuth();
  }, [navigate]);

  const handleLogout = () => {
    // Clear freelancer-specific storage
    localStorage.removeItem("freelancer_token");
    localStorage.removeItem("freelancer_user");
    localStorage.removeItem("freelancerId");

    // Optional: Clear any other freelancer-related data
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("freelancer_")) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));

    navigate("/freelancer-auth", { replace: true });
  };

  // Get user role
  const userRole = freelancerUser?.role || "Freelancer";

  // Navigation items
  const navItems = [
    {
      path: "/FreelancerDashboard/dashboard",
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
      color: "text-blue-500",
      bgColor: "bg-blue-100",
      description: "Overview & Analytics",
    },
    {
      path: "/FreelancerDashboard/post-job",
      icon: <FileText size={20} />,
      label: "Post Job",
      color: "text-emerald-500",
      bgColor: "bg-emerald-100",
      description: "Create new job",
    },
    {
      path: "/FreelancerDashboard/manage-jobs",
      icon: <Briefcase size={20} />,
      label: "Manage Jobs",
      color: "text-purple-500",
      bgColor: "bg-purple-100",
      description: "View & edit jobs",
    },
    {
      path: "/FreelancerDashboard/applications",
      icon: <Users size={20} />,
      label: "Applications",
      color: "text-amber-500",
      bgColor: "bg-amber-100",
      description: "Manage applicants",
    },
  ];

  // Get current route label
  const getCurrentRouteLabel = () => {
    const currentRoute = navItems.find((item) =>
      location.pathname.startsWith(item.path)
    );
    return currentRoute?.label || "Dashboard";
  };

  // Get current route description
  const getCurrentRouteDescription = () => {
    const currentRoute = navItems.find((item) =>
      location.pathname.startsWith(item.path)
    );
    return currentRoute?.description || "Manage your freelance job postings";
  };

  // Quick links
  const quickLinks = [
    {
      icon: <DollarSign size={18} />,
      label: "Earnings",
      color: "text-green-500",
      path: "/freelancer/earnings",
    },
    {
      icon: <Calendar size={18} />,
      label: "Calendar",
      color: "text-orange-500",
      path: "/freelancer/calendar",
    },
    {
      icon: <MessageSquare size={18} />,
      label: "Messages",
      color: "text-purple-500",
      path: "/freelancer/messages",
    },
    {
      icon: <FileCheck size={18} />,
      label: "Reports",
      color: "text-cyan-500",
      path: "/freelancer/reports",
    },
  ];

  // Notifications data
  const notifications = [
    {
      id: 1,
      text: "New application for Senior Developer role",
      time: "2 min ago",
      read: false,
    },
    {
      id: 2,
      text: "Your job post has been approved",
      time: "1 hour ago",
      read: true,
    },
    {
      id: 3,
      text: "Weekly summary report is ready",
      time: "3 hours ago",
      read: true,
    },
    {
      id: 4,
      text: "Profile verification completed",
      time: "1 day ago",
      read: true,
    },
  ];

  // Stats data
  const stats = [
    {
      label: "Active Jobs",
      value: "12",
      change: "+2",
      icon: <Briefcase className="text-blue-600" size={20} />,
    },
    {
      label: "Applications",
      value: "156",
      change: "+24",
      icon: <Users className="text-emerald-600" size={20} />,
    },
    {
      label: "Interviews",
      value: "8",
      change: "+3",
      icon: <MessageSquare className="text-purple-600" size={20} />,
    },
    {
      label: "Hired",
      value: "4",
      change: "+1",
      icon: <CheckCircle className="text-amber-600" size={20} />,
    },
  ];

  // Loading state while checking auth
  if (!freelancerUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed md:fixed
        top-0 left-0 bottom-0 z-50 w-72
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0
        flex flex-col
        bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800
        text-white
        shadow-2xl
      `}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Briefcase size={22} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  FreelancerPro
                </h2>
                <p className="text-xs text-gray-400">Professional Suite</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 md:hidden"
            >
              <X size={20} />
            </button>
          </div>

          {/* User Profile Card */}
          <div className="p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl border border-gray-700/50 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center shadow-md">
                {freelancerUser.name?.charAt(0) || <User size={20} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">
                  {freelancerUser.name || "Freelancer"}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {freelancerUser.email || "freelancer@example.com"}
                </p>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                  <span className="text-xs text-gray-400 capitalize">
                    {userRole}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <nav className="space-y-1">
            <h3 className="px-3 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Main Navigation
            </h3>

            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `
                  group flex items-center justify-between p-3 rounded-xl transition-all duration-200
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600/20 to-blue-700/20 border-l-4 border-blue-500 shadow-lg"
                      : "hover:bg-gray-800/50 hover:border-l-4 hover:border-gray-700"
                  }
                  border-l-4 border-transparent
                `}
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center space-x-3">
                      <div
                        className={`
                        p-2 rounded-lg transition-all duration-200
                        ${
                          isActive
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg"
                            : "bg-gray-800 group-hover:bg-gray-700"
                        }
                      `}
                      >
                        {React.cloneElement(item.icon, {
                          size: 18,
                          className: isActive ? "text-white" : "text-gray-300",
                        })}
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-sm">{item.label}</p>
                        <p className="text-xs text-gray-400">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      size={16}
                      className={`
                        transition-transform duration-200
                        ${
                          isActive
                            ? "text-blue-400 rotate-90"
                            : "text-gray-500 group-hover:text-gray-300"
                        }
                      `}
                    />
                  </>
                )}
              </NavLink>
            ))}

            {/* Quick Links Section */}
            <div className="pt-6 border-t border-gray-700/50 mt-6">
              <h3 className="px-3 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Quick Access
              </h3>
              <div className="space-y-1">
                {quickLinks.map((link, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      navigate(link.path);
                      setSidebarOpen(false);
                    }}
                    className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-800/50 w-full text-left transition-colors group"
                  >
                    <div
                      className={`p-2 rounded-lg bg-gray-800 group-hover:bg-gray-700 ${link.color}`}
                    >
                      {link.icon}
                    </div>
                    <span className="text-sm">{link.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Performance Section */}
            <div className="mt-8 px-3">
              <div className="p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl border border-gray-700/50">
                <div className="flex items-center space-x-2 mb-3">
                  <TrendingUp size={16} className="text-green-400" />
                  <span className="text-sm font-medium">Performance Score</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">This Month</span>
                    <span className="text-green-400">94%</span>
                  </div>
                  <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                      style={{ width: "94%" }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs mt-2">
                    <span className="text-gray-400">Target: 85%</span>
                    <span className="text-green-400">+9%</span>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-700/50">
          <div className="mb-4 p-3 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg">
            <div className="flex items-center space-x-2">
              <Target size={16} className="text-blue-400" />
              <span className="text-sm font-medium">Daily Goal</span>
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Applications Reviewed</span>
                <span className="text-blue-400">12/20</span>
              </div>
              <div className="w-full bg-gray-700 h-1.5 rounded-full mt-1">
                <div className="w-3/5 bg-gradient-to-r from-blue-500 to-cyan-400 h-1.5 rounded-full"></div>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center space-x-2 w-full p-3 rounded-xl 
                     bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 
                     border border-gray-700 transition-all duration-200 group"
          >
            <LogOut
              size={18}
              className="group-hover:rotate-12 transition-transform"
            />
            <span className="font-medium">Logout</span>
          </button>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              © 2024 FreelancerPro • v2.1.0
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="md:ml-72 min-h-screen bg-gray-50">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-lg border-b border-gray-200/80 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Left Section */}
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors md:hidden"
                >
                  <Menu size={24} />
                </button>

                <div className="flex items-center ml-4 md:ml-0 space-x-3">
                  <div className="hidden sm:block p-2 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100">
                    {navItems.find((item) =>
                      location.pathname.startsWith(item.path)
                    )?.icon || (
                      <LayoutDashboard size={20} className="text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">
                      {getCurrentRouteLabel()}
                    </h1>
                    <p className="text-sm text-gray-600 hidden md:block">
                      {getCurrentRouteDescription()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center space-x-3">
                {/* Search Bar */}
                <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-64">
                  <Search size={18} className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search jobs, applicants..."
                    className="ml-2 bg-transparent border-none focus:outline-none w-full text-sm"
                  />
                </div>

                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="relative p-2.5 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Bell size={20} className="text-gray-700" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>

                  {/* Notifications Dropdown */}
                  {notificationsOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-20"
                        onClick={() => setNotificationsOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg py-2 z-30 border border-gray-200">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="font-semibold text-gray-900">
                            Notifications
                          </p>
                          <p className="text-xs text-gray-500">
                            You have{" "}
                            {notifications.filter((n) => !n.read).length} unread
                          </p>
                        </div>

                        <div className="max-h-80 overflow-y-auto">
                          {notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`px-4 py-3 hover:bg-gray-50 border-l-4 ${
                                notification.read
                                  ? "border-transparent"
                                  : "border-blue-500"
                              }`}
                            >
                              <p className="text-sm text-gray-900">
                                {notification.text}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {notification.time}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="px-4 py-2 border-t border-gray-100">
                          <button className="text-sm text-blue-600 hover:text-blue-700">
                            View all notifications
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-3 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
                      <span className="text-white font-semibold text-sm">
                        {freelancerUser.name?.charAt(0) || "F"}
                      </span>
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-semibold text-gray-900">
                        {freelancerUser.name || "Freelancer"}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {userRole} Account
                      </p>
                    </div>
                    <ChevronRight
                      size={16}
                      className={`text-gray-500 transition-transform ${
                        userMenuOpen ? "rotate-90" : ""
                      }`}
                    />
                  </button>

                  {/* User Dropdown */}
                  {userMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-20"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 z-30 border border-gray-200">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="font-semibold text-gray-900">
                            {freelancerUser.name || "Freelancer"}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">
                            {userRole}
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            navigate("/freelancer/profile");
                            setUserMenuOpen(false);
                          }}
                          className="flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-gray-50"
                        >
                          <User size={16} className="text-gray-500" />
                          <span>Profile</span>
                        </button>
                        <button
                          onClick={() => {
                            navigate("/freelancer/settings");
                            setUserMenuOpen(false);
                          }}
                          className="flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-gray-50"
                        >
                          <Settings size={16} className="text-gray-500" />
                          <span>Settings</span>
                        </button>
                        <button
                          onClick={() => {
                            navigate("/freelancer/help");
                            setUserMenuOpen(false);
                          }}
                          className="flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-gray-50"
                        >
                          <HelpCircle size={16} className="text-gray-500" />
                          <span>Help & Support</span>
                        </button>

                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 w-full px-4 py-3 text-left text-red-600 hover:bg-red-50"
                        >
                          <LogOut size={16} />
                          <span>Logout</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Banner - Only show on dashboard */}
            {location.pathname === "/FreelancerDashboard/dashboard" && (
              <div className="mb-8 p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      Welcome back, {freelancerUser.name || userRole}! 👋
                    </h2>
                    <p className="text-blue-100">
                      Here's what's happening with your job postings today.
                    </p>
                  </div>
                  <Zap size={32} className="text-yellow-300" />
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                    Active Jobs: 12
                  </span>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                    Applications: 156
                  </span>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                    Response Rate: 92%
                  </span>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                    Today's Goal: 60%
                  </span>
                </div>
              </div>
            )}

            {/* Quick Stats Grid - Only show on dashboard */}
            {location.pathname === "/FreelancerDashboard/dashboard" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 font-medium">
                          {stat.label}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 mt-2">
                          {stat.value}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100">
                        {stat.icon}
                      </div>
                    </div>
                    <div className="flex items-center mt-4">
                      <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                        {stat.change}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        from last month
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Content Area */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[500px]">
              <div className="p-6">
                <Routes>
                  <Route path="dashboard" element={<DashboardOverview />} />
                  <Route path="post-job" element={<PostJobPage />} />
                  <Route path="manage-jobs" element={<ManageJobsPage />} />
                  <Route path="applications" element={<ApplicationsPage />} />
                  <Route path="edit-job/:id" element={<EditJobPage />} />
                  <Route path="*" element={<DashboardOverview />} />
                </Routes>
              </div>
            </div>

            {/* Recent Activity Section - Only show on dashboard */}
            {location.pathname === "/FreelancerDashboard/dashboard" && (
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Recent Activity
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <Eye size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-900">
                            New application received for Senior Developer
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            2 minutes ago
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                          <CheckCircle size={16} className="text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-900">
                            Job post "Frontend Engineer" published successfully
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            1 hour ago
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Quick Tips
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-white/70 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">
                        🚀 Boost Visibility
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Use specific keywords in your job titles
                      </p>
                    </div>
                    <div className="p-4 bg-white/70 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">
                        💡 Quick Responses
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Respond to applicants within 24 hours
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-sm text-gray-600">
                  © 2024 FreelancerPro. All rights reserved.
                </p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                  <a
                    href="#"
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Privacy
                  </a>
                  <a
                    href="#"
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Terms
                  </a>
                  <a
                    href="#"
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Help
                  </a>
                  <a
                    href="#"
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Contact
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
