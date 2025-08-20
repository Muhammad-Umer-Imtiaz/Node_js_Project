"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { NAV_LINKS } from "@/constants";
import { Menu, X, User, LayoutDashboard, Heart, LogOut } from "lucide-react";
import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";

const Navbar = () => {
  const [theme, setTheme] = useState("light");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filteredLinks, setFilteredLinks] = useState(NAV_LINKS);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false); // Add hydration state
  const [userProfile, setUserProfile] = useState({
    image: "",
    name: "",
  });

  useEffect(() => {
    // Set hydration flag
    setIsHydrated(true);

    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      setTheme("light");
    }

    // Check login status
    const token = localStorage.getItem("token");
    const profileImage = localStorage.getItem("userProfileImage");
    const userName = localStorage.getItem("userName");

    const loggedIn = !!token;
    setIsLoggedIn(loggedIn);
    setUserProfile({
      image: profileImage || "",
      name: userName || "",
    });

    // Filter links based on login status
    const links = loggedIn
      ? NAV_LINKS.filter(
          (link) => link.label !== "Login" && link.label !== "Signup"
        )
      : NAV_LINKS;
    setFilteredLinks(links);
  }, []);

  const [, forceUpdate] = useState(0);
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    forceUpdate((n) => n + 1);
  };

  const handleNavigation = async (link: any) => {
    if (link.key === "submit") {
      const token = localStorage.getItem("token") || "";
      console.log("Token:", token);
              window.location.href = "/submit";
      if (!token) {
        console.log("No token provided");
        window.location.href = "/login";
        return;
      }

      // First try with 'Token' authentication scheme
      try {
        console.log("trying with Token auth scheme");
        const res = await fetch(
          "https://ai-tools-backend-p3sk.onrender.com/api/check-login/",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (res.status === 200) {
          console.log("Token auth successful");
          window.location.href = "/submit";
          return;
        }

        // If first attempt fails, try with Bearer
        console.log(
          "Token auth failed with status",
          res.status,
          "- trying Bearer auth"
        );
        const bearerRes = await fetch(
          "https://ai-tools-backend-p3sk.onrender.com/api/check-login/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (bearerRes.status === 200) {
          console.log("Bearer auth successful");
          // Store the successful auth scheme for future requests
          localStorage.setItem("authScheme", "Bearer");
          window.location.href = "/submit";
        } else {
          console.log(
            "Both auth schemes failed. Bearer status:",
            bearerRes.status
          );
          window.location.href = "/login";
        }
      } catch (error) {
        console.error("API request failed:", error);
        window.location.href = "/login";
      }
    } else {
      console.log("Navigating to:", link.href);
      window.location.href = link.href;
    }
  };

  const handleUserMenuAction = (action: string) => {
    switch (action) {
      case "dashboard":
        window.location.href = "/dashboard";
        break;
      case "favorites":
        window.location.href = "/favorites";
        break;
      case "logout":
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        window.location.href = "/";
        break;
      default:
        break;
    }
  };

  const userMenuItems = [
    {
      label: "Dashboard",
      action: "dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Favorites",
      action: "favorites",
      icon: Heart,
    },
    {
      label: "Logout",
      action: "logout",
      icon: LogOut,
    },
  ];

  // Don't render navigation links until hydrated to prevent flash
  const navLinksToRender = isHydrated ? filteredLinks : [];

  return (
    <nav className="w-[100%] mx-auto flex justify-between px-4 py-5 bg-white transition-all duration-300 relative">
      {/* Logo */}
      <Link href="/" className="flex items-center justify-center gap-2">
        <Image
          src="/logo.png"
          alt="ai"
          width={50}
          height={50}
          style={{ height: "auto", width: "auto" }}
        />
        <p className="font-bold text-2xl text-[#121212]">Tools Cover</p>
      </Link>

      {/* Hamburger for Mobile */}
      <button
        className="md:hidden block"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? (
          <X size={30} color="black" />
        ) : (
          <Menu size={30} color="black" />
        )}
      </button>

      {/* Desktop Menu */}
      <div className="md:flex items-center gap-3 hidden">
        <ul className="flex gap-8 items-center font-semibold mt-2">
          {navLinksToRender.map((link) => (
            <button
              key={link.key}
              onClick={() => handleNavigation(link)}
              className={`cursor-pointer pb-1.5 transition-all
                ${
                  link.label === "Submit"
                    ? "bg-[#7d42fb] text-white px-4 py-2 rounded-full font-semibold"
                    : "text-black hover:font-bold"
                }
              `}
            >
              {link.label}
            </button>
          ))}

          {isHydrated && isLoggedIn && (
            <Popover className="relative z-20">
              <Popover.Button className="w-10 h-10 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#7d42fb] focus:ring-offset-2 overflow-hidden">
                {userProfile.image ? (
                  <Image
                    src={userProfile.image}
                    alt={userProfile.name || "User"}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      // Fallback if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      target.parentElement!.innerHTML = "U";
                      target.parentElement!.classList.add(
                        "bg-[#7d42fb]",
                        "text-white",
                        "font-bold"
                      );
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-[#7d42fb] flex items-center justify-center text-white font-bold">
                    U
                  </div>
                )}
              </Popover.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute right-0 z-10 mt-3 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {userProfile.name && (
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {userProfile.name}
                      </p>
                    </div>
                  )}
                  <div className="py-1">
                    {userMenuItems.map((item) => (
                      <button
                        key={item.action}
                        onClick={() => handleUserMenuAction(item.action)}
                        className="group flex w-full items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                      >
                        <item.icon
                          className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500"
                          aria-hidden="true"
                        />
                        {item.label}
                      </button>
                    ))}
                  </div>
                </Popover.Panel>
              </Transition>
            </Popover>
          )}
        </ul>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white flex flex-col items-start gap-4 px-4 py-4 md:hidden z-50">
          {navLinksToRender.map((link) => (
            <button
              key={link.key}
              onClick={() => {
                setMobileMenuOpen(false);
                handleNavigation(link);
              }}
              className="text-black text-left w-full"
            >
              {link.label}
            </button>
          ))}

          {/* User Menu for Mobile */}
          {isHydrated && isLoggedIn && (
            <div className="w-full border-t border-gray-200 pt-4 mt-2">
              <div className="flex items-center gap-3 mb-3">
                {userProfile.image ? (
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src={userProfile.image}
                      alt={userProfile.name || "User"}
                      width={32}
                      height={32}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        // Fallback if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        target.parentElement!.innerHTML = "U";
                        target.parentElement!.classList.add(
                          "bg-[#7d42fb]",
                          "text-white",
                          "font-bold",
                          "flex",
                          "items-center",
                          "justify-center"
                        );
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-[#7d42fb] rounded-full flex items-center justify-center text-white font-bold text-sm">
                    U
                  </div>
                )}
                <span className="text-gray-700 font-medium">
                  {userProfile.name || "User Menu"}
                </span>
              </div>
              {userMenuItems.map((item) => (
                <button
                  key={item.action}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleUserMenuAction(item.action);
                  }}
                  className="flex w-full items-center px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <item.icon
                    className="mr-3 h-4 w-4 text-gray-400"
                    aria-hidden="true"
                  />
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
