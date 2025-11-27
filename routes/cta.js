import express from 'express';
import { getActiveCTA, getAllCTAs, upsertCTA } from '../controllers/ctaController.js';

const router = express.Router();

// Get active CTA button for frontend
router.get('/active', getActiveCTA);

// Get all CTAs (admin)
router.get('/', getAllCTAs);

// Create or update CTA
router.post('/', upsertCTA);

export default router;
