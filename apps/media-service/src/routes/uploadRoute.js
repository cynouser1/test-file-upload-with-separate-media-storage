import express from "express";
import { upload } from "../config/upload.js";
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Helper function to generate file URL
const generateFileUrl = (req, filename) => {
  return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
};

// Single file upload
// router.post("/single", upload.single("file"), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: "No file uploaded" });
//   }
//   const fileUrl = generateFileUrl(req, req.file.filename);

//   // const filePath = `/uploads/${req.file.filename}`;
//   // res.json({ path: filePath });
// const fileData = {
//   fileId: uuidv4(), // Generate unique ID for the file
//   filename: req.file.filename,
//   url: generateFileUrl(req, req.file.filename),
//   dbpath: "/uploads/" + req.file.filename,
//   originalName: req.file.originalname,
//   mimeType: req.file.mimetype,
//   size: req.file.size,
//   createdAt: new Date()
// }
//   res.status(201).json({
//     success: true,
//     fileData
//   });
// });

// Multiple files upload
// router.post("/multiple", upload.array("files", 10), (req, res) => {
//   if (!req.files || req.files.length === 0) {
//     return res.status(400).json({ error: "No files uploaded" });
//   }

//   // const filePaths = req.files.map((file) => `/uploads/${file.filename}`);
//   // res.json({ paths: filePaths });
//   const filesData = req.files.map((file) => {
//     const fileUrl = generateFileUrl(req, file.filename);
//     return {
//       url: fileUrl,
//       dbpath: "/uploads/" + file.filename,
//       fileId: uuidv4(), // Generate unique ID for the file
//       originalName: file.originalname,
//       mimeType: file.mimetype,
//       size: file.size
//     }
//   });
//   res.status(201).json({
//     success: true,
//     filesData
//   });
// });


// Multiple files upload with any 
// router.post("/upload-media", upload.any(), (req, res) => {
router.post("/upload", upload, (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  // const filePaths = req.files.map((file) => `/uploads/${file.filename}`);
  // res.json({ paths: filePaths });
  const filesData = req.files.map((file) => ({
    fileId: uuidv4(), // Generate unique ID for the file
    filename: file.filename,
    url: generateFileUrl(req, file.filename),
    dbpath: "/uploads/" + file.filename,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    createdAt: new Date()
  }));

  console.log("filesData in media-service", filesData);
  res.status(201).json({
    success: true,
    data: filesData
  });
});


// Delete file endpoint
router.delete("/:filename", (req, res) => {
  const filePath = path.join(__dirname, '../../uploads', req.params.filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(404).json({ success: false, error: "File not found" });
    }
    res.json({ success: true, message: "File deleted successfully" });
  });
});

export default router;
