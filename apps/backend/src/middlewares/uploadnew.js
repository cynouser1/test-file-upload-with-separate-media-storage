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

// Middleware to validate file size per type
export const validateFileSizes = (req, res, next) => {
  if (!req.files) return next();

  const maxSizes = {
    image: 2 * 1024 * 1024, // 2MB
    audio: 5 * 1024 * 1024, // 5MB
    video: 20 * 1024 * 1024, // 20MB
  };

  for (const file of req.files) {
    const { mimetype, size } = file;

    if (
      (mimetype.startsWith("image/") && size > maxSizes.image) || // 2MB for images
      (mimetype.startsWith("audio/") && size > maxSizes.audio) || // 5MB for audio
      (mimetype.startsWith("video/") && size > maxSizes.video) // 20MB for video
    ) {
      // Delete the uploaded files if any fail validation
      req.files.forEach(f => {
        fs.unlink(f.path, () => { });
      });

      return res.status(400).json({
        message: "File size exceeds limit",
        success: false,
        error: `File ${file.originalname} exceeds the size limit for its type.`,
      });
    }
  }
  next();
};