import express from 'express';
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost
} from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validatePost } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getPosts)
  .post(protect, validatePost, createPost);

router.route('/:id')
  .get(getPost)
  .put(protect, validatePost, updatePost)
  .delete(protect, deletePost);

export default router;