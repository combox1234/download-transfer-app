-- V2: add refresh token hash column to users
ALTER TABLE users
ADD COLUMN IF NOT EXISTS refresh_token_hash VARCHAR(255);

-- index
CREATE INDEX IF NOT EXISTS idx_users_refresh_token_hash ON users(refresh_token_hash);
