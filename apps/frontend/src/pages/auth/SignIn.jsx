import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
// import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
// import Label from "../form/Label";
// import Input from "../form/input/InputField";
// import Checkbox from "../form/input/Checkbox";
// import Button from "../ui/button/Button";
import {
  PiEyeThin,
  PiEyeLight,
  PiEyeSlashThin,
  PiEyeSlash,
} from "react-icons/pi";
import { FcGoogle } from "react-icons/fc";
import { login } from "../../api/api";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AppContext } from "../../context/AuthContext";
export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // console.log("formData login", formData);

  const { setUser, setToken } = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(formData);
    // console.log("res login", res);
    if (res.success) {
      toast.success(res.message);
      setFormData({ email: "", password: "" });
      // setTimeout(() => navigate("/"), 2000);
      // Save token and user data to localStorage
      localStorage.setItem("token", res.token);
      let user = res.user;
      delete user.password;
      localStorage.setItem("user", JSON.stringify(user));
      setToken(res.token);
      setUser(res.user);

      // Check for unsaved forms in localStorage
      const unsaved = localStorage.getItem("unsavedForms");
      if (unsaved) {
        const { url } = JSON.parse(unsaved);
        navigate(url || "/");
      } else {
        navigate("/");
      }
    } else {
      toast.error(res.message);
    }
  };


  return (
    <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row  sm:p-0">
      <div className="flex flex-col flex-1">
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <div>
            <div className="mb-5 sm:mb-8">
              <h1
                className="mb-2 font-semibold text-gray-800 text-4xl text-left sm:text-md"
                // onClick={() => navigate("/")}
              >
                Sign In
              </h1>
              <p className="text-sm text-gray-500 text-left">
                Enter your email and password to sign in!
              </p>
            </div>
            <div>
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 text-left">
                      {/* <label className="-400"> */}
                      Email <span className="text-error-500">*</span>{" "}
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="info@gmail.com"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="h-11 w-full overflow-hidden rounded-lg border px-4 py-2.5 border-gray-300 bg-transparent text-sm text-gray-500 transition-colors placeholder:text-gray-400 focus:outline focus:outline-sky-500 focus:shadow-md"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 text-left">
                      Password <span className="text-error-500">*</span>{" "}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="h-11 w-full overflow-hidden rounded-lg border px-4 py-2.5 border-gray-300 bg-transparent text-sm text-gray-500 transition-colors placeholder:text-gray-400 focus:outline focus:outline-sky-500 focus:shadow-md"
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                      >
                        {showPassword ? (
                          <>
                            {/* <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" /> */}
                            <PiEyeThin size={20} />
                            {/* <PiEyeLight /> */}
                          </>
                        ) : (
                          <>
                            {/* <EyeSlashIcon className="fill-gray-500 dark:fill-gray-400 size-5" /> */}
                            <PiEyeSlashThin size={20} />
                            {/* <PiEyeSlash /> */}
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4 " />
                      <span className="block font-normal text-gray-700 text-sm">
                        Keep me logged in
                      </span>
                    </div>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-blue-500 hover:text-blue-700 "
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 inline-flex items-center justify-center gap-2 rounded-lg transition bg-brand-500 text-white  hover:bg-brand-600  px-4 py-3 text-sm"
                    >
                      Sign in
                    </button>
                  </div>
                </div>
              </form>
              <div className="relative py-3 sm:py-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 "></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="p-2 text-gray-400 bg-white  sm:px-5 sm:py-2">
                    Or
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm font-normal text-center text-gray-700 ">
                  Don&apos;t have an account? {""}
                  <Link
                    to="/auth/signup"
                    className="text-blue-600 hover:text-blue-700 "
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
