import express from 'express';
import { create } from '../Controllers/permissions'

const router = express.Router();

router.post('/create', create);

export default router;