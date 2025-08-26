#!/usr/bin/env python3
"""
Database setup script for GuardIQ
Run this script to initialize the PostgreSQL database
"""

import psycopg2
from psycopg2.extras import RealDictCursor
import os
import sys

# Database configuration
DATABASE_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'database': os.getenv('DB_NAME', 'guardiq'),
    'user': os.getenv('DB_USER', 'postgres'),
    'password': os.getenv('DB_PASSWORD', ''),
    'port': os.getenv('DB_PORT', '5432')
}

def create_database():
    """Create the GuardIQ database if it doesn't exist"""
    try:
        # Connect to default postgres database
        conn = psycopg2.connect(
            host=DATABASE_CONFIG['host'],
            database='postgres',
            user=DATABASE_CONFIG['user'],
            password=DATABASE_CONFIG['password'],
            port=DATABASE_CONFIG['port']
        )
        conn.autocommit = True
        cursor = conn.cursor()
        
        # Check if database exists
        cursor.execute("SELECT 1 FROM pg_database WHERE datname = %s", (DATABASE_CONFIG['database'],))
        exists = cursor.fetchone()
        
        if not exists:
            cursor.execute(f"CREATE DATABASE {DATABASE_CONFIG['database']}")
            print(f"Database '{DATABASE_CONFIG['database']}' created successfully")
        else:
            print(f"Database '{DATABASE_CONFIG['database']}' already exists")
        
        cursor.close()
        conn.close()
        return True
        
    except psycopg2.Error as e:
        print(f"Error creating database: {e}")
        return False

def setup_tables():
    """Create tables and insert sample data"""
    try:
        conn = psycopg2.connect(**DATABASE_CONFIG)
        cursor = conn.cursor()
        
        print("Creating tables...")
        
        # Create VIP users table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS vip_users (
                id SERIAL PRIMARY KEY,
                full_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                phone VARCHAR(20),
                organization VARCHAR(255),
                security_clearance VARCHAR(50),
                access_code VARCHAR(100) UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_verified TIMESTAMP,
                is_active BOOLEAN DEFAULT TRUE
            )
        """)
        
        # Create verification logs table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS verification_logs (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255),
                access_code VARCHAR(100),
                verification_status VARCHAR(20),
                ip_address VARCHAR(45),
                user_agent TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        print("Tables created successfully")
        
        # Insert sample VIP users
        print("Inserting sample VIP users...")
        sample_users = [
            ('John Doe', 'john.doe@trinova.com', '+1-555-0101', 'TriNova Security', 'Level 5', 'VIP2024SECURE'),
            ('Jane Smith', 'jane.smith@trinova.com', '+1-555-0102', 'TriNova Security', 'Level 4', 'ELITE2024GUARD'),
            ('Mike Johnson', 'mike.johnson@trinova.com', '+1-555-0103', 'TriNova Security', 'Level 5', 'PREMIUM2024SHIELD'),
            ('Sarah Wilson', 'sarah.wilson@trinova.com', '+1-555-0104', 'TriNova Security', 'Level 3', 'SECURE2024VIP'),
            ('David Brown', 'david.brown@trinova.com', '+1-555-0105', 'TriNova Security', 'Level 4', 'GUARDIAN2024ELITE')
        ]
        
        for user in sample_users:
            cursor.execute("""
                INSERT INTO vip_users (full_name, email, phone, organization, security_clearance, access_code)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON CONFLICT (email) DO NOTHING
            """, user)
        
        conn.commit()
        cursor.close()
        conn.close()
        
        print("Sample data inserted successfully")
        print("\nSample VIP Access Codes:")
        for user in sample_users:
            print(f"  {user[1]} -> {user[5]}")
        
        return True
        
    except psycopg2.Error as e:
        print(f"Error setting up tables: {e}")
        return False

def main():
    """Main setup function"""
    print("GuardIQ Database Setup")
    print("=" * 30)
    
    # Create database
    if not create_database():
        print("Failed to create database")
        sys.exit(1)
    
    # Setup tables
    if not setup_tables():
        print("Failed to setup tables")
        sys.exit(1)
    
    print("\nDatabase setup completed successfully!")
    print("You can now start the Flask backend server.")

if __name__ == "__main__":
    main()
