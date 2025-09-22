package submission.pass

default allow = false

# Single-source-of-truth for mode (with precedence)
mode := m {
  input.mode != ""
  m := input.mode
}
else := "prod" {
  startswith(input.provenance.git.tag, "submission/")
}
else := "prod" {
  startswith(input.provenance.git.branch, "main")
}
else := "demo" {
  startswith(input.provenance.git.branch, "demo/")
}
else := "prod" { true }

threshold := 80 { mode == "prod" }
threshold := 60 { mode == "demo" }

passed(v) { v == "PASSED" }

deny[msg] {
  input.summary.backendTests.coveragePct < threshold
  msg := sprintf("Coverage %.1f%% < required %.0f%% (%s mode)", [input.summary.backendTests.coveragePct, threshold, mode])
}
deny[msg] { not passed(input.summary.performance.status); msg := "Performance not PASSED" }
deny[msg] { not passed(input.summary.codeQuality.status);  msg := "Code quality not PASSED" }
deny[msg] { not passed(input.summary.compliance.status);   msg := "Compliance not PASSED" }

allow { count(deny) == 0 }