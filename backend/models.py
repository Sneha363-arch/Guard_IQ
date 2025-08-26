"""
Database models for GuardIQ VIP system
"""
from dataclasses import dataclass
from datetime import datetime
from typing import Optional, List
import psycopg2
from psycopg2.extras import RealDictCursor

@dataclass
class VIPUser:
    """VIP User model"""
    id: Optional[int] = None
    full_name: str = ""
    email: str = ""
    phone: Optional[str] = None
    organization: str = ""
    security_clearance: str = ""
    access_code: str = ""
    created_at: Optional[datetime] = None
    last_verified: Optional[datetime] = None
    is_active: bool = True

@dataclass
class VerificationLog:
    """Verification log model"""
    id: Optional[int] = None
    email: str = ""
    access_code: str = ""
    verification_status: str = ""
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    created_at: Optional[datetime] = None

@dataclass
class SecurityEvent:
    """Security event model"""
    id: Optional[int] = None
    event_type: str = ""
    user_id: Optional[int] = None
    email: str = ""
    description: str = ""
    severity: str = "low"
    ip_address: Optional[str] = None
    created_at: Optional[datetime] = None

class DatabaseManager:
    """Database operations manager"""
    
    def __init__(self, db_config: dict):
        self.db_config = db_config
    
    def get_connection(self):
        """Get database connection"""
        try:
            return psycopg2.connect(**self.db_config)
        except psycopg2.Error as e:
            print(f"Database connection error: {e}")
            return None
    
    def verify_vip_user(self, email: str, access_code: str) -> Optional[VIPUser]:
        """Verify VIP user credentials"""
        conn = self.get_connection()
        if not conn:
            return None
        
        try:
            cursor = conn.cursor(cursor_factory=RealDictCursor)
            cursor.execute("""
                SELECT * FROM vip_users 
                WHERE email = %s AND access_code = %s AND is_active = TRUE
            """, (email.lower().strip(), access_code.strip()))
            
            result = cursor.fetchone()
            cursor.close()
            conn.close()
            
            if result:
                return VIPUser(
                    id=result['id'],
                    full_name=result['full_name'],
                    email=result['email'],
                    phone=result['phone'],
                    organization=result['organization'],
                    security_clearance=result['security_clearance'],
                    access_code=result['access_code'],
                    created_at=result['created_at'],
                    last_verified=result['last_verified'],
                    is_active=result['is_active']
                )
            return None
            
        except psycopg2.Error as e:
            print(f"Database query error: {e}")
            if conn:
                conn.close()
            return None
    
    def log_verification_attempt(self, log: VerificationLog) -> bool:
        """Log verification attempt"""
        conn = self.get_connection()
        if not conn:
            return False
        
        try:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO verification_logs 
                (email, access_code, verification_status, ip_address, user_agent)
                VALUES (%s, %s, %s, %s, %s)
            """, (
                log.email,
                log.access_code,
                log.verification_status,
                log.ip_address,
                log.user_agent
            ))
            
            conn.commit()
            cursor.close()
            conn.close()
            return True
            
        except psycopg2.Error as e:
            print(f"Logging error: {e}")
            if conn:
                conn.rollback()
                conn.close()
            return False
    
    def update_last_verified(self, user_id: int) -> bool:
        """Update user's last verified timestamp"""
        conn = self.get_connection()
        if not conn:
            return False
        
        try:
            cursor = conn.cursor()
            cursor.execute("""
                UPDATE vip_users 
                SET last_verified = CURRENT_TIMESTAMP 
                WHERE id = %s
            """, (user_id,))
            
            conn.commit()
            cursor.close()
            conn.close()
            return True
            
        except psycopg2.Error as e:
            print(f"Update error: {e}")
            if conn:
                conn.rollback()
                conn.close()
            return False
    
    def get_vip_statistics(self) -> dict:
        """Get VIP system statistics"""
        conn = self.get_connection()
        if not conn:
            return {}
        
        try:
            cursor = conn.cursor(cursor_factory=RealDictCursor)
            cursor.execute("SELECT * FROM get_vip_statistics()")
            result = cursor.fetchone()
            cursor.close()
            conn.close()
            
            return dict(result) if result else {}
            
        except psycopg2.Error as e:
            print(f"Statistics error: {e}")
            if conn:
                conn.close()
            return {}
    
    def check_suspicious_activity(self, email: str) -> dict:
        """Check for suspicious activity for a user"""
        conn = self.get_connection()
        if not conn:
            return {}
        
        try:
            cursor = conn.cursor(cursor_factory=RealDictCursor)
            cursor.execute("SELECT * FROM check_suspicious_activity(%s)", (email,))
            result = cursor.fetchone()
            cursor.close()
            conn.close()
            
            return dict(result) if result else {}
            
        except psycopg2.Error as e:
            print(f"Suspicious activity check error: {e}")
            if conn:
                conn.close()
            return {}
