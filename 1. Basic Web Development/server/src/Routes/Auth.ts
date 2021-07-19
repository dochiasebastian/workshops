import express from 'express';
import { register, login, getMe, logout } from '../Controllers/auth';

const router = express.Router();

import protect from '../Middleware/Auth';

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/logout', logout);

export default router;