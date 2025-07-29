import React, { useState } from "react";
import Footer from "../components/Footer";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoCloseOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Headerwithprofile from "../components/header/Headerwithprofile";

const AmrutHomePage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Load Form", href: "/survey/published/6882569307bdb21bbfce214d" },
  ];

  return (
    <>
      {/* <div>AmrutHomePage</div> */}

      <div className="bg-white text-gray-800">
        {/* Header Section */}

        <header className="sticky top-0 bg-[#c0f0fd] shadow z-50">
          <div className="w-full py-2">
            <div className="container mx-auto flex items-center justify-between px-4">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-[#2c4964]">
                  Logo
                </h1>
              </div>

              {/* Nav Links - Desktop */}
              <nav className={`hidden md:flex space-x-4 items-center `}>
                {navLinks.map((link, index) =>
                  link.href.startsWith("#") ? (
                    <a
                      key={index}
                      href={link.href}
                      className="text-gray-700 hover:text-blue-600 font-medium"
                    >
                      {link.label}
                    </a>
                  ) : link?.label === "FAQs" || link?.label === "User Forum" ? (
                    <a
                      key={index}
                      href={link.href}
                      target="_blank"
                      className="text-gray-700 hover:text-blue-600 font-medium"
                    >
                      {link.label}
                    </a>
                  ) : link?.label === "Primary Survey" ? (
                    <span>
                      <a
                        key={index}
                        onClick={() => navigate(link.href)}
                        className="text-gray-700 hover:text-blue-600 font-medium cursor-pointer"
                      >
                        {link.label}
                        <sup className="text-[10px] text-yellow-600 font-semibold bg-yellow-100 px-1 py-0.5 rounded">
                          BETA
                        </sup>
                      </a>
                    </span>
                  ) : (
                    <a
                      key={index}
                      onClick={() => navigate(link.href)}
                      className="text-gray-700 hover:text-blue-600 font-medium cursor-pointer"
                    >
                      {link.label}
                    </a>
                  )
                )}
              </nav>

              {/* Hamburger Toggle Button - Mobile */}
              <button
                className="md:hidden text-2xl text-gray-700"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {!mobileMenuOpen ? <RxHamburgerMenu /> : <IoCloseOutline />}
              </button>
            </div>

            {/* Mobile Nav Links */}
            {mobileMenuOpen && (
              <div className="md:hidden mt-2 px-4 space-y-2">
                {navLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="block text-gray-700 hover:text-blue-600 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                  // <a
                  //   key={index}
                  //   // Conditionally add the `href` attribute only for links that are not `/` or `/survey`
                  //   href={link.href.startsWith("/") && !["/", "/survey"].includes(link.href) ? link.href : undefined}
                  //   href={link.href.startsWith("/") ? "" : link.href}
                  //   target={link.href.startsWith("http") ? "_blank" : "_self"}
                  //   className="block text-gray-700 hover:text-blue-600 font-medium cursor-pointer"
                  //   onClick={() => {
                  //     if (["/", "/survey"].includes(link.href)) {
                  //       // e.preventDefault(); // Prevent the default action (if any)
                  //       navigate(link.href);
                  //     }
                  //     // else if (link.label === "Primary Survey") {
                  //     //   navigate(link.href);
                  //     // }
                  //     // Close mobile menu on link click
                  //     setMobileMenuOpen(false)
                  //   }
                  //   }
                  // >
                  //   {link.label}
                  //   {link.label === "Primary Survey" && (<sup className="text-[10px] text-yellow-600 font-semibold bg-yellow-100 px-1 py-0.5 rounded">BETA</sup>)}
                  // </a>
                ))}
              </div>
            )}
          </div>
        </header>
        {/* <Headerwithprofile/> */}
        <div className="h-[80vh] flex items-center justify-center">
          <div>
            <h1>Home Page</h1>
            <button
              onClick={() => navigate("/survey/published/6882569307bdb21bbfce214d")}
              className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center">
              Load Form
            </button>
          </div>
        </div>

      </div>
      {/* Footer */}

      <Footer />
    </>
  );
};

export default AmrutHomePage;
