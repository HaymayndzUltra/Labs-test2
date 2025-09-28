"""Gate execution primitives."""

from __future__ import annotations

import json
import logging
import shlex
import subprocess
from dataclasses import dataclass, field
from importlib import resources
from pathlib import Path
from typing import Any, Dict, List, Optional

from .config import ActionConfig, GateConfig, WorkflowConfig
from .evidence import EvidenceCollector, EvidenceEntry, utc_now

LOGGER = logging.getLogger(__name__)


class GateExecutionError(RuntimeError):
    """Raised when a gate fails to execute."""

    def __init__(self, gate_id: str, message: str, *, details: Optional[Dict[str, Any]] = None) -> None:
        super().__init__(message)
        self.gate_id = gate_id
        self.details = details or {}


@dataclass(slots=True)
class ActionResult:
    """Holds execution metadata for a single action."""

    type: str
    status: str
    message: str
    metadata: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "type": self.type,
            "status": self.status,
            "message": self.message,
            "metadata": dict(self.metadata),
        }


class ActionExecutor:
    """Resolves an action configuration into runtime behavior."""

    def __init__(self, config: WorkflowConfig, *, dry_run: bool = False) -> None:
        self.config = config
        self.dry_run = dry_run
        self._env_cache: Optional[Dict[str, str]] = None

    def _env(self) -> Dict[str, str]:
        if self._env_cache is None:
            self._env_cache = self.config.to_environment()
        return self._env_cache

    def execute(self, action: ActionConfig, *, gate: GateConfig) -> ActionResult:
        handler = getattr(self, f"_run_{action.type}", None)
        if not handler:
            raise GateExecutionError(gate.identifier, f"Unsupported action type: {action.type}")
        return handler(action, gate)

    # Action handlers -----------------------------------------------------

    def _run_command(self, action: ActionConfig, gate: GateConfig) -> ActionResult:
        command = action.options.get("run")
        if not command:
            raise GateExecutionError(gate.identifier, "Command action missing 'run' option")
        env = self._env()
        cwd = action.options.get("cwd") or str(self.config.project_dir)
        capture = action.options.get("capture", False)
        shell = action.options.get("shell", True)
        timeout = action.options.get("timeout")
        command_str = str(command).format(**env)
        LOGGER.debug("Executing command for gate %s: %s", gate.identifier, command_str)

        if self.dry_run:
            return ActionResult(
                type="command",
                status="skipped",
                message="Dry-run: command not executed",
                metadata={"command": command_str, "cwd": cwd},
            )

        try:
            completed = subprocess.run(  # noqa: S603
                command_str if shell else shlex.split(command_str),
                shell=shell,
                cwd=cwd,
                check=True,
                capture_output=capture,
                text=True,
                timeout=timeout,
                env={**self.config.environment, **env},
            )
        except subprocess.CalledProcessError as exc:  # pragma: no cover - depends on external commands
            LOGGER.error("Command failed for gate %s: %s", gate.identifier, exc)
            raise GateExecutionError(
                gate.identifier,
                f"Command execution failed with exit code {exc.returncode}",
                details={"command": command_str, "stdout": exc.stdout, "stderr": exc.stderr},
            ) from exc
        except subprocess.TimeoutExpired as exc:  # pragma: no cover - dependent on runtime
            LOGGER.error("Command timed out for gate %s", gate.identifier)
            raise GateExecutionError(
                gate.identifier,
                f"Command execution timed out after {timeout} seconds",
                details={"command": command_str},
            ) from exc

        metadata: Dict[str, Any] = {"command": command_str, "cwd": cwd}
        if capture:
            metadata["stdout"] = completed.stdout
            metadata["stderr"] = completed.stderr
        return ActionResult(type="command", status="passed", message="Command executed", metadata=metadata)

    def _run_file_check(self, action: ActionConfig, gate: GateConfig) -> ActionResult:
        raw_path = action.options.get("path")
        if not raw_path:
            raise GateExecutionError(gate.identifier, "file_check action missing 'path' option")
        env = self._env()
        path = Path(str(raw_path).format(**env))
        optional = bool(action.options.get("optional", False))
        exists = path.exists()
        LOGGER.debug("Checking file for gate %s: %s (exists=%s)", gate.identifier, path, exists)
        if not exists and not optional:
            raise GateExecutionError(gate.identifier, f"Required file not found: {path}")
        metadata = {"path": str(path), "exists": exists}
        status = "skipped" if self.dry_run else "passed"
        message = "Dry-run: file existence not enforced" if self.dry_run else "File check completed"
        return ActionResult(type="file_check", status=status, message=message, metadata=metadata)

    def _run_write_json(self, action: ActionConfig, gate: GateConfig) -> ActionResult:
        raw_path = action.options.get("path")
        if not raw_path:
            raise GateExecutionError(gate.identifier, "write_json action missing 'path'")
        env = self._env()
        path = Path(str(raw_path).format(**env))
        payload = self._format_payload(action.options.get("payload", {}), env)
        metadata = {"path": str(path)}
        if self.dry_run:
            return ActionResult(type="write_json", status="skipped", message="Dry-run", metadata=metadata)

        path.parent.mkdir(parents=True, exist_ok=True)
        if isinstance(payload, dict) and "written_at" not in payload:
            payload = {**payload, "written_at": utc_now()}
        with path.open("w", encoding="utf-8") as handle:
            json.dump(payload, handle, indent=2)
        return ActionResult(type="write_json", status="passed", message="JSON written", metadata=metadata)

    def _run_copy_template(self, action: ActionConfig, gate: GateConfig) -> ActionResult:
        resource_name = action.options.get("resource")
        if not resource_name:
            raise GateExecutionError(gate.identifier, "copy_template action missing 'resource'")
        package = action.options.get("package", "workflow.templates")
        raw_destination = action.options.get("destination")
        if not raw_destination:
            raise GateExecutionError(gate.identifier, "copy_template action missing 'destination'")
        env = self._env()
        destination = Path(str(raw_destination).format(**env))
        overwrite = bool(action.options.get("overwrite", False))
        metadata = {"package": package, "resource": resource_name, "destination": str(destination)}

        if self.dry_run:
            return ActionResult(type="copy_template", status="skipped", message="Dry-run", metadata=metadata)

        if destination.exists() and not overwrite:
            metadata["skipped"] = True
            return ActionResult(type="copy_template", status="passed", message="Destination exists", metadata=metadata)

        try:
            content = resources.files(package).joinpath(resource_name).read_text(encoding="utf-8")
        except (FileNotFoundError, OSError) as exc:  # pragma: no cover - depends on filesystem state
            raise GateExecutionError(
                gate.identifier,
                f"Template resource '{resource_name}' not found in package '{package}'",
            ) from exc

        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(content, encoding="utf-8")
        return ActionResult(type="copy_template", status="passed", message="Template copied", metadata=metadata)

    def _format_payload(self, payload: Any, env: Dict[str, str]) -> Any:
        if isinstance(payload, str):
            try:
                return payload.format(**env)
            except KeyError:
                return payload
        if isinstance(payload, dict):
            return {key: self._format_payload(value, env) for key, value in payload.items()}
        if isinstance(payload, list):
            return [self._format_payload(item, env) for item in payload]
        return payload


def run_gate(
    gate: GateConfig,
    config: WorkflowConfig,
    evidence: EvidenceCollector,
    *,
    dry_run: bool = False,
) -> None:
    LOGGER.info("Running gate %s - %s", gate.identifier, gate.name)
    executor = ActionExecutor(config, dry_run=dry_run)
    artifacts: List[EvidenceEntry] = []
    actions: List[Dict[str, Any]] = []

    started = utc_now()
    try:
        for artifact in gate.required_artifacts:
            if dry_run:
                actions.append(
                    {
                        "type": "file_check",
                        "status": "skipped",
                        "message": "Dry-run: requirement not validated",
                        "metadata": {"path": str(artifact)},
                    }
                )
                continue
            action = ActionConfig.from_mapping({"type": "file_check", "path": artifact})
            result = executor.execute(action, gate=gate)
            actions.append(result.to_dict())
        for action_config in gate.actions:
            result = executor.execute(action_config, gate=gate)
            actions.append(result.to_dict())
            evidence_path = action_config.options.get("evidence")
            if evidence_path:
                env = config.to_environment()
                path = Path(str(evidence_path).format(**env))
                artifacts.append(EvidenceEntry(path=str(path)))
        status = "passed" if not dry_run else "skipped"
        message = "Dry-run execution" if dry_run else "Gate completed"
    except GateExecutionError as exc:
        status = "failed"
        message = str(exc)
        actions.append({"type": "error", "status": "failed", "message": message, "metadata": exc.details})
    completed = utc_now()
    evidence.register(
        gate.identifier,
        gate.name,
        status,
        started,
        completed,
        notes=message,
        artifacts=artifacts,
        actions=actions,
    )

    if status == "failed":
        raise GateExecutionError(gate.identifier, message)

