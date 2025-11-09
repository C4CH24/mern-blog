import express from 'express';
import {
  getCategories,
  createCategory
} from '../controllers/categoryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { validateCategory } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getCategories)
  .post(protect, admin, validateCategory, createCategory);

export default router;