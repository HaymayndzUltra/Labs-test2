import re
from typing import Dict, Any, Tuple, List

from .proposal_generator import CTA_LINE


def _extract_sections(text: str) -> List[str]:
    return [p.strip() for p in text.split("\n\n") if p.strip()]


def _has_five_sections(text: str) -> bool:
    parts = _extract_sections(text)
    if len(parts) < 5:
        return False
    expected = ["Introduction:", "Understanding of Project:", "Solution Approach:", "Value Proposition:", "Call to Action:"]
    for exp, part in zip(expected, parts):
        if not part.startswith(exp):
            return False
    return True


def _word_count(text: str) -> int:
    return len([w for w in text.split() if w.strip()])


def _find_post_specific_refs(proposal_text: str, extracted: Dict[str, Any]) -> int:
    refs = 0
    for key in ("skills", "deliverables", "kpis", "constraints"):
        for item in extracted.get(key, [])[:4]:
            val = str(item.get("value", "")).strip()
            if val and re.search(rf"\b{re.escape(val)}\b", proposal_text, re.I):
                refs += 1
    return refs


def _claims_are_evidence_bound(proposal_text: str, extracted: Dict[str, Any], candidate_facts: Dict[str, Any]) -> bool:
    # Heuristic: if proposal mentions tools/claims not in extracted or candidate facts, flag
    # Build a whitelist of permissible tokens
    whitelist: List[str] = []
    for key in ("skills", "kpis", "deliverables", "constraints"):
        whitelist += [str(i.get("value", "")).lower() for i in extracted.get(key, [])]
    for key, val in candidate_facts.items():
        if isinstance(val, str):
            whitelist += [t.lower() for t in re.findall(r"[A-Za-z][A-Za-z0-9+.-]{1,}", val)]
        if isinstance(val, list):
            for v in val:
                if isinstance(v, str):
                    whitelist += [t.lower() for t in re.findall(r"[A-Za-z][A-Za-z0-9+.-]{1,}", v)]

    tokens = set(t.lower() for t in re.findall(r"[A-Za-z][A-Za-z0-9+.-]{2,}", proposal_text))
    # Allow generic words
    generic = {"the", "and", "for", "with", "project", "value", "client", "approach", "deliverables", "acceptance"}
    extraneous = [t for t in tokens if t not in set(whitelist) and t not in generic]
    # This is intentionally permissive; we only fail if we detect high-risk terms
    risky = [t for t in extraneous if t in {"blockchain", "kafka", "hadoop", "terraform"}]
    return len(risky) == 0


def validate_proposal(
    proposal_text: str,
    job_text: str,
    extracted: Dict[str, Any],
    candidate_facts: Dict[str, Any],
) -> Dict[str, Any]:
    report: Dict[str, Any] = {"pass": True, "failures": [], "autofixes": []}

    # Section structure
    if not _has_five_sections(proposal_text):
        report["pass"] = False
        report["failures"].append("missing_or_misordered_sections")

    # CTA exactness
    if CTA_LINE not in proposal_text:
        report["pass"] = False
        report["failures"].append("cta_missing")
        proposal_text = proposal_text.rstrip() + "\n\nCall to Action: " + CTA_LINE
        report["autofixes"].append("cta_inserted")

    # Word count
    wc = _word_count(proposal_text)
    if wc < 140 or wc > 220:
        report["pass"] = False
        report["failures"].append("length_out_of_bounds")
        # Simple auto-fix: pad if short, trim if long
        if wc < 140:
            filler = (
                " I will keep reviews tight and ensure each deliverable has explicit acceptance criteria to streamline approvals."
            )
            while _word_count(proposal_text) < 140:
                proposal_text += filler
            report["autofixes"].append("padded_short_draft")
        else:
            # Trim by removing middle sentences until within bounds
            parts = proposal_text.split("\n\n")
            new_parts: List[str] = []
            for sec in parts:
                if sec.startswith("Call to Action:"):
                    new_parts.append(sec)
                    continue
                sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", sec) if s.strip()]
                if len(sentences) > 2:
                    sentences = [sentences[0]] + sentences[-1:]
                new_parts.append(" ".join(sentences))
            proposal_text = "\n\n".join(new_parts)
            report["autofixes"].append("trimmed_long_draft")

    # Post-specific references
    refs = _find_post_specific_refs(proposal_text, extracted)
    if refs < 2:
        report["pass"] = False
        report["failures"].append("insufficient_post_specific_references")

    # Evidence-only claims
    if not _claims_are_evidence_bound(proposal_text, extracted, candidate_facts):
        report["pass"] = False
        report["failures"].append("unverifiable_claims_detected")
        # No safe automatic deletion without semantic understanding; flag only

    report["proposal_text"] = proposal_text
    return report

