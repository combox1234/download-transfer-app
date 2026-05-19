-- V1__initial_schema.sql
-- AutoBackup Manager initial database schema
-- PostgreSQL 14+

-- Create UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

-- Devices table
CREATE TABLE devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_name VARCHAR(255) NOT NULL,
    device_token VARCHAR(255) NOT NULL,
    last_seen_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_devices_user_id ON devices(user_id);

-- Backup schedules table
CREATE TABLE backup_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    source_uri TEXT NOT NULL,
    destination_uri TEXT NOT NULL,
    destination_type VARCHAR(50) NOT NULL CHECK (destination_type IN ('GOOGLE_DRIVE', 'ONE_DRIVE', 'DROPBOX', 'S3', 'LOCAL')),
    trigger_hour INT NOT NULL CHECK (trigger_hour >= 0 AND trigger_hour <= 23),
    trigger_minute INT NOT NULL CHECK (trigger_minute >= 0 AND trigger_minute <= 59),
    mode VARCHAR(10) NOT NULL CHECK (mode IN ('COPY', 'MOVE')),
    file_filter TEXT,
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_backup_schedules_user_id ON backup_schedules(user_id);
CREATE INDEX idx_backup_schedules_device_id ON backup_schedules(device_id);

-- Backup runs table (execution history)
CREATE TABLE backup_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    schedule_id UUID NOT NULL REFERENCES backup_schedules(id) ON DELETE CASCADE,
    device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    started_at TIMESTAMP NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMP,
    status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'RUNNING', 'SUCCESS', 'FAILED', 'PARTIAL')),
    total_files INT NOT NULL DEFAULT 0,
    moved_files INT NOT NULL DEFAULT 0,
    failed_files INT NOT NULL DEFAULT 0,
    bytes_copied BIGINT NOT NULL DEFAULT 0,
    error_message TEXT
);

CREATE INDEX idx_backup_runs_schedule_id ON backup_runs(schedule_id);
CREATE INDEX idx_backup_runs_device_id ON backup_runs(device_id);
CREATE INDEX idx_backup_runs_status ON backup_runs(status);
CREATE INDEX idx_backup_runs_started_at ON backup_runs(started_at DESC);

-- File transfer logs table
CREATE TABLE file_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    run_id UUID NOT NULL REFERENCES backup_runs(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    source_uri TEXT NOT NULL,
    destination_uri TEXT,
    status VARCHAR(20) NOT NULL CHECK (status IN ('SUCCESS', 'FAILED', 'SKIPPED')),
    error_code VARCHAR(100),
    transferred_at TIMESTAMP
);

CREATE INDEX idx_file_logs_run_id ON file_logs(run_id);
CREATE INDEX idx_file_logs_status ON file_logs(status);

-- Failed transfers table (for retry mechanism)
CREATE TABLE failed_transfers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_log_id UUID NOT NULL REFERENCES file_logs(id) ON DELETE CASCADE,
    source_uri TEXT NOT NULL,
    destination_uri TEXT NOT NULL,
    retry_count INT NOT NULL DEFAULT 0,
    last_retry_at TIMESTAMP,
    resolved BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_failed_transfers_file_log_id ON failed_transfers(file_log_id);
CREATE INDEX idx_failed_transfers_resolved ON failed_transfers(resolved);

-- Add triggers for updated_at timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trigger_backup_schedules_updated_at BEFORE UPDATE ON backup_schedules
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
