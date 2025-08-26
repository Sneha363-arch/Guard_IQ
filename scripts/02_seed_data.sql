-- Seed data for GuardIQ VIP system
-- Insert sample VIP users and test data

-- Insert VIP users
INSERT INTO vip_users (full_name, email, phone, organization, security_clearance, access_code) VALUES
('John Doe', 'john.doe@trinova.com', '+1-555-0101', 'TriNova Security', 'Level 5', 'VIP2024SECURE'),
('Jane Smith', 'jane.smith@trinova.com', '+1-555-0102', 'TriNova Security', 'Level 4', 'ELITE2024GUARD'),
('Mike Johnson', 'mike.johnson@trinova.com', '+1-555-0103', 'TriNova Security', 'Level 5', 'PREMIUM2024SHIELD'),
('Sarah Wilson', 'sarah.wilson@trinova.com', '+1-555-0104', 'TriNova Security', 'Level 3', 'SECURE2024VIP'),
('David Brown', 'david.brown@trinova.com', '+1-555-0105', 'TriNova Security', 'Level 4', 'GUARDIAN2024ELITE'),
('Emily Davis', 'emily.davis@trinova.com', '+1-555-0106', 'TriNova Security', 'Level 5', 'CYBER2024SHIELD'),
('Robert Miller', 'robert.miller@trinova.com', '+1-555-0107', 'TriNova Security', 'Level 3', 'DEFENSE2024VIP'),
('Lisa Anderson', 'lisa.anderson@trinova.com', '+1-555-0108', 'TriNova Security', 'Level 4', 'PROTECT2024ELITE'),
('James Taylor', 'james.taylor@trinova.com', '+1-555-0109', 'TriNova Security', 'Level 5', 'FORTRESS2024GUARD'),
('Maria Garcia', 'maria.garcia@trinova.com', '+1-555-0110', 'TriNova Security', 'Level 4', 'SENTINEL2024VIP')
ON CONFLICT (email) DO NOTHING;

-- Insert some sample verification logs (for testing dashboard stats)
INSERT INTO verification_logs (email, access_code, verification_status, ip_address, user_agent) VALUES
('john.doe@trinova.com', 'VIP2024SECURE', 'success', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
('jane.smith@trinova.com', 'ELITE2024GUARD', 'success', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'),
('unknown@example.com', 'INVALID123', 'failed', '192.168.1.102', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'),
('mike.johnson@trinova.com', 'PREMIUM2024SHIELD', 'success', '192.168.1.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
('sarah.wilson@trinova.com', 'SECURE2024VIP', 'success', '192.168.1.104', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15');

-- Insert sample security events
INSERT INTO security_events (event_type, email, description, severity, ip_address) VALUES
('successful_verification', 'john.doe@trinova.com', 'VIP verification completed successfully', 'low', '192.168.1.100'),
('failed_verification', 'unknown@example.com', 'Failed verification attempt with invalid credentials', 'medium', '192.168.1.102'),
('multiple_failed_attempts', 'hacker@malicious.com', 'Multiple failed verification attempts detected', 'high', '10.0.0.1'),
('successful_verification', 'jane.smith@trinova.com', 'VIP verification completed successfully', 'low', '192.168.1.101'),
('account_access', 'mike.johnson@trinova.com', 'VIP account accessed successfully', 'low', '192.168.1.103');

-- Update some users with recent verification timestamps
UPDATE vip_users SET last_verified = NOW() - INTERVAL '1 hour' WHERE email = 'john.doe@trinova.com';
UPDATE vip_users SET last_verified = NOW() - INTERVAL '2 hours' WHERE email = 'jane.smith@trinova.com';
UPDATE vip_users SET last_verified = NOW() - INTERVAL '30 minutes' WHERE email = 'mike.johnson@trinova.com';
UPDATE vip_users SET last_verified = NOW() - INTERVAL '3 hours' WHERE email = 'sarah.wilson@trinova.com';

-- Display summary of inserted data
SELECT 'VIP Users Created' as summary, COUNT(*) as count FROM vip_users WHERE is_active = TRUE
UNION ALL
SELECT 'Verification Logs' as summary, COUNT(*) as count FROM verification_logs
UNION ALL
SELECT 'Security Events' as summary, COUNT(*) as count FROM security_events;

-- Display sample access codes for testing
SELECT 
    full_name,
    email,
    access_code,
    security_clearance
FROM vip_users 
WHERE is_active = TRUE 
ORDER BY security_clearance DESC, full_name;
