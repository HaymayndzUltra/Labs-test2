#!/usr/bin/env node

/**
 * Demo script to test the API testing automation
 * This creates a mock test report to demonstrate the quality gate functionality
 */

const fs = require('fs');
const path = require('path');

// Create mock test report
const mockReport = {
  run: {
    stats: {
      assertions: {
        total: 9,
        failed: 0
      }
    },
    timings: {
      started: Date.now() - 1000,
      completed: Date.now()
    },
    failures: []
  }
};

// Ensure reports directory exists
const reportsDir = path.join(__dirname, 'clients', 'acme-001', 'reports', 'api');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// Write mock report
const reportPath = path.join(reportsDir, 'postman_stage.json');
fs.writeFileSync(reportPath, JSON.stringify(mockReport, null, 2));

console.log('🎯 Demo: Created mock test report');
console.log(`📄 Report saved to: ${reportPath}`);
console.log('\n🚀 Now run: npm run api:gate');
console.log('   This will demonstrate the quality gate functionality!');
