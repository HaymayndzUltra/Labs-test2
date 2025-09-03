package openapi

deny[msg] {
  not startswith(input.openapi, "3")
  msg := "OpenAPI version must start with 3.x"
}

deny[msg] {
  not input.info.version
  msg := "OpenAPI info.version must be set"
}

deny[msg] {
  count(input.servers) == 0
  msg := "OpenAPI must declare at least one server"
}

deny[msg] {
  some i
  startswith(input.servers[i].url, "http://")
  msg := sprintf("Server URL must use https: %v", [input.servers[i].url])
}