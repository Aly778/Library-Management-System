#!/bin/bash
# Quick Start Script for Library Management System

echo "🎯 Library Management System - Quick Start"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Backend Setup
echo "📦 Setting up Backend..."
cd library_backend
npm install 2>/dev/null
echo "✅ Backend dependencies installed"
echo ""

# Frontend Setup
echo "📦 Setting up Frontend..."
cd ../Library-Management-System
npm install 2>/dev/null
echo "✅ Frontend dependencies installed"
echo ""

echo "🚀 Ready to start the application!"
echo ""
echo "To run the application:"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd library_backend"
echo "  npm start"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd Library-Management-System"
echo "  npm start"
echo ""
echo "Access the application at: http://localhost:3000"
echo "Backend API at: http://localhost:5000/api"
