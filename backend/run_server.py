#!/usr/bin/env python3
"""
GuardIQ Flask Server Runner
Run this file to start the Flask backend server
"""

import os
import sys
from app import create_app

def main():
    """Main function to run the Flask server"""
    app = create_app()
    
    # Get port from environment or default to 5000
    port = int(os.environ.get('PORT', 5000))
    
    print("🛡️  GuardIQ Flask Backend Starting...")
    print(f"🌐 Server running on: http://localhost:{port}")
    print("📊 Database: PostgreSQL")
    print("🔒 Security: Enabled")
    print("-" * 50)
    
    # Run the Flask app
    app.run(
        host='0.0.0.0',
        port=port,
        debug=True,
        threaded=True
    )

if __name__ == '__main__':
    main()
