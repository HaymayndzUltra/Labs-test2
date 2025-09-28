#!/usr/bin/env python3
"""Wrapper script to invoke the workflow optimizer CLI."""

from __future__ import annotations

import sys

from workflow_optimizer.cli import run_cli


if __name__ == "__main__":  # pragma: no cover
    sys.exit(run_cli())
