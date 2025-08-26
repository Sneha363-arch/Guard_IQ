# GuardIQ Cybersecurity Dashboard

A professional cybersecurity dashboard with Flask Python backend and PostgreSQL database.

## 🚀 Quick Start

### Backend Setup (Flask + PostgreSQL)

1. **Navigate to backend directory:**
   \`\`\`bash
   cd backend
   \`\`\`

2. **Make startup script executable:**
   \`\`\`bash
   chmod +x start.sh
   \`\`\`

3. **Run the setup script:**
   \`\`\`bash
   ./start.sh
   \`\`\`

   Or manually:
   \`\`\`bash
   # Create virtual environment
   python3 -m venv venv
   source venv/bin/activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Setup database
   python setup_database.py
   
   # Start server
   python run_server.py
   \`\`\`

### Frontend Setup (Next.js)

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Start development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

## 🗄️ Database Configuration

Update your PostgreSQL connection in `backend/.env`:

\`\`\`env
DATABASE_URL=postgresql://username:password@localhost:5432/guardiq_db
FLASK_SECRET_KEY=your-secret-key-here
FLASK_ENV=development
\`\`\`

## 🔧 API Endpoints

- `POST /api/verify-vip` - VIP verification
- `GET /api/health` - Health check
- `GET /api/vip-users` - List VIP users (admin)

## 🛡️ Features

- ✅ Flask Python Backend
- ✅ PostgreSQL Database
- ✅ VIP Verification System
- ✅ Security Logging
- ✅ Professional UI/UX
- ✅ Cursor Animations
- ✅ Cybersecurity Theme

## 📱 Usage

1. Start the Flask backend server
2. Start the Next.js frontend
3. Navigate to VIP verification page
4. Test with sample VIP codes: `VIP001`, `VIP002`, `VIP003`
