import os
import nox


ROOT = os.path.dirname(__file__)


@nox.session(reuse_venv=True)
def generator(session: nox.Session):
    session.install('pytest')
    session.run('pytest', '-q', 'project_generator/tests', '-vv')


@nox.session
def fastapi(session: nox.Session):
    base = os.path.join(ROOT, 'template-packs', 'backend', 'fastapi', 'base')
    session.cd(base)
    session.install('-r', 'requirements.txt')
    session.run('pytest', '-q', 'tests', '-vv')


@nox.session
def django(session: nox.Session):
    base = os.path.join(ROOT, 'template-packs', 'backend', 'django', 'base')
    session.cd(base)
    session.install('-r', 'requirements.txt')
    session.run('python', 'manage.py', 'test', '--noinput')


@nox.session
def next(session: nox.Session):
    base = os.path.join(ROOT, 'template-packs', 'frontend', 'nextjs', 'base')
    session.cd(base)
    session.run('npm', 'ci', external=True)
    session.run('npm', 'test', external=True)


@nox.session
def angular(session: nox.Session):
    base = os.path.join(ROOT, 'template-packs', 'frontend', 'angular', 'base')
    session.cd(base)
    session.run('npm', 'ci', external=True)
    # Headless if Chrome exists
    session.run('npm', 'run', 'test', '--', '--watch=false', '--browsers=ChromeHeadless', external=True)

