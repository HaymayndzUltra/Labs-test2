"""
Pytest configuration and fixtures for Client Project Generator tests
"""

import pytest
import tempfile
import shutil
import os
import sys
from pathlib import Path
from unittest.mock import Mock, patch
from typing import Generator, Dict, Any

# Add project_generator to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'project_generator'))

from project_generator.core.generator import ProjectGenerator
from project_generator.core.validator import ProjectValidator
from project_generator.core.industry_config import IndustryConfig


@pytest.fixture
def temp_dir() -> Generator[Path, None, None]:
    """Create a temporary directory for testing"""
    temp_path = Path(tempfile.mkdtemp())
    yield temp_path
    shutil.rmtree(temp_path, ignore_errors=True)


@pytest.fixture
def sample_config() -> Dict[str, Any]:
    """Sample project configuration for testing"""
    return {
        'name': 'test-project',
        'industry': 'healthcare',
        'project_type': 'fullstack',
        'frontend': 'nextjs',
        'backend': 'fastapi',
        'database': 'postgres',
        'auth': 'auth0',
        'deploy': 'aws',
        'compliance': ['hipaa'],
        'features': ['patient-portal', 'appointment-scheduling']
    }


@pytest.fixture
def generator(temp_dir: Path) -> ProjectGenerator:
    """Create a ProjectGenerator instance for testing"""
    return ProjectGenerator(
        output_dir=temp_dir,
        template_dir=Path(__file__).parent / 'template-packs'
    )


@pytest.fixture
def validator() -> ProjectValidator:
    """Create a ProjectValidator instance for testing"""
    return ProjectValidator()


@pytest.fixture
def industry_config() -> IndustryConfig:
    """Create an IndustryConfig instance for testing"""
    return IndustryConfig()


@pytest.fixture
def mock_docker():
    """Mock Docker operations for testing"""
    with patch('subprocess.run') as mock_run:
        mock_run.return_value = Mock(returncode=0, stdout=b'', stderr=b'')
        yield mock_run


@pytest.fixture
def mock_git():
    """Mock Git operations for testing"""
    with patch('subprocess.run') as mock_run:
        mock_run.return_value = Mock(returncode=0, stdout=b'', stderr=b'')
        yield mock_run


@pytest.fixture
def sample_template_files(temp_dir: Path) -> Dict[str, Path]:
    """Create sample template files for testing"""
    template_dir = temp_dir / 'templates'
    template_dir.mkdir(parents=True, exist_ok=True)
    
    # Create sample template structure
    (template_dir / 'frontend' / 'nextjs' / 'base').mkdir(parents=True, exist_ok=True)
    (template_dir / 'backend' / 'fastapi' / 'base').mkdir(parents=True, exist_ok=True)
    (template_dir / 'database' / 'postgres' / 'base').mkdir(parents=True, exist_ok=True)
    
    # Create sample files
    files = {
        'package_json': template_dir / 'frontend' / 'nextjs' / 'base' / 'package.json',
        'main_py': template_dir / 'backend' / 'fastapi' / 'base' / 'main.py',
        'docker_compose': template_dir / 'database' / 'postgres' / 'base' / 'docker-compose.yml'
    }
    
    # Write sample content
    files['package_json'].write_text('{"name": "{{PROJECT_NAME}}", "version": "1.0.0"}')
    files['main_py'].write_text('from fastapi import FastAPI\napp = FastAPI(title="{{PROJECT_NAME}}")')
    files['docker_compose'].write_text('version: "3.8"\nservices:\n  postgres:\n    image: postgres:15')
    
    return files


@pytest.fixture(autouse=True)
def setup_test_environment():
    """Setup test environment before each test"""
    # Set test environment variables
    os.environ['TESTING'] = 'true'
    os.environ['LOG_LEVEL'] = 'ERROR'
    
    yield
    
    # Cleanup after test
    if 'TESTING' in os.environ:
        del os.environ['TESTING']
    if 'LOG_LEVEL' in os.environ:
        del os.environ['LOG_LEVEL']


# Pytest configuration
def pytest_configure(config):
    """Configure pytest"""
    config.addinivalue_line(
        "markers", "unit: mark test as a unit test"
    )
    config.addinivalue_line(
        "markers", "integration: mark test as an integration test"
    )
    config.addinivalue_line(
        "markers", "e2e: mark test as an end-to-end test"
    )
    config.addinivalue_line(
        "markers", "slow: mark test as slow running"
    )


def pytest_collection_modifyitems(config, items):
    """Modify test collection"""
    for item in items:
        # Add unit marker to tests in test_unit directory
        if "test_unit" in str(item.fspath):
            item.add_marker(pytest.mark.unit)
        # Add integration marker to tests in test_integration directory
        elif "test_integration" in str(item.fspath):
            item.add_marker(pytest.mark.integration)
        # Add e2e marker to tests in test_e2e directory
        elif "test_e2e" in str(item.fspath):
            item.add_marker(pytest.mark.e2e)
