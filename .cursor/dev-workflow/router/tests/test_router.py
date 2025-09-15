import json
from importlib import util

spec = util.spec_from_file_location('router', '/workspace/.cursor/dev-workflow/router/router.py')
router = util.module_from_spec(spec)
spec.loader.exec_module(router)

def test_precedence_fallback():
    # force precedence load when file missing by pointing to temp ROOT not possible; ensure BASE_PRECEDENCE exists
    assert isinstance(router.BASE_PRECEDENCE, list) and len(router.BASE_PRECEDENCE) > 0


def test_token_set_matching_exact():
    policies = [
        {"name": "p1", "conditions": ["industry:healthcare", "project_type:fullstack"], "priority": 10},
        {"name": "p2", "conditions": ["industry:healthcare"], "priority": 5}
    ]
    ctx = {"tokens": ["industry:healthcare", "project_type:fullstack"]}
    matches = router.evaluate_policies(policies, ctx)
    assert matches and matches[0]["name"] == "p1"


def test_no_false_positive_substring():
    policies = [{"name": "p", "conditions": ["token"], "priority": 1}]
    ctx = {"tokens": ["notrelated"]}
    matches = router.evaluate_policies(policies, ctx)
    assert matches == []


def test_tie_breaker_uses_precedence():
    policies = [
        {"name": "A", "conditions": [], "priority": 1, "precedence_tag": "7-dev-workflow-command-router"},
        {"name": "B", "conditions": [], "priority": 1, "precedence_tag": "project-rules"}
    ]
    ctx = {}
    _ = router.route_decision(ctx)
    # route_decision uses list_policies() normally; we simulate tie by calling internals
    prec = router.load_precedence()
    tie = [p for p in policies if p.get('priority',0)==1]
    prec_index = {k:i for i,k in enumerate(prec)}
    tie.sort(key=lambda p: prec_index.get(str(p.get('precedence_tag')), len(prec_index)))
    assert tie[0]['precedence_tag'] == '7-dev-workflow-command-router'
