#!/bin/bash
# Start All Project Services (Frontend, Backend, ML Services)

# Get the directory where this script is located
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "============================================"
echo "Career Saarthi - Starting All Services"
echo "============================================"
echo ""

# Clean up old processes
echo "Cleaning up old processes..."
lsof -ti:5173,8080,8001,8002,8003 | xargs kill -9 2>/dev/null
sleep 2
echo "Ports cleared"
echo ""

# Start ML Services
echo "Starting ML Services..."

echo "  ML Model 1 (Skill Intelligence) on port 8001..."
(cd "$PROJECT_DIR/ML/model1_skill_recommendation/backend" && python3 -m uvicorn main:app --host 0.0.0.0 --port 8001 > /dev/null 2>&1) &
sleep 2

echo "  ML Model 2 (Recommendations) on port 8002..."
(cd "$PROJECT_DIR/ML/model2_recommendation_system" && python3 -m uvicorn main:app --host 0.0.0.0 --port 8002 > /dev/null 2>&1) &
sleep 2

echo "  ML Model 3 (Career Insights) on port 8003..."
(cd "$PROJECT_DIR/ML/model3_suggestions" && python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8003 > /dev/null 2>&1) &
sleep 2
echo ""

# Start Backend (using global mvn - values hardcoded in application.properties)
echo "Starting Backend on port 8080..."
(cd "$PROJECT_DIR/Backend" && mvn spring-boot:run > /dev/null 2>&1) &
sleep 15
echo ""

# Start Frontend
echo "Starting Frontend on port 5173..."
(cd "$PROJECT_DIR/Frontend" && npm run dev > /dev/null 2>&1) &
sleep 3
echo ""

# Verify Services
echo "Verifying Services..."
sleep 5

check_service() {
    local port=$1
    local name=$2
    if lsof -i :$port > /dev/null 2>&1; then
        echo "  $name ($port): ✅ Running"
    else
        echo "  $name ($port): ⏳ Starting..."
    fi
}

check_service 8001 "ML Model 1"
check_service 8002 "ML Model 2"
check_service 8003 "ML Model 3"
check_service 8080 "Backend"
check_service 5173 "Frontend"
echo ""

echo "============================================"
echo "URLs:"
echo "============================================"
echo "  Frontend:  http://localhost:5173"
echo "  Backend:   http://localhost:8080"
echo "  ML API 1:  http://localhost:8001/docs"
echo "  ML API 2:  http://localhost:8002/docs"
echo "  ML API 3:  http://localhost:8003/docs"
echo "============================================"
echo ""
echo "To stop all services: ./stop_project.sh"
echo ""
