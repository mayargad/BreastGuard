#!/bin/bash
# BreastGuard Frontend Startup Script
echo "🎀 Starting BreastGuard Frontend..."
echo ""

# Check Node
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 16+"
    exit 1
fi

cd "$(dirname "$0")"

# Install dependencies
echo "📦 Installing npm dependencies..."
npm install

echo ""
echo "✅ Frontend starting on http://localhost:3000"
echo "   Make sure backend is running on http://localhost:5000"
echo "   Press Ctrl+C to stop"
echo ""
npm start
