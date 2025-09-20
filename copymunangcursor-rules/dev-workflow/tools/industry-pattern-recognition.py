#!/usr/bin/env python3
"""
Industry Pattern Recognition System
Automatically detects industry patterns and activates relevant rules
"""

import os
import json
import re
import yaml
from pathlib import Path
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
from enum import Enum

class Industry(Enum):
    HEALTHCARE = "healthcare"
    FINANCE = "finance"
    ECOMMERCE = "ecommerce"
    ENTERPRISE = "enterprise"
    CONSUMER_MOBILE = "consumer_mobile"
    UNKNOWN = "unknown"

@dataclass
class IndustryPattern:
    """Represents an industry pattern with its detection criteria"""
    industry: Industry
    keywords: List[str]
    tech_stack_indicators: List[str]
    directory_patterns: List[str]
    file_patterns: List[str]
    compliance_requirements: List[str]
    confidence_threshold: float = 0.7

class IndustryPatternRecognizer:
    """Main class for industry pattern recognition and rule activation"""
    
    def __init__(self, project_path: str):
        self.project_path = Path(project_path)
        self.industry_patterns = self._initialize_patterns()
        self.detected_industry = Industry.UNKNOWN
        self.confidence_score = 0.0
        self.activated_rules = []
        
    def _initialize_patterns(self) -> Dict[Industry, IndustryPattern]:
        """Initialize industry patterns with detection criteria"""
        return {
            Industry.HEALTHCARE: IndustryPattern(
                industry=Industry.HEALTHCARE,
                keywords=[
                    "patient", "medical", "health", "clinic", "hospital", "hipaa",
                    "healthcare", "physician", "doctor", "nurse", "appointment",
                    "medical record", "patient portal", "health data", "phr"
                ],
                tech_stack_indicators=[
                    "healthcare-apis", "epic", "cerner", "hl7", "fhir",
                    "auth0-healthcare", "hipaa-compliant", "medical-software"
                ],
                directory_patterns=[
                    "patient-portal", "medical-records", "appointment-scheduling",
                    "health-data", "patient-management", "clinical"
                ],
                file_patterns=[
                    "patient", "medical", "health", "hipaa", "clinical"
                ],
                compliance_requirements=["HIPAA", "HITECH", "FDA"]
            ),
            
            Industry.FINANCE: IndustryPattern(
                industry=Industry.FINANCE,
                keywords=[
                    "payment", "transaction", "banking", "financial", "sox", "pci",
                    "money", "account", "balance", "transfer", "investment",
                    "trading", "fraud", "compliance", "audit", "financial"
                ],
                tech_stack_indicators=[
                    "stripe", "paypal", "financial-apis", "trading", "banking",
                    "payment-gateway", "pci-compliant", "sox-compliant"
                ],
                directory_patterns=[
                    "payment-processing", "account-management", "fraud-detection",
                    "financial-reporting", "transaction-history", "banking"
                ],
                file_patterns=[
                    "payment", "transaction", "banking", "financial", "sox", "pci"
                ],
                compliance_requirements=["SOX", "PCI DSS", "Basel III"]
            ),
            
            Industry.ECOMMERCE: IndustryPattern(
                industry=Industry.ECOMMERCE,
                keywords=[
                    "shop", "store", "product", "cart", "checkout", "gdpr",
                    "ecommerce", "shopping", "inventory", "order", "customer",
                    "product catalog", "shopping cart", "payment", "shipping"
                ],
                tech_stack_indicators=[
                    "shopify", "woocommerce", "stripe", "payment-gateways",
                    "ecommerce", "shopping-cart", "product-catalog"
                ],
                directory_patterns=[
                    "product-catalog", "shopping-cart", "order-management",
                    "inventory", "customer-portal", "ecommerce"
                ],
                file_patterns=[
                    "shop", "store", "product", "cart", "checkout", "ecommerce"
                ],
                compliance_requirements=["GDPR", "CCPA", "PCI DSS"]
            ),
            
            Industry.ENTERPRISE: IndustryPattern(
                industry=Industry.ENTERPRISE,
                keywords=[
                    "enterprise", "saas", "multi-tenant", "sso", "admin",
                    "organization", "team", "user management", "api management",
                    "enterprise", "corporate", "business", "workflow"
                ],
                tech_stack_indicators=[
                    "auth0", "okta", "salesforce", "microsoft-365", "enterprise",
                    "multi-tenant", "sso", "saml", "oidc", "enterprise-saas"
                ],
                directory_patterns=[
                    "admin-dashboard", "user-management", "api-management",
                    "organization", "team-management", "enterprise"
                ],
                file_patterns=[
                    "enterprise", "admin", "user", "organization", "team"
                ],
                compliance_requirements=["SOC2", "ISO27001", "FedRAMP"]
            ),
            
            Industry.CONSUMER_MOBILE: IndustryPattern(
                industry=Industry.CONSUMER_MOBILE,
                keywords=[
                    "mobile", "app", "ios", "android", "pwa", "progressive",
                    "consumer", "user", "mobile-first", "responsive", "touch"
                ],
                tech_stack_indicators=[
                    "react-native", "expo", "flutter", "pwa", "mobile",
                    "ios", "android", "progressive-web-app"
                ],
                directory_patterns=[
                    "mobile-app", "pwa", "mobile", "app", "consumer"
                ],
                file_patterns=[
                    "mobile", "app", "ios", "android", "pwa"
                ],
                compliance_requirements=["App Store Guidelines", "Google Play Guidelines"]
            )
        }
    
    def analyze_project(self) -> Tuple[Industry, float]:
        """Analyze project and return detected industry with confidence score"""
        signals = self._extract_project_signals()
        scores = self._calculate_industry_scores(signals)
        
        if not scores:
            return Industry.UNKNOWN, 0.0
            
        # Find industry with highest score
        best_industry = max(scores, key=scores.get)
        confidence = scores[best_industry]
        
        self.detected_industry = best_industry
        self.confidence_score = confidence
        
        return best_industry, confidence
    
    def _extract_project_signals(self) -> Dict[str, List[str]]:
        """Extract signals from project structure and content"""
        signals = {
            'keywords': [],
            'tech_stack': [],
            'directories': [],
            'files': []
        }
        
        # Extract keywords from README and package files
        signals['keywords'] = self._extract_keywords()
        
        # Extract tech stack indicators
        signals['tech_stack'] = self._extract_tech_stack()
        
        # Extract directory patterns
        signals['directories'] = self._extract_directory_patterns()
        
        # Extract file patterns
        signals['files'] = self._extract_file_patterns()
        
        return signals
    
    def _extract_keywords(self) -> List[str]:
        """Extract keywords from project files"""
        keywords = []
        
        # Check README files
        for readme_file in self.project_path.rglob("README.md"):
            try:
                with open(readme_file, 'r', encoding='utf-8') as f:
                    content = f.read().lower()
                    keywords.extend(self._extract_words_from_text(content))
            except Exception:
                continue
        
        # Check package.json for description and keywords
        package_json = self.project_path / "package.json"
        if package_json.exists():
            try:
                with open(package_json, 'r') as f:
                    data = json.load(f)
                    if 'description' in data:
                        keywords.extend(self._extract_words_from_text(data['description'].lower()))
                    if 'keywords' in data:
                        keywords.extend([kw.lower() for kw in data['keywords']])
            except Exception:
                pass
        
        return list(set(keywords))
    
    def _extract_tech_stack(self) -> List[str]:
        """Extract technology stack indicators"""
        tech_stack = []
        
        # Check package.json dependencies
        package_json = self.project_path / "package.json"
        if package_json.exists():
            try:
                with open(package_json, 'r') as f:
                    data = json.load(f)
                    dependencies = data.get('dependencies', {})
                    dev_dependencies = data.get('devDependencies', {})
                    all_deps = {**dependencies, **dev_dependencies}
                    tech_stack.extend(list(all_deps.keys()))
            except Exception:
                pass
        
        # Check requirements.txt for Python projects
        requirements_txt = self.project_path / "requirements.txt"
        if requirements_txt.exists():
            try:
                with open(requirements_txt, 'r') as f:
                    tech_stack.extend([line.split('==')[0].split('>=')[0].split('<=')[0] 
                                     for line in f if line.strip() and not line.startswith('#')])
            except Exception:
                pass
        
        return [dep.lower() for dep in tech_stack]
    
    def _extract_directory_patterns(self) -> List[str]:
        """Extract directory patterns from project structure"""
        directories = []
        
        for item in self.project_path.rglob("*"):
            if item.is_dir():
                dir_name = item.name.lower()
                directories.append(dir_name)
                # Also check parent directory names
                for parent in item.parents:
                    if parent != self.project_path:
                        directories.append(parent.name.lower())
        
        return list(set(directories))
    
    def _extract_file_patterns(self) -> List[str]:
        """Extract file patterns from project structure"""
        files = []
        
        for item in self.project_path.rglob("*"):
            if item.is_file():
                file_name = item.stem.lower()
                files.append(file_name)
        
        return list(set(files))
    
    def _extract_words_from_text(self, text: str) -> List[str]:
        """Extract meaningful words from text"""
        # Remove special characters and split into words
        words = re.findall(r'\b[a-zA-Z]+\b', text)
        # Filter out common words and short words
        stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'}
        return [word.lower() for word in words if len(word) > 2 and word.lower() not in stop_words]
    
    def _calculate_industry_scores(self, signals: Dict[str, List[str]]) -> Dict[Industry, float]:
        """Calculate confidence scores for each industry"""
        scores = {}
        
        for industry, pattern in self.industry_patterns.items():
            score = 0.0
            total_weight = 0.0
            
            # Keyword matching (weight: 0.4)
            keyword_matches = sum(1 for keyword in pattern.keywords if keyword in signals['keywords'])
            if pattern.keywords:
                keyword_score = keyword_matches / len(pattern.keywords)
                score += keyword_score * 0.4
                total_weight += 0.4
            
            # Tech stack matching (weight: 0.3)
            tech_matches = sum(1 for tech in pattern.tech_stack_indicators if tech in signals['tech_stack'])
            if pattern.tech_stack_indicators:
                tech_score = tech_matches / len(pattern.tech_stack_indicators)
                score += tech_score * 0.3
                total_weight += 0.3
            
            # Directory pattern matching (weight: 0.2)
            dir_matches = sum(1 for dir_pattern in pattern.directory_patterns if dir_pattern in signals['directories'])
            if pattern.directory_patterns:
                dir_score = dir_matches / len(pattern.directory_patterns)
                score += dir_score * 0.2
                total_weight += 0.2
            
            # File pattern matching (weight: 0.1)
            file_matches = sum(1 for file_pattern in pattern.file_patterns if file_pattern in signals['files'])
            if pattern.file_patterns:
                file_score = file_matches / len(pattern.file_patterns)
                score += file_score * 0.1
                total_weight += 0.1
            
            # Normalize score
            if total_weight > 0:
                scores[industry] = score / total_weight
            else:
                scores[industry] = 0.0
        
        return scores
    
    def activate_industry_rules(self) -> List[str]:
        """Activate rules based on detected industry"""
        if self.detected_industry == Industry.UNKNOWN:
            return []
        
        pattern = self.industry_patterns[self.detected_industry]
        activated_rules = []
        
        # Always activate the industry patterns rule
        activated_rules.append("common-rule-client-industry-patterns")
        
        # Add industry-specific rules based on compliance requirements
        for compliance in pattern.compliance_requirements:
            if compliance == "HIPAA":
                activated_rules.append("healthcare-compliance")
            elif compliance == "SOX":
                activated_rules.append("finance-compliance")
            elif compliance == "PCI DSS":
                activated_rules.append("payment-security")
            elif compliance == "GDPR":
                activated_rules.append("privacy-compliance")
            elif compliance == "SOC2":
                activated_rules.append("enterprise-security")
        
        self.activated_rules = activated_rules
        return activated_rules
    
    def generate_rule_activation_config(self) -> Dict:
        """Generate configuration for rule activation"""
        return {
            "detected_industry": self.detected_industry.value,
            "confidence_score": self.confidence_score,
            "activated_rules": self.activated_rules,
            "compliance_requirements": self.industry_patterns[self.detected_industry].compliance_requirements if self.detected_industry != Industry.UNKNOWN else [],
            "recommended_tech_stack": self._get_recommended_tech_stack()
        }
    
    def _get_recommended_tech_stack(self) -> Dict[str, str]:
        """Get recommended tech stack for detected industry"""
        recommendations = {
            Industry.HEALTHCARE: {
                "frontend": "React/Next.js with HIPAA-compliant hosting",
                "backend": "Node.js/Python with encrypted databases",
                "auth": "Auth0 with healthcare compliance add-ons",
                "hosting": "AWS/GCP with BAA (Business Associate Agreement)"
            },
            Industry.FINANCE: {
                "frontend": "React with financial-grade security",
                "backend": "Java/C# with financial middleware",
                "auth": "Enterprise SSO with MFA",
                "hosting": "On-premise or certified cloud providers"
            },
            Industry.ECOMMERCE: {
                "frontend": "Next.js with performance optimization",
                "backend": "Node.js/Python with payment processing",
                "auth": "Social login with guest checkout option",
                "hosting": "CDN-enabled with global distribution"
            },
            Industry.ENTERPRISE: {
                "frontend": "React/Angular with complex state management",
                "backend": "Microservices architecture",
                "auth": "Enterprise directory integration",
                "hosting": "Kubernetes with auto-scaling"
            },
            Industry.CONSUMER_MOBILE: {
                "frontend": "React Native/Flutter for mobile apps",
                "backend": "Node.js/Python with mobile APIs",
                "auth": "Social login with biometric support",
                "hosting": "CDN with mobile optimization"
            }
        }
        
        return recommendations.get(self.detected_industry, {})

def main():
    """Main function for command-line usage"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Industry Pattern Recognition System")
    parser.add_argument("--project-path", required=True, help="Path to the project directory")
    parser.add_argument("--output", help="Output file for configuration (JSON)")
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose output")
    
    args = parser.parse_args()
    
    # Initialize recognizer
    recognizer = IndustryPatternRecognizer(args.project_path)
    
    # Analyze project
    industry, confidence = recognizer.analyze_project()
    
    if args.verbose:
        print(f"Project: {args.project_path}")
        print(f"Detected Industry: {industry.value}")
        print(f"Confidence Score: {confidence:.2f}")
    
    # Activate rules
    activated_rules = recognizer.activate_industry_rules()
    
    if args.verbose:
        print(f"Activated Rules: {', '.join(activated_rules)}")
    
    # Generate configuration
    config = recognizer.generate_rule_activation_config()
    
    if args.output:
        with open(args.output, 'w') as f:
            json.dump(config, f, indent=2)
        print(f"Configuration saved to {args.output}")
    else:
        print(json.dumps(config, indent=2))

if __name__ == "__main__":
    main()
