# Project Makefile

.PHONY: help install test build deploy clean

help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	@echo "Installing dependencies..."

test: ## Run tests
	@echo "Running tests..."

build: ## Build the project
	@echo "Building project..."

deploy: ## Deploy to production
	@echo "Deploying to production..."

clean: ## Clean build artifacts
	@echo "Cleaning build artifacts..."
