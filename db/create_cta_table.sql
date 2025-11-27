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
