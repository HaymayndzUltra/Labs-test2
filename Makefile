.PHONY: setup dev test lint build deploy deploy-frontend deploy-backend deploy-staging deploy-production rollback pipeline-validate clean

ENV ?= staging
APP_NAME ?= portfolio-dashboard
VERCEL_TOKEN ?=
VERCEL_ORG_ID ?=
VERCEL_PROJECT_ID ?=
FRONTEND_ENV_FILE ?= .env.$(ENV)
BACKEND_IMAGE ?=
AWS_REGION ?= us-east-1
AWS_PROFILE ?=
REVISION ?= previous
FRONTEND_URL ?=
API_URL ?=
DB_URL ?=
PIPELINE_REPORT ?= reports/$(ENV)-pipeline-validation.json

# Setup project
setup:
	@echo "Setting up portfolio-dashboard..."
	(cd frontend && npm install)
	(cd backend && python -m venv venv && venv/bin/pip install -r requirements.txt)
	@echo "Setup complete!"

# Start development environment
dev:
	docker-compose up -d
	(cd frontend && npm run dev &)
	(cd backend && python main.py)




# Run tests
test:
	(cd frontend && npm test)
	(cd backend && pytest)



# Run linters
lint:
	(cd frontend && npm run lint)
	(cd backend && black . && flake8)



# Build for production
build:
	(cd frontend && npm run build)
	(cd backend && python -m build)



# Deploy application
deploy: deploy-frontend deploy-backend

deploy-frontend:
	@if [ -z "$(VERCEL_TOKEN)" ]; then \
	echo "Missing VERCEL_TOKEN environment variable"; \
	exit 1; \
	fi
	@if [ -z "$(VERCEL_ORG_ID)" ]; then \
	echo "Missing VERCEL_ORG_ID environment variable"; \
	exit 1; \
	fi
	@if [ -z "$(VERCEL_PROJECT_ID)" ]; then \
	echo "Missing VERCEL_PROJECT_ID environment variable"; \
	exit 1; \
	fi
	@if [ ! -f "$(FRONTEND_ENV_FILE)" ]; then \
	echo "Expected environment file $(FRONTEND_ENV_FILE) for frontend deployment"; \
	exit 1; \
	fi
	(cd frontend && npm ci)
	(cd frontend && npm run build)
	( \
	cd frontend && \
	export VERCEL_ORG_ID="$(VERCEL_ORG_ID)" && \
	export VERCEL_PROJECT_ID="$(VERCEL_PROJECT_ID)" && \
	SCOPE_FLAG="" && \
	if [ -n "$(VERCEL_ORG_ID)" ]; then \
	SCOPE_FLAG="--scope $(VERCEL_ORG_ID)"; \
	fi && \
	ENV_FILE_FLAG="" && \
	if [ -f "../$(FRONTEND_ENV_FILE)" ]; then \
	ENV_FILE_FLAG="--env-file ../$(FRONTEND_ENV_FILE)"; \
	fi && \
	DEPLOY_FLAGS="--yes --token $(VERCEL_TOKEN)" && \
	if [ "$(ENV)" = "production" ]; then \
	DEPLOY_FLAGS="$$DEPLOY_FLAGS --prod"; \
	fi && \
	npx vercel deploy $$DEPLOY_FLAGS $$SCOPE_FLAG $$ENV_FILE_FLAG \
	)

deploy-backend:
	@if [ -z "$(AWS_REGION)" ]; then \
	        echo "Missing AWS_REGION environment variable"; \
	        exit 1; \
	fi
	@if [ -z "$(BACKEND_IMAGE)" ]; then \
	        echo "Missing BACKEND_IMAGE tag for backend deployment"; \
	        exit 1; \
	fi
	AWS_REGION=$(AWS_REGION) AWS_PROFILE=$(AWS_PROFILE) APP_NAME=$(APP_NAME) BACKEND_IMAGE=$(BACKEND_IMAGE) ./scripts/deploy_backend.sh $(ENV)

deploy-staging:
	@$(MAKE) deploy ENV=staging

deploy-production:
	@$(MAKE) deploy ENV=production

rollback:
	@if [ -z "$(AWS_REGION)" ]; then \
	echo "Missing AWS_REGION environment variable"; \
	exit 1; \
	fi
	AWS_REGION=$(AWS_REGION) AWS_PROFILE=$(AWS_PROFILE) APP_NAME=$(APP_NAME) ./scripts/rollback_backend.sh $(ENV) $(REVISION)
	@if [ -n "$(VERCEL_TOKEN)" ]; then \
	./scripts/rollback_frontend.sh $(ENV); \
	else \
	echo "Skipping frontend rollback because VERCEL_TOKEN is not provided"; \
	fi

pipeline-validate:
	@if [ -z "$(FRONTEND_URL)" ]; then \
	echo "FRONTEND_URL must be provided (e.g., make pipeline-validate FRONTEND_URL=https://staging.example.com API_URL=https://staging.example.com/api/health)"; \
	exit 1; \
	fi
	@if [ -z "$(API_URL)" ]; then \
	echo "API_URL must be provided"; \
	exit 1; \
	fi
	mkdir -p $(dir $(PIPELINE_REPORT))
	CMD="python3 scripts/health/check_deployment.py --environment $(ENV) --frontend-url $(FRONTEND_URL) --api-url $(API_URL) --output-file $(PIPELINE_REPORT)"
	@if [ -n "$(DB_URL)" ]; then \
	CMD="$$CMD --db-url $(DB_URL)"; \
	fi; \
	$$CMD

# Clean build artifacts
clean:
	rm -rf node_modules/
	rm -rf venv/
	rm -rf __pycache__/
	rm -rf dist/
	rm -rf build/
	docker-compose down -v
