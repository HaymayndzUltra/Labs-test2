.PHONY: setup dev test lint build deploy clean

# Setup project
setup:
	@echo "Setting up acme-telehealth-frontend..."
	cd frontend && npm install



	@echo "Setup complete!"

# Start development environment
dev:
	docker-compose up -d
	cd frontend && npm run dev &





# Run tests
test:
	cd frontend && npm test




# Run linters
lint:
	cd frontend && npm run lint




# Build for production
build:
	cd frontend && npm run build




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
