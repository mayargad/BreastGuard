#!/bin/bash
# BreastGuard Backend Startup Script
echo "🎀 Starting BreastGuard Backend..."
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 not found. Please install Python 3.8+"
    exit 1
fi

cd "$(dirname "$0")"

# Install dependencies
echo "📦 Installing dependencies..."
pip3 install -r requirements.txt --quiet

echo ""
echo "✅ Backend starting on http://localhost:5000"
echo "   Press Ctrl+C to stop"
echo ""
python3 app.py
