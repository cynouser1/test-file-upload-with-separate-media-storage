// authRoutes.js
import express from 'express';
const router = express.Router();
// const { signup, login } = require('../controllers/authController');
import {  login, signup } from '../controllers/authController.js';
import { loginValidation, signupValidation } from '../middlewares/AuthValidation.js';
// import { loginValidation, signupValidation } from '../middlewares/authMiddleware.js';

router.post('/login', loginValidation, login);
// router.post('/login', login);
router.post('/signup', signupValidation, signup);

// sendMail route
// router.get('/sendMail', sendMail);

// module.exports = router;
export default router;