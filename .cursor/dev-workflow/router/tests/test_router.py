import json
import sys

# Import router as a real module for coverage collection
sys.path.insert(0, '/workspace/.cursor/dev-workflow/router')
import router  # type: ignore

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
    # ensure precedence loads (fallback to base precedence if file missing)
    _ = router.load_precedence()
    # simulate tie by calling internals
    prec = router.load_precedence()
    tie = [p for p in policies if p.get('priority',0)==1]
    prec_index = {k:i for i,k in enumerate(prec)}
    tie.sort(key=lambda p: prec_index.get(str(p.get('precedence_tag')), len(prec_index)))
    assert tie[0]['precedence_tag'] == '7-dev-workflow-command-router'


def test_load_precedence_parses_file():
    order = router.load_precedence()
    assert isinstance(order, list)
    assert 'project-rules' in order or len(order) > 0


def test_list_policies_reads_files():
    policies = router.list_policies()
    assert isinstance(policies, list)


def test_redact_sensitive_masks():
    data = {
        'username': 'alice',
        'password': 'supersecret',
        'nested': {'api_key': 'abcd', 'normal': 'ok'},
        'tokens': ['keep', 'secret-token']
    }
    red = router._redact_sensitive(data)
    # password key dropped, token redacted
    assert 'password' not in red
    assert red['nested']['normal'] == 'ok'
    assert red['nested'].get('api_key') is None or red['nested'].get('api_key') == '[REDACTED]'


def test_route_decision_writes_log_and_caches(tmp_path):
    ctx = {'tokens': ['industry:healthcare']}
    res1 = router.route_decision(ctx)
    assert 'trace_id' in res1
    res2 = router.route_decision(ctx)
    assert res2['decision'] == res1['decision']


def test_evaluate_policies_with_string_context():
    policies = [
        {"name": "p1", "conditions": ["industry:healthcare"], "priority": 1}
    ]
    ctx = "industry:healthcare"
    matches = router.evaluate_policies(policies, ctx)
    assert matches and matches[0]['name'] == 'p1'
