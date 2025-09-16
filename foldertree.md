.
├── _generated
│   ├── test-projects
│   │   ├── test-compliance
│   │   │   ├── gates_config.yaml
│   │   │   ├── gates_config_finance.yaml
│   │   │   └── gates_config_healthcare.yaml
│   │   └── verify-isolation
│   │       ├── .devcontainer
│   │       │   └── devcontainer.json
│   │       ├── .github
│   │       │   └── workflows
│   │       │       ├── ci-deploy.yml
│   │       │       ├── ci-lint.yml
│   │       │       ├── ci-security.yml
│   │       │       └── ci-test.yml
│   │       ├── .gitignore
│   │       ├── Makefile
│   │       ├── README.md
│   │       ├── backend
│   │       │   ├── .env.example
│   │       │   ├── Dockerfile
│   │       │   ├── README.md
│   │       │   ├── apps
│   │       │   │   ├── __init__.py
│   │       │   │   ├── authentication
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── models.py
│   │       │   │   │   ├── serializers.py
│   │       │   │   │   ├── tests.py
│   │       │   │   │   ├── urls.py
│   │       │   │   │   └── views.py
│   │       │   │   ├── core
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── management
│   │       │   │   │   │   ├── __init__.py
│   │       │   │   │   │   └── commands
│   │       │   │   │   │       ├── __init__.py
│   │       │   │   │   │       └── seed.py
│   │       │   │   │   ├── models.py
│   │       │   │   │   ├── serializers.py
│   │       │   │   │   ├── tests.py
│   │       │   │   │   ├── urls.py
│   │       │   │   │   └── views.py
│   │       │   │   └── users
│   │       │   │       ├── __init__.py
│   │       │   │       ├── models.py
│   │       │   │       ├── serializers.py
│   │       │   │       ├── tests.py
│   │       │   │       ├── urls.py
│   │       │   │       └── views.py
│   │       │   ├── manage.py
│   │       │   ├── pytest.ini
│   │       │   ├── requirements.txt
│   │       │   ├── scripts
│   │       │   │   ├── migrate.sh
│   │       │   │   └── setup.sh
│   │       │   └── {{PROJECT_NAME}}
│   │       │       ├── __init__.py
│   │       │       ├── asgi.py
│   │       │       ├── celery.py
│   │       │       ├── settings
│   │       │       │   ├── __init__.py
│   │       │       │   ├── base.py
│   │       │       │   ├── development.py
│   │       │       │   ├── production.py
│   │       │       │   └── testing.py
│   │       │       ├── urls.py
│   │       │       └── wsgi.py
│   │       ├── database
│   │       │   └── base
│   │       │       ├── .env.example
│   │       │       ├── README.md
│   │       │       ├── backup
│   │       │       │   ├── backup.sh
│   │       │       │   └── restore.sh
│   │       │       ├── docker-compose.yml
│   │       │       ├── init-mongo.js
│   │       │       ├── schemas
│   │       │       │   ├── mongoose
│   │       │       │   │   ├── auditLog.schema.ts
│   │       │       │   │   ├── index.ts
│   │       │       │   │   ├── session.schema.ts
│   │       │       │   │   └── user.schema.ts
│   │       │       │   └── prisma
│   │       │       │       └── schema.prisma
│   │       │       └── scripts
│   │       │           ├── backup.sh
│   │       │           └── restore.sh
│   │       ├── docker-compose.yml
│   │       ├── docs
│   │       │   └── API.md
│   │       ├── frontend
│   │       │   ├── .env.example
│   │       │   ├── README.md
│   │       │   ├── next.config.js
│   │       │   ├── package.json
│   │       │   ├── src
│   │       │   │   ├── app
│   │       │   │   │   ├── dashboard
│   │       │   │   │   │   └── page.tsx
│   │       │   │   │   ├── globals.css
│   │       │   │   │   ├── layout.tsx
│   │       │   │   │   ├── page.tsx
│   │       │   │   │   └── providers.tsx
│   │       │   │   ├── hooks
│   │       │   │   │   └── useApi.ts
│   │       │   │   └── lib
│   │       │   │       └── api.ts
│   │       │   ├── tailwind.config.ts
│   │       │   └── tsconfig.json
│   │       ├── gates_config.yaml
│   │       ├── gates_config_finance.yaml
│   │       └── gates_config_healthcare.yaml
├── _tmp_next
│   ├── README.md
│   ├── jest.config.js
│   ├── jest.setup.ts
│   ├── next.config.js
│   ├── package-lock.json
│   ├── package.json
│   ├── src
│   │   ├── app
│   │   │   ├── dashboard
│   │   │   │   └── page.tsx
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   ├── page.test.tsx
│   │   │   ├── page.tsx
│   │   │   └── providers.tsx
│   │   ├── hooks
│   │   │   └── useApi.ts
│   │   └── lib
│   │       └── api.ts
│   ├── tailwind.config.ts
│   └── tsconfig.json
├── ai-direct-communication.mdc
├── baselines
│   └── routing_logs
│       ├── 52f02c75-8bc6-493f-9471-50fd9ceadc35.json
│       └── c3cf3a4e-cea0-42bc-b0bf-afaee5157ec6.json
├── ci
│   └── gates.yml
├── conftest.py
├── contracts_repo_flow.png
├── convert_rules_for_routing.py
├── debug_runner.py
├── docs
│   ├── ARCHITECTURE.md
│   ├── COMPLIANCE.md
│   ├── TEMPLATES.md
│   ├── briefs
│   │   └── project1
│   │       ├── brief.md
│   │       └── shema.json
│   ├── design
│   │   └── tokens.json
│   └── interaction
│       └── modal.json
├── find_duplicates.py
├── fix_yaml_frontmatter.py
├── fix_yaml_syntax.py
├── get-pip.py
├── healthtech-demo
│   ├── .cursor
│   │   ├── dev-workflow
│   │   │   ├── ai_context.json
│   │   │   └── router_config.json
│   │   ├── project.json
│   │   └── rules
│   │       ├── client-specific-rules.mdc
│   │       ├── common-rules
│   │       │   ├── common-rule-client-industry-patterns.mdc
│   │       │   ├── common-rule-monorepo-setup-conventions.mdc
│   │       │   ├── common-rule-ui-foundation-design-system.mdc
│   │       │   ├── common-rule-ui-interaction-a11y-perf.mdc
│   │       │   └── common-rule-ui-premium-brand-dataviz-enterprise-gated.mdc
│   │       ├── industry-compliance-hipaa.mdc
│   │       ├── master-rules
│   │       │   ├── 0-how-to-create-effective-rules.mdc
│   │       │   ├── 1-master-rule-context-discovery.mdc
│   │       │   ├── 2-master-rule-ai-collaboration-guidelines.mdc
│   │       │   ├── 3-master-rule-code-quality-checklist.mdc
│   │       │   ├── 4-master-rule-code-modification-safety-protocol.mdc
│   │       │   ├── 5-master-rule-documentation-and-context-guidelines.mdc
│   │       │   ├── 6-master-rule-complex-feature-context-preservation.mdc
│   │       │   ├── 7-dev-workflow-command-router.mdc
│   │       │   ├── 8-auditor-validator-protocol.mdc
│   │       │   ├── 9-governance-precedence.mdc
│   │       │   └── F8-security-and-compliance-overlay.mdc
│   │       ├── pci-compliance.mdc
│   │       ├── project-rules
│   │       │   ├── accessibility.mdc
│   │       │   ├── al.mdc
│   │       │   ├── alpine-js.mdc
│   │       │   ├── android.mdc
│   │       │   ├── angular.mdc
│   │       │   ├── api.mdc
│   │       │   ├── arduino-framework.mdc
│   │       │   ├── aspnet.mdc
│   │       │   ├── astro.mdc
│   │       │   ├── autohotkey.mdc
│   │       │   ├── axi.mdc
│   │       │   ├── azure.mdc
│   │       │   ├── backend-development.mdc
│   │       │   ├── best-practices.mdc
│   │       │   ├── blockchain.mdc
│   │       │   ├── bootstrap.mdc
│   │       │   ├── browser-api.mdc
│   │       │   ├── clean-architecture.mdc
│   │       │   ├── cms.mdc
│   │       │   ├── convex.mdc
│   │       │   ├── cot.mdc
│   │       │   ├── cpp.mdc
│   │       │   ├── cross-platform-desktop-app.mdc
│   │       │   ├── css.mdc
│   │       │   ├── cybersecurity.mdc
│   │       │   ├── data-analyst.mdc
│   │       │   ├── deep-learning.mdc
│   │       │   ├── django.mdc
│   │       │   ├── elixir.mdc
│   │       │   ├── enterprise.mdc
│   │       │   ├── ex.mdc
│   │       │   ├── expo.mdc
│   │       │   ├── fastapi.mdc
│   │       │   ├── fastify.mdc
│   │       │   ├── feature-first.mdc
│   │       │   ├── firebase.mdc
│   │       │   ├── flask.mdc
│   │       │   ├── flutter.mdc
│   │       │   ├── franework.mdc
│   │       │   ├── function.mdc
│   │       │   ├── game-development.mdc
│   │       │   ├── gatsby.mdc
│   │       │   ├── ghost-cms.mdc
│   │       │   ├── ghost.mdc
│   │       │   ├── global.mdc
│   │       │   ├── go-testing.mdc
│   │       │   ├── golang.mdc
│   │       │   ├── graphql.mdc
│   │       │   ├── html.mdc
│   │       │   ├── htmx.mdc
│   │       │   ├── i18n.mdc
│   │       │   ├── ibc.mdc
│   │       │   ├── infrastructure-as-code.mdc
│   │       │   ├── ionic.mdc
│   │       │   ├── jakarta-ee.mdc
│   │       │   ├── java.mdc
│   │       │   ├── javascript.mdc
│   │       │   ├── julia.mdc
│   │       │   ├── kotlin.mdc
│   │       │   ├── laravel.mdc
│   │       │   ├── livewire.mdc
│   │       │   ├── lua.mdc
│   │       │   ├── machine-learning.mdc
│   │       │   ├── manifest.mdc
│   │       │   ├── meta-prompt.mdc
│   │       │   ├── microservices.mdc
│   │       │   ├── mongodb.mdc
│   │       │   ├── mpsc.mdc
│   │       │   ├── nethttp.mdc
│   │       │   ├── nextjs-a11y.mdc
│   │       │   ├── nextjs-formatting.mdc
│   │       │   ├── nextjs-rsc-and-client.mdc
│   │       │   ├── nextjs.mdc
│   │       │   ├── node.mdc
│   │       │   ├── nodejs.mdc
│   │       │   ├── observability.mdc
│   │       │   ├── official.mdc
│   │       │   ├── onchainkit.mdc
│   │       │   ├── open-api.mdc
│   │       │   ├── orm.mdc
│   │       │   ├── package-management.mdc
│   │       │   ├── paraglide-js.mdc
│   │       │   ├── pci-compliance.mdc
│   │       │   ├── performance.mdc
│   │       │   ├── php.mdc
│   │       │   ├── pixijs.mdc
│   │       │   ├── playwright.mdc
│   │       │   ├── popular.mdc
│   │       │   ├── python.mdc
│   │       │   ├── rails.mdc
│   │       │   ├── react-native.mdc
│   │       │   ├── react.mdc
│   │       │   ├── redux.mdc
│   │       │   ├── reflection.mdc
│   │       │   ├── remix.mdc
│   │       │   ├── responsive-design.mdc
│   │       │   ├── rest-api.mdc
│   │       │   ├── robocorp.mdc
│   │       │   ├── rspec.mdc
│   │       │   ├── rust.mdc
│   │       │   ├── salesforce.mdc
│   │       │   ├── sanity.mdc
│   │       │   ├── serverless.mdc
│   │       │   ├── shadcn-ui.mdc
│   │       │   ├── smart-contracts.mdc
│   │       │   ├── sox-compliance.mdc
│   │       │   ├── spring.mdc
│   │       │   ├── standard-js.mdc
│   │       │   ├── supabase.mdc
│   │       │   ├── svelte.mdc
│   │       │   ├── sveltekit.mdc
│   │       │   ├── swift.mdc
│   │       │   ├── tailwind.mdc
│   │       │   ├── terraform.mdc
│   │       │   ├── threejs.mdc
│   │       │   ├── timing-optimization.mdc
│   │       │   ├── trajectory-analysis.mdc
│   │       │   ├── tutorials.mdc
│   │       │   ├── typescript.mdc
│   │       │   ├── ui.mdc
│   │       │   ├── unity.mdc
│   │       │   ├── ux.mdc
│   │       │   ├── viem-v2.mdc
│   │       │   ├── vite.mdc
│   │       │   ├── vivado.mdc
│   │       │   ├── vue.mdc
│   │       │   ├── web-development.mdc
│   │       │   ├── web-scraping.mdc
│   │       │   ├── web3js.mdc
│   │       │   ├── webshop.mdc
│   │       │   ├── woocommerce.mdc
│   │       │   ├── wordpress.mdc
│   │       │   └── zod.mdc
│   │       ├── project-workflow.mdc
│   │       ├── security-compliance-overlay.mdc
│   │       └── sox-compliance.mdc
│   ├── .devcontainer
│   │   └── devcontainer.json
│   ├── .github
│   │   └── workflows
│   │       ├── ci-deploy.yml
│   │       ├── ci-lint.yml
│   │       ├── ci-security.yml
│   │       └── ci-test.yml
│   ├── .gitignore
│   ├── .pre-commit-config.yaml
│   ├── Makefile
│   ├── README.md
│   ├── backend
│   │   ├── .env.example
│   │   ├── Dockerfile
│   │   ├── README.md
│   │   ├── app
│   │   │   ├── __init__.py
│   │   │   ├── api
│   │   │   │   ├── __init__.py
│   │   │   │   └── v1
│   │   │   │       ├── endpoints
│   │   │   │       │   ├── appointments.py
│   │   │   │       │   ├── medical_records.py
│   │   │   │       │   ├── patients.py
│   │   │   │       │   └── realtime.py
│   │   │   │       └── router.py
│   │   │   ├── config.py
│   │   │   ├── core
│   │   │   │   ├── audit.py
│   │   │   │   ├── compliance.py
│   │   │   │   └── security.py
│   │   │   ├── database.py
│   │   │   ├── models
│   │   │   │   ├── appointment.py
│   │   │   │   ├── audit_log.py
│   │   │   │   ├── medical_record.py
│   │   │   │   ├── patient.py
│   │   │   │   └── user.py
│   │   │   └── services
│   │   │       ├── audit_service.py
│   │   │       ├── encryption.py
│   │   │       └── notification.py
│   │   ├── main.py
│   │   ├── requirements.txt
│   │   └── src
│   │       └── api
│   │           ├── patient_api.py
│   │           ├── provider_api.py
│   │           └── scheduling_api.py
│   ├── database
│   │   ├── README.md
│   │   ├── docker-compose.yml
│   │   └── init.sql
│   ├── docker-compose.yml
│   ├── docs
│   │   ├── API.md
│   │   ├── COMPLIANCE.md
│   │   ├── DEPLOYMENT.md
│   │   └── DEVELOPMENT.md
│   ├── frontend
│   │   ├── .env.example
│   │   ├── README.md
│   │   ├── next.config.js
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── app
│   │   │   │   ├── dashboard
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── globals.css
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   └── providers.tsx
│   │   │   ├── components
│   │   │   │   ├── charts
│   │   │   │   │   ├── AppointmentChart.tsx
│   │   │   │   │   ├── PatientChart.tsx
│   │   │   │   │   └── RevenueChart.tsx
│   │   │   │   └── dashboard
│   │   │   │       ├── Analytics.tsx
│   │   │   │       ├── AppointmentCalendar.tsx
│   │   │   │       ├── MedicalRecords.tsx
│   │   │   │       └── PatientDashboard.tsx
│   │   │   ├── hooks
│   │   │   │   ├── useApi.ts
│   │   │   │   ├── useAudit.ts
│   │   │   │   ├── useAuth.ts
│   │   │   │   └── useSecurity.ts
│   │   │   ├── lib
│   │   │   │   ├── api.ts
│   │   │   │   ├── auth.ts
│   │   │   │   ├── compliance.ts
│   │   │   │   └── security.ts
│   │   │   └── pages
│   │   │       ├── appointment_calendar.tsx
│   │   │       ├── dashboard.tsx
│   │   │       └── patient_list.tsx
│   │   ├── tailwind.config.ts
│   │   └── tsconfig.json
│   └── gates_config.yaml
├── legal-doc-platform
│   ├── .cursor
│   │   ├── dev-workflow
│   │   │   ├── client-prd-template.md
│   │   │   └── client-tasks-template.md
│   │   └── rules
│   │       ├── client-specific-rules.mdc
│   │       └── industry-compliance.mdc
│   ├── README.md
│   ├── SETUP.md
│   ├── backend
│   │   ├── Dockerfile
│   │   ├── apps
│   │   │   ├── audit
│   │   │   │   └── models.py
│   │   │   └── documents
│   │   │       └── models.py
│   │   ├── config
│   │   │   ├── settings.py
│   │   │   └── urls.py
│   │   ├── manage.py
│   │   └── requirements.txt
│   ├── database
│   │   └── schemas
│   │       └── legal_docs_schema.sql
│   ├── deployment
│   │   ├── docker-compose.yml
│   │   └── nginx
│   │       └── nginx.conf
│   ├── docs
│   │   └── technical-architecture.md
│   └── frontend
│       ├── Dockerfile
│       ├── app
│       │   ├── globals.css
│       │   ├── layout.tsx
│       │   └── providers.tsx
│       ├── components
│       │   └── documents
│       │       └── DocumentCard.tsx
│       ├── lib
│       │   └── auth-context.tsx
│       ├── next.config.js
│       ├── package.json
│       └── tailwind.config.js
├── nly main
├── noxfile.py
├── optimize_rules.py
├── policy-tests
│   └── baseline.yaml
├── popular.html
├── prd-ai-governor-enhancement.md
├── project_generator
│   ├── __init__.py
│   ├── __pycache__
│   │   ├── __init__.cpython-313.pyc
│   │   ├── core
│   │   │   ├── __init__.cpython-313.pyc
│   │   │   ├── generator.cpython-313.pyc
│   │   │   ├── industry_config.cpython-313.pyc
│   │   │   └── validator.cpython-313.pyc
│   │   ├── integrations
│   │   │   ├── __init__.cpython-313.pyc
│   │   │   └── ai_governor.cpython-313.pyc
│   │   └── templates
│   │       ├── __init__.cpython-313.pyc
│   │       └── template_engine.cpython-313.pyc
│   ├── core
│   │   ├── __init__.py
│   │   ├── brief_parser.py
│   │   ├── generator.py
│   │   ├── industry_config.py
│   │   └── validator.py
│   ├── integrations
│   │   ├── __init__.py
│   │   ├── ai_governor.py
│   │   └── git.py
│   ├── templates
│   │   ├── __init__.py
│   │   ├── registry.py
│   │   └── template_engine.py
│   └── tests
│       ├── __init__.py
│       └── test_validation.py
├── remove_duplicates.py
├── rule_optimization_report.json
├── sample
│   ├── sample1.md
│   └── sample2.md
├── scaffold-role-generator.mdc
├── scrape_cursor_rules.py
├── scripts
│   ├── benchmark_generation.py
│   ├── doctor.py
│   ├── generate_client_project.py
│   ├── generate_from_brief.py
│   ├── plan_from_brief.py
│   ├── router_benchmark.py
│   ├── setup_template_tests.sh
│   ├── test_policy_decisions.py
│   └── trigger_plan.py
├── src
│   ├── backend
│   │   └── .gitkeep
│   └── frontend
│       └── .gitkeep
├── standardize_metadata.py
├── system_update_report_20250908_011949.md
├── tasks-ai-governor-enhancement.md
├── tatus
├── template-packs
│   ├── README-NO-INSTALL.md
│   ├── backend
│   │   ├── django
│   │   │   ├── base
│   │   │   │   ├── .env.example
│   │   │   │   ├── Dockerfile
│   │   │   │   ├── README.md
│   │   │   │   ├── apps
│   │   │   │   │   ├── __init__.py
│   │   │   │   │   ├── authentication
│   │   │   │   │   │   ├── __init__.py
│   │   │   │   │   │   ├── models.py
│   │   │   │   │   │   ├── serializers.py
│   │   │   │   │   │   ├── tests.py
│   │   │   │   │   │   ├── urls.py
│   │   │   │   │   │   └── views.py
│   │   │   │   │   ├── core
│   │   │   │   │   │   ├── __init__.py
│   │   │   │   │   │   ├── management
│   │   │   │   │   │   │   ├── __init__.py
│   │   │   │   │   │   │   └── commands
│   │   │   │   │   │   │       ├── __init__.py
│   │   │   │   │   │   │       ├── bootstrap.py
│   │   │   │   │   │   │       └── seed.py
│   │   │   │   │   │   ├── models.py
│   │   │   │   │   │   ├── serializers.py
│   │   │   │   │   │   ├── tests.py
│   │   │   │   │   │   ├── urls.py
│   │   │   │   │   │   └── views.py
│   │   │   │   │   └── users
│   │   │   │   │       ├── __init__.py
│   │   │   │   │       ├── models.py
│   │   │   │   │       ├── serializers.py
│   │   │   │   │       ├── tests.py
│   │   │   │   │       ├── urls.py
│   │   │   │   │       └── views.py
│   │   │   │   ├── manage.py
│   │   │   │   ├── pytest.ini
│   │   │   │   ├── requirements.txt
│   │   │   │   ├── scripts
│   │   │   │   │   ├── migrate.sh
│   │   │   │   │   └── setup.sh
│   │   │   │   └── {{PROJECT_NAME}}
│   │   │   │       ├── __init__.py
│   │   │   │       ├── asgi.py
│   │   │   │       ├── celery.py
│   │   │   │       ├── settings
│   │   │   │       │   ├── __init__.py
│   │   │   │       │   ├── base.py
│   │   │   │       │   ├── development.py
│   │   │   │       │   ├── production.py
│   │   │   │       │   └── testing.py
│   │   │   │       ├── urls.py
│   │   │   │       └── wsgi.py
│   │   │   └── template.manifest.json
│   │   ├── fastapi
│   │   │   ├── base
│   │   │   │   ├── .env.example
│   │   │   │   ├── Dockerfile
│   │   │   │   ├── README.md
│   │   │   │   ├── alembic
│   │   │   │   │   ├── README
│   │   │   │   │   ├── env.py
│   │   │   │   │   └── script.py.mako
│   │   │   │   ├── alembic.ini
│   │   │   │   ├── app
│   │   │   │   │   ├── __init__.py
│   │   │   │   │   ├── api
│   │   │   │   │   │   ├── __init__.py
│   │   │   │   │   │   ├── deps.py
│   │   │   │   │   │   └── v1
│   │   │   │   │   │       ├── endpoints
│   │   │   │   │   │       │   ├── __init__.py
│   │   │   │   │   │       │   ├── auth.py
│   │   │   │   │   │       │   └── users.py
│   │   │   │   │   │       └── router.py
│   │   │   │   │   ├── config.py
│   │   │   │   │   ├── core
│   │   │   │   │   │   ├── __init__.py
│   │   │   │   │   │   └── security.py
│   │   │   │   │   ├── crud
│   │   │   │   │   │   ├── __init__.py
│   │   │   │   │   │   ├── base.py
│   │   │   │   │   │   └── crud_user.py
│   │   │   │   │   ├── database.py
│   │   │   │   │   ├── models
│   │   │   │   │   │   ├── __init__.py
│   │   │   │   │   │   └── user.py
│   │   │   │   │   ├── schemas
│   │   │   │   │   │   ├── __init__.py
│   │   │   │   │   │   ├── msg.py
│   │   │   │   │   │   ├── token.py
│   │   │   │   │   │   └── user.py
│   │   │   │   │   ├── services
│   │   │   │   │   │   └── __init__.py
│   │   │   │   │   └── utils
│   │   │   │   │       └── __init__.py
│   │   │   │   ├── main.py
│   │   │   │   ├── requirements.txt
│   │   │   │   ├── scripts
│   │   │   │   │   ├── init_db.py
│   │   │   │   │   └── setup.sh
│   │   │   │   └── tests
│   │   │   │       ├── __init__.py
│   │   │   │       ├── conftest.py
│   │   │   │       └── test_main.py
│   │   │   └── template.manifest.json
│   │   ├── go
│   │   │   ├── base
│   │   │   │   ├── .air.toml
│   │   │   │   ├── .env.example
│   │   │   │   ├── .gitignore
│   │   │   │   ├── Dockerfile
│   │   │   │   ├── Makefile
│   │   │   │   ├── README.md
│   │   │   │   ├── go.mod
│   │   │   │   ├── internal
│   │   │   │   │   ├── api
│   │   │   │   │   │   ├── handlers
│   │   │   │   │   │   │   ├── auth.go
│   │   │   │   │   │   │   ├── health.go
│   │   │   │   │   │   │   ├── health_test.go
│   │   │   │   │   │   │   ├── root.go
│   │   │   │   │   │   │   └── user.go
│   │   │   │   │   │   ├── middleware
│   │   │   │   │   │   │   └── auth.go
│   │   │   │   │   │   ├── requests
│   │   │   │   │   │   │   ├── auth.go
│   │   │   │   │   │   │   └── user.go
│   │   │   │   │   │   ├── responses
│