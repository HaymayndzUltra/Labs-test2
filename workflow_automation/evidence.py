"""Evidence management utilities."""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
import hashlib
import json
import logging
from pathlib import Path
from typing import Any, Dict, List, Optional

LOGGER = logging.getLogger(__name__)


@dataclass
class EvidenceRecord:
    """Represents an evidence artifact stored on disk."""

    path: Path
    category: str
    description: str
    checksum: str
    created_at: str

    def to_dict(self) -> Dict[str, Any]:
        return {
            "path": str(self.path),
            "category": self.category,
            "description": self.description,
            "checksum": self.checksum,
            "created_at": self.created_at,
        }


@dataclass
class EvidenceManager:
    """Helper class for writing evidence artifacts and maintaining the manifest."""

    root: Path
    manifest: List[EvidenceRecord] = field(default_factory=list)

    def __post_init__(self) -> None:
        self.root = Path(self.root)
        self.root.mkdir(parents=True, exist_ok=True)

    def _write_text(self, path: Path, content: str) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
        LOGGER.debug("Wrote text evidence to %s", path)

    def _write_json(self, path: Path, payload: Dict[str, Any]) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(payload, indent=2, sort_keys=True), encoding="utf-8")
        LOGGER.debug("Wrote JSON evidence to %s", path)

    def _record(self, path: Path, category: str, description: str) -> None:
        checksum = hashlib.sha256(path.read_bytes()).hexdigest()
        record = EvidenceRecord(
            path=path.relative_to(self.root),
            category=category,
            description=description,
            checksum=checksum,
            created_at=datetime.utcnow().isoformat() + "Z",
        )
        self.manifest.append(record)
        LOGGER.debug("Recorded evidence %s", record)

    def write_json(self, relative_path: str, payload: Dict[str, Any], *, category: str, description: str) -> Path:
        path = self.root / relative_path
        self._write_json(path, payload)
        self._record(path, category, description)
        return path

    def write_text(self, relative_path: str, content: str, *, category: str, description: str) -> Path:
        path = self.root / relative_path
        self._write_text(path, content)
        self._record(path, category, description)
        return path

    def finalize(self, *, manifest_name: str = "index.json") -> Path:
        payload = [record.to_dict() for record in sorted(self.manifest, key=lambda r: r.path)]
        manifest_path = self.root / manifest_name
        manifest_path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
        LOGGER.info("Wrote evidence manifest containing %s artifacts", len(payload))
        return manifest_path

    def summary(self) -> Dict[str, Any]:
        return {
            "artifacts": [record.to_dict() for record in self.manifest],
            "generated_at": datetime.utcnow().isoformat() + "Z",
        }


__all__ = ["EvidenceManager", "EvidenceRecord"]
