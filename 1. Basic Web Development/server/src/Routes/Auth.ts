import express from 'express';
import { register, login, getMe, logout } from '../Controllers/auth';
import { protect } from '../Middleware/Auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/logout', logout);

export default router;