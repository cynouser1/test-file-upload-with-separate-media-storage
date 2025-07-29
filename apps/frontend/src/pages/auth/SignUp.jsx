import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  PiEyeThin,
  PiEyeLight,
  PiEyeSlashThin,
  PiEyeSlash,
} from "react-icons/pi";
import { toast } from "react-toastify";

import { signup } from "../../api/api";
export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // console.log("formData", formData);
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("formData", formData);
    // return;
    const res = await signup(formData);
    // console.log("res", res);
    if (res.success) {
      toast.success(res.message);
      setFormData({ name: "", email: "", password: "" });
      setTimeout(() => navigate("/auth/signin"), 2000);
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
              <h1 className="mb-2 font-semibold text-gray-800 text-4xl text-left sm:text-md">
                Sign Up
              </h1>
              <p className="text-sm text-gray-500 text-left">
                Enter your email and password to sign up!
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 text-left">
                    Full Name<span className="text-error-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="h-11 w-full overflow-hidden rounded-lg border px-4 py-2.5 border-gray-300 bg-transparent text-sm text-gray-500 transition-colors placeholder:text-gray-400 focus:outline focus:outline-sky-500 focus:shadow-md"
                    required
                  />
                </div>
                {/* <!-- Email --> */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 text-left">
                    Email<span className="text-error-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="h-11 w-full overflow-hidden rounded-lg border px-4 py-2.5 border-gray-300 bg-transparent text-sm text-gray-500 transition-colors placeholder:text-gray-400 focus:outline focus:outline-sky-500 focus:shadow-md"
                    required
                  />
                </div>
                {/* <!-- Password --> */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 text-left">
                    Password <span className="text-error-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className="h-11 w-full overflow-hidden rounded-lg border px-4 py-2.5 border-gray-300 bg-transparent text-sm text-gray-500 transition-colors placeholder:text-gray-400 focus:outline focus:outline-sky-500 focus:shadow-md"
                      required
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        // <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                        <PiEyeThin size={20} />
                      ) : (
                        // <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                        <PiEyeSlashThin size={20} />
                      )}
                    </span>
                  </div>
                </div>
                {/* <!-- Button --> */}
                <div>
                  <button
                    type="submit"
                    className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 inline-flex items-center justify-center gap-2 rounded-lg transition bg-brand-500 text-white  hover:bg-brand-600  px-4 py-3 text-sm"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </form>

            {/* OR */}
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
            {/* signin option */}
            <div className="mt-4">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 ">
                Already have an account? {""}
                <Link
                  to="/auth/signin"
                  className="text-blue-600 hover:text-blue-700 "
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
