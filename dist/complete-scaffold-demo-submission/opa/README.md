# OPA Policy for Submission Validation

This directory contains an Open Policy Agent (OPA) Rego policy for validating submission requirements.

## Usage

If you have OPA installed locally, you can validate the submission:

```bash
opa eval -i ../manifest.json -d policy.rego "data.submission.pass.allow"
```

Expected output for a valid submission:
```json
{
  "result": [
    {
      "expressions": [
        {
          "value": true
        }
      ]
    }
  ]
}
```

## Policy Rules

The policy validates:
- Frontend build status: PASSED
- Backend tests status: PASSED  
- Backend test coverage: >= 60%
- Code quality status: PASSED
- Performance status: PASSED
- Compliance status: PASSED

## Installation

To install OPA locally:
```bash
# Download and install OPA
curl -L -o opa https://openpolicyagent.org/downloads/latest/opa_linux_amd64
chmod +x opa
sudo mv opa /usr/local/bin/
```
