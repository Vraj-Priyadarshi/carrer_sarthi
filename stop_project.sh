#!/bin/bash
# Stop All Project Services (Frontend, Backend, ML Services)

echo "============================================"
echo "Career Saarthi - Stopping All Services"
echo "============================================"
echo ""

echo "Stopping Frontend (port 5173)..."
lsof -ti:5173 | xargs kill -9 2>/dev/null && echo "  Frontend stopped" || echo "  Frontend was not running"

echo "Stopping Backend (port 8080)..."
lsof -ti:8080 | xargs kill -9 2>/dev/null && echo "  Backend stopped" || echo "  Backend was not running"

echo "Stopping ML Model 1 (port 8001)..."
lsof -ti:8001 | xargs kill -9 2>/dev/null && echo "  ML Model 1 stopped" || echo "  ML Model 1 was not running"

echo "Stopping ML Model 2 (port 8002)..."
lsof -ti:8002 | xargs kill -9 2>/dev/null && echo "  ML Model 2 stopped" || echo "  ML Model 2 was not running"

echo "Stopping ML Model 3 (port 8003)..."
lsof -ti:8003 | xargs kill -9 2>/dev/null && echo "  ML Model 3 stopped" || echo "  ML Model 3 was not running"

echo ""
echo "============================================"
echo "All services stopped"
echo "============================================"
