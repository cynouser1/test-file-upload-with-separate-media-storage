import React from "react";
// import { Lock, LogIn, UserPlus } from 'lucide-react';
import { CiLock } from "react-icons/ci";
import { PiSignInLight } from "react-icons/pi";
import { FiUserPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const LoginRequiredUI = () => {
    const navigate = useNavigate();
    return (
        <div className="flex items-center justify-center min-h-[60vh] px-4">
            <div className="max-w-md w-full">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                        <CiLock className="w-10 h-10 text-blue-600" />
                    </div>
                </div>

                {/* Content */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Login Required
                    </h1>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        You need to be logged in to access this content. Please sign in with
                        your account or create a new one to continue.
                    </p>

                    {/* Info Message */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <p className="text-blue-800 text-sm font-medium">
                            Please authenticate to access this resource.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <button
                        onClick={() => navigate("/auth/signin")}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center">
                            <PiSignInLight className="w-4 h-4 mr-2" />
                            Sign In
                        </button>
                        <button
                        onClick={() => navigate("/auth/signup")}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center">
                            <FiUserPlus className="w-4 h-4 mr-2" />
                            Create Account
                        </button>
                    </div>

                    {/* Additional Help */}
                    {/* <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                            Having trouble?{" "}
                            <a
                                href="#"
                                className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Contact Support
                            </a>
                        </p>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default LoginRequiredUI;
