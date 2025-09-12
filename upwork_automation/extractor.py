import re
from typing import Dict, Any, List, Tuple


def _capture_spans(pattern: re.Pattern[str], text: str) -> List[Tuple[int, int, str]]:
    spans: List[Tuple[int, int, str]] = []
    for m in pattern.finditer(text):
        spans.append((m.start(), m.end(), m.group(0)))
    return spans


def _find_budget(text: str) -> Dict[str, Any] | None:
    # Capture currency-like patterns
    curr = re.compile(r"\b(?:budget|price|cost)\b[:\-\s]*\$?\s*(\d{2,7})(?:\.(\d{2}))?", re.I)
    spans = _capture_spans(curr, text)
    if spans:
        amount_str = re.sub(r"[^0-9]", "", spans[0][2])
        try:
            amount = int(amount_str)
        except ValueError:
            amount = None
        return {
            "value": amount,
            "confidence": 0.61,
            "evidence": [[spans[0][0], spans[0][1]]],
            "assumption": False,
        }
    return None


def _find_timeline(text: str) -> Dict[str, Any] | None:
    pat = re.compile(r"(\d{1,3})\s*(weeks?|days?|months?)", re.I)
    spans = _capture_spans(pat, text)
    if spans:
        qty_s, unit_s = re.findall(r"(\d{1,3})\s*(weeks?|days?|months?)", spans[0][2], re.I)[0]
        qty = int(qty_s)
        unit = unit_s.lower()
        return {
            "value": {"quantity": qty, "unit": unit},
            "confidence": 0.52,
            "evidence": [[spans[0][0], spans[0][1]]],
            "assumption": False,
        }
    return None


KNOWN_SKILLS = [
    # Web
    "React", "Next.js", "Node", "TypeScript", "JavaScript", "Tailwind", "CSS", "HTML",
    "Vue", "Nuxt", "Svelte", "SvelteKit", "Gatsby",
    # Backend
    "Python", "Django", "Flask", "FastAPI", "Go", "Golang", "Java", "Spring", "Ruby on Rails",
    # Data / Infra
    "Postgres", "MySQL", "MongoDB", "Redis", "AWS", "GCP", "Azure", "Docker", "Kubernetes",
    # Mobile
    "React Native", "Expo", "Flutter", "Kotlin", "Swift",
    # Ecommerce / CMS
    "Shopify", "Liquid", "WordPress", "WooCommerce",
    # Observability / QA
    "Playwright", "Cypress", "Sentry",
]


def _find_skills(text: str) -> List[Dict[str, Any]]:
    results: List[Dict[str, Any]] = []
    for skill in KNOWN_SKILLS:
        pat = re.compile(rf"\b{re.escape(skill)}\b", re.I)
        spans = _capture_spans(pat, text)
        if spans:
            results.append({
                "value": skill,
                "confidence": 0.9 if len(skill) > 3 else 0.7,
                "evidence": [[s[0], s[1]] for s in spans],
            })
    return results


def _find_deliverables(text: str) -> List[Dict[str, Any]]:
    lines = text.splitlines()
    dels: List[Dict[str, Any]] = []
    for i, line in enumerate(lines):
        if re.match(r"^\s*[-*\d+\.)]", line):
            clean = re.sub(r"^[\s\d\-*.\)]*", "", line).strip()
            if clean:
                start_idx = text.find(line)
                end_idx = start_idx + len(line)
                dels.append({
                    "value": clean,
                    "confidence": 0.6,
                    "evidence": [[start_idx, end_idx]],
                })
    return dels[:8]


KPI_TERMS = [
    "conversion rate", "PageSpeed", "Core Web Vitals", "LCP", "CLS", "TTFB", "SEO",
    "accessibility", "WCAG", "response time", "latency", "throughput"
]


def _find_kpis(text: str) -> List[Dict[str, Any]]:
    kpis: List[Dict[str, Any]] = []
    for term in KPI_TERMS:
        pat = re.compile(rf"\b{re.escape(term)}\b", re.I)
        spans = _capture_spans(pat, text)
        if spans:
            kpis.append({
                "value": term,
                "confidence": 0.8,
                "evidence": [[s[0], s[1]] for s in spans],
            })
    return kpis


def _find_constraints(text: str) -> List[Dict[str, Any]]:
    constraints: List[Dict[str, Any]] = []
    for m in re.finditer(r"\b(must|required|constraint|cannot|won't|should not)\b(.{0,200})", text, re.I):
        frag = (m.group(1) + m.group(2)).strip()
        constraints.append({
            "value": frag,
            "confidence": 0.55,
            "evidence": [[m.start(), m.end()]],
        })
    return constraints[:8]


def extract_job_post(text: str) -> Dict[str, Any]:
    """Deterministic extraction with simple heuristics and evidence spans.

    Returns a dictionary where each field includes a value, confidence, evidence spans,
    and assumption flags as applicable.
    """
    res: Dict[str, Any] = {}

    budget = _find_budget(text)
    if budget:
        res["budget_usd"] = budget

    timeline = _find_timeline(text)
    if timeline:
        res["timeline"] = timeline

    skills = _find_skills(text)
    if skills:
        res["skills"] = skills

    deliverables = _find_deliverables(text)
    if deliverables:
        res["deliverables"] = deliverables

    kpis = _find_kpis(text)
    if kpis:
        res["kpis"] = kpis

    constraints = _find_constraints(text)
    if constraints:
        res["constraints"] = constraints

    # Text complexity heuristics for tone inference
    tech_terms = len(skills) + len(kpis)
    res["inferred_client_proficiency"] = {
        "value": "technical" if tech_terms >= 3 else "plain",
        "confidence": 0.6,
        "evidence": [],
    }

    return res

