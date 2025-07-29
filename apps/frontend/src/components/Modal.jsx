// src/components/Modal.js
import React from "react";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-black bg-opacity-50 overflow-y-auto">
      <div className="relative w-full max-w-lg sm:my-8 bg-white rounded-lg shadow-xl">
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-2xl font-bold"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        <div className="px-6 pb-6">
          {title && (
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">{title}</h2>
          )}
          <div className="text-sm sm:text-base">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
