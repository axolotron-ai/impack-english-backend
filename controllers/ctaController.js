import { pool } from '../db/index.js';

// 🎯 Get active CTA button
export const getActiveCTA = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, button_name, button_link, is_active FROM cta_buttons WHERE is_active = true ORDER BY created_at DESC LIMIT 1'
    );
    
    if (result.rows.length === 0) {
      return res.json({ success: false, data: null, message: 'No active CTA found' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 🎯 Get all CTAs (for admin)
export const getAllCTAs = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cta_buttons ORDER BY created_at DESC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 🎯 Create or update CTA
export const upsertCTA = async (req, res) => {
  try {
    const { id, button_name, button_link, is_active } = req.body;

    if (!button_name || !button_link) {
      return res.status(400).json({ success: false, message: 'button_name and button_link are required' });
    }

    if (id) {
      // Update existing
      const result = await pool.query(
        'UPDATE cta_buttons SET button_name = $1, button_link = $2, is_active = $3, updated_at = NOW() WHERE id = $4 RETURNING *',
        [button_name, button_link, is_active || false, id]
      );
      return res.json({ success: true, data: result.rows[0] });
    } else {
      // Create new
      const result = await pool.query(
        'INSERT INTO cta_buttons (button_name, button_link, is_active) VALUES ($1, $2, $3) RETURNING *',
        [button_name, button_link, is_active || false]
      );
      return res.status(201).json({ success: true, data: result.rows[0] });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
