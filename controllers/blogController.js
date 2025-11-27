import { pool } from '../db/index.js';

// 🧠 Get all published blogs
export const getBlogs = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM blogs WHERE published = true ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🧠 Get blog by slug
export const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await pool.query('SELECT * FROM blogs WHERE slug = $1', [slug]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Blog not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🧠 Add or edit blog
export const upsertBlog = async (req, res) => {
  try {
    const { title, slug, content, author, tags, cover_image, seo_title, seo_description, published } = req.body;
    const result = await pool.query(
      `INSERT INTO blogs (title, slug, content, author, tags, cover_image, seo_title, seo_description, published)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (slug)
       DO UPDATE SET title=$1, content=$3, author=$4, tags=$5, cover_image=$6, seo_title=$7, seo_description=$8, published=$9, updated_at=NOW()
       RETURNING *`,
      [title, slug, content, author, tags, cover_image, seo_title, seo_description, published]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
