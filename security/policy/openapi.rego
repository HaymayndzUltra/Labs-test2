package openapi

deny contains msg if {
  openapi_str := sprintf("%v", [input.openapi])
  not startswith(openapi_str, "3")
  msg := "OpenAPI version must start with 3.x"
}

deny contains msg if {
  not input.info.version
  msg := "OpenAPI info.version must be set"
}

deny contains msg if {
  not input.servers
  msg := "OpenAPI must declare at least one server"
}

deny contains msg if {
  input.servers
  server := input.servers[_]
  url := server.url
  is_string(url)
  startswith(url, "http://")
  msg := sprintf("Server URL must use https: %v", [url])
}