import express from 'express';
import { createBlog, getAllBlogs, getBlogById, deleteBlog } from '../controllers/blog.controller.js';
import { protectRoute, adminRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getAllBlogs);
router.get('/:id', getBlogById);
router.post('/', protectRoute, adminRoute, createBlog);
router.delete('/:id', protectRoute, adminRoute, deleteBlog);

export default router;