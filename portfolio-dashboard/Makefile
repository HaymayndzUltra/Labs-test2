.PHONY: setup dev test lint build deploy clean

PYTHON ?= python3
PIP ?= pip3

# Setup project
setup:
	@echo "Setting up portfolio-dashboard..."
	cd frontend && npm install
	cd backend && $(PYTHON) -m venv venv && venv/bin/pip install -r requirements.txt


	@echo "Setup complete!"

# Start development environment
dev:
	docker-compose up -d
	cd frontend && npm run dev &
	cd backend && venv/bin/python main.py




# Run tests
test:
	cd frontend && npm test
	cd backend && venv/bin/pytest



# Run linters
lint:
	cd frontend && npm run lint
	cd backend && venv/bin/black . && venv/bin/flake8



# Build for production
build:
	cd frontend && npm run build
	cd backend && venv/bin/python -m build



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
	docker-compose down -v
