import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  UserCircleIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/solid";
import {
  BuildingOfficeIcon,
  SparklesIcon,
  MegaphoneIcon,
  UserGroupIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const menuItems = {
  home: { label: "Home", path: "/", icon: HomeIcon },
  internships: {
    label: "Internships",
    path: "/internships",
    icon: AcademicCapIcon,
  },
  jobs: { label: "All Jobs", path: "/alljobs", icon: BriefcaseIcon },
  features: { label: "Features", path: "/features", icon: SparklesIcon },
  // courses: { label: "Courses", path: "/courses", icon: MegaphoneIcon },
};

// Utility function to check user type
const checkUserType = () => {
  const regularToken = localStorage.getItem("token");
  const freelancerToken = localStorage.getItem("freelancer_token");

  if (freelancerToken) return "freelancer";
  if (regularToken) return "regular";
  return null;
};

// Get user data based on type
const getUserData = () => {
  const userType = checkUserType();

  if (userType === "freelancer") {
    const user = localStorage.getItem("freelancer_user");
    return user ? JSON.parse(user) : null;
  }

  if (userType === "regular") {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  return null;
};

const Navbar = ({ user: propUser, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(propUser);
  const [userType, setUserType] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);

  // ✅ Sync user and user type from localStorage
  useEffect(() => {
    const updateUserData = () => {
      const currentUserType = checkUserType();
      setUserType(currentUserType);

      if (propUser) {
        setUser(propUser);
      } else {
        const userData = getUserData();
        if (userData) {
          setUser(userData);
        } else {
          setUser(null);
        }
      }
    };

    updateUserData();

    // Listen for storage changes (for logout from other tabs)
    const handleStorageChange = (e) => {
      if (
        e.key === "user" ||
        e.key === "token" ||
        e.key === "freelancer_user" ||
        e.key === "freelancer_token"
      ) {
        updateUserData();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [propUser]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const firstName = useMemo(() => user?.name?.split(" ")[0] || "", [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    // Clear both types of tokens
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("freelancer_user");
    localStorage.removeItem("freelancer_token");

    // Clear all user-related localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("user_") || key.startsWith("freelancer_")) {
        localStorage.removeItem(key);
      }
    });

    onLogout?.();
    closeMenus();
    setUser(null);
    setUserType(null);

    // Navigate to home page
    navigate("/");
  };

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  const isActive = (path) => location.pathname === path;

  // Get profile link based on user type
  const getProfileLink = () => {
    if (userType === "freelancer") {
      return "/FreelancerDashboard/profile";
    }
    return "/profile";
  };

  // Get dashboard link based on user type
  const getDashboardLink = () => {
    if (userType === "freelancer") {
      return "/FreelancerDashboard/dashboard";
    }
    return "/ClientDashboard";
  };

  // Get profile completion status
  const getProfileCompletion = () => {
    if (!user) return false;

    if (userType === "freelancer") {
      return user.profileCompleted || false;
    }

    // For regular users, check if they have basic profile info
    return user?.profile?.bio && user?.profile?.skills?.length > 0;
  };

  // Don't show navbar for freelancers on their dashboard routes
  const isFreelancerDashboard = location.pathname.includes(
    "FreelancerDashboard"
  );
  if (isFreelancerDashboard) {
    return null;
  }

  return (
    <nav
      ref={menuRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100"
          : "bg-white"
      }`}
    >
      {/* Announcement Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="animate-pulse">🎉</span>
            <span>500+ New Jobs Posted This Week!</span>
          </div>
          <Link to="/alljobs" className="font-semibold hover:underline">
            Apply Now →
          </Link>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 group"
            onClick={closeMenus}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-xl">W</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                WorkBridge
              </span>
              <span className="text-xs text-gray-500 -mt-1">
                Connect • Work • Grow
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {Object.entries(menuItems).map(([key, item]) => {
              const Icon = item.icon;
              return (
                <Link
                  key={key}
                  to={item.path}
                  onClick={closeMenus}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                  {key === "courses" && (
                    <span className="ml-1 px-2 py-0.5 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-pulse">
                      NEW
                    </span>
                  )}
                </Link>
              );
            })}

            {/* CTA Button - Different for freelancers vs regular users */}
            {userType !== "freelancer" && (
              <Link
                to="/register/recruiter"
                className="ml-4 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <BuildingOfficeIcon className="w-5 h-5" />
                Post a Job
              </Link>
            )}

            {userType === "freelancer" && (
              <Link
                to="/FreelancerDashboard/dashboard"
                className="ml-4 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <ChartBarIcon className="w-5 h-5" />
                Dashboard
              </Link>
            )}

            {/* User Menu */}
            <div className="relative ml-4">
              {user ? (
                <div className="flex items-center gap-4">
                  {/* Notifications */}
                  <button className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <BellIcon className="w-6 h-6" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>

                  {/* Profile Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() =>
                        setOpenDropdown(openDropdown === "user" ? null : "user")
                      }
                      className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {firstName.charAt(0)}
                        </div>
                        {!getProfileCompletion() && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
                        )}
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900">
                          Hi, {firstName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {userType === "freelancer"
                            ? "Freelancer"
                            : user.role || "Member"}
                        </div>
                      </div>
                      <ChevronDownIcon
                        className={`w-4 h-4 text-gray-400 transition-transform ${
                          openDropdown === "user" ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {openDropdown === "user" && (
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-40 animate-fadeIn">
                        {/* Profile Status */}
                        {!getProfileCompletion() && (
                          <div className="px-4 py-3 bg-gradient-to-r from-red-50 to-orange-50 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-semibold text-gray-900">
                                Complete Your Profile
                              </div>
                              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                              70% more chances to get hired
                            </p>
                            <Link
                              to={getProfileLink()}
                              onClick={closeMenus}
                              className="mt-2 w-full px-3 py-1.5 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-semibold rounded-lg hover:shadow-md transition-all block text-center"
                            >
                              Complete Now
                            </Link>
                          </div>
                        )}

                        {/* Menu Items */}
                        <div className="py-2">
                          <Link
                            to={getProfileLink()}
                            onClick={closeMenus}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors group"
                          >
                            <UserCircleIcon className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                            <div>
                              <div className="font-medium">My Profile</div>
                              <div className="text-xs text-gray-500">
                                View and edit profile
                              </div>
                            </div>
                          </Link>

                          <Link
                            to={getDashboardLink()}
                            onClick={closeMenus}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors group"
                          >
                            <ChartBarIcon className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                            <div>
                              <div className="font-medium">Dashboard</div>
                              <div className="text-xs text-gray-500">
                                Overview and analytics
                              </div>
                            </div>
                          </Link>

                          {userType !== "freelancer" && (
                            <Link
                              to="/myjobs"
                              onClick={closeMenus}
                              className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors group"
                            >
                              <DocumentTextIcon className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                              <div>
                                <div className="font-medium">My Jobs</div>
                                <div className="text-xs text-gray-500">
                                  Applications & saved jobs
                                </div>
                              </div>
                            </Link>
                          )}

                          <div className="border-t border-gray-100 my-2"></div>

                          <button
                            onClick={handleLogoutClick}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors group"
                          >
                            <ArrowRightOnRectangleIcon className="w-5 h-5" />
                            <div className="font-medium">Logout</div>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link
                    to="/login"
                    onClick={closeMenus}
                    className="px-6 py-2.5 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300"
                  >
                    Sign In
                  </Link>
                  <div className="relative">
                    <Link
                      to="/register"
                      onClick={closeMenus}
                      className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
                    >
                      Join Free
                    </Link>
                    <div className="absolute -top-2 -right-2">
                      <Link
                        to="/freelancer-auth"
                        className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full hover:shadow-md transition-all"
                        title="For freelancers/recruiters"
                      >
                        Pro
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-4">
            {user && (
              <button className="relative p-2 text-gray-600 hover:text-blue-600">
                <BellIcon className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-7 h-7 text-gray-700" />
              ) : (
                <Bars3Icon className="w-7 h-7 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-2xl px-6 pt-6 pb-8 space-y-1 animate-slideDown">
          {/* User Info */}
          {user ? (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {firstName.charAt(0)}
                  </div>
                  {!getProfileCompletion() && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
                  )}
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">
                    Hi, {firstName}
                  </div>
                  <div className="text-sm text-gray-600">
                    {userType === "freelancer"
                      ? "Freelancer"
                      : user.email || "Member"}
                  </div>
                </div>
              </div>

              {!getProfileCompletion() && (
                <Link
                  to={getProfileLink()}
                  onClick={closeMenus}
                  className="mt-4 w-full px-4 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-xl hover:shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Complete Profile</span>
                  <span className="animate-pulse">⚡</span>
                </Link>
              )}
            </div>
          ) : (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Welcome to WorkBridge
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Join thousands finding their dream jobs
              </p>
              <div className="flex gap-3">
                <Link
                  to="/login"
                  onClick={closeMenus}
                  className="flex-1 px-4 py-2.5 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl text-center"
                >
                  Sign In
                </Link>
                <div className="flex-1 relative">
                  <Link
                    to="/register"
                    onClick={closeMenus}
                    className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl text-center block"
                  >
                    Join Free
                  </Link>
                  <Link
                    to="/freelancer-auth"
                    className="absolute -top-2 -right-2 px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full hover:shadow-md"
                  >
                    Pro
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Menu Items */}
          <div className="space-y-1">
            {Object.entries(menuItems).map(([key, item]) => {
              const Icon = item.icon;
              return (
                <Link
                  key={key}
                  to={item.path}
                  onClick={closeMenus}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-colors ${
                    isActive(item.path)
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  {item.label}
                  {key === "courses" && (
                    <span className="ml-auto px-2 py-1 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
                      NEW
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="border-t border-gray-200 my-4 pt-4">
            <h4 className="text-sm font-semibold text-gray-500 px-4 mb-2">
              Account
            </h4>

            {user ? (
              <>
                <Link
                  to={getProfileLink()}
                  onClick={closeMenus}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <UserCircleIcon className="w-5 h-5 text-gray-500" />
                  My Profile
                </Link>

                <Link
                  to={getDashboardLink()}
                  onClick={closeMenus}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <ChartBarIcon className="w-5 h-5 text-gray-500" />
                  Dashboard
                </Link>

                {userType !== "freelancer" && (
                  <Link
                    to="/myjobs"
                    onClick={closeMenus}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <DocumentTextIcon className="w-5 h-5 text-gray-500" />
                    My Jobs
                  </Link>
                )}

                <button
                  onClick={handleLogoutClick}
                  className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors rounded-xl"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                {userType !== "freelancer" && (
                  <Link
                    to="/register/recruiter"
                    onClick={closeMenus}
                    className="flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-md transition-all mb-3"
                  >
                    <BuildingOfficeIcon className="w-5 h-5" />
                    Post a Job Free
                  </Link>
                )}

                <Link
                  to="/freelancer-auth"
                  onClick={closeMenus}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl hover:shadow-md transition-all"
                >
                  <UserGroupIcon className="w-5 h-5" />
                  {userType === "freelancer"
                    ? "Freelancer Dashboard"
                    : "Become a Freelancer"}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

// CSS animations
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes slideDown {
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.2s ease-out;
  }
  
  .animate-slideDown {
    animation: slideDown 0.3s ease-out;
  }
`;

// Add styles to document head only once
if (!document.getElementById("navbar-styles")) {
  const styleElement = document.createElement("style");
  styleElement.id = "navbar-styles";
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}

export default Navbar;
