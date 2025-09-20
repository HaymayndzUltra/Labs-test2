#!/usr/bin/env python3
"""
Cached Context Discovery Integration
Integrates context caching with enhanced context discovery for optimal performance
"""

import os
import json
import time
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple
from context_cache_manager import ContextCacheManager
from industry_pattern_recognition import IndustryPatternRecognizer, Industry
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CachedContextDiscovery:
    """Enhanced context discovery with intelligent caching"""
    
    def __init__(self, project_path: str, cache_config: Dict[str, Any] = None):
        self.project_path = project_path
        self.cache_config = cache_config or {}
        
        # Initialize cache manager
        cache_dir = self.cache_config.get('cache_directory', '.cursor/dev-workflow/cache')
        max_size_mb = self.cache_config.get('max_size_mb', 100)
        self.cache_manager = ContextCacheManager(cache_dir, max_size_mb)
        
        # Initialize industry recognizer
        self.industry_recognizer = IndustryPatternRecognizer(project_path)
        
        # Cache keys for different operations
        self.cache_keys = {
            'industry_classification': 'industry_classification',
            'rule_activation': 'rule_activation',
            'compliance_mapping': 'compliance_mapping',
            'tech_stack_analysis': 'tech_stack_analysis',
            'context_discovery': 'context_discovery'
        }
    
    def discover_context(self, user_request: str, force_refresh: bool = False) -> Dict[str, Any]:
        """Discover context with intelligent caching"""
        # Create context for caching
        context = {
            'project_path': self.project_path,
            'user_request': user_request,
            'timestamp': time.time()
        }
        
        # Check cache first (unless force refresh)
        if not force_refresh:
            cached_result = self.cache_manager.get(context, self.cache_keys['context_discovery'])
            if cached_result:
                logger.info("Using cached context discovery result")
                return cached_result
        
        # Perform context discovery
        logger.info("Performing fresh context discovery")
        result = self._perform_context_discovery(user_request)
        
        # Cache the result
        ttl = self.cache_config.get('ttl', {}).get('context_discovery', 3600)
        self.cache_manager.put(context, result, ttl, self.cache_keys['context_discovery'])
        
        return result
    
    def _perform_context_discovery(self, user_request: str) -> Dict[str, Any]:
        """Perform the actual context discovery"""
        # Step 1: Industry Classification
        industry, confidence = self._get_industry_classification(user_request)
        
        # Step 2: Rule Activation
        activated_rules = self._get_activated_rules(industry, confidence)
        
        # Step 3: Compliance Mapping
        compliance_requirements = self._get_compliance_requirements(industry)
        
        # Step 4: Technology Stack Analysis
        tech_stack = self._get_tech_stack_analysis(industry)
        
        # Step 5: Context Assembly
        context_result = {
            'industry': industry.value if industry else 'unknown',
            'confidence': confidence,
            'activated_rules': activated_rules,
            'compliance_requirements': compliance_requirements,
            'tech_stack': tech_stack,
            'discovery_timestamp': time.time(),
            'cache_hit': False
        }
        
        return context_result
    
    def _get_industry_classification(self, user_request: str) -> Tuple[Industry, float]:
        """Get industry classification with caching"""
        context = {
            'project_path': self.project_path,
            'user_request': user_request
        }
        
        # Check cache
        cached_result = self.cache_manager.get(context, self.cache_keys['industry_classification'])
        if cached_result:
            logger.debug("Using cached industry classification")
            return Industry(cached_result['industry']), cached_result['confidence']
        
        # Perform classification
        industry, confidence = self.industry_recognizer.analyze_project()
        
        # Cache result
        ttl = self.cache_config.get('ttl', {}).get('industry_classification', 7200)
        cache_data = {
            'industry': industry.value,
            'confidence': confidence
        }
        self.cache_manager.put(context, cache_data, ttl, self.cache_keys['industry_classification'])
        
        return industry, confidence
    
    def _get_activated_rules(self, industry: Industry, confidence: float) -> List[str]:
        """Get activated rules with caching"""
        context = {
            'project_path': self.project_path,
            'industry': industry.value,
            'confidence': confidence
        }
        
        # Check cache
        cached_result = self.cache_manager.get(context, self.cache_keys['rule_activation'])
        if cached_result:
            logger.debug("Using cached rule activation")
            return cached_result['rules']
        
        # Perform rule activation
        rules = self.industry_recognizer.activate_industry_rules()
        
        # Cache result
        ttl = self.cache_config.get('ttl', {}).get('rule_activation', 1800)
        cache_data = {'rules': rules}
        self.cache_manager.put(context, cache_data, ttl, self.cache_keys['rule_activation'])
        
        return rules
    
    def _get_compliance_requirements(self, industry: Industry) -> List[str]:
        """Get compliance requirements with caching"""
        context = {
            'project_path': self.project_path,
            'industry': industry.value
        }
        
        # Check cache
        cached_result = self.cache_manager.get(context, self.cache_keys['compliance_mapping'])
        if cached_result:
            logger.debug("Using cached compliance requirements")
            return cached_result['requirements']
        
        # Get compliance requirements
        config = self.industry_recognizer.generate_rule_activation_config()
        requirements = config.get('compliance_requirements', [])
        
        # Cache result
        ttl = self.cache_config.get('ttl', {}).get('compliance_mapping', 3600)
        cache_data = {'requirements': requirements}
        self.cache_manager.put(context, cache_data, ttl, self.cache_keys['compliance_mapping'])
        
        return requirements
    
    def _get_tech_stack_analysis(self, industry: Industry) -> Dict[str, str]:
        """Get technology stack analysis with caching"""
        context = {
            'project_path': self.project_path,
            'industry': industry.value
        }
        
        # Check cache
        cached_result = self.cache_manager.get(context, self.cache_keys['tech_stack_analysis'])
        if cached_result:
            logger.debug("Using cached tech stack analysis")
            return cached_result['tech_stack']
        
        # Get tech stack recommendations
        config = self.industry_recognizer.generate_rule_activation_config()
        tech_stack = config.get('recommended_tech_stack', {})
        
        # Cache result
        ttl = self.cache_config.get('ttl', {}).get('tech_stack_analysis', 5400)
        cache_data = {'tech_stack': tech_stack}
        self.cache_manager.put(context, cache_data, ttl, self.cache_keys['tech_stack_analysis'])
        
        return tech_stack
    
    def invalidate_cache(self, pattern: str = None, industry: str = None):
        """Invalidate cache entries"""
        self.cache_manager.invalidate(pattern, industry)
        logger.info(f"Cache invalidated for pattern: {pattern}, industry: {industry}")
    
    def get_cache_stats(self) -> Dict[str, Any]:
        """Get cache performance statistics"""
        stats = self.cache_manager.get_stats()
        return {
            'total_entries': stats.total_entries,
            'hit_rate': stats.hit_rate,
            'total_size_mb': stats.total_size_bytes / 1024 / 1024,
            'eviction_count': stats.eviction_count,
            'hit_count': stats.hit_count,
            'miss_count': stats.miss_count
        }
    
    def optimize_cache(self):
        """Optimize cache performance"""
        from context_cache_manager import ContextCacheOptimizer
        optimizer = ContextCacheOptimizer(self.cache_manager)
        optimizer.optimize_cache()
        logger.info("Cache optimized")
    
    def export_cache(self, file_path: str):
        """Export cache to file"""
        self.cache_manager.export_cache(file_path)
        logger.info(f"Cache exported to {file_path}")
    
    def import_cache(self, file_path: str):
        """Import cache from file"""
        self.cache_manager.import_cache(file_path)
        logger.info(f"Cache imported from {file_path}")
    
    def shutdown(self):
        """Shutdown the cached context discovery system"""
        self.cache_manager.shutdown()
        logger.info("Cached context discovery system shutdown complete")

def main():
    """Main function for command-line usage"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Cached Context Discovery")
    parser.add_argument("--project-path", required=True, help="Project path")
    parser.add_argument("--request", help="User request for context discovery")
    parser.add_argument("--config", help="Configuration file")
    parser.add_argument("--force-refresh", action="store_true", help="Force refresh cache")
    parser.add_argument("--stats", action="store_true", help="Show cache statistics")
    parser.add_argument("--optimize", action="store_true", help="Optimize cache")
    parser.add_argument("--export", help="Export cache to file")
    parser.add_argument("--import", help="Import cache from file")
    
    args = parser.parse_args()
    
    # Load configuration
    config = {}
    if args.config:
        with open(args.config, 'r') as f:
            config = json.load(f)
    
    # Initialize cached context discovery
    cached_discovery = CachedContextDiscovery(args.project_path, config)
    
    try:
        if args.stats:
            stats = cached_discovery.get_cache_stats()
            print(f"Cache Statistics:")
            for key, value in stats.items():
                print(f"  {key}: {value}")
        
        elif args.optimize:
            cached_discovery.optimize_cache()
            print("Cache optimized")
        
        elif args.export:
            cached_discovery.export_cache(args.export)
            print(f"Cache exported to {args.export}")
        
        elif args.import:
            cached_discovery.import_cache(args.import)
            print(f"Cache imported from {args.import}")
        
        elif args.request:
            result = cached_discovery.discover_context(args.request, args.force_refresh)
            print(json.dumps(result, indent=2))
        
        else:
            print("No operation specified")
    
    finally:
        cached_discovery.shutdown()

if __name__ == "__main__":
    main()
