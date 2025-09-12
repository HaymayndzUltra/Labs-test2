from pathlib import Path
from typing import Dict, Any, List, Tuple

from .evidence_gate import select_micro_proof

CTA_LINE = (
    "To keep things efficient, I’ll structure everything into clear phases with goals, deliverables, and acceptance criteria. If you could share any specific requirements or reference materials upfront, I’ll integrate them right away—so we finalize scope faster without needing long back-and-forth calls"
)


def _pick_specifics(extracted: Dict[str, Any]) -> List[str]:
    specifics: List[str] = []
    for key in ("skills", "deliverables", "kpis", "constraints"):
        for item in extracted.get(key, [])[:3]:
            val = str(item.get("value", "")).strip()
            if val and val not in specifics:
                specifics.append(val)
            if len(specifics) >= 4:
                break
        if len(specifics) >= 4:
            break
    return specifics[:4]


def _infer_tone(extracted: Dict[str, Any], style_config_dir: Path) -> str:
    # Allow override via config
    style_path_json = style_config_dir / "proposal-style.json"
    if style_path_json.exists():
        import json
        try:
            style = json.loads(style_path_json.read_text(encoding="utf-8"))
            tone = style.get("tone")
            if tone in ("plain", "technical"):
                return tone
        except Exception:
            pass
    prof = extracted.get("inferred_client_proficiency", {}).get("value", "plain")
    return "technical" if prof == "technical" else "plain"


def _compose_sections_dict(
    job_text: str,
    extracted: Dict[str, Any],
    domain_info: Dict[str, Any],
    candidate_facts: Dict[str, Any],
    style_config_dir: Path,
    variant: int | None = None,
) -> Tuple[Dict[str, str], Dict[str, Any]]:
    tone = _infer_tone(extracted, style_config_dir)
    specifics = _pick_specifics(extracted)
    domain = domain_info.get("domain", "general")
    micro_proof = select_micro_proof(candidate_facts, domain)

    # Choose 2–3 specifics to reference explicitly in opening
    lead_specs = specifics[:3]
    if variant and variant % 2 == 0:
        lead_specs = list(reversed(lead_specs))

    intro = []
    if tone == "technical":
        intro.append(
            f"Introduction: I specialize in {', '.join(lead_specs[:2])} and related delivery patterns, focused on fast, accurate execution."
        )
    else:
        intro.append(
            f"Introduction: I help teams ship {', '.join(lead_specs[:2])} work quickly and correctly, with clear communication."
        )

    understanding = []
    if extracted.get("deliverables"):
        deliverables = ", ".join(d.get("value", "") for d in extracted.get("deliverables", [])[:3])
        understanding.append(f"Understanding of Project: You need {deliverables} aligned to the requirements you shared.")
    else:
        understanding.append("Understanding of Project: You want a focused, reliable solution aligned to your goals and constraints.")
    if extracted.get("kpis"):
        kpis = ", ".join(k.get("value", "") for k in extracted.get("kpis", [])[:2])
        understanding.append(f"We’ll measure success against {kpis} and related outcomes.")

    approach = []
    approach.append("Solution Approach: Rapid discovery → scope confirmation → implementation in small, reviewable increments.")
    if domain_info.get("priority_questions"):
        ask = "; ".join(domain_info["priority_questions"][:3])
        approach.append(f"First, I’ll confirm blockers and access: {ask}.")

    value = []
    if micro_proof:
        value.append(f"Value Proposition: {micro_proof}")
    else:
        value.append("Value Proposition: I’ll align tightly to the tools and KPIs you named and communicate progress clearly.")
    if extracted.get("skills"):
        skills = ", ".join(s.get("value", "") for s in extracted.get("skills", [])[:3])
        value.append(f"Relevant stack focus: {skills}.")

    cta = [f"Call to Action: {CTA_LINE}"]

    sections = {
        "Introduction": " ".join(intro).strip(),
        "Understanding of Project": " ".join(understanding).strip(),
        "Solution Approach": " ".join(approach).strip(),
        "Value Proposition": " ".join(value).strip(),
        "Call to Action": " ".join(cta).strip(),
    }

    used_refs = {
        "specifics": lead_specs,
        "domain": domain,
        "used_facts": [micro_proof] if micro_proof else [],
        "claims": [
            *[{"category": "deliverables", "value": d.get("value", "")} for d in extracted.get("deliverables", [])[:3]],
            *[{"category": "kpis", "value": k.get("value", "")} for k in extracted.get("kpis", [])[:2]],
            *[{"category": "skills", "value": s.get("value", "")} for s in extracted.get("skills", [])[:3]],
        ],
    }
    return sections, used_refs


def _word_count(text: str) -> int:
    return len([w for w in text.split() if w.strip()])


def _adjust_length_to_bounds(text: str, min_w: int = 140, max_w: int = 220) -> str:
    words = _word_count(text)
    if words < min_w:
        # Expand by adding a concise clarifier sentence referencing alignment and acceptance criteria.
        filler = (
            " I’ll keep commits small, share quick previews, and confirm acceptance criteria per deliverable so review is fast."
        )
        while words < min_w:
            text += filler
            words = _word_count(text)
        return text
    if words > max_w:
        # Compress by removing the second sentence from the longest section except CTA
        sections = text.split("\n\n")
        new_sections: List[str] = []
        for i, sec in enumerate(sections):
            if "Call to Action:" in sec:
                new_sections.append(sec)
                continue
            sentences = [s.strip() for s in sec.split(".") if s.strip()]
            if len(sentences) > 1:
                sentences = [sentences[0]] + sentences[2:]
            new_sections.append(". ".join(sentences).strip())
        text = "\n\n".join(new_sections)
        # If still long, hard trim to last max_w words while preserving CTA
        words = _word_count(text)
        if words > max_w:
            parts = text.split("\n\n")
            cta = [p for p in parts if "Call to Action:" in p]
            others = [p for p in parts if "Call to Action:" not in p]
            merged = "\n\n".join(others)
            tokens = merged.split()
            merged = " ".join(tokens[: max_w - 50]).strip()
            text = (merged + "\n\n" + cta[0]).strip()
        return text
    return text


def generate_proposal(
    job_text: str,
    extracted: Dict[str, Any],
    domain_info: Dict[str, Any],
    candidate_facts: Dict[str, Any],
    style_config_dir: Path,
    variant: int | None = None,
) -> Tuple[str, Dict[str, Any]]:
    sections, used_refs = _compose_sections_dict(job_text, extracted, domain_info, candidate_facts, style_config_dir, variant)
    text = "\n\n".join([
        sections["Introduction"],
        sections["Understanding of Project"],
        sections["Solution Approach"],
        sections["Value Proposition"],
        sections["Call to Action"],
    ])
    text = _adjust_length_to_bounds(text)
    # Ensure CTA line exists exactly
    if CTA_LINE not in text:
        text = text.rstrip() + "\n\nCall to Action: " + CTA_LINE
    return text, used_refs


def compose_sections_dict(
    job_text: str,
    extracted: Dict[str, Any],
    domain_info: Dict[str, Any],
    candidate_facts: Dict[str, Any],
    style_config_dir: Path,
    variant: int | None = None,
) -> Tuple[Dict[str, str], Dict[str, Any]]:
    return _compose_sections_dict(job_text, extracted, domain_info, candidate_facts, style_config_dir, variant)

