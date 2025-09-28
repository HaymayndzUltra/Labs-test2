"""Evidence management utilities for the workflow optimization system."""

from __future__ import annotations

from dataclasses import dataclass, asdict
from datetime import datetime
from hashlib import sha256
from pathlib import Path
from typing import Any, Dict, List
import json
import shutil


@dataclass(slots=True)
class EvidenceRecord:
    """Represents a single evidence artifact."""

    gate: str
    artifact: str
    path: str
    sha256: str
    timestamp: str
    metadata: Dict[str, Any]

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class EvidenceManager:
    """Manage creation of evidence artifacts and manifest files."""

    def __init__(self, evidence_dir: Path) -> None:
        self.evidence_dir = evidence_dir
        self.evidence_dir.mkdir(parents=True, exist_ok=True)
        self._records: List[EvidenceRecord] = []

    def manifest_path(self) -> Path:
        return self.evidence_dir / "evidence_manifest.json"

    def record_data(
        self,
        gate: str,
        artifact: str,
        data: Dict[str, Any] | List[Any] | str,
        metadata: Dict[str, Any] | None = None,
    ) -> EvidenceRecord:
        """Record structured data as a JSON artifact."""

        metadata = metadata or {}
        artifact_path = self.evidence_dir / f"{artifact}.json"
        if isinstance(data, (dict, list)):
            artifact_path.write_text(json.dumps(data, indent=2), encoding="utf-8")
        else:
            artifact_path.write_text(str(data), encoding="utf-8")
        return self._register(gate, artifact, artifact_path, metadata)

    def record_file(
        self, gate: str, artifact: str, source_path: Path, metadata: Dict[str, Any] | None = None
    ) -> EvidenceRecord:
        """Copy a file into the evidence directory and register it."""

        metadata = metadata or {}
        destination = self.evidence_dir / f"{artifact}{source_path.suffix}"
        shutil.copy2(source_path, destination)
        return self._register(gate, artifact, destination, metadata)

    def _register(
        self, gate: str, artifact: str, artifact_path: Path, metadata: Dict[str, Any]
    ) -> EvidenceRecord:
        checksum = sha256(artifact_path.read_bytes()).hexdigest()
        record = EvidenceRecord(
            gate=gate,
            artifact=artifact,
            path=str(artifact_path),
            sha256=checksum,
            timestamp=datetime.utcnow().isoformat(timespec="seconds") + "Z",
            metadata=metadata,
        )
        self._records.append(record)
        return record

    def save_manifest(self) -> Path:
        """Persist the evidence manifest to disk."""

        manifest_data = [record.to_dict() for record in self._records]
        manifest_path = self.manifest_path()
        manifest_path.write_text(json.dumps(manifest_data, indent=2), encoding="utf-8")
        return manifest_path

    @property
    def records(self) -> List[EvidenceRecord]:
        return list(self._records)
