# Upwork Proposal Automation

## Quickstart

1. Create config facts (optional):
   - `/workspace/config/candidate-facts.yaml`
2. Start a session from a job post:
   ```bash
   echo "<paste job post>" | python -m upwork_automation.cli start
   ```
3. Add a client reply:
   ```bash
   echo "<client reply>" | python -m upwork_automation.cli add
   ```
4. Validate current draft:
   ```bash
   python -m upwork_automation.cli validate
   ```
5. Generate brief (gated until <=3 open gaps):
   ```bash
   python -m upwork_automation.cli brief
   ```

## Commands
- start|add|status|gaps|draft|validate|redflags|traces|brief|tune|facts|watch

## Troubleshooting
- If validate fails, check `validation_report.json` for failures and auto-fixes.
- If brief is blocked, run `gaps` and address top questions first.
- Candidate proofs come from `config/candidate-facts.yaml`.

## Performance
- Time-to-first-draft (TtFD) targets < 10s on typical posts.
- Validator pass rate targeted > 99% on golden fixtures.