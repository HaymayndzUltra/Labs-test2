# 🚀 API Testing Automation with One-liner Scripts

## Overview
This setup provides automated API testing with evidence collection using Postman and Newman. Perfect for CI/CD pipelines and quality gates.

## 📁 Project Structure
```
Labs-test2/
├── package.json                    # NPM scripts configuration
├── tools/
│   └── check-postman.js           # Quality gate checker
└── clients/
    └── acme-001/
        ├── postman/
        │   ├── collection.json     # Postman test collection
        │   └── env.stage.json     # Stage environment variables
        └── reports/
            └── api/               # Test reports and evidence
```

## 🛠️ Available Scripts

### 1. Run API Tests (`api:run:stage`)
```bash
npm run api:run:stage
```

**What it does:**
- Runs Postman collection against stage environment
- Generates both CLI and JSON reports
- Saves detailed results to `clients/acme-001/reports/api/postman_stage.json`

**Output:**
- ✅ Real-time test results in terminal
- 📄 Detailed JSON report for analysis
- ⏱️ Performance metrics and timing data

### 2. Quality Gate Check (`api:gate`)
```bash
npm run api:gate
```

**What it does:**
- Validates test results from JSON report
- Acts as quality gate (pass/fail)
- Generates evidence file for compliance
- Exits with code 0 (success) or 1 (failure)

**Output:**
- 📊 Test summary statistics
- ❌ Detailed failure information (if any)
- 📄 Evidence file for audit trails
- 🚫 Blocks deployment if tests fail

## 🚀 Usage Examples

### Basic Testing
```bash
# Run tests and check results
npm run api:run:stage && npm run api:gate
```

### CI/CD Integration
```yaml
# GitHub Actions example
- name: Run API Tests
  run: npm run api:run:stage

- name: Quality Gate Check
  run: npm run api:gate
```

### Docker Integration
```dockerfile
# Dockerfile example
COPY package.json ./
RUN npm install
COPY clients/ ./clients/
RUN npm run api:run:stage && npm run api:gate
```

## 📊 Test Results Format

### JSON Report Structure
```json
{
  "run": {
    "stats": {
      "assertions": {
        "total": 9,
        "failed": 0
      }
    },
    "timings": {
      "started": 1234567890,
      "completed": 1234567891
    },
    "failures": []
  }
}
```

### Evidence File
```
Postman Test Evidence
====================
Date: 2024-01-15T10:30:00.000Z
Report: clients/acme-001/reports/api/postman_stage.json
Status: PASSED
Tests: 9
Passed: 9
Failed: 0
Duration: 1000ms
Quality Gate: PASSED
```

## 🔧 Configuration

### Environment Variables
Edit `clients/acme-001/postman/env.stage.json`:
```json
{
  "values": [
    {
      "key": "base_url",
      "value": "https://your-api-stage.com",
      "enabled": true
    },
    {
      "key": "auth_token",
      "value": "your-stage-token",
      "enabled": true
    }
  ]
}
```

### Test Collection
Add your API tests to `clients/acme-001/postman/collection.json`:
- Health checks
- Authentication tests
- CRUD operations
- Performance tests
- Error handling tests

## 🎯 Quality Gate Rules

The quality gate will **FAIL** if:
- ❌ Any test assertions fail
- ❌ Response times exceed thresholds
- ❌ Required fields are missing
- ❌ Status codes are incorrect

The quality gate will **PASS** if:
- ✅ All tests pass
- ✅ Performance requirements met
- ✅ All assertions successful
- ✅ No critical errors

## 🚨 Error Handling

### Common Issues
1. **Report file not found**
   - Ensure `api:run:stage` ran successfully first
   - Check file path in script configuration

2. **Tests failing**
   - Review test assertions in collection
   - Check environment variables
   - Verify API endpoints are accessible

3. **Permission errors**
   - Ensure `tools/check-postman.js` is executable
   - Check write permissions for reports directory

### Debug Mode
```bash
# Run with verbose output
DEBUG=* npm run api:run:stage

# Check specific report file
node tools/check-postman.js clients/acme-001/reports/api/postman_stage.json
```

## 📈 Advanced Features

### Custom Test Thresholds
Modify `tools/check-postman.js` to add custom validation rules:
```javascript
// Add custom performance thresholds
if (responseTime > 5000) {
    console.error('❌ Response time too slow');
    process.exit(1);
}
```

### Multiple Environments
Add more scripts for different environments:
```json
{
  "scripts": {
    "api:run:dev": "newman run clients/acme-001/postman/collection.json -e clients/acme-001/postman/env.dev.json --reporters cli,json --reporter-json-export clients/acme-001/reports/api/postman_dev.json",
    "api:run:prod": "newman run clients/acme-001/postman/collection.json -e clients/acme-001/postman/env.prod.json --reporters cli,json --reporter-json-export clients/acme-001/reports/api/postman_prod.json"
  }
}
```

### Integration with Other Tools
- **Slack notifications** on test failures
- **Jira ticket creation** for failed tests
- **Email alerts** for critical failures
- **Dashboard updates** with test metrics

## 🎉 Benefits

1. **Automated Testing** - No manual intervention required
2. **Evidence Collection** - Audit trail for compliance
3. **Quality Gates** - Prevents bad deployments
4. **CI/CD Ready** - Integrates with any pipeline
5. **Performance Monitoring** - Tracks response times
6. **Error Detection** - Catches issues early
7. **Team Collaboration** - Shared test results

## 🚀 Next Steps

1. **Customize tests** for your specific APIs
2. **Add more environments** (dev, prod, etc.)
3. **Integrate with CI/CD** pipeline
4. **Set up monitoring** and alerts
5. **Expand test coverage** for all endpoints
6. **Add performance benchmarks**
7. **Create test dashboards**

---

**Ready to test! Run `npm run api:run:stage && npm run api:gate` to get started!** 🚀
