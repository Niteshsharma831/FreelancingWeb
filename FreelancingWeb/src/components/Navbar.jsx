import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

const menuItems = {
  home: { label: "Home", path: "/" },
  internships: { label: "Internships", path: "/internships" },
  jobs: { label: "All Jobs", path: "/alljobs" },
  // jobs: [
  //   { label: "All Jobs", path: "/alljobs" },
  //   { label: "Tech Job", path: "/techjobs" },
  //   { label: "Non-tech Job", path: "/nontechjobs" },
  // ],
  // courses: [
  //   { label: "Programming", path: "/courses/programming" },
  //   { label: "Design", path: "/courses/design" },
  // ],
};

const Navbar = ({ user: propUser, onLogout }) => {
  const [user, setUser] = useState(propUser);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // ✅ Sync user from localStorage on mount or when propUser changes
  useEffect(() => {
    if (propUser) {
      setUser(propUser);
    } else {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse user from localStorage", e);
        }
      }
    }
  }, [propUser]);

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
    localStorage.removeItem("user");
    onLogout?.();
    closeMenus();
    setUser(null); // ✅ Clear local user state
  };

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={menuRef}>
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-2xl font-extrabold text-blue-600 hover:text-blue-800 transition"
            onClick={closeMenus}
          >
            <img src="/paper-plane.png" alt="logo" className="w-8 h-8" />
            <span>WorkBridge</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 font-medium text-gray-700">
            {Object.entries(menuItems).map(([menu, links]) => {
              const isArray = Array.isArray(links);
              const label = isArray ? menu : links.label;
              const path = isArray ? null : links.path;

              return (
                <div key={menu} className="relative">
                  {isArray ? (
                    <>
                      <button
                        onClick={() =>
                          setOpenDropdown(openDropdown === menu ? null : menu)
                        }
                        className="flex items-center hover:text-blue-600 transition"
                      >
                        {menu.charAt(0).toUpperCase() + menu.slice(1)}
                        {menu === "courses" && (
                          <span className="ml-1 px-1 text-xs font-bold text-white bg-orange-500 rounded animate-pulse">
                            OFFER
                          </span>
                        )}
                        <ChevronDownIcon className="ml-1 w-4 h-4" />
                      </button>
                      {openDropdown === menu && (
                        <div className="absolute mt-2 w-40 bg-white shadow-md rounded z-30 py-2">
                          {links.map(({ label, path }) => (
                            <Link
                              key={label}
                              to={path}
                              onClick={closeMenus}
                              className="block px-4 py-2 hover:bg-blue-50 transition"
                            >
                              {label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={path}
                      onClick={closeMenus}
                      className="hover:text-blue-600 transition"
                    >
                      {label}
                    </Link>
                  )}
                </div>
              );
            })}

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() =>
                  setOpenDropdown(openDropdown === "user" ? null : "user")
                }
                className="flex items-center hover:text-blue-600 transition"
              >
                {user ? `Hi, ${firstName}` : "Login / Register"}
                <ChevronDownIcon className="ml-1 w-4 h-4" />
              </button>
              {openDropdown === "user" && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded z-30 py-2">
                  {user ? (
                    <>
                      <Link
                        to="/profile"
                        onClick={closeMenus}
                        className="block px-4 py-2 hover:bg-blue-50 transition"
                      >
                        My Account
                      </Link>
                      <Link
                        to="/myjobs"
                        onClick={closeMenus}
                        className="block px-4 py-2 hover:bg-blue-50 transition"
                      >
                        My Jobs
                      </Link>
                      <button
                        onClick={handleLogoutClick}
                        className="block w-full text-left px-4 py-2 hover:bg-blue-50 transition"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/register/student"
                        onClick={closeMenus}
                        className="block px-4 py-2 hover:bg-blue-50 transition"
                      >
                        Register as Student
                      </Link>
                      <Link
                        to="/register/recruiter"
                        onClick={closeMenus}
                        className="block px-4 py-2 hover:bg-blue-50 transition"
                      >
                        Register as Employer
                      </Link>
                      <Link
                        to="/login"
                        onClick={closeMenus}
                        className="block px-4 py-2 hover:bg-blue-50 transition"
                      >
                        Login as User
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-md px-4 pt-2 pb-4 space-y-2">
          {Object.entries(menuItems).map(([key, value]) => {
            const isArray = Array.isArray(value);
            const label = isArray
              ? key.charAt(0).toUpperCase() + key.slice(1)
              : value.label;
            const path = isArray ? null : value.path;

            return isArray ? (
              <div key={key}>
                <span className="block font-semibold">{label}</span>
                <div className="pl-4">
                  {value.map((item) => (
                    <Link
                      key={item.label}
                      to={item.path}
                      onClick={closeMenus}
                      className="block py-1 text-gray-700 hover:bg-blue-50"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={key}
                to={path}
                onClick={closeMenus}
                className="block py-1 text-gray-700 hover:bg-blue-50"
              >
                {label}
              </Link>
            );
          })}

          <hr />

          {user ? (
            <>
              <Link
                to="/profile"
                onClick={closeMenus}
                className="block py-1 text-gray-700 hover:bg-blue-50"
              >
                My Account
              </Link>
              <Link
                to="/myjobs"
                onClick={closeMenus}
                className="block py-1 text-gray-700 hover:bg-blue-50"
              >
                My Jobs
              </Link>
              <button
                onClick={handleLogoutClick}
                className="block w-full text-left py-1 hover:bg-blue-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register/student"
                onClick={closeMenus}
                className="block py-1 text-gray-700 hover:bg-blue-50"
              >
                Register as Student
              </Link>
              <Link
                to="/register/recruiter"
                onClick={closeMenus}
                className="block py-1 text-gray-700 hover:bg-blue-50"
              >
                Register as Employer
              </Link>
              <Link
                to="/login"
                onClick={closeMenus}
                className="block py-1 text-gray-700 hover:bg-blue-50"
              >
                Login as User
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
