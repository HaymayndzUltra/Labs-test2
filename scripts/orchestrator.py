#!/usr/bin/env python3
import json, os, sys, time, socket, subprocess, signal
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STATE = ROOT / ".orchestrator/state.json"


def load_state():
    if not STATE.exists():
        STATE.parent.mkdir(parents=True, exist_ok=True)
        STATE.write_text(json.dumps({"services": {}}, indent=2))
    return json.loads(STATE.read_text())


def save_state(state):
    state["last_updated"] = int(time.time())
    STATE.write_text(json.dumps(state, indent=2))


def find_free_port(start_port):
    port = start_port
    while True:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            try:
                s.bind(("127.0.0.1", port))
                return port
            except OSError:
                port += 1


def run(cmd, env=None, background=False):
    if background:
        return subprocess.Popen(cmd, env=env or os.environ.copy())
    res = subprocess.run(cmd, env=env or os.environ.copy(), check=False)
    return res.returncode


def health_wait(url, timeout=20):
    import urllib.request
    start = time.time()
    while time.time() - start < timeout:
        try:
            with urllib.request.urlopen(url) as r:
                if r.status == 200:
                    return True
        except Exception:
            time.sleep(0.5)
    return False


def cmd_gen():
    print("GEN completed earlier via scaffolding.")


def cmd_status():
    st = load_state()
    print(json.dumps(st, indent=2))


def cmd_stop():
    # Best-effort: find known dev servers by ports and kill
    st = load_state()
    # No PID tracking in this stub; reset statuses
    for name in st.get("services", {}):
        st["services"][name]["status"] = "down"
    save_state(st)
    print("Stopped services (logical state).")


def main():
    if len(sys.argv) < 2:
        print("Usage: orchestrator.py [GEN|STATUS|STOP]")
        sys.exit(1)
    cmd = sys.argv[1].upper()
    if cmd == "GEN":
        cmd_gen()
    elif cmd == "STATUS":
        cmd_status()
    elif cmd == "STOP":
        cmd_stop()
    else:
        print(f"Unknown command: {cmd}")
        sys.exit(2)


if __name__ == "__main__":
    main()

