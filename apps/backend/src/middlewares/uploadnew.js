// middleware/upload.js
import multer from "multer";

// Configure multer to use memory storage.
// This means files are kept in memory as Buffers,
// which is suitable when immediately forwarding them to another service.
// Configure multer to use memory storage
const storage = multer.memoryStorage();

// File filter for allowed types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'video/mp4',
    'audio/mpeg'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} not allowed`), false);
  }
};

// Initialize multer with limits
const upload = multer({
  storage,
//   fileFilter,
//   limits: {
//     fileSize: 50 * 1024 * 1024, // 50MB limit
//     files: 10 // Max 10 files
//   }
});

export const uploadnew = upload.any();