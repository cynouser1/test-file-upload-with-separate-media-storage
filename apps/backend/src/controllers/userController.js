import Form from "../models/Form.js";
import User from "../models/User.js";
import FormResponse from "../models/formResponse.js";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import FormDataNode from "form-data";
import { config } from "dotenv";
config();

const MEDIA_SERVICE_URL = process.env.MEDIA_SERVICE_URL || 'http://localhost:4002';

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });

    res.status(200).json({
      message: "Profile fetched Successfully",
      data: user,
      success: true,
    });
  } catch (err) {
    console.error("Get Profile Error:", err);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// submit formResponse fixed for file upload and formData handling
// export const submitFormResponse = async (req, res) => {
//   const { formId } = req.params;
//   const userId = req.user?._id || null;

//   try {
//     // Process files
//     const processedFiles = {};
//     if (req.files && req.files.length > 0) {
//       req.files.forEach((file) => {
//         if (!processedFiles[file.fieldname]) {
//           processedFiles[file.fieldname] = [];
//         }
//         processedFiles[file.fieldname].push({
//           filename: file.filename,
//           originalname: file.originalname,
//           path: file.path,
//           dbpath: `/uploads/${file.filename}`,
//           mimetype: file.mimetype,
//           size: file.size,
//         });
//       });
//     }

//     console.log("req.body inside before saving", req.body);
//     console.log("processedFiles inside before saving", processedFiles);

//     // Combine form data and file data
//     const formData = { ...req.body, ...processedFiles };

//     // Rest of your existing code...
//     const response = new FormResponse({
//       formId: formId,
//       submittedBy: userId,
//       data: formData,
//     });

//     await response.save();
//     res.status(201).json({
//       message: "Form response submitted successfully",
//       data: response,
//       success: true,
//     });
//     // ...
//   } catch (error) {
//     // Error handling
//     console.error("Submit Form Response Error:", error);
//     res.status(500).json({ message: "Server error", error, success: false });
//   }
// };


// export const submitFormResponseNew = async (req, res) => {
//   const { formId } = req.params;
//   const userId = req.user?._id || null;

//   try {
//     // req.files is an array of all uploaded files, regardless of field name
//     const filesToProcess = req.files;

//     const mediaServiceUrl = 'http://localhost:4002/api/upload-media';
//     const mediaPaths = new Map(); // Use a Map to store paths by fieldName

//     if (filesToProcess && filesToProcess.length > 0) {
//       // Process all files concurrently
//       const uploadPromises = filesToProcess.map(async (file) => {
//         const formDataForMediaService = new FormDataNode();
//         // Append the file buffer and its original name
//         formDataForMediaService.append('media', file.buffer, file.originalname);

//         try {
//           const mediaResponse = await axios.post(mediaServiceUrl, formDataForMediaService, {
//             headers: {
//               // Important: Use getHeaders() from form-data to set correct Content-Type with boundary
//               ...formDataForMediaService.getHeaders(),
//             },
//           });

//           const fileData = {
//             filePath: mediaResponse.data.filePath,
//             url: mediaResponse.data.url,
//             dbpath: mediaResponse.data.dbpath,
//             fileId: mediaResponse.data.fileId,
//             url2: fileUrl,
//             dbpath2: "/uploads/" + file.filename,
//             fileId2: uuidv4(), // Generate unique ID for the file
//             originalName: file.originalname,
//             mimeType: file.mimetype,
//             size: file.size
//           }

//           // Return the field name and the path returned by the media service
//           return { fieldName: file.fieldname, fileData };
//         } catch (mediaError) {
//           console.error(`Error uploading file ${file.originalname} to media service:`, mediaError.response?.data || mediaError.message);
//           // Return null or throw error to indicate failure for this specific file
//           return { fieldName: file.fieldname, fileData: null, error: true };
//         }
//       });

//       // Wait for all file uploads to complete
//       const results = await Promise.all(uploadPromises);

//       // Group file paths by their field name
//       results.forEach(result => {
//         if (result.filePath) {
//           if (!mediaPaths.has(result.fieldName)) {
//             mediaPaths.set(result.fieldName, []);
//           }
//           mediaPaths.get(result.fieldName).push(result.filePath);
//           // mediaPaths.get(result.fieldName).push(result.fileData);
//         }
//       });
//       console.log("results inside check to file upload", results);
//     }

//     console.log("req.body inside before saving", req.body);
//     // console.log("processedFiles inside before saving", processedFiles);
//     console.log("mediaPaths inside before saving", mediaPaths);
//     // console.log("results inside before saving", results);

//     // Combine form data and file data
//     // const formData = { ...req.body, ...processedFiles };
//     const formData = { ...req.body, ...mediaPaths };
//     console.log("formdata inside before saving", formData);

//     // Rest of your existing code...
//     const response = new FormResponse({
//       formId: formId,
//       submittedBy: userId,
//       data: formData,
//     });

//     await response.save();
//     res.status(201).json({
//       message: "Form response submitted successfully",
//       data: response,
//       success: true,
//     });
//     // ...
//   } catch (error) {
//     // Error handling
//     console.error("Submit Form Response Error:", error);
//     res.status(500).json({ message: "Server error", error, success: false });
//   }
// };

// Helper function to upload file to media service

// Define size limits
const maxFileSizes = {
  image: 2 * 1024 * 1024, // 2MB
  audio: 5 * 1024 * 1024, // 5MB
  video: 20 * 1024 * 1024, // 20MB
  default: 5 * 1024 * 1024, // fallback
};

function getFileCategory(mimetype) {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('audio/')) return 'audio';
  if (mimetype.startsWith('video/')) return 'video';
  return 'default';
}

function validateFileSizesByType(files) {
  const invalidFiles = [];

  for (let file of files) {
    const category = getFileCategory(file.mimetype);
    const maxSize = maxFileSizes[category] || maxFileSizes.default;

    if (file.size > maxSize) {
      invalidFiles.push({
        fieldname: file.fieldname,
        filename: file.originalname,
        sizeMB: (file.size / (1024 * 1024)).toFixed(2),
        maxAllowedMB: (maxSize / (1024 * 1024)).toFixed(2),
        mimetype: file.mimetype
      });
    }
  }

  return invalidFiles;
}

const uploadToMediaService = async (file) => {
  const formData = new FormDataNode();
  formData.append('media', file.buffer, {
    filename: file.originalname,
    contentType: file.mimetype
  });

  const response = await axios.post(
    `${MEDIA_SERVICE_URL}/api/upload`,
    formData,
    {
      headers: {
        ...formData.getHeaders(),
        'Content-Length': formData.getLengthSync()
      }
    }
  );

  return response.data.data; // Returns the file metadata
};

// submit formResponse fixed for file upload and formData handling and media in media-service
export const submitFormResponseNew = async (req, res) => {
  const { formId } = req.params;
  const userId = req.user?._id || null;

  try {
    // Process files if any
    const processedFiles = {};
    if (req.files && req.files.length > 0) {
      // Validate file sizes
      const invalidFiles = validateFileSizesByType(req.files);
      if (invalidFiles.length > 0) {
        return res.status(413).json({
          success: false,
          error: 'One or more files exceed size limits',
          details: invalidFiles
        });
      }

      // Group files by fieldname
      const filesByField = req.files.reduce((acc, file) => {
        if (!acc[file.fieldname]) {
          acc[file.fieldname] = [];
        }
        acc[file.fieldname].push(file);
        return acc;
      }, {});

      // Process each field's files
      for (const [fieldName, files] of Object.entries(filesByField)) {
        const uploadPromises = files.map(file => uploadToMediaService(file));
        const uploadedFiles = await Promise.all(uploadPromises);
        processedFiles[fieldName] = files.length === 1 ? uploadedFiles[0] : uploadedFiles;
      }
    }

    // Parse JSON fields in form data
    const parsedFormData = Object.entries(req.body).reduce((acc, [key, value]) => {
      try {
        acc[key] = JSON.parse(value);
      } catch (e) {
        acc[key] = value;
      }
      return acc;
    }, {});

    console.log("req.body inside before saving", req.body);
    console.log("parsedFormData inside before saving", parsedFormData);
    console.log("processedFiles inside before saving", processedFiles);
    // console.log("results inside before saving", results);

    // Combine form data and file data
    // const formData = { ...req.body, ...processedFiles };
    const formData = { ...parsedFormData, ...processedFiles };
    console.log("formdata inside before saving", formData);

    // Rest of your existing code...
    const response = new FormResponse({
      formId: formId,
      submittedBy: userId,
      data: formData,
    });

    await response.save();
    res.status(201).json({
      message: "Form response submitted successfully",
      data: response,
      success: true,
    });
    // ...
  } catch (error) {
    // Error handling
    console.error("Submit Form Response Error:", error);
    res.status(500).json({ message: "Server error", error, success: false });
  }
};
