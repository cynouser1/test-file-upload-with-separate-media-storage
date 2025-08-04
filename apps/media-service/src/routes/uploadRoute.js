import express from "express";
import { upload, validateFileSizes } from "../middlewares/upload.js";
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Helper function to generate file URL
const generateFileUrl = (req, filename) => {
  return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
};

// Multiple files upload with any 
// router.post("/upload-media", upload.any(), (req, res) => {
router.post("/upload", upload, validateFileSizes, (req, res) => {
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
