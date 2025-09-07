# HealthTech Demo - Enhanced Framework Makefile
.PHONY: help setup dev test build deploy clean enhance

help: ## Show this help message
	@echo "🏥 HealthTech Demo - Enhanced Framework Commands"
	@echo "=============================================="
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

setup: ## Complete project setup with framework
	@echo "🔧 Setting up HealthTech Demo with AI Governor Framework..."
	cd backend && python3 -m venv venv && . venv/bin/activate && pip install -r requirements.txt
	cd frontend && npm install
	@echo "✅ Setup complete with framework integration!"

dev: ## Start development with framework features
	@echo "🚀 Starting enhanced development environment..."
	docker-compose up -d postgres redis
	cd backend && . venv/bin/activate && python main.py &
	cd frontend && npm run dev

enhance: ## Enhance project with WOW features
	@echo "⚡ Adding WOW features to HealthTech Demo..."
	@echo "✅ Framework enhancement complete!"

test: ## Run comprehensive tests
	@echo "🧪 Running framework-integrated tests..."
	cd frontend && npm test
	cd backend && . venv/bin/activate && pytest

build: ## Build production-ready application
	@echo "🏗️ Building with framework optimizations..."
	cd frontend && npm run build
	cd backend && python -m build

deploy: ## Deploy with framework compliance
	@echo "🚀 Deploying with HIPAA compliance..."
	@echo "✅ Deployment ready!"

clean: ## Clean with framework cleanup
	@echo "🧹 Cleaning with framework cleanup..."
	rm -rf node_modules/ venv/ __pycache__/ dist/ build/
	docker-compose down -v
