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


def _build_whitelist(extracted: Dict[str, Any], candidate_facts: Dict[str, Any]) -> List[str]:
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
    return whitelist


def _detect_unverifiable_tokens(proposal_text: str, whitelist: List[str]) -> List[str]:
    tokens = set(t.lower() for t in re.findall(r"[A-Za-z][A-Za-z0-9+.-]{2,}", proposal_text))
    generic = {"the", "and", "for", "with", "project", "value", "client", "approach", "deliverables", "acceptance", "criteria", "success", "plan", "phase", "review"}
    extraneous = [t for t in tokens if t not in set(whitelist) and t not in generic]
    # Only flag explicitly disallowed off-topic technologies (conservative)
    risky_set = {"blockchain", "kafka", "hadoop", "terraform"}
    risky = [t for t in extraneous if t in risky_set]
    return risky


def _sanitize_unverifiable(proposal_text: str, risky_tokens: List[str]) -> str:
    if not risky_tokens:
        return proposal_text
    sections = proposal_text.split("\n\n")
    new_sections: List[str] = []
    for sec in sections:
        if sec.startswith("Call to Action:"):
            new_sections.append(sec)
            continue
        sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", sec) if s.strip()]
        kept: List[str] = []
        for s in sentences:
            s_l = s.lower()
            if any(tok in s_l for tok in risky_tokens):
                continue
            kept.append(s)
        if not kept:
            # Preserve the header label if present and add a neutral sentence
            if sec.startswith("Introduction:"):
                kept = ["Introduction: I focus on aligning to your stated tools and outcomes with clear progress."]
            elif sec.startswith("Value Proposition:"):
                kept = ["Value Proposition: I will align tightly to your inputs and communicate progress clearly."]
            elif sec.startswith("Understanding of Project:"):
                kept = ["Understanding of Project: You need a focused solution aligned to your goals and constraints."]
            elif sec.startswith("Solution Approach:"):
                kept = ["Solution Approach: Short discovery, confirm scope, deliver in small, reviewable increments."]
            else:
                kept = [sec]
        new_sections.append(" ".join(kept).strip())
    return "\n\n".join(new_sections)


def validate_proposal(
    proposal_text: str,
    job_text: str,
    extracted: Dict[str, Any],
    candidate_facts: Dict[str, Any],
) -> Dict[str, Any]:
    report: Dict[str, Any] = {"pass": True, "failures": [], "autofixes": []}

    # Ensure CTA exists exactly and is the last section
    if CTA_LINE not in proposal_text:
        report["failures"].append("cta_missing")
        proposal_text = proposal_text.rstrip() + "\n\nCall to Action: " + CTA_LINE
        report["autofixes"].append("cta_inserted")
    else:
        # Move any trailing text after CTA into previous sections by trimming
        parts = proposal_text.split("\n\n")
        cta_idx = None
        for i, p in enumerate(parts):
            if p.startswith("Call to Action:"):
                cta_idx = i
                break
        if cta_idx is not None and cta_idx != len(parts) - 1:
            proposal_text = "\n\n".join(parts[: cta_idx + 1])
            report["autofixes"].append("cta_moved_to_end")
        # Normalize CTA section content to exact line
        parts = proposal_text.split("\n\n")
        for i, p in enumerate(parts):
            if p.startswith("Call to Action:"):
                parts[i] = "Call to Action: " + CTA_LINE
                proposal_text = "\n\n".join(parts)
                report["autofixes"].append("cta_normalized_exact")
                break

    # Length guardrails (pre)
    wc = _word_count(proposal_text)
    if wc < 140:
        report["failures"].append("too_short")
        filler = (
            " I will keep reviews tight and ensure each deliverable has explicit acceptance criteria to streamline approvals."
        )
        # Insert filler before CTA section to keep CTA last
        parts = proposal_text.split("\n\n")
        cta_idx = None
        for i, p in enumerate(parts):
            if p.startswith("Call to Action:"):
                cta_idx = i
                break
        insert_idx = (cta_idx - 1) if cta_idx and cta_idx > 0 else 0
        while _word_count("\n\n".join(parts)) < 140:
            parts[insert_idx] = parts[insert_idx].rstrip() + filler
        proposal_text = "\n\n".join(parts)
        report["autofixes"].append("padded_short_draft")
    elif wc > 220:
        report["failures"].append("too_long")
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

    # Ensure 5 sections in order
    if not _has_five_sections(proposal_text):
        report["failures"].append("missing_or_misordered_sections")

    # Post-specific references
    refs = _find_post_specific_refs(proposal_text, extracted)
    if refs < 2:
        report["failures"].append("insufficient_post_specific_references")

    # Evidence-only claims with auto-sanitization
    whitelist = _build_whitelist(extracted, candidate_facts)
    risky = _detect_unverifiable_tokens(proposal_text, whitelist)
    if risky:
        proposal_text = _sanitize_unverifiable(proposal_text, risky)
        report["autofixes"].append("removed_unverifiable_claims")
        # Re-check after sanitization
        risky_after = _detect_unverifiable_tokens(proposal_text, whitelist)
        if risky_after:
            report["failures"].append("unverifiable_claims_detected")

    # Final length pass after sanitization
    wc2 = _word_count(proposal_text)
    if wc2 < 140:
        filler = (
            " I will keep reviews tight and ensure each deliverable has explicit acceptance criteria to streamline approvals."
        )
        parts = proposal_text.split("\n\n")
        cta_idx = None
        for i, p in enumerate(parts):
            if p.startswith("Call to Action:"):
                cta_idx = i
                break
        insert_idx = (cta_idx - 1) if cta_idx and cta_idx > 0 else 0
        while _word_count("\n\n".join(parts)) < 140:
            parts[insert_idx] = parts[insert_idx].rstrip() + filler
        proposal_text = "\n\n".join(parts)
        report["autofixes"].append("padded_short_draft_post_sanitize")
    elif wc2 > 220:
        parts = proposal_text.split("\n\n")
        new_parts: List[str] = []
        for sec in parts:
            if sec.startswith("Call to Action:"):
                new_parts.append(sec)
                continue
            sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", sec) if s.strip()]
            if len(sentences) > 1:
                sentences = [sentences[0]]
            new_parts.append(" ".join(sentences))
        proposal_text = "\n\n".join(new_parts)
        report["autofixes"].append("trimmed_long_draft_post_sanitize")

    # Compute pass
    report["pass"] = len(report["failures"]) == 0
    report["proposal_text"] = proposal_text
    return report

