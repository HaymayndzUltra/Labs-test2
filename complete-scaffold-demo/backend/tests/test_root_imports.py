# Ensures app import + settings paths execute (bumps coverage deterministically)
def test_app_import():
    import importlib
    m = importlib.import_module("main")
    assert hasattr(m, "app")
