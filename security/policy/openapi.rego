package openapi

deny contains msg if {
  not startswith(input.openapi, "3")
  msg := "OpenAPI version must start with 3.x"
}

deny contains msg if {
  not input.info.version
  msg := "OpenAPI info.version must be set"
}

deny contains msg if {
  count(input.servers) == 0
  msg := "OpenAPI must declare at least one server"
}

deny contains msg if {
  some i
  startswith(input.servers[i].url, "http://")
  msg := sprintf("Server URL must use https: %v", [input.servers[i].url])
}