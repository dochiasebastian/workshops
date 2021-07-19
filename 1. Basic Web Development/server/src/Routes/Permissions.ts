import express from 'express';
import { createPermission, deletePermission, updatePermission, getPermissions } from '../Controllers/permissions'

const router = express.Router();

router.route('/').post(createPermission).get(getPermissions);
router.delete('/delete', deletePermission);
router.put('/update', updatePermission);

export default router;