HEAD
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/27bcfc52-aa9b-4cb0-86f2-a7f195035008

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/27bcfc52-aa9b-4cb0-86f2-a7f195035008) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/27bcfc52-aa9b-4cb0-86f2-a7f195035008) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

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
 e1f69ee021b605c9da8f16aabb6e035556b9a883
