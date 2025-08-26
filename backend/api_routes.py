"""
API routes for GuardIQ VIP verification system
"""
from flask import Blueprint, request, jsonify
from datetime import datetime
import re
from .models import DatabaseManager, VerificationLog
from .config import Config

# Create blueprint
api = Blueprint('api', __name__, url_prefix='/api')

# Initialize database manager
db_config = {
    'host': Config.DB_HOST,
    'database': Config.DB_NAME,
    'user': Config.DB_USER,
    'password': Config.DB_PASSWORD,
    'port': Config.DB_PORT
}
db_manager = DatabaseManager(db_config)

def validate_email(email: str) -> bool:
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_role(role: str) -> bool:
    """Validate role/category"""
    valid_roles = ['influencer', 'celebrity', 'vip', 'executive', 'content-creator', 'public-figure']
    return role.lower() in valid_roles

def validate_platform(platform: str) -> bool:
    """Validate social media platform"""
    valid_platforms = ['twitter', 'instagram', 'youtube', 'tiktok', 'linkedin', 'facebook', 'twitch']
    return platform.lower() in valid_platforms

def determine_vip_status(role: str, platform: str, followers: int) -> bool:
    """Determine VIP status based on role, platform, and followers"""
    # VIP criteria based on role and follower count
    vip_thresholds = {
        'celebrity': 100000,      # 100K+ followers
        'influencer': 50000,      # 50K+ followers
        'vip': 25000,            # 25K+ followers
        'executive': 10000,       # 10K+ followers
        'content-creator': 75000, # 75K+ followers
        'public-figure': 30000    # 30K+ followers
    }
    
    threshold = vip_thresholds.get(role.lower(), 100000)  # Default high threshold
    return followers >= threshold

@api.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'GuardIQ VIP API',
        'timestamp': datetime.utcnow().isoformat(),
        'version': '1.0.0'
    })

@api.route('/verify-vip', methods=['POST'])
def verify_vip():
    """
    Verify VIP status endpoint
    Expected payload: {
        "fullName": "string",
        "email": "string", 
        "role": "string",
        "platform": "string",
        "followers": number
    }
    """
    try:
        # Get request data
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        full_name = data.get('fullName', '').strip()
        email = data.get('email', '').strip().lower()
        role = data.get('role', '').strip().lower()
        platform = data.get('platform', '').strip().lower()
        followers = data.get('followers', 0)
        
        # Validation
        if not all([full_name, email, role, platform]) or followers < 0:
            return jsonify({'error': 'All fields are required and followers must be non-negative'}), 400
        
        if not validate_email(email):
            return jsonify({'error': 'Invalid email format'}), 400
        
        if not validate_role(role):
            return jsonify({'error': 'Invalid role selected'}), 400
            
        if not validate_platform(platform):
            return jsonify({'error': 'Invalid platform selected'}), 400
        
        # Check for suspicious activity
        suspicious_check = db_manager.check_suspicious_activity(email)
        if suspicious_check.get('is_suspicious', False):
            log = VerificationLog(
                email=email,
                access_code=f"{role}:{platform}:{followers}",  # Store verification attempt details
                verification_status='blocked',
                ip_address=request.remote_addr,
                user_agent=request.headers.get('User-Agent', '')
            )
            db_manager.log_verification_attempt(log)
            
            return jsonify({
                'success': False,
                'message': 'Account temporarily locked due to suspicious activity. Please contact security.',
                'blocked': True
            }), 429
        
        is_vip = determine_vip_status(role, platform, followers)
        
        # Log verification attempt
        log = VerificationLog(
            email=email,
            access_code=f"{role}:{platform}:{followers}",
            verification_status='success' if is_vip else 'failed',
            ip_address=request.remote_addr,
            user_agent=request.headers.get('User-Agent', '')
        )
        db_manager.log_verification_attempt(log)
        
        if is_vip:
            return jsonify({
                'success': True,
                'message': 'Verified as VIP',
                'user': {
                    'fullName': full_name,
                    'email': email,
                    'role': role.title(),
                    'platform': platform.title(),
                    'followers': followers,
                    'verificationStatus': 'VIP Verified'
                }
            })
        else:
            return jsonify({
                'success': False,
                'message': "You're not a VIP. Insufficient followers for your role category."
            }), 401
            
    except Exception as e:
        print(f"Verification error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@api.route('/vip-stats', methods=['GET'])
def get_vip_stats():
    """Get VIP system statistics"""
    try:
        stats = db_manager.get_vip_statistics()
        return jsonify(stats)
    except Exception as e:
        print(f"Stats error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@api.route('/security-status', methods=['GET'])
def get_security_status():
    """Get overall security status"""
    try:
        stats = db_manager.get_vip_statistics()
        
        # Calculate security score based on recent activity
        total_attempts = stats.get('recent_verifications', 0) + stats.get('failed_attempts_today', 0)
        success_rate = (stats.get('recent_verifications', 0) / max(total_attempts, 1)) * 100
        
        security_level = 'high'
        if stats.get('high_risk_events', 0) > 5:
            security_level = 'critical'
        elif stats.get('high_risk_events', 0) > 2:
            security_level = 'medium'
        elif stats.get('failed_attempts_today', 0) > 10:
            security_level = 'medium'
        
        return jsonify({
            'securityLevel': security_level,
            'successRate': round(success_rate, 2),
            'totalVips': stats.get('active_vips', 0),
            'recentActivity': stats.get('recent_verifications', 0),
            'threatLevel': stats.get('high_risk_events', 0),
            'lastUpdated': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        print(f"Security status error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@api.route('/user-activity/<email>', methods=['GET'])
def get_user_activity(email):
    """Get activity for a specific user"""
    try:
        if not validate_email(email):
            return jsonify({'error': 'Invalid email format'}), 400
        
        activity = db_manager.check_suspicious_activity(email.lower())
        return jsonify(activity)
        
    except Exception as e:
        print(f"User activity error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

# Error handlers
@api.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@api.errorhandler(405)
def method_not_allowed(error):
    return jsonify({'error': 'Method not allowed'}), 405

@api.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500
