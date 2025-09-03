package lighthouse

deny contains msg if {
  not input.ci
  msg := "Lighthouse config must define .ci"
}

deny contains msg if {
  not input.ci.assert
  msg := "Lighthouse config must define ci.assert"
}

deny contains msg if {
  not input.ci.assert.assertions
  msg := "Lighthouse config must define ci.assert.assertions"
}