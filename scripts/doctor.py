#!/usr/bin/env python3
"""
Environment Doctor

Probes Docker/Node/npm/Python/pip/Go, detects CI/non-Docker envs,
and prints actionable PASS/FAIL checks.
"""

import os
import shutil
import subprocess
from typing import Tuple


def check(cmd: str, version_args=("--version",)) -> Tuple[bool, str]:
    path = shutil.which(cmd)
    if not path:
        return False, f"{cmd} not found in PATH"
    try:
        out = subprocess.run([cmd, *version_args], capture_output=True, text=True, timeout=5)
        ver = out.stdout.strip() or out.stderr.strip()
        return True, ver.splitlines()[0] if ver else f"{cmd} detected"
    except Exception as e:
        return True, f"{cmd} detected, version check failed: {e}"


def print_result(name: str, ok: bool, info: str, hint: str = ""):
    status = "PASS" if ok else "FAIL"
    print(f"[{status}] {name}: {info}")
    if hint and not ok:
        print(f"      Hint: {hint}")


def main():
    # CI detection
    in_ci = os.environ.get("CI") or os.environ.get("GITHUB_ACTIONS")
    if in_ci:
        print("[INFO] CI environment detected")
    else:
        print("[INFO] Local environment detected")

    ok, info = check("docker")
    print_result("Docker", ok, info, hint="Install Docker and ensure daemon is running: https://docker.com")

    okn, info = check("node")
    print_result("Node.js", okn, info, hint="Install Node 18+: https://nodejs.org")

    oknpm, info = check("npm")
    print_result("npm", oknpm, info, hint="Install with Node or use pnpm/yarn")

    okpy, info = check("python3", ("--version",))
    print_result("Python3", okpy, info, hint="Install Python 3.11+")

    okpip = bool(shutil.which("pip")) or bool(shutil.which("pip3"))
    print_result("pip", okpip, "pip detected" if okpip else "pip not found", hint="Install pip or use python -m ensurepip")

    okgo, info = check("go", ("version",))
    print_result("Go", okgo, info, hint="Install Go 1.21+: https://golang.org")

    # Summary exit code is 0; doctor is advisory
    print("\n[INFO] Doctor checks complete")


if __name__ == "__main__":
    main()

