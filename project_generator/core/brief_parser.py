"""
Brief parser that extracts a ScaffoldSpec from a brief.md file.

Heuristics:
- Prefer YAML frontmatter keys: name, industry, project_type, frontend, backend, database, auth, deploy, compliance, features
- Fallback to body keyword extraction with simple regexes and known vocab
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import List, Optional, Dict, Any


FRONTENDS = {"nextjs", "nuxt", "angular", "expo", "none"}
BACKENDS = {"fastapi", "django", "nestjs", "go", "none"}
DATABASES = {"postgres", "mongodb", "firebase", "none"}
AUTHS = {"auth0", "firebase", "cognito", "custom", "none"}
DEPLOYS = {"aws", "azure", "gcp", "vercel", "self-hosted"}
INDUSTRIES = {"healthcare", "finance", "ecommerce", "saas", "enterprise"}
PROJECT_TYPES = {"web", "mobile", "api", "fullstack", "microservices"}


@dataclass
class ScaffoldSpec:
    name: str
    industry: str
    project_type: str
    frontend: str = "none"
    backend: str = "none"
    database: str = "none"
    auth: str = "none"
    deploy: str = "aws"
    compliance: List[str] = field(default_factory=list)
    features: List[str] = field(default_factory=list)
    separate_repos: bool = True


class BriefParser:
    def __init__(self, path: str | Path):
        self.path = Path(path)

    def parse(self) -> ScaffoldSpec:
        content = self.path.read_text(encoding="utf-8")
        meta = self._parse_frontmatter(content)
        body = self._strip_frontmatter(content)

        # Required fields: name, industry, project_type
        name = (meta.get("name") or self._guess_name(body) or "my-app").strip()
        industry = (meta.get("industry") or self._guess_industry(body) or "healthcare").strip().lower()
        project_type = (meta.get("project_type") or meta.get("project-type") or self._guess_project_type(body) or "fullstack").strip().lower()

        frontend = (meta.get("frontend") or self._guess_frontend(body) or ("nextjs" if project_type != "api" else "none")).strip().lower()
        backend = (meta.get("backend") or self._guess_backend(body) or ("fastapi" if project_type != "web" else "none")).strip().lower()
        database = (meta.get("database") or self._guess_database(body) or ("postgres" if backend != "none" else "none")).strip().lower()
        auth = (meta.get("auth") or self._guess_auth(body) or "auth0").strip().lower()
        deploy = (meta.get("deploy") or self._guess_deploy(body) or "aws").strip().lower()

        compliance_val = meta.get("compliance") or self._guess_compliance(body) or []
        if isinstance(compliance_val, str):
            compliance = [c.strip().lower() for c in compliance_val.split(',') if c.strip()]
        else:
            compliance = [str(c).strip().lower() for c in compliance_val]

        features_val = meta.get("features") or self._guess_features(body) or []
        if isinstance(features_val, str):
            features = [f.strip() for f in features_val.split(',') if f.strip()]
        else:
            features = [str(f).strip() for f in features_val]

        # Clamp to vocab where applicable
        industry = industry if industry in INDUSTRIES else "healthcare"
        project_type = project_type if project_type in PROJECT_TYPES else "fullstack"
        frontend = frontend if frontend in FRONTENDS else ("nextjs" if project_type != "api" else "none")
        backend = backend if backend in BACKENDS else ("fastapi" if project_type != "web" else "none")
        database = database if database in DATABASES else ("postgres" if backend != "none" else "none")
        auth = auth if auth in AUTHS else "auth0"
        deploy = deploy if deploy in DEPLOYS else "aws"

        return ScaffoldSpec(
            name=name,
            industry=industry,
            project_type=project_type,
            frontend=frontend,
            backend=backend,
            database=database,
            auth=auth,
            deploy=deploy,
            compliance=compliance,
            features=features,
            separate_repos=True,
        )

    # ---- helpers ----
    def _parse_frontmatter(self, content: str) -> Dict[str, Any]:
        if not content.startswith("---\n"):
            return {}
        end = content.find("\n---\n", 4)
        if end == -1:
            return {}
        fm = content[4:end]
        meta: Dict[str, Any] = {}
        for line in fm.splitlines():
            if ":" in line:
                k, v = line.split(":", 1)
                meta[k.strip().lower()] = v.strip().strip('"\'')
        return meta

    def _strip_frontmatter(self, content: str) -> str:
        if not content.startswith("---\n"):
            return content
        end = content.find("\n---\n", 4)
        if end == -1:
            return content
        return content[end + len("\n---\n"):]

    def _guess_name(self, text: str) -> Optional[str]:
        m = re.search(r"project\s+name[:\-]\s*([A-Za-z0-9\-\_]+)", text, re.IGNORECASE)
        return m.group(1) if m else None

    def _guess_industry(self, text: str) -> Optional[str]:
        for ind in INDUSTRIES:
            if re.search(rf"\b{re.escape(ind)}\b", text, re.IGNORECASE):
                return ind
        return None

    def _guess_project_type(self, text: str) -> Optional[str]:
        for pt in PROJECT_TYPES:
            if re.search(rf"\b{re.escape(pt)}\b", text, re.IGNORECASE):
                return pt
        return None

    def _guess_frontend(self, text: str) -> Optional[str]:
        for fe in FRONTENDS:
            if fe != "none" and re.search(rf"\b{re.escape(fe)}\b", text, re.IGNORECASE):
                return fe
        return None

    def _guess_backend(self, text: str) -> Optional[str]:
        for be in BACKENDS:
            if be != "none" and re.search(rf"\b{re.escape(be)}\b", text, re.IGNORECASE):
                return be
        return None

    def _guess_database(self, text: str) -> Optional[str]:
        for db in DATABASES:
            if db != "none" and re.search(rf"\b{re.escape(db)}\b", text, re.IGNORECASE):
                return db
        return None

    def _guess_auth(self, text: str) -> Optional[str]:
        for a in AUTHS:
            if a != "none" and re.search(rf"\b{re.escape(a)}\b", text, re.IGNORECASE):
                return a
        return None

    def _guess_deploy(self, text: str) -> Optional[str]:
        for d in DEPLOYS:
            if re.search(rf"\b{re.escape(d)}\b", text, re.IGNORECASE):
                return d
        return None

    def _guess_compliance(self, text: str) -> List[str]:
        hits: List[str] = []
        for c in ["hipaa", "gdpr", "sox", "pci", "soc2"]:
            if re.search(rf"\b{c}\b", text, re.IGNORECASE):
                hits.append(c)
        return hits

    def _guess_features(self, text: str) -> List[str]:
        # Capture comma-separated list after keywords like features:, capabilities:, include:
        m = re.search(r"\b(features|capabilities|include)[:\-]\s*([^\n]+)", text, re.IGNORECASE)
        if not m:
            return []
        return [f.strip() for f in m.group(2).split(',') if f.strip()]

