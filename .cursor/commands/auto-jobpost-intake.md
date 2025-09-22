# Auto Job Post Intake

Run the automated intake orchestrator instead of the manual `/@upwork start` flow. Paste the job post when prompted and press Ctrl-D to finish.

```bash
@command
python3 .cursor/dev-workflow/tools/auto_jobpost_intake.py --force-refresh
```

Optional flags:
- `--session-id session-XYZ` to target a specific folder name
- `--overwrite` to rebuild an existing session directory
- `--job-post-file path/to/post.txt` to ingest a saved post without manual pasting
