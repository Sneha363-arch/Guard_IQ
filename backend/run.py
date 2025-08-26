#!/usr/bin/env python3
"""
GuardIQ Flask Application Runner
"""
import os
import sys
from backend.app import create_app   # instead of just from app import create_app
from .api_routes import api
from .config import Config
from .models import DatabaseManager


def check_database_connection():
    """Check if database is accessible"""
    db_config = {
        'host': Config.DB_HOST,
        'database': Config.DB_NAME,
        'user': Config.DB_USER,
        'password': Config.DB_PASSWORD,
        'port': Config.DB_PORT
    }
    
    db_manager = DatabaseManager(db_config)
    conn = db_manager.get_connection()
    
    if conn:
        conn.close()
        print("✓ Database connection successful")
        return True
    else:
        print("✗ Database connection failed")
        print("Please check your database configuration and ensure PostgreSQL is running")
        return False

def main():
    """Main application runner"""
    print("GuardIQ VIP API Server")
    print("=" * 30)
    
    # Check database connection
    if not check_database_connection():
        print("\nPlease fix database connection issues before starting the server.")
        sys.exit(1)
    
    # Create Flask app
    app = create_app()
    
    # Get configuration
    host = os.getenv('FLASK_HOST', '0.0.0.0')
    port = int(os.getenv('FLASK_PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    
    print(f"\nStarting server on http://{host}:{port}")
    print(f"Debug mode: {debug}")
    print("\nAPI Endpoints:")
    print("  GET  /api/health           - Health check")
    print("  POST /api/verify-vip       - Verify VIP status")
    print("  GET  /api/vip-stats        - Get VIP statistics")
    print("  GET  /api/security-status  - Get security status")
    print("\nPress Ctrl+C to stop the server")
    print("-" * 50)
    
    try:
        app.run(host=host, port=port, debug=debug)
    except KeyboardInterrupt:
        print("\n\nServer stopped by user")
    except Exception as e:
        print(f"\nServer error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
