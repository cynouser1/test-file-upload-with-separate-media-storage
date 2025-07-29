// const express = require('express');
import express from "express";
const router = express.Router();
// const User = require('../models/User');
// import User from '../models/User.js'
import { authOptional } from "../middlewares/authMiddleware.js";
import {
  // submitFormResponse,
  submitFormResponseNew,
} from "../controllers/userController.js";
import { upload } from "../middlewares/upload.js";
import { uploadnew } from "../middlewares/uploadnew.js";

// router.post('/submit-form-response/:formId', upload, authOptional, submitFormResponse);
router.post('/submit-form-response/:formId', uploadnew, authOptional, submitFormResponseNew);


export default router;
