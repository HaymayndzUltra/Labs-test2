"""
Template registry and manifest loader
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Dict, Any, List, Optional


class TemplateRegistry:
    """Discovers templates and reads template.manifest.json files if present."""

    def __init__(self, root: Optional[Path] = None):
        self.root = root or Path(__file__).resolve().parents[2] / 'template-packs'

    def _manifest_for(self, template_dir: Path) -> Optional[Dict[str, Any]]:
        mf = template_dir / 'template.manifest.json'
        if mf.exists():
            try:
                return json.loads(mf.read_text(encoding='utf-8'))
            except Exception:
                return None
        return None

    def list_all(self) -> List[Dict[str, Any]]:
        results: List[Dict[str, Any]] = []
        for group in ['backend', 'frontend', 'database']:
            base = self.root / group
            if not base.exists():
                continue
            for child in base.iterdir():
                if not child.is_dir():
                    continue
                mf = self._manifest_for(child)
                if mf:
                    entry = {
                        'type': group,
                        'name': mf.get('name') or child.name,
                        'variants': mf.get('variants') or ['base'],
                        'engines': mf.get('engines'),
                        'path': str(child),
                    }
                else:
                    # fallback heuristic
                    variants = [p.name for p in child.iterdir() if p.is_dir()]
                    entry = {
                        'type': group,
                        'name': child.name,
                        'variants': variants or ['base'],
                        'engines': None,
                        'path': str(child),
                    }
                results.append(entry)
        return results

