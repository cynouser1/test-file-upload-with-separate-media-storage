import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "..", "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // const ext = path.extname(file.originalname);
    // cb(null, unique + path.extname(file.originalname));
    // const uniqueName = Date.now() + "-" + file.originalname;
    const uniqueName = uniqueSuffix + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
    "video/mp4",
    "audio/mpeg",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

const limits = {
  // fileSize: 5 * 1024 * 1024, // 5 MB
  fileSize: 20 * 1024 * 1024, // 20 MB
  files: 10 // Max 10 files per field
};

export const upload = multer({
  storage,
  // fileFilter,
  limits
}).any();

// Middleware to validate file size per type
// export const validateFileSizes = (req, res, next) => {
//   if (!req.files) return next();

//   const maxSizes = {
//     image: 2 * 1024 * 1024, // 2MB
//     audio: 5 * 1024 * 1024, // 5MB
//     video: 20 * 1024 * 1024, // 20MB
//   };

//   for (const file of req.files) {
//     const { mimetype, size } = file;

//     if (
//       (mimetype.startsWith("image/") && size > maxSizes.image) || // 2MB for images
//       (mimetype.startsWith("audio/") && size > maxSizes.audio) || // 5MB for audio
//       (mimetype.startsWith("video/") && size > maxSizes.video) // 20MB for video
//     ) {
//       // Delete the uploaded files if any fail validation
//       req.files.forEach(f => {
//         fs.unlink(f.path, () => { });
//       });

//       return res.status(400).json({
//         message: "File size exceeds limit",
//         success: false,
//         error: `File ${file.originalname} exceeds the size limit for its type.`,
//       });
//     }
//   }
//   next();
// };

export const validateFileSizes = (req, res, next) => {
  if (!req.files || req.files.length === 0) return next();

  const maxSizes = {
    'image/': 2 * 1024 * 1024,    // 2MB
    'audio/': 5 * 1024 * 1024,    // 5MB
    'video/': 20 * 1024 * 1024,   // 20MB
    'application/': 5 * 1024 * 1024 // 5MB for other files
  };

  const invalidFiles = req.files.filter(file => {
    const fileType = Object.keys(maxSizes).find(type => 
      file.mimetype.startsWith(type)
    );
    const maxSize = fileType ? maxSizes[fileType] : maxSizes['application/'];
    return file.size > maxSize;
  });

  if (invalidFiles.length > 0) {
    // Clean up uploaded files
    req.files.forEach(file => {
      fs.unlink(file.path, () => {});
    });

    const errorDetails = invalidFiles.map(file => ({
      filename: file.originalname,
      size: `${(file.size / (1024 * 1024)).toFixed(2)}MB`,
      maxSize: `${(maxSizes[Object.keys(maxSizes).find(type => 
        file.mimetype.startsWith(type)
      ) || 'application/'] / (1024 * 1024))}MB`
    }));

    return res.status(413).json({
      success: false,
      error: 'One or more files exceed size limits',
      details: errorDetails
    });
  }

  next();
};

// export default upload;
