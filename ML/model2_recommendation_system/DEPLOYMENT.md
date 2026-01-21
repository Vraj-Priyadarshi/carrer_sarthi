# Deployment Guide

## Development Setup

### Local Development

```bash
# 1. Clone and navigate
cd model2_recommendation_system

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Set API key
export OPENAI_API_KEY="sk-..."  # or your Claude API key

# 5. Run development server
python main.py

# 6. Test in another terminal
python test_api.py
```

Visit: `http://localhost:8000/docs` for Swagger UI

---

## Production Deployment

### Option 1: Docker

Create `Dockerfile`:

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV OPENAI_API_KEY=""

CMD ["python", "main.py"]
```

Create `.dockerignore`:

```
venv
__pycache__
.git
*.pyc
.env
```

Build and run:

```bash
# Build
docker build -t recommendation-system:latest .

# Run
docker run -p 8000:8000 \
  -e OPENAI_API_KEY="sk-..." \
  recommendation-system:latest
```

### Option 2: AWS Lambda + API Gateway

Create `serverless.yml`:

```yaml
service: recommendation-system

provider:
  name: aws
  runtime: python3.9
  apiGateway:
    metrics: true
  environment:
    OPENAI_API_KEY: ${env:OPENAI_API_KEY}

functions:
  recommendations:
    handler: handler.lambda_handler
    events:
      - http:
          path: recommendations
          method: post
          cors: true
    layers:
      - arn:aws:lambda:region:account:layer:python-deps:1

package:
  patterns:
    - '!node_modules/**'
    - '!venv/**'
```

Deploy:

```bash
serverless deploy
```

### Option 3: Google Cloud Run

```bash
# 1. Create app.yaml
cat > app.yaml <<EOF
runtime: python39
env: standard

env_variables:
  OPENAI_API_KEY: "sk-..."

handlers:
- url: /.*
  script: auto
EOF

# 2. Deploy
gcloud app deploy
```

### Option 4: Heroku

```bash
# 1. Install Heroku CLI
# 2. Create Procfile
cat > Procfile <<EOF
web: python main.py
EOF

# 3. Deploy
heroku create recommendation-system
heroku config:set OPENAI_API_KEY="sk-..."
git push heroku main
```

---

## Configuration for Production

### 1. Use Gunicorn instead of Uvicorn

```bash
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

### 2. Enable HTTPS/TLS

```python
# In main.py, or use reverse proxy (Nginx)
app = FastAPI(...)
# Trust proxy headers
app.add_middleware(TrustedHostMiddleware, allowed_hosts=["yourdomain.com"])
```

### 3. Rate Limiting

```bash
pip install slowapi
```

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.post("/recommendations")
@limiter.limit("10/minute")
async def get_recommendations(request: RecommendationRequest):
    ...
```

### 4. Logging & Monitoring

```bash
pip install python-json-logger

# Configure structured logging
import logging
from pythonjsonlogger import jsonlogger

logHandler = logging.StreamHandler()
formatter = jsonlogger.JsonFormatter()
logHandler.setFormatter(formatter)
logger = logging.getLogger()
logger.addHandler(logHandler)
logger.setLevel(logging.INFO)
```

### 5. API Key Management

**Never commit API keys!**

```bash
# Use environment variables
export OPENAI_API_KEY="sk-..."

# Or use a secrets manager
# AWS: AWS Secrets Manager
# GCP: Google Secret Manager
# Azure: Azure Key Vault
```

---

## Performance Optimization

### 1. Knowledge Base Caching

Already implemented in `utils.py`:

```python
class KnowledgeBaseLoader:
    _roles_cache = None
    _courses_cache = None
    _projects_cache = None
```

### 2. Connection Pooling

```bash
pip install aiohttp
```

### 3. Compress Responses

```python
from fastapi.middleware.gzip import GZIPMiddleware
app.add_middleware(GZIPMiddleware, minimum_size=1000)
```

### 4. Load Balancing

For multiple instances:

```bash
# Nginx config (nginx.conf)
upstream api {
    server localhost:8000;
    server localhost:8001;
    server localhost:8002;
}

server {
    location / {
        proxy_pass http://api;
    }
}
```

---

## Monitoring & Health Checks

### 1. Health Endpoint (Already Implemented)

```bash
curl http://localhost:8000/health
```

Response:

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:45.123456"
}
```

### 2. Add Prometheus Metrics

```bash
pip install prometheus-fastapi-instrumentator
```

```python
from prometheus_fastapi_instrumentator import Instrumentator

Instrumentator().instrument(app).expose(app)
```

### 3. Structured Logging

Already implemented in all modules:

```python
logger = logging.getLogger(__name__)
logger.info(f"Processing recommendation request for user: {request.user_id}")
```

---

## Database Integration (Optional)

If you want to store recommendations:

```bash
pip install sqlalchemy psycopg2
```

```python
from sqlalchemy import create_engine, Column, String, DateTime
from sqlalchemy.orm import declarative_base, Session
from datetime import datetime

Base = declarative_base()

class Recommendation(Base):
    __tablename__ = "recommendations"
    
    user_id = Column(String, primary_key=True)
    target_role = Column(String)
    courses = Column(String)  # JSON
    projects = Column(String)  # JSON
    created_at = Column(DateTime, default=datetime.utcnow)

# In main.py
engine = create_engine("postgresql://user:password@localhost/dbname")
Base.metadata.create_all(engine)

@app.post("/recommendations")
async def get_recommendations(request: RecommendationRequest):
    # ... existing logic ...
    
    # Save to database
    with Session(engine) as session:
        recommendation = Recommendation(
            user_id=request.user_id,
            target_role=request.target_role,
            courses=json.dumps([c.dict() for c in recommended_courses]),
            projects=json.dumps([p.dict() for p in recommended_projects]),
        )
        session.add(recommendation)
        session.commit()
    
    return response
```

---

## Testing in Production

### 1. Smoke Test

```bash
curl -X GET http://your-api.com/health
```

### 2. Full Recommendation Test

```bash
curl -X POST http://your-api.com/recommendations \
  -H "Content-Type: application/json" \
  -d @test_payload.json
```

### 3. Load Testing

```bash
pip install locust

# Create locustfile.py
from locust import HttpUser, task

class APIUser(HttpUser):
    @task
    def recommend(self):
        self.client.post("/recommendations", json={...})

# Run
locust -f locustfile.py --host=http://localhost:8000
```

---

## Troubleshooting

### Issue: 502 Bad Gateway

**Cause**: Application crashed or not responding
**Solution**:
- Check logs: `docker logs container-id`
- Verify API key is set
- Check dependencies are installed

### Issue: Timeout (504)

**Cause**: LLM call taking too long
**Solution**:
- Increase timeout in `llm_service.py`
- Use fallback ranking (automatic)
- Consider caching common recommendations

### Issue: High Memory Usage

**Cause**: Knowledge base not being cached properly
**Solution**:
- Verify `KnowledgeBaseLoader` is being used
- Check for memory leaks in logging
- Use `memory_profiler` to debug

```bash
pip install memory-profiler
python -m memory_profiler main.py
```

---

## Security Checklist

- [ ] API key stored in environment variables, not committed
- [ ] HTTPS/TLS enabled in production
- [ ] Rate limiting implemented
- [ ] Input validation with Pydantic
- [ ] CORS configured appropriately
- [ ] Logging doesn't expose sensitive data
- [ ] Database credentials secured (if using DB)
- [ ] Regular dependency updates (`pip install --upgrade`)

---

## Scaling Strategy

### Horizontal Scaling

```bash
# Docker Swarm
docker service create \
  --replicas 3 \
  -p 8000:8000 \
  recommendation-system:latest

# Kubernetes
kubectl scale deployment recommendation-system --replicas=5
```

### Vertical Scaling

- Increase CPU/memory per instance
- Optimize knowledge base loading
- Use caching layer (Redis)

### Hybrid Approach

```bash
# Load balancer + multiple instances
- 1 load balancer (Nginx)
- 3-5 API instances
- Shared knowledge base cache (Redis)
- Optional: Database for persistence
```

---

## Cost Estimation

| Component | Service | Estimated Cost |
|-----------|---------|-----------------|
| API Calls | OpenAI GPT-4 | $0.02-0.05 per request |
| Compute | Cloud Run / Lambda | $0-50/month (free tier available) |
| Storage | Object Storage | <$1/month |
| Database | PostgreSQL | $10-50/month |
| Load Balancer | | $5-20/month |
| **Total** | | **$15-125/month** |

---

## Maintenance & Updates

### Weekly
- Check logs for errors
- Monitor API response times
- Verify health endpoint

### Monthly
- Update dependencies: `pip install --upgrade -r requirements.txt`
- Review recommendation quality (if tracking)
- Backup knowledge base

### Quarterly
- Update Python version
- Security audit
- Performance optimization

---

## Rollback Plan

If something breaks:

```bash
# Keep previous version running
docker tag recommendation-system:v1 recommendation-system:stable

# Deploy new version with health checks
docker run \
  --health-cmd="curl http://localhost:8000/health" \
  --health-interval=30s \
  recommendation-system:latest

# If fails, rollback
docker run -p 8000:8000 recommendation-system:stable
```

---

**Ready to deploy!** 🚀
