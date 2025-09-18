.PHONY: setup dev test lint build deploy clean

# Setup project
setup:
	@echo "Setting up acme-telehealth-backend..."

	cd backend && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt


	@echo "Setup complete!"

# Start development environment
dev:
	docker-compose up -d

	cd backend && python main.py




# Run tests
test:

	cd backend && pytest



# Run linters
lint:

	cd backend && black . && flake8



# Build for production
build:

	cd backend && python -m build



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
