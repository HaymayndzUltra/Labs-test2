.PHONY: setup dev test lint build deploy clean lifecycle pipeline-validate bootstrap workflow-optimize

ENV ?= staging
FRONTEND_URL ?=
API_URL ?=
DB_URL ?=
WORKFLOW_CONFIG ?= workflow/workflow_config.json
LIFECYCLE_ENV := $(strip \
  $(if $(NAME),NAME="$(NAME)") \
  $(if $(INDUSTRY),INDUSTRY="$(INDUSTRY)") \
  $(if $(PROJECT_TYPE),PROJECT_TYPE="$(PROJECT_TYPE)") \
  $(if $(FE),FE="$(FE)") \
  $(if $(BE),BE="$(BE)") \
  $(if $(DB),DB="$(DB)") \
  $(if $(COMPLIANCE),COMPLIANCE="$(COMPLIANCE)") \
)

# Setup project
setup:
	@echo "Setting up portfolio-dashboard..."
	cd frontend && npm install
	cd backend && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt


	@echo "Setup complete!"

# Start development environment
dev:
	docker-compose up -d
	cd frontend && npm run dev &
	cd backend && python main.py




# Run tests
test:
	cd frontend && npm test -- --ci --coverage --runInBand
	cd backend && pytest --cov=app --cov-report=term-missing --cov-report=xml:../coverage/backend-coverage.xml --cov-fail-under=70
	python scripts/aggregate_coverage.py



# Run linters
lint:
	cd frontend && npm run lint
	cd backend && black . && flake8



# Build for production
build:
	cd frontend && npm run build
	cd backend && python -m build



# Deploy application
deploy:
	@echo "Deploying to vercel..."
	# Add deployment commands here

# Clean build artifacts
clean:
	rm -rf node_modules/
	rm -rf venv/
	rm -rf __pycache__/
	rm -rf dist/
	rm -rf build/
	docker-compose down -v

lifecycle:
	@$(if $(NAME),:,echo "[lifecycle] NAME not provided; set NAME=<client> or ensure workflow.config.json has it." >&2;)
	@$(if $(INDUSTRY),:,echo "[lifecycle] INDUSTRY not provided; set INDUSTRY=<sector> or rely on workflow.config.json." >&2;)
	@$(if $(PROJECT_TYPE),:,echo "[lifecycle] PROJECT_TYPE not provided; set PROJECT_TYPE=<type> or rely on workflow.config.json." >&2;)
	@$(if $(FE),:,echo "[lifecycle] FE not provided; set FE=<frontend> or rely on workflow.config.json." >&2;)
	@$(if $(BE),:,echo "[lifecycle] BE not provided; set BE=<backend> or rely on workflow.config.json." >&2;)
	@$(if $(DB),:,echo "[lifecycle] DB not provided; set DB=<database> or rely on workflow.config.json." >&2;)
	@$(if $(LIFECYCLE_ENV),env $(LIFECYCLE_ENV) ,) ./scripts/e2e_from_brief.sh

pipeline-validate:
	@if [ -z "$(FRONTEND_URL)" ]; then echo "FRONTEND_URL is required" >&2; exit 1; fi
	@if [ -z "$(API_URL)" ]; then echo "API_URL is required" >&2; exit 1; fi
	@if [ -z "$(DB_URL)" ]; then echo "DB_URL is required" >&2; exit 1; fi
	@mkdir -p reports
	@python scripts/health/check_deployment.py --environment $(ENV) --frontend-url $(FRONTEND_URL) --api-url $(API_URL) --db-url $(DB_URL) --out reports/$(ENV)-pipeline-validation.json

bootstrap:
	@python3 scripts/bootstrap_project.py $(if $(NAME),--name "$(NAME)") $(if $(INDUSTRY),--industry "$(INDUSTRY)") $(if $(PROJECT_TYPE),--project-type "$(PROJECT_TYPE)") $(if $(FE),--frontend "$(FE)") $(if $(BE),--backend "$(BE)") $(if $(DB),--database "$(DB)") $(if $(AUTH),--auth "$(AUTH)") $(if $(DEPLOY),--deploy "$(DEPLOY)") $(if $(COMPLIANCE),--compliance "$(COMPLIANCE)") $(if $(CONFIG_FILE),--config-file "$(CONFIG_FILE)") $(if $(OUTPUT_ROOT),--output-root "$(OUTPUT_ROOT)") $(if $(FORCE_OUTPUT),--force) $(if $(BOOTSTRAP_UPDATE_CONFIG),--update-config)

workflow-optimize:
	@python3 scripts/run_workflow_optimization.py run --config "$(WORKFLOW_CONFIG)"
