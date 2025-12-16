#!/bin/bash

echo "🚀 TITIK SPORTS - Next.js Setup"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
  echo "❌ Failed to install dependencies!"
  exit 1
fi

echo "✅ Dependencies installed successfully!"
echo ""

# Setup environment variables
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://www.fotmob.com/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase Configuration (Replace with your credentials)
NEXT_PUBLIC_SUPABASE_URL=https://oodzcqhmvixwiyyroplf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Ads Configuration (Optional)
NEXT_PUBLIC_ADSTERRA_BANNER_ID=b563d06cb842eb05b6d065d74b35ee3c
NEXT_PUBLIC_ADSTERRA_SMARTLINK=https://www.effectivegatecpm.com/...
NEXT_PUBLIC_MONETAG_ZONE=10319821

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Environment
NODE_ENV=development
EOF
    
    echo "✅ .env.local created!"
    echo "⚠️  IMPORTANT: Please update .env.local with your actual credentials!"
else
    echo "✅ .env.local already exists"
fi

echo ""

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p public/images
mkdir -p scripts
echo "✅ Directories created!"
echo ""

# Make scripts executable
chmod +x scripts/*.sh 2>/dev/null
echo "✅ Scripts made executable!"
echo ""

echo "================================"
echo "✅ Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your credentials"
echo "2. Run 'npm run dev' to start development server"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "For production build:"
echo "1. Run 'npm run build'"
echo "2. Run 'npm start' to start production server"
echo ""
echo "Happy coding! 🎉"