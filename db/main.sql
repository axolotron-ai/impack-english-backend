CREATE TABLE gallery_albums (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    cover_image TEXT, -- optional thumbnail for album
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE gallery_photos (
    id SERIAL PRIMARY KEY,
    album_id INTEGER REFERENCES gallery_albums(id) ON DELETE CASCADE,
    title VARCHAR(150),
    image_url TEXT NOT NULL,
    uploaded_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(100),
    tags TEXT, -- array of tags for easy filtering
    cover_image TEXT,
    seo_title VARCHAR(160),
    seo_description VARCHAR(160),
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Create CTA Buttons table for workshop registration and other CTAs
CREATE TABLE IF NOT EXISTS cta_buttons (
    id SERIAL PRIMARY KEY,
    button_name VARCHAR(255) NOT NULL,
    button_link VARCHAR(500) NOT NULL,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on is_active for faster queries
CREATE INDEX idx_cta_buttons_active ON cta_buttons(is_active);

-- Insert sample data
INSERT INTO cta_buttons (button_name, button_link, is_active) 
VALUES ('Register for Workshop', '/workshop-registration', true);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cta_buttons_updated_at BEFORE UPDATE
    ON cta_buttons FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


