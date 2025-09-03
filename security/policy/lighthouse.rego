package lighthouse

deny[msg] {
  not input.ci
  msg := "Lighthouse config must define .ci"
}

deny[msg] {
  not input.ci.assert
  msg := "Lighthouse config must define ci.assert"
}

deny[msg] {
  not input.ci.assert.assertions
  msg := "Lighthouse config must define ci.assert.assertions"
}