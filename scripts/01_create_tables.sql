-- GuardIQ Database Schema
-- PostgreSQL database setup for VIP verification system

-- Create database (run this manually if needed)
-- CREATE DATABASE guardiq;

-- Connect to guardiq database
\c guardiq;

-- Create VIP users table
CREATE TABLE IF NOT EXISTS vip_users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    organization VARCHAR(255) NOT NULL,
    security_clearance VARCHAR(50) NOT NULL,
    access_code VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_verified TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Indexes for performance
    CONSTRAINT vip_users_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT vip_users_phone_check CHECK (phone ~* '^\+?[1-9]\d{1,14}$')
);

-- Create verification logs table for audit trail
CREATE TABLE IF NOT EXISTS verification_logs (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    access_code VARCHAR(100),
    verification_status VARCHAR(20) NOT NULL CHECK (verification_status IN ('success', 'failed', 'blocked')),
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key reference (optional, allows for orphaned logs)
    user_id INTEGER REFERENCES vip_users(id) ON DELETE SET NULL
);

-- Create security events table for monitoring
CREATE TABLE IF NOT EXISTS security_events (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    user_id INTEGER REFERENCES vip_users(id) ON DELETE CASCADE,
    email VARCHAR(255),
    description TEXT,
    severity VARCHAR(20) DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vip_users_email ON vip_users(email);
CREATE INDEX IF NOT EXISTS idx_vip_users_access_code ON vip_users(access_code);
CREATE INDEX IF NOT EXISTS idx_vip_users_active ON vip_users(is_active);
CREATE INDEX IF NOT EXISTS idx_verification_logs_email ON verification_logs(email);
CREATE INDEX IF NOT EXISTS idx_verification_logs_created_at ON verification_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON security_events(created_at);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON security_events(severity);

-- Create views for common queries
CREATE OR REPLACE VIEW active_vip_users AS
SELECT 
    id,
    full_name,
    email,
    organization,
    security_clearance,
    created_at,
    last_verified
FROM vip_users 
WHERE is_active = TRUE;

CREATE OR REPLACE VIEW recent_verifications AS
SELECT 
    vl.id,
    vl.email,
    vl.verification_status,
    vl.ip_address,
    vl.created_at,
    vu.full_name,
    vu.organization
FROM verification_logs vl
LEFT JOIN vip_users vu ON vl.email = vu.email
WHERE vl.created_at >= NOW() - INTERVAL '7 days'
ORDER BY vl.created_at DESC;

-- Add comments for documentation
COMMENT ON TABLE vip_users IS 'Stores VIP user information and access credentials';
COMMENT ON TABLE verification_logs IS 'Audit trail for all verification attempts';
COMMENT ON TABLE security_events IS 'Security monitoring and incident tracking';

COMMENT ON COLUMN vip_users.security_clearance IS 'Security clearance level (Level 1-5)';
COMMENT ON COLUMN vip_users.access_code IS 'Unique access code for VIP verification';
COMMENT ON COLUMN verification_logs.verification_status IS 'Result of verification attempt';
COMMENT ON COLUMN security_events.severity IS 'Security event severity level';
