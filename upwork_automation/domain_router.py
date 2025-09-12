from typing import Dict, Any


def route_domain(extracted: Dict[str, Any]) -> Dict[str, Any]:
    skills = [s.get("value", "").lower() for s in extracted.get("skills", [])]
    deliverables = [d.get("value", "").lower() for d in extracted.get("deliverables", [])]

    domain = "general"
    if any(x in skills for x in ["shopify", "liquid"]):
        domain = "shopify"
    elif any(x in skills for x in ["react", "next.js", "typescript", "javascript"]):
        domain = "webapp"
    elif any(x in skills for x in ["django", "fastapi", "flask", "python"]):
        domain = "backend"
    elif any(x in skills for x in ["react native", "expo", "flutter", "kotlin", "swift"]):
        domain = "mobile"

    # Minimal domain-specific question bank (top 3 prioritized)
    questions_map = {
        "shopify": [
            "Do we have collaborator access and a staging theme?",
            "Target PageSpeed/ CWV scores (mobile/desktop)?",
            "Apps or integrations that must remain untouched?",
        ],
        "webapp": [
            "Primary user roles and permissions?",
            "Critical KPIs (e.g., Core Web Vitals, conversion)?",
            "Data sources/APIs and auth constraints?",
        ],
        "backend": [
            "Environment targets (dev/stage/prod) and deployment process?",
            "Data model ownership and migration risks?",
            "Security requirements (authn/z, PII/PHI)?",
        ],
        "mobile": [
            "Target platforms and minimum OS versions?",
            "Release cadence/TestFlight or Play Alpha?",
            "Offline and sync requirements?",
        ],
        "general": [
            "What are the success criteria and timeline constraints?",
            "Who approves deliverables and how will feedback be provided?",
            "Any compliance or accessibility requirements?",
        ],
    }

    return {
        "domain": domain,
        "priority_questions": questions_map.get(domain, questions_map["general"])[:3],
    }

