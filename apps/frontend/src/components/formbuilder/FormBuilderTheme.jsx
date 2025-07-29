import React from "react";
import AmrutLogo from "../../assets/img/amrut_logo.png";
import Footer from "../Footer";
// import { useNavigate } from "react-router-dom";
import Headerwithprofile from "../header/Headerwithprofile";
import { useLocation } from "react-router-dom";

// This component wraps the FormBuilder with styling that matches the AMRUT SANKALAN theme
const FormBuilderTheme = ({ children }) => {
  const { pathname } = useLocation();
  // const paths = ["/form", "/form/", "/terms", "/terms/", "/privacy", "/privacy/",];
  const paths = ["/form/template", "/form/template/", "/form/new", "/form/new/"];
  
  return (
    <div className="min-h-screen bg-sky-50">
      {/* Header similar to AMRUT SANKALAN */}

      {/* <Headert/> */}
      <Headerwithprofile />
      {/* <Header/> */}

      {/* Main content */}
      <main className="py-8 z-5">
        <div className="max-w-6xl mx-auto px-4">
          {/* {pathname === "/form/" && ( */}
          {/* {!paths.includes(pathname) && ( */}
          {paths.includes(pathname) && (
            <div className="bg-gradient-to-r from-sky-600 to-blue-700 text-white p-8 mb-8 rounded-lg shadow-sm">
              <h2 className="text-3xl font-bold mb-2">
                PRIMARY SURVERY FORM BUILDER
              </h2>
            </div>
          )}

          {/* Content section with form builder */}
          <div className="mt-8">{children}</div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default FormBuilderTheme;
