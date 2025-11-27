
import express from 'express';
import { getAlbums, getPhotosByAlbum, addPhoto, getGallery } from '../controllers/galleryController.js';

const router = express.Router();

router.get('/', getGallery);
router.get('/albums', getAlbums);
router.get('/photos/:album_id', getPhotosByAlbum);
router.post('/photos', addPhoto);

export default router;
