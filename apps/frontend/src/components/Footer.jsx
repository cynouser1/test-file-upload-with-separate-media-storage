import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    // <footer className="bg-sky-100 py-4 mt-12">
    //   <div className="max-w-6xl mx-auto px-4">
    //     <div className="flex flex-col md:flex-row justify-between items-center">
    //       <p className="text-sm text-gray-600">© Copyright {new Date().getFullYear()}</p>
    //       <div className="mt-2 md:mt-0">
    //         <nav className="flex space-x-4">
    //           <a href="#" className="text-sm text-gray-600 hover:text-blue-700">Help</a>
    //           <a href="#" className="text-sm text-gray-600 hover:text-blue-700">Privacy Policy</a>
    //           <a href="#" className="text-sm text-gray-600 hover:text-blue-700">Terms</a>
    //         </nav>
    //       </div>
    //     </div>
    //     <p className="mt-2 text-center text-sm text-gray-600">Developed & Maintained by FormBuilder Team</p>
    //   </div>
    // </footer>
    <footer className="py-4 mt-5 bg-[#c0f0fd]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">
            © Copyright <b>2025</b> All Rights Reserved
          </p>
          <div className="mt-2 md:mt-0">
            <nav className="flex space-x-4">
              <span onClick={()=>navigate("/privacy")} className="text-sm text-blue-600 cursor-pointer">
                Privacy Policy
              </span>
              <span onClick={()=>navigate("/terms")} className="text-sm text-blue-600 cursor-pointer">
                Terms & Conditions
              </span>
            </nav>
          </div>
        </div>
        <p className="mt-2 text-center text-sm text-gray-600">
          Developed & Maintained by{" "}
          <a href="https://in.linkedin.com/in/dhananjaydhiman?trk=people-guest_people_search-card" className="text-blue-600">
            Dhananjay Dhiman
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
