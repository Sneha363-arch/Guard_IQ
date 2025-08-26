-- PostgreSQL functions and triggers for GuardIQ system
-- Advanced database features for security and monitoring

-- Function to log security events automatically
CREATE OR REPLACE FUNCTION log_security_event()
RETURNS TRIGGER AS $$
BEGIN
    -- Log failed verification attempts
    IF NEW.verification_status = 'failed' THEN
        INSERT INTO security_events (
            event_type, 
            email, 
            description, 
            severity, 
            ip_address
        ) VALUES (
            'failed_verification',
            NEW.email,
            'Failed VIP verification attempt',
            CASE 
                WHEN (SELECT COUNT(*) FROM verification_logs 
                      WHERE email = NEW.email 
                      AND verification_status = 'failed' 
                      AND created_at >= NOW() - INTERVAL '1 hour') >= 3 
                THEN 'high'
                ELSE 'medium'
            END,
            NEW.ip_address
        );
    END IF;
    
    -- Log successful verifications
    IF NEW.verification_status = 'success' THEN
        INSERT INTO security_events (
            event_type,
            email,
            description,
            severity,
            ip_address
        ) VALUES (
            'successful_verification',
            NEW.email,
            'VIP verification completed successfully',
            'low',
            NEW.ip_address
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic security logging
DROP TRIGGER IF EXISTS trigger_log_security_event ON verification_logs;
CREATE TRIGGER trigger_log_security_event
    AFTER INSERT ON verification_logs
    FOR EACH ROW
    EXECUTE FUNCTION log_security_event();

-- Function to check for suspicious activity
CREATE OR REPLACE FUNCTION check_suspicious_activity(user_email VARCHAR)
RETURNS TABLE(
    is_suspicious BOOLEAN,
    failed_attempts INTEGER,
    last_failure TIMESTAMP,
    risk_level VARCHAR
) AS $$
DECLARE
    failed_count INTEGER;
    last_fail TIMESTAMP;
BEGIN
    -- Count failed attempts in last hour
    SELECT COUNT(*), MAX(created_at)
    INTO failed_count, last_fail
    FROM verification_logs
    WHERE email = user_email
    AND verification_status = 'failed'
    AND created_at >= NOW() - INTERVAL '1 hour';
    
    RETURN QUERY SELECT 
        failed_count >= 3 as is_suspicious,
        failed_count as failed_attempts,
        last_fail as last_failure,
        CASE 
            WHEN failed_count >= 5 THEN 'critical'
            WHEN failed_count >= 3 THEN 'high'
            WHEN failed_count >= 1 THEN 'medium'
            ELSE 'low'
        END as risk_level;
END;
$$ LANGUAGE plpgsql;

-- Function to get VIP statistics
CREATE OR REPLACE FUNCTION get_vip_statistics()
RETURNS TABLE(
    total_vips INTEGER,
    active_vips INTEGER,
    recent_verifications INTEGER,
    failed_attempts_today INTEGER,
    high_risk_events INTEGER
) AS $$
BEGIN
    RETURN QUERY SELECT 
        (SELECT COUNT(*)::INTEGER FROM vip_users) as total_vips,
        (SELECT COUNT(*)::INTEGER FROM vip_users WHERE is_active = TRUE) as active_vips,
        (SELECT COUNT(*)::INTEGER FROM verification_logs 
         WHERE verification_status = 'success' 
         AND created_at >= NOW() - INTERVAL '24 hours') as recent_verifications,
        (SELECT COUNT(*)::INTEGER FROM verification_logs 
         WHERE verification_status = 'failed' 
         AND created_at >= CURRENT_DATE) as failed_attempts_today,
        (SELECT COUNT(*)::INTEGER FROM security_events 
         WHERE severity IN ('high', 'critical') 
         AND created_at >= NOW() - INTERVAL '24 hours') as high_risk_events;
END;
$$ LANGUAGE plpgsql;

-- Function to clean old logs (for maintenance)
CREATE OR REPLACE FUNCTION cleanup_old_logs(days_to_keep INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Delete old verification logs
    DELETE FROM verification_logs 
    WHERE created_at < NOW() - INTERVAL '1 day' * days_to_keep;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Delete old security events (keep critical events longer)
    DELETE FROM security_events 
    WHERE created_at < NOW() - INTERVAL '1 day' * days_to_keep
    AND severity NOT IN ('high', 'critical');
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for the new functions
CREATE INDEX IF NOT EXISTS idx_verification_logs_email_status_time 
ON verification_logs(email, verification_status, created_at);

CREATE INDEX IF NOT EXISTS idx_security_events_severity_time 
ON security_events(severity, created_at);

-- Test the functions
SELECT * FROM get_vip_statistics();
SELECT * FROM check_suspicious_activity('unknown@example.com');
