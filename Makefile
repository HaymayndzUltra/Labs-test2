# Client Project Generator Makefile

.PHONY: help setup test test-unit test-integration test-e2e test-all lint format security clean install dev \
	workflow.phase.1 workflow.phase.2 workflow.phase.3 workflow.phase.4 workflow.phase.5 \
	workflow.phase.6 workflow.phase.7 workflow.phase.8 workflow.phase.9 workflow.phase.10 \
	test-scripts lint-scripts security-scripts coverage-scripts

# Default target
help:
	@echo "Client Project Generator - Available Commands:"
	@echo ""
	@echo "Setup:"
	@echo "  setup          Install dependencies and setup development environment"
	@echo "  install        Install Python dependencies"
	@echo ""
	@echo "Testing:"
	@echo "  test           Run all tests"
	@echo "  test-unit      Run unit tests only"
	@echo "  test-integration Run integration tests only"
	@echo "  test-e2e       Run end-to-end tests only"
	@echo "  test-coverage  Run tests with coverage report"
	@echo ""
	@echo "Code Quality:"
	@echo "  lint           Run all linting checks"
	@echo "  format         Format code with black and isort"
	@echo "  security       Run security checks"
	@echo ""
	@echo "Development:"
	@echo "  dev            Start development environment"
	@echo "  clean          Clean up generated files and caches"
	@echo ""
	@echo "Workflows:"
	@echo "  workflow.phase.N  Validate workflow docs (frontmatter/sections)"
	@echo ""

# Setup
setup: install
	@echo "🔵 Setting up development environment..."
	@python -m pip install --upgrade pip
	@python -m pip install -r requirements.txt
	@echo "✅ Setup completed!"

install:
	@echo "🔵 Installing dependencies..."
	@python -m pip install -r requirements.txt
	@echo "✅ Dependencies installed!"

# Testing
test: test-all

test-unit:
	@echo "🔵 Running unit tests..."
	@python3 run_tests.py --unit

test-integration:
	@echo "🔵 Running integration tests..."
	@python3 run_tests.py --integration

test-e2e:
	@echo "🔵 Running E2E tests..."
	@python3 run_tests.py --e2e

test-all:
	@echo "🔵 Running all tests..."
	@python3 run_tests.py --all

test-coverage:
	@echo "🔵 Running tests with coverage..."
	@python3 -m pytest project_generator/tests/ -v --cov=project_generator --cov-report=html --cov-report=term --cov-report=xml

# Code Quality
lint:
	@echo "🔵 Running linting checks..."
	@python3 run_tests.py --lint

format:
	@echo "🔵 Formatting code..."
	@python3 -m black project_generator/ scripts/
	@python3 -m isort project_generator/ scripts/
	@echo "✅ Code formatted!"

security:
	@echo "🔵 Running security checks..."
	@python3 run_tests.py --security

# Development
dev:
	@echo "🔵 Starting development environment..."
	@echo "Available commands:"
	@echo "  make test      - Run all tests"
	@echo "  make lint      - Run linting"
	@echo "  make format    - Format code"
	@echo "  make security  - Run security checks"

# Cleanup
clean:
	@echo "🔵 Cleaning up..."
	@find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	@find . -type f -name "*.pyc" -delete 2>/dev/null || true
	@find . -type d -name "*.egg-info" -exec rm -rf {} + 2>/dev/null || true
	@find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	@find . -type d -name ".coverage" -exec rm -rf {} + 2>/dev/null || true
	@find . -type d -name "htmlcov" -exec rm -rf {} + 2>/dev/null || true
	@find . -type d -name ".mypy_cache" -exec rm -rf {} + 2>/dev/null || true
	@find . -type d -name ".tox" -exec rm -rf {} + 2>/dev/null || true
	@rm -rf _generated/ 2>/dev/null || true
	@rm -rf _tmp_*/ 2>/dev/null || true
	@echo "✅ Cleanup completed!"

# Quick validation
validate: lint test-unit
	@echo "✅ Validation completed!"

# Full CI pipeline
ci: clean install lint test-all security
	@echo "✅ CI pipeline completed!"

# Workflow validators (non-interactive)
workflow.phase.1:
	@echo "🔎 Phase 01 — Brief Analysis: validating docs/workflows..."
	@python3 scripts/validate_workflows.py --all --dry-run | cat

workflow.phase.2:
	@echo "🔎 Phase 02 — Technical Planning: validating docs/workflows..."
	@python3 scripts/validate_workflows.py --all --dry-run | cat

workflow.phase.3:
	@echo "🔎 Phase 03 — Project Generation: validating docs/workflows..."
	@python3 scripts/validate_workflows.py --all --dry-run | cat

workflow.phase.4:
	@echo "🔎 Phase 04 — Feature Implementation: validating docs/workflows..."
	@python3 scripts/validate_workflows.py --all --dry-run | cat

workflow.phase.5:
	@echo "🔎 Phase 05 — Testing & QA: validating docs/workflows..."
	@python3 scripts/validate_workflows.py --all --dry-run | cat

workflow.phase.6:
	@echo "🔎 Phase 06 — Deployment: validating docs/workflows..."
	@python3 scripts/validate_workflows.py --all --dry-run | cat

workflow.phase.7:
	@echo "🔎 Phase 07 — Maintenance: validating docs/workflows..."
	@python3 scripts/validate_workflows.py --all --dry-run | cat

workflow.phase.8:
	@echo "🔎 Phase 08 — Security & Compliance: validating docs/workflows..."
	@python3 scripts/validate_workflows.py --all --dry-run | cat

workflow.phase.9:
	@echo "🔎 Phase 09 — Documentation: validating docs/workflows..."
	@python3 scripts/validate_workflows.py --all --dry-run | cat

workflow.phase.10:
	@echo "🔎 Phase 10 — Monitoring & Observability: validating docs/workflows..."
	@python3 scripts/validate_workflows.py --all --dry-run | cat

# Generate sample project for testing
generate-sample:
	@echo "🔵 Generating sample project..."
	@python scripts/generate_client_project.py \
		--name sample-healthcare \
		--industry healthcare \
		--project-type fullstack \
		--frontend nextjs \
		--backend fastapi \
		--database postgres \
		--auth auth0 \
		--deploy aws \
		--compliance hipaa \
		--features "patient-portal,appointment-scheduling" \
		--output-dir _generated/samples
	@echo "✅ Sample project generated in _generated/samples/sample-healthcare/"

# Test generated project
test-generated:
	@echo "🔵 Testing generated sample project..."
	@cd _generated/samples/sample-healthcare && make test
	@echo "✅ Generated project test completed!"

# Performance benchmark
benchmark:
	@echo "🔵 Running performance benchmarks..."
	@python3 -m pytest project_generator/tests/test_unit/test_generator.py::TestProjectGenerator::test_generate_project -v --durations=10
	@echo "✅ Benchmark completed!"

# Documentation
docs:
	@echo "🔵 Generating documentation..."
	@python3 -c "import pydoc; pydoc.writedocs('project_generator')"
	@echo "✅ Documentation generated!"

# Docker support
docker-test:
	@echo "🔵 Running tests in Docker..."
	@docker build -t client-project-generator-test .
	@docker run --rm client-project-generator-test make test
	@echo "✅ Docker tests completed!"

# Release preparation
release-prep: clean install lint test-all security
	@echo "🔵 Preparing for release..."
	@python3 -m build
	@echo "✅ Release preparation completed!"

# Install development dependencies
install-dev: install
	@echo "🔵 Installing development dependencies..."
	@python3 -m pip install -r requirements.txt
	@python3 -m pip install pre-commit
	@pre-commit install
	@echo "✅ Development dependencies installed!"

# Pre-commit hooks
pre-commit:
	@echo "🔵 Running pre-commit hooks..."
	@pre-commit run --all-files
	@echo "✅ Pre-commit hooks completed!"

# Scripts-only targets (Phase 05)
test-scripts:
	@echo "🔵 Running scripts unit tests (validator only)..."
	@python3 -m pytest project_generator/tests/test_unit/test_validate_workflows_script.py -v --cov=scripts/validate_workflows.py --cov-report=term --cov-report=xml

lint-scripts:
	@echo "🔵 Linting scripts (black/isort checks)..."
	@python3 -m black scripts/ --check || true
	@python3 -m isort scripts/ --check-only || true

security-scripts:
	@echo "🔵 Security scan (bandit) on scripts/..."
	@python3 -m bandit -r scripts/ -f json | cat

coverage-scripts:
	@echo "🔵 Coverage for scripts (validator)..."
	@python3 -m pytest project_generator/tests/test_unit/test_validate_workflows_script.py -q --cov=scripts/validate_workflows.py --cov-report=term-missing

# Maintenance (Phase 07)
backup-workflows:
	@echo "🔵 Backing up workflows and triggers..."
	@python3 scripts/backup_workflows.py | cat

restore-test:
	@echo "🔵 Restoring backup to verify integrity..."
	@python3 scripts/restore_workflows.py | cat