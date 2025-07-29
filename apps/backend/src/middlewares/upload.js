// middleware/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Static path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "..", "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
    // cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // cb(null, unique + path.extname(file.originalname));
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error('Invalid file type. Only JPEG, PNG, and PDF are allowed.'), false);
//   }
// };

// const limits = {
//   fileSize: 5 * 1024 * 1024, // 5MB
//   files: 5 // Max 5 files per field
// };

// export const upload = multer({ storage });
export const upload = multer({
  storage,
  // fileFilter,
  // limits
}).any(); // accept any field
