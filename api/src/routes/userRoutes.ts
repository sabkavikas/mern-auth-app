import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { signup, login, getUserProfile, updateUserProfile, downloadCSV, getUsers, deleteAccount } from "../controllers/userController";
import multer from 'multer';
import path from 'path';
import mime from 'mime-types';

const userRoutes = Router();

// Set up multer to handle file uploads
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../../public/uploads'),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now();
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + mime.extension(file.mimetype));
    },
});
const upload = multer({ storage });

// Signup route
userRoutes.post('/signup', signup);

// Login route
userRoutes.post('/login', login);

// Profile route - Protected with authMiddleware
userRoutes.get('/profile', authMiddleware, getUserProfile);

// Profile route - Protected with authMiddleware
userRoutes.get('/download', authMiddleware, downloadCSV);

// Profile update route
userRoutes.put('/profile/:id', [authMiddleware, upload.single('profilePic')], updateUserProfile);

// Get users list page from server rendering
userRoutes.get('/list',getUsers);

// Delete user account
userRoutes.delete('/account/:id', authMiddleware, deleteAccount);

export default userRoutes