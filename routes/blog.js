import express from 'express';
import { getBlogs, getBlogBySlug, upsertBlog } from '../controllers/blogController.js';

const router = express.Router();

router.get('/', getBlogs);
router.get('/:slug', getBlogBySlug);
router.post('/', upsertBlog);

export default router;
