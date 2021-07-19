import express from 'express';
import { createPermission, deletePermission, updatePermission, getPermissions } from '../Controllers/permissions'

const router = express.Router();

router.post('/create', createPermission);
router.delete('/delete', deletePermission);
router.put('/update', updatePermission);
router.get('/', getPermissions);

export default router;