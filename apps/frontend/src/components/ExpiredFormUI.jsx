import React from 'react';
// import { Clock, ArrowLeft, RefreshCw } from 'lucide-react';
import { GoClock } from "react-icons/go";
import { RxArrowLeft } from "react-icons/rx";
import { useNavigate } from 'react-router-dom';

const ExpiredFormUI = () => {
    const navigate = useNavigate();
    return (
        <div className="flex items-center justify-center min-h-[60vh] px-4">
            <div className="max-w-md w-full">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                        <GoClock className="w-10 h-10 text-red-600" />
                    </div>
                </div>

                {/* Content */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Content Expired</h1>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        This form has expired and is no longer accepting responses. Please contact the administrator or check for an updated version.
                    </p>

                    {/* Error Message */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-800 text-sm font-medium">
                            This content has expired.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate("/")}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center">
                            <RxArrowLeft className="w-4 h-4 mr-2" />
                            Go Back to Home Page
                        </button>
                        {/* <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh Page
                        </button> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpiredFormUI;