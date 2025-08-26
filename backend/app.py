from flask import Flask
from flask_cors import CORS
from .api_routes import api   # ✅ fixed import
from .config import config    # ✅ also make config relative
import os


def create_app(config_name=None):
    """Application factory"""
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')
    
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Initialize CORS
    CORS(app, origins=app.config['CORS_ORIGINS'])
    
    # Register blueprints
    app.register_blueprint(api)
    
    # Root endpoint
    @app.route('/')
    def index():
        return {
            'service': 'GuardIQ VIP API',
            'version': '1.0.0',
            'status': 'running'
        }
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
