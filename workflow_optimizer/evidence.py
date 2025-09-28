"""Evidence collection helpers."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Dict, Iterable, List

from .exceptions import EvidenceError
from .models import EvidenceRecord


class EvidenceCollector:
    """Collects and persists evidence records for gate executions."""

    def __init__(self, root: Path) -> None:
        self.root = root
        self._records: List[EvidenceRecord] = []
        self.root.mkdir(parents=True, exist_ok=True)

    def record(self, evidence: EvidenceRecord) -> None:
        """Record evidence and write to disk if it references an artifact."""

        if evidence.artifact_path and not evidence.artifact_path.exists():
            raise EvidenceError(f"Evidence artifact not found: {evidence.artifact_path}")
        self._records.append(evidence)
        self._write_manifest()

    def extend(self, evidence_list: Iterable[EvidenceRecord]) -> None:
        for evidence in evidence_list:
            self.record(evidence)

    def _write_manifest(self) -> None:
        manifest = [
            {
                "gate": record.gate,
                "description": record.description,
                "artifact_path": str(record.artifact_path) if record.artifact_path else None,
                "metadata": record.metadata,
                "timestamp": record.timestamp,
            }
            for record in self._records
        ]
        manifest_path = self.root / "index.json"
        manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")

    def manifest_path(self) -> Path:
        return self.root / "index.json"

    @property
    def records(self) -> List[EvidenceRecord]:
        return list(self._records)
