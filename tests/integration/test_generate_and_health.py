import os
import subprocess
import sys
from pathlib import Path
import subprocess
import os


def _run(cmd: list[str], cwd: str | None = None) -> subprocess.CompletedProcess:
    return subprocess.run(cmd, cwd=cwd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, check=False)


def _ensure_runtime_deps():
    try:
        import sqlalchemy  # noqa: F401
    except Exception:
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-q', 'SQLAlchemy'], check=False)
    # auth/security deps imported by templates
    try:
        import jose  # type: ignore # noqa: F401
    except Exception:
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-q', 'python-jose[cryptography]'], check=False)
    try:
        import passlib  # type: ignore # noqa: F401
    except Exception:
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-q', 'passlib[bcrypt]'], check=False)
    try:
        import pydantic_settings  # type: ignore # noqa: F401
    except Exception:
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-q', 'pydantic-settings'], check=False)
    try:
        import email_validator  # type: ignore # noqa: F401
    except Exception:
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-q', 'email-validator'], check=False)
    try:
        import multipart  # type: ignore # noqa: F401
    except Exception:
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-q', 'python-multipart'], check=False)


def _fastapi_health_ok(backend_dir: Path) -> bool:
    sys.path.insert(0, str(backend_dir))
    try:
        # avoid heavy deps: force sqlite and ensure SQLAlchemy only
        os.environ['DATABASE_URL'] = 'sqlite:///./test.db'
        _ensure_runtime_deps()
        from fastapi.testclient import TestClient  # type: ignore
        import importlib
        main = importlib.import_module('main')
        app = getattr(main, 'app', None)
        assert app is not None, 'FastAPI app not found in main.py'
        client = TestClient(app)
        resp = client.get('/health')
        return resp.status_code == 200
    finally:
        sys.path.remove(str(backend_dir))


def test_generate_fastapi_fullstack_health(tmp_path):
    outdir = tmp_path / 'gen'
    outdir.mkdir(parents=True, exist_ok=True)
    cmd = [
        sys.executable, '/workspace/scripts/generate_client_project.py',
        '--name', 'stack-fastapi',
        '--industry', 'ecommerce',
        '--project-type', 'fullstack',
        '--frontend', 'nextjs',
        '--backend', 'fastapi',
        '--database', 'postgres',
        '--auth', 'auth0',
        '--deploy', 'self-hosted',
        '--output-dir', str(outdir),
        '--yes', '--no-git', '--no-install', '--skip-system-checks'
    ]
    res = _run(cmd)
    assert res.returncode == 0, res.stdout

    proj = outdir / 'stack-fastapi'
    assert proj.exists()
    backend = proj / 'backend'
    assert (backend / 'main.py').exists(), 'fastapi main.py missing'
    assert _fastapi_health_ok(backend)


def test_generate_fastapi_api_health(tmp_path):
    outdir = tmp_path / 'gen_api'
    outdir.mkdir(parents=True, exist_ok=True)
    cmd = [
        sys.executable, '/workspace/scripts/generate_client_project.py',
        '--name', 'api-fastapi',
        '--industry', 'saas',
        '--project-type', 'api',
        '--frontend', 'none',
        '--backend', 'fastapi',
        '--database', 'postgres',
        '--auth', 'auth0',
        '--deploy', 'self-hosted',
        '--output-dir', str(outdir),
        '--yes', '--no-git', '--no-install', '--skip-system-checks'
    ]
    res = _run(cmd)
    assert res.returncode == 0, res.stdout

    proj = outdir / 'api-fastapi'
    assert proj.exists()
    backend = proj / 'backend'
    assert (backend / 'main.py').exists(), 'fastapi main.py missing'
    assert _fastapi_health_ok(backend)
