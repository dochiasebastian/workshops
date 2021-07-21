import express from 'express';
import { createCategory, deleteCategory, updateCategory, getCategory } from '../Controllers/categories'

const router = express.Router();

router.route('/').post(createCategory).get(getCategory);
router.delete('/delete', deleteCategory);
router.put('/update', updateCategory);

export default router;