#!/usr/bin/env node

/**
 * Postman Test Results Gate Checker
 * 
 * This script validates Postman test results and acts as a quality gate.
 * It will exit with code 0 (success) or 1 (failure) based on test results.
 * 
 * Usage: node tools/check-postman.js <path-to-json-report>
 * Example: node tools/check-postman.js clients/acme-001/reports/api/postman_stage.json
 */

const fs = require('fs');
const path = require('path');

// Get the report file path from command line arguments
const reportPath = process.argv[2];

if (!reportPath) {
    console.error('❌ Error: Report file path is required');
    console.log('Usage: node tools/check-postman.js <path-to-json-report>');
    process.exit(1);
}

// Check if report file exists
if (!fs.existsSync(reportPath)) {
    console.error(`❌ Error: Report file not found: ${reportPath}`);
    process.exit(1);
}

try {
    // Read and parse the JSON report
    const reportData = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    
    // Extract test statistics
    const stats = reportData.run.stats;
    const failures = reportData.run.failures || [];
    
    // Display test results summary
    console.log('\n📊 Postman Test Results Summary:');
    console.log('================================');
    console.log(`✅ Passed: ${stats.assertions.total - stats.assertions.failed}`);
    console.log(`❌ Failed: ${stats.assertions.failed}`);
    console.log(`📝 Total: ${stats.assertions.total}`);
    console.log(`⏱️  Duration: ${reportData.run.timings.completed - reportData.run.timings.started}ms`);
    
    // Check for failures
    if (stats.assertions.failed > 0) {
        console.log('\n❌ Test Failures Detected:');
        console.log('========================');
        
        failures.forEach((failure, index) => {
            console.log(`\n${index + 1}. ${failure.error.name}`);
            console.log(`   Test: ${failure.error.test}`);
            console.log(`   Message: ${failure.error.message}`);
            console.log(`   Request: ${failure.source.name}`);
        });
        
        console.log('\n🚫 Quality Gate: FAILED');
        console.log('❌ Cannot proceed with deployment due to test failures');
        process.exit(1);
    }
    
    // All tests passed
    console.log('\n✅ Quality Gate: PASSED');
    console.log('🚀 All tests passed! Ready for deployment');
    
    // Save evidence to a summary file
    const evidencePath = path.join(path.dirname(reportPath), 'test_evidence.txt');
    const evidenceContent = `
Postman Test Evidence
====================
Date: ${new Date().toISOString()}
Report: ${reportPath}
Status: PASSED
Tests: ${stats.assertions.total}
Passed: ${stats.assertions.total - stats.assertions.failed}
Failed: ${stats.assertions.failed}
Duration: ${reportData.run.timings.completed - reportData.run.timings.started}ms
Quality Gate: PASSED
    `.trim();
    
    fs.writeFileSync(evidencePath, evidenceContent);
    console.log(`📄 Evidence saved to: ${evidencePath}`);
    
    process.exit(0);
    
} catch (error) {
    console.error('❌ Error parsing report file:', error.message);
    process.exit(1);
}
