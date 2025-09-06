.PHONY: setup dev test lint build deploy clean

# Setup project
setup:
	@echo "Setting up healthtech-demo..."
	cd frontend && npm install
	cd backend && python3 -m venv venv && . venv/bin/activate && pip install -r requirements.txt
	@echo "Setup complete!"

# Start development environment
dev:
	docker compose up -d
	cd frontend && npm run dev &
	cd backend && . venv/bin/activate && python3 main.py

# Run tests
test:
	cd frontend && npm test
	cd backend && . venv/bin/activate && pytest

# Run linters
lint:
	cd frontend && npm run lint
	cd backend && . venv/bin/activate && black . && flake8

# Build for production
build:
	cd frontend && npm run build
	cd backend && python3 -m build

# Deploy application
deploy:
	@echo "Deploying to aws..."
	# Add deployment commands here

# Clean build artifacts
clean:
	rm -rf node_modules/
	rm -rf venv/
	rm -rf __pycache__/
	rm -rf dist/
	rm -rf build/
	docker compose down -v
