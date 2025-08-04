import React, { useState, useCallback } from 'react';
// import { ChevronLeft, ChevronRight, Upload, X, Play, Pause, MapPin, Plus, Minus } from 'lucide-react';
import { SAMPLE_SURVEY_FORM } from "../../constants/formConstants.js";
import { useNavigate, useParams } from "react-router-dom";
import { submitFormResponse } from "../../api/api";
import { ChevronLeftIcon, ChevronRightIcon, } from "@heroicons/react/24/outline";
import { IoCloudUploadOutline, IoCloseOutline, IoPlayOutline } from "react-icons/io5";
import { BsCheck2Circle } from "react-icons/bs";
import { BsPause } from "react-icons/bs";
import { PiMapPinLight } from "react-icons/pi";
import { HiOutlinePlus, HiOutlineMinus } from "react-icons/hi2";
import { toast } from 'react-toastify';
// const DynamicSurvey = ({ formConfig = SAMPLE_SURVEY_FORM }) => {

const FILE_SIZE_LIMITS = {
  IMAGE: 2 * 1024 * 1024, // 2MB
  AUDIO: 5 * 1024 * 1024, // 5MB
  VIDEO: 20 * 1024 * 1024, // 20MB
  DOCUMENT: 5 * 1024 * 1024 // 5MB
};

const getFileType = (file) => {
  if (file.type.startsWith('image/')) return 'IMAGE';
  if (file.type.startsWith('audio/')) return 'AUDIO';
  if (file.type.startsWith('video/')) return 'VIDEO';
  return 'DOCUMENT';
};

const validateFileSize = (file) => {
  const fileType = getFileType(file);
  const maxSize = FILE_SIZE_LIMITS[fileType] || FILE_SIZE_LIMITS.DOCUMENT;
  return file.size <= maxSize;
};

const getMaxSizeForType = (fileType) => {
  const type = fileType?.toUpperCase();
  return FILE_SIZE_LIMITS[type] ? FILE_SIZE_LIMITS[type] / (1024 * 1024) + 'MB' : '5MB';
};

const DynamicSurvey = ({ form, authToken, setForm }) => {
  // const [form, setForm] = useState(SAMPLE_SURVEY_FORM);
  const [currentSubFormIndex, setCurrentSubFormIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [counters, setCounters] = useState({});
  const { id } = useParams();

  const navigate = useNavigate();

  const updateFormData = useCallback((fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));

    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: null
      }));
    }
  }, [errors]);

  // Defensive checks
  if (!form?.subForms || form.subForms.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 font-medium">
        This form has no subforms defined.
      </div>
    );
  }
  // debugger;
  const currentSubForm = form?.subForms[currentSubFormIndex];
  const currentStep = currentSubForm.steps[currentStepIndex];


  console.log("formData", formData);

  const handleAddSection = () => {
    // Make deep copy of form to avoid mutating state directly
    const formCopy = JSON.parse(JSON.stringify(form));
    console.log("formCopy", formCopy);

    const stepToDuplicate = currentStep;
    if (!stepToDuplicate.repeatable) {
      console.log("Current step is not repeatable.");
      return;
    }
    console.log("stepToDuplicate", stepToDuplicate);    

    const baseName = stepToDuplicate.name.split(' - Copy')[0]; // remove any existing copy labels
    console.log("baseName", baseName);

    // 🔢 Count existing copies
    const copyCount = currentSubForm.steps.filter(step =>
        step.name.startsWith(baseName + ' - Copy')
    ).length;

    const copyNumber = copyCount + 1;
    const newName = `${baseName} - Copy ${copyNumber}`;

    const newStep = {
      ...stepToDuplicate,
      id: `${stepToDuplicate.id}_copy_${Date.now()}`,
      // name: `${stepToDuplicate.name} - Copy`,
      name: newName,
      fields: stepToDuplicate.fields.map(field => ({
        ...field,
        id: `${field.id}_copy_${Date.now()}`,
        name: `${field.name}_copy_${Date.now()}`,
      })),
    };

    // const sub = formCopy?.subForms[currentSubFormIndex];
    // console.log("sub", sub);
    const steps = formCopy?.subForms[currentSubFormIndex].steps;
    const newStepIndex = currentStepIndex + 1;

    if (newStepIndex < steps.length) {
      steps.splice(newStepIndex, 0, newStep); // Insert in-between
    } else {
      steps.push(newStep); // Add at the end
    }

    setForm(formCopy);
    // switch to new duplicated step
    setCurrentStepIndex(prev => prev + 1);
  };

  const validateCurrentStep = () => {
    const stepErrors = {};
    let isValid = true;

    currentStep.fields.forEach(field => {
      const fieldName = field.name;
      const fieldValue = formData[fieldName];

      if (field.required && (!fieldValue || fieldValue === '' ||
        (Array.isArray(fieldValue) && fieldValue.length === 0))) {
        stepErrors[fieldName] = `${field.label} is required`;
        isValid = false;
      }

      // Validate file limits for media fields
      if ((field.type === 'image' || field.type === 'audio' || field.type === 'video') && field.multipleFiles && fieldValue) {
        const files = Array.isArray(fieldValue) ? fieldValue : [fieldValue];

        if (field.limits?.min && files.length < field.limits.min) {
          stepErrors[fieldName] = `Minimum ${field.limits.min} file(s) required`;
          isValid = false;
        }

        if (field.limits?.max && files.length > field.limits.max) {
          stepErrors[fieldName] = `Maximum ${field.limits.max} file(s) allowed`;
          isValid = false;
        }
      }
    });

    setErrors(stepErrors);
    return isValid;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;

    if (currentStepIndex < currentSubForm.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else if (currentSubFormIndex < form.subForms.length - 1) {
      setCurrentSubFormIndex(prev => prev + 1);
      setCurrentStepIndex(0);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    } else if (currentSubFormIndex > 0) {
      setCurrentSubFormIndex(prev => prev - 1);
      setCurrentStepIndex(form.subForms[currentSubFormIndex - 1].steps.length - 1);
    }
  };

  // handle submit for fixed one
  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    console.log('Form Data Submitted:', formData);

    // Extract all File instances from formData
    const filesToValidate = Object.values(formData)
      .flatMap(value => {
        if (value instanceof File) return [value];
        if (Array.isArray(value) && value.every(item => item instanceof File)) return value;
        return [];
      });

    if (filesToValidate.length > 0) {
      const invalidFile = filesToValidate.find(file => !validateFileSize(file));
      console.log("invalidFile", invalidFile);

      if (invalidFile) {
        const fileType = getFileType(invalidFile);
        const maxSize = getMaxSizeForType(fileType);
        const errorMsg = `File "${invalidFile.name}" exceeds the maximum size limit of ${maxSize}`;

        console.error(errorMsg);
        toast?.error?.(errorMsg); // Optional: If using toast notifications
        // toast?.error?.("File size exceeds the maximum size limit"); // Optional: If using toast notifications
        return;
      }
    }

    const response = await submitFormResponse(id, formData, authToken);
    console.log('Form Response:', response);
    if (response.success) {
      toast.success('Form submitted successfully!');
      setIsSubmitted(true);
      setFormData({}); // Reset form data on success
    } else {
      toast.error('Error submitting form');
    }
  };

  const handleNavigation = () => {
    if (isSubmitted) {
      navigate("/");
      setTimeout(() => setIsSubmitted(false), 1000);
    }
  };

  const isFirstStep = currentSubFormIndex === 0 && currentStepIndex === 0;
  const isLastStep = currentSubFormIndex === form.subForms.length - 1 &&
    currentStepIndex === currentSubForm.steps.length - 1;

  const totalSteps = form.subForms.reduce((acc, subForm) => acc + subForm.steps.length, 0);
  const currentStepNumber = form.subForms.slice(0, currentSubFormIndex).reduce((acc, subForm) => acc + subForm.steps.length, 0) + currentStepIndex + 1;

  return (
    !isSubmitted ? (
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 animate-fade-in">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{form.name}</h1>
            {form.hint && (
              <p className="text-gray-600 text-lg">{form.hint}</p>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-600">
                Step {currentStepNumber} of {totalSteps}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round((currentStepNumber / totalSteps) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStepNumber / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Current Form and Step Info */}
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-1">{currentSubForm.name}</h2>
            <h3 className="text-lg text-gray-600 mb-2">{currentStep.name}</h3>
            {currentStep.description && (
              <p className="text-gray-500">{currentStep.description}</p>
            )}
          </div>
        </div>

        {/* Form Fields */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 animate-slide-up text-left">
          <div className="space-y-8">
            {currentStep.fields.map(field => (
              <FieldRenderer
                key={field.id}
                field={field}
                value={formData[field.name] || (field.type === 'checkbox' ? [] : '')}
                onChange={(value) => updateFormData(field.name, value)}
                error={errors[field.name]}
                counters={counters}
                setCounters={setCounters}
              />
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={isFirstStep}
              className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${isFirstStep
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md transform hover:-translate-y-0.5'
                }`}
            >
              <ChevronLeftIcon className="w-5 h-5 mr-2" />
              Previous
            </button>
            {/* add button for repetable section  */}
            {currentStep.repeatable && (
              <button
                onClick={handleAddSection}
                className="flex items-center px-6 py-3 rounded-xl font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md transform hover:-translate-y-0.5"
              >
                Add Section
              </button>
            )}

            {isLastStep ? (
              <button
                onClick={handleSubmit}
                className="flex items-center px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
                data-item-name="submit-form"
              >
                Submit Form
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                Next
                <ChevronRightIcon className="w-5 h-5 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    ) : (
      // Success UI
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl px-8 py-10 flex flex-col items-center justify-center ">
        <div className="  text-center transform transition-all duration-500 animate-fade-in">
          <div className="mb-6">
            <div className="flex justify-center mb-7">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <BsCheck2Circle className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Form Submitted Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your submission. Your response has been recorded.
            </p>
            <button
              onClick={handleNavigation}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  );
};

const FieldRenderer = ({ field, value, onChange, error, counters, setCounters }) => {
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);

  const handleFileChange = (e, field, multiple = false) => {
    const files = Array.from(e.target.files);

    // Validate each file
    const invalidFiles = files.filter(file => !validateFileSize(file));

    if (invalidFiles.length > 0) {
      const fileType = getFileType(invalidFiles[0]);
      const maxSize = getMaxSizeForType(fileType);
      toast.error(`One or more files exceed the maximum size limit of ${maxSize}`);
      // toast.error(`"${invalidFiles[0].name}" exceeds the maximum allowed size of ${maxSize}.`);
      return;
    }
    // Check file limits for multiple files
    if (multiple && field.limits) {
      if (field.limits.min && files.length < field.limits.min) {
        toast.error(`Please select at least ${field.limits.min} file`);
        return;
      }
      if (field.limits.max && files.length > field.limits.max) {
        // toast.error(`Please select no more than ${field.limits.max} file(s)`);
        toast.error(`You can upload up to ${field.limits.max} file${field.limits.max > 1 ? 's' : ''} only.`);
        return;
      }
    }

    if (multiple) {
      onChange(files);
    } else {
      onChange(files[0] || null);
    }
  };

  const getCurrentLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          setLocation(coords);
          onChange(coords);
          setLocationLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationLoading(false);
          alert('Unable to get location. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
      setLocationLoading(false);
    }
  };

  const updateCounter = (fieldName) => {
    const currentTimestamps = counters[fieldName] || [];
    const newTimestamp = new Date().toISOString(); // You can format it as needed

    const updatedTimestamps = [...currentTimestamps, newTimestamp];

    console.log("New click timestamp for", fieldName, "->", newTimestamp);

    setCounters(prev => ({ ...prev, [fieldName]: updatedTimestamps }));
    onChange(updatedTimestamps); // optional, depends on your use case
  };

  const removeFile = (index, multiple = false) => {
    if (multiple) {
      const currentFiles = Array.isArray(value) ? value : [];
      const newFiles = currentFiles.filter((_, i) => i !== index);
      onChange(newFiles.length > 0 ? newFiles : []);
    } else {
      onChange(null);
    }
  };

  const renderFilePreview = (files, multiple = false) => {
    if (!files) return null;

    const fileArray = multiple ? (Array.isArray(files) ? files : [files]) : [files];

    return (
      <div className="mt-4 flex flex-wrap gap-3">
        {fileArray.map((file, index) => {
          if (!file || typeof file === 'string') return null;

          const fileType = file.type;
          const fileUrl = URL.createObjectURL(file);

          if (fileType.startsWith('image/')) {
            return (
              <div key={index} className="relative inline-block group">
                {/* // <div key={index} className="flex flex-wrap gap-3 group"> */}
                <img
                  src={fileUrl}
                  alt="Preview"
                  // className="max-w-xs max-h-48 rounded-lg border shadow-sm"
                  className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                />
                <button
                  onClick={() => removeFile(index, multiple)}
                  // className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <IoCloseOutline className="w-4 h-4" />
                </button>
              </div>
            );
          }

          if (fileType.startsWith('audio/')) {
            return (
              <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border">
                <button
                  onClick={() => {
                    const audio = document.getElementById(`audio-${field.id}-${index}`);
                    if (audioPlaying) {
                      audio.pause();
                      setAudioPlaying(false);
                    } else {
                      audio.play();
                      setAudioPlaying(true);
                    }
                  }}
                  className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                >
                  {audioPlaying ? <BsPause className="w-4 h-4" /> : <IoPlayOutline className="w-4 h-4" />}
                </button>
                <span className="text-sm text-gray-600 flex-1">{file.name}</span>
                <button
                  onClick={() => removeFile(index, multiple)}
                  className="text-red-500 hover:text-red-600 transition-colors"
                >
                  <IoCloseOutline className="w-4 h-4" />
                </button>
                <audio
                  id={`audio-${field.id}-${index}`}
                  src={fileUrl}
                  onEnded={() => setAudioPlaying(false)}
                  className="hidden"
                />
              </div>
            );
          }

          if (fileType.startsWith('video/')) {
            return (
              <div key={index} className="relative inline-block">
                <video
                  src={fileUrl}
                  controls
                  className="max-w-xs max-h-48 rounded-lg border shadow-sm"
                />
                <button
                  onClick={() => removeFile(index, multiple)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <IoCloseOutline className="w-4 h-4" />
                </button>
              </div>
            );
          }

          return (
            <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border">
              <span className="text-sm text-gray-600 flex-1">{file.name}</span>
              <button
                onClick={() => removeFile(index, multiple)}
                className="text-red-500 hover:text-red-600 transition-colors"
              >
                <IoCloseOutline className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  const renderField = () => {
    const baseInputClasses = `w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${error ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
      }`;

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
        return (
          <input
            type={field.type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={baseInputClasses}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            rows={field.rows || 4}
            className={`${baseInputClasses} resize-vertical`}
          />
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={baseInputClasses}
          >
            <option value="">Select an option</option>
            {field.options.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-3">
            {field.options.map(option => (
              <label key={option} className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="radio"
                  name={field.name}
                  value={option}
                  checked={value === option}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 transition-colors"
                />
                <span className="text-gray-700 group-hover:text-gray-900 transition-colors">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-3">
            {field.options.map(option => (
              <label key={option} className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  value={option}
                  checked={Array.isArray(value) && value.includes(option)}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : [];
                    if (e.target.checked) {
                      onChange([...currentValues, option]);
                    } else {
                      onChange(currentValues.filter(v => v !== option));
                    }
                  }}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded transition-colors"
                />
                <span className="text-gray-700 group-hover:text-gray-900 transition-colors">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'image':
      case 'audio':
      case 'video': {
        const acceptTypes = {
          image: 'image/*',
          audio: 'audio/*',
          video: 'video/*'
        };

        const getFileCountText = () => {
          if (!field.multipleFiles) return '';

          let text = '';
          if (field.limits?.min && field.limits?.max) {
            text = `(${field.limits.min}-${field.limits.max} files)`;
          } else if (field.limits?.min) {
            text = `(min ${field.limits.min} files)`;
          } else if (field.limits?.max) {
            text = `(max ${field.limits.max} files)`;
          }
          return text;
        };

        return (
          <div>
            <div className="flex items-center justify-center w-full">
              <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer hover:bg-gray-50 transition-all duration-200 ${error ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                }`}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <IoCloudUploadOutline className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    {field.type.toUpperCase()} files only {getFileCountText()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {/* {field.type.toUpperCase()} Max size :  {FILE_SIZE_LIMITS[field.type] ? FILE_SIZE_LIMITS[field.type] / (1024 * 1024) + 'MB' : '50MB'} */}
                    {field.type.toUpperCase()} Max size :  {getMaxSizeForType(field.type)}
                  </p>
                </div>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, field, field.multipleFiles)}
                  accept={acceptTypes[field.type]}
                  multiple={field.multipleFiles}
                  className="hidden"
                />
              </label>
            </div>
            {renderFilePreview(value, field.multipleFiles)}
          </div>
        );
      }

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            min={field.limits?.min}
            max={field.limits?.max}
            step={field.limits?.decimalPlaces ? `0.${'0'.repeat(field.limits.decimalPlaces - 1)}1` : '1'}
            className={baseInputClasses}
          />
        );

      case 'date':
        if (field.isDateRange) {
          return (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">From Date</label>
                <input
                  type="date"
                  value={value?.from || ''}
                  onChange={(e) => onChange({ ...value, from: e.target.value })}
                  min={field.limits?.min}
                  max={field.limits?.max}
                  className={baseInputClasses}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">To Date</label>
                <input
                  type="date"
                  value={value?.to || ''}
                  onChange={(e) => onChange({ ...value, to: e.target.value })}
                  min={field.limits?.min}
                  max={field.limits?.max}
                  className={baseInputClasses}
                />
              </div>
            </div>
          );
        }
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            min={field.limits?.min}
            max={field.limits?.max}
            className={baseInputClasses}
          />
        );

      case 'geolocation':
        return (
          <div className="space-y-4">
            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={locationLoading}
              className="flex items-center px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PiMapPinLight className="w-5 h-5 mr-2" />
              {locationLoading ? 'Getting Location...' : 'Get Current Location'}
            </button>

            {(location || value) && (
              <div className="p-4 bg-gray-50 rounded-xl border">
                <p className="text-sm text-gray-600">
                  <strong>Latitude:</strong> {(location || value)?.latitude}<br />
                  <strong>Longitude:</strong> {(location || value)?.longitude}<br />
                  {(location || value)?.accuracy && (
                    <>
                      <strong>Accuracy:</strong> {(location || value).accuracy}m
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
        );

      case 'count': {
        // const currentCount = counters[field.name] || 0;
        const currentCount = counters[field.name]?.length || 0
        return (
          <div className="flex items-center space-x-4">
            {/* <button
              type="button"
              onClick={() => updateCounter(field.name, -1)}
              className="flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <HiOutlineMinus className="w-4 h-4" />
            </button> */}

            <div className="flex-1 text-center">
              <div className="text-3xl font-bold text-gray-800">{currentCount}</div>
              <div className="text-sm text-gray-500">Count</div>
            </div>

            <button
              type="button"
              // onClick={() => updateCounter(field.name, 1)}
              onClick={() => updateCounter(field.name)}
              className="flex items-center justify-center w-10 h-10 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
            >
              <HiOutlinePlus className="w-4 h-4" />
            </button>
          </div>
        );
      }

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={baseInputClasses}
          />
        );
    }
  };

  return (
    <div className="space-y-3 animate-fade-in">
      <label className="block text-sm font-semibold text-gray-700">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {field.hint && (
        <p className="text-sm text-gray-500 italic">{field.hint}</p>
      )}

      {renderField()}

      {error && (
        <p className="text-sm text-red-500 flex items-center animate-fade-in">
          <IoCloseOutline className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};

export default DynamicSurvey;