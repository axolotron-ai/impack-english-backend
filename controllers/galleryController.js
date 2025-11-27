import { pool } from '../db/index.js';

// 📸 Get all albums
export const getAlbums = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM gallery_albums ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📸 Get gallery grouped by album (for frontend DynamicGallery)
export const getGallery = async (req, res) => {
  try {
    const albumsResult = await pool.query('SELECT id, name FROM gallery_albums ORDER BY created_at DESC');
    const albums = albumsResult.rows;

    const results = await Promise.all(
      albums.map(async (album) => {
        const photosResult = await pool.query(
          'SELECT id, title, image_url, uploaded_by FROM gallery_photos WHERE album_id = $1 ORDER BY created_at DESC',
          [album.id]
        );
        const photos = photosResult.rows.map((p) => ({ img_url: p.image_url, caption: p.title }));
        return { album_name: album.name, photos };
      })
    );

    res.json({ success: true, results });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 📸 Get photos by album
export const getPhotosByAlbum = async (req, res) => {
  try {
    const { album_id } = req.params;
    const result = await pool.query('SELECT * FROM gallery_photos WHERE album_id = $1 ORDER BY created_at DESC', [album_id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📸 Add photo
export const addPhoto = async (req, res) => {
  try {
    const { album_id, title, image_url, uploaded_by } = req.body;
    const result = await pool.query(
      'INSERT INTO gallery_photos (album_id, title, image_url, uploaded_by) VALUES ($1, $2, $3, $4) RETURNING *',
      [album_id, title, image_url, uploaded_by]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
