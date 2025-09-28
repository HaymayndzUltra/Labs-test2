"""Built-in check executors."""

from __future__ import annotations

import importlib
import json
import subprocess
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Tuple

from .exceptions import CheckExecutionError
from .models import CheckDefinition, CheckResult


def _load_callable(dotted_path: str):
    module_name, _, attr = dotted_path.partition(":")
    if not attr:
        module_name, attr = dotted_path.rsplit(".", 1)
    module = importlib.import_module(module_name)
    return getattr(module, attr)


def execute_python_check(
    check: CheckDefinition,
    context: Dict[str, Any],
    collector,
) -> CheckResult:
    """Execute a Python function defined by ``check.target``."""

    started_at = datetime.utcnow()
    func = _load_callable(check.target)
    try:
        result = func(context=context, collector=collector, **check.args)
    except CheckExecutionError:
        raise
    except Exception as exc:  # pragma: no cover - rewrap unexpected errors
        raise CheckExecutionError(str(exc)) from exc

    completed_at = datetime.utcnow()
    details = None
    evidence = []
    status = "pass"

    if isinstance(result, tuple):
        status, details = _normalize_tuple_result(result)
    elif isinstance(result, dict):
        status = result.get("status", "pass")
        details = result.get("details")
        evidence = result.get("evidence", [])
    elif result is False:
        status = "fail"

    return CheckResult(
        check=check,
        status=status,
        started_at=started_at,
        completed_at=completed_at,
        details=details,
        evidence=evidence,
    )


def execute_shell_check(
    check: CheckDefinition,
    context: Dict[str, Any],
    collector,
) -> CheckResult:
    """Execute a shell command check."""

    started_at = datetime.utcnow()
    command = check.target.format(**context)
    shell = check.args.get("shell", False)
    cwd = check.args.get("cwd")
    env = None
    if "env" in check.args:
        env = {key: str(value) for key, value in check.args["env"].items()}

    process = subprocess.run(
        command if shell else command.split(),
        check=False,
        cwd=cwd,
        env=env,
        shell=shell,
        capture_output=True,
        text=True,
    )
    completed_at = datetime.utcnow()

    status = "pass" if process.returncode == 0 else "fail"
    details = json.dumps(
        {
            "stdout": process.stdout,
            "stderr": process.stderr,
            "returncode": process.returncode,
        }
    )

    return CheckResult(
        check=check,
        status=status,
        started_at=started_at,
        completed_at=completed_at,
        details=details,
    )


def execute_check(check: CheckDefinition, context: Dict[str, Any], collector) -> CheckResult:
    """Execute a check based on its type."""

    if check.type == "python":
        return execute_python_check(check, context, collector)
    if check.type == "shell":
        return execute_shell_check(check, context, collector)
    raise CheckExecutionError(f"Unsupported check type: {check.type}")


def _normalize_tuple_result(result: Tuple[Any, ...]) -> Tuple[str, Any]:
    """Normalise tuple results to ``(status, details)``."""

    if not result:
        return "pass", None
    status = result[0]
    details = result[1] if len(result) > 1 else None
    return str(status), details
