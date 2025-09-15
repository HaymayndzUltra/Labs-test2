# Contributing to Client Project Generator

Thank you for your interest in contributing to the Client Project Generator! This guide will help you get started.

## 🤝 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:
- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive criticism
- Respect differing viewpoints and experiences

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Docker and Docker Compose
- Git
- Node.js 18+ (for testing frontend templates)
- Make

### Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/client-project-generator.git
   cd client-project-generator
   ```

3. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

4. Install development dependencies:
   ```bash
   pip install -r requirements-dev.txt
   ```

5. Install pre-commit hooks:
   ```bash
   pre-commit install
   ```

## 📝 Contribution Types

### 1. Adding New Templates

#### Frontend Template
1. Create template directory: `template-packs/frontend/<framework>/`
2. Add base, enterprise, and compliance variants
3. Include package.json, configuration files, and example components
4. Update `project_generator/templates/template_engine.py`

Example structure:
```
template-packs/frontend/vue/
├── base/
│   ├── package.json
│   ├── vite.config.js
│   └── src/
├── enterprise/
│   └── (additional enterprise features)
└── compliance/
    └── (compliance-specific components)
```

#### Backend Template
1. Create template directory: `template-packs/backend/<framework>/`
2. Add requirements/package files and boilerplate code
3. Include Docker configuration
4. Update template engine with new generator

### 2. Adding Industry Support

1. Update `project_generator/core/industry_config.py`:
   ```python
   'new_industry': {
       'name': 'Industry Name',
       'default_features': [...],
       'required_features': [...],
       'compliance': [...],
       'recommended_stack': {...}
   }
   ```

2. Add policy rules in `template-packs/policy-dsl/client-generator-policies.yaml`
3. Create compliance rules if needed: `template-packs/rules/industry-compliance-<compliance>.mdc`

### 3. Adding Compliance Standards

1. Create compliance rule file: `template-packs/rules/industry-compliance-<standard>.mdc`
2. Update validator in `project_generator/core/validator.py`
3. Add CI/CD gates in workflow templates
4. Update documentation

### 4. Improving Existing Features

- Enhance error handling
- Add more validation rules
- Improve interactive mode UX
- Add more code snippets
- Enhance documentation

## 🧪 Testing

### Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=project_generator tests/

# Run specific test file
pytest tests/test_generator.py

# Run in watch mode
pytest-watch
```

### Writing Tests

1. Add tests for new features in `tests/`
2. Follow existing test patterns
3. Aim for >80% coverage
4. Test both success and failure cases

Example test:
```python
def test_healthcare_project_generation():
    """Test generating a healthcare project"""
    args = create_test_args(
        name="test-health",
        industry="healthcare",
        project_type="web",
        compliance="hipaa"
    )
    
    generator = ProjectGenerator(args, validator, config)
    result = generator.generate()
    
    assert result['success']
    assert (Path(result['project_path']) / '.cursor' / 'rules').exists()
```

## 🎨 Code Style

### Python
- Follow PEP 8
- Use Black for formatting
- Use type hints where applicable
- Maximum line length: 100 characters

### Templates
- Use consistent indentation (2 spaces for JS/TS, 4 for Python)
- Include helpful comments
- Use template variables: `{{PROJECT_NAME}}`, `{{INDUSTRY}}`, etc.

### Documentation
- Use clear, concise language
- Include code examples
- Update README when adding features
- Add docstrings to all functions
 - For workflow docs, include required YAML frontmatter and required sections per `docs/workflows/CONVENTIONS.md`; validate with `python3 scripts/validate_workflows.py --all`

## 📋 Pull Request Process

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**:
   - Write clean, documented code
   - Add tests for new functionality
   - Update documentation

3. **Run checks locally**:
   ```bash
   make lint
   make test
   ```

4. **Commit with conventional commits**:
   ```bash
   git commit -m "feat: add support for Vue.js templates"
   git commit -m "fix: correct PostgreSQL connection string"
   git commit -m "docs: update README with new examples"
   ```

5. **Push and create PR**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **PR Guidelines**:
   - Clear title and description
   - Reference any related issues
   - Include screenshots for UI changes
   - Ensure all CI checks pass

## 🏗️ Architecture Overview

```
project_generator/
├── core/
│   ├── generator.py        # Main generation logic
│   ├── validator.py        # Configuration validation
│   ├── industry_config.py  # Industry-specific settings
│   └── template_engine.py  # Template processing
├── templates/
│   └── template_engine.py  # Code generation templates
├── integrations/
│   └── ai_governor.py      # AI Governor Framework integration
└── rules/
    └── selection.py        # Smart template selection
```

## 🔍 Code Review Checklist

- [ ] Code follows project style guidelines
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No hardcoded values or secrets
- [ ] Error handling is appropriate
- [ ] Performance impact is considered
- [ ] Security implications reviewed
- [ ] Backward compatibility maintained

## 🐛 Reporting Issues

### Bug Reports

Include:
- Python version
- Operating system
- Steps to reproduce
- Expected vs actual behavior
- Error messages/logs

### Feature Requests

Include:
- Use case description
- Proposed solution
- Alternative approaches
- Impact on existing features

## 📚 Resources

- [Python Style Guide](https://www.python.org/dev/peps/pep-0008/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## 🎉 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Invited to contributor meetings

## 💬 Getting Help

- GitHub Discussions: Ask questions and share ideas
- Discord: Join our community for real-time chat
- Issues: Report bugs or request features

Thank you for contributing to make this project better! 🚀