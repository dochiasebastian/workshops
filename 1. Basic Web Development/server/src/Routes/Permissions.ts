import express from 'express';
import { createPermission, deletePermission, updatePermission, getPermissions } from '../Controllers/permissions'
import { protect } from '../Middleware/Auth';

const router = express.Router();

router.route('/').post(createPermission).get(getPermissions);
router.delete('/delete', deletePermission);
router.put('/update', protect, updatePermission);

export default router;