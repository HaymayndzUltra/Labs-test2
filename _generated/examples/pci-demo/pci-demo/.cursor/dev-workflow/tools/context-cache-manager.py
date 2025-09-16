#!/usr/bin/env python3
"""
Context Cache Manager
High-performance caching system for context discovery and rule activation
"""

import os
import json
import hashlib
import time
import pickle
import threading
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass, asdict
from datetime import datetime, timedelta
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class CacheEntry:
    """Represents a cached context entry"""
    key: str
    data: Any
    timestamp: float
    ttl: int
    access_count: int
    last_accessed: float
    dependencies: List[str]
    industry_context: Optional[str] = None
    rule_types: List[str] = None

@dataclass
class CacheStats:
    """Cache performance statistics"""
    total_entries: int
    hit_count: int
    miss_count: int
    eviction_count: int
    total_size_bytes: int
    hit_rate: float
    average_access_time: float

class ContextCacheManager:
    """High-performance context cache manager with intelligent invalidation"""
    
    def __init__(self, cache_dir: str = ".cursor/dev-workflow/cache", 
                 max_size_mb: int = 100, default_ttl: int = 3600):
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        self.max_size_bytes = max_size_mb * 1024 * 1024
        self.default_ttl = default_ttl
        self.cache: Dict[str, CacheEntry] = {}
        self.stats = CacheStats(0, 0, 0, 0, 0, 0.0, 0.0)
        self.lock = threading.RLock()
        self.cleanup_thread = None
        self.running = True
        
        # Start background cleanup thread
        self._start_cleanup_thread()
        
        # Load existing cache
        self._load_cache()
    
    def _start_cleanup_thread(self):
        """Start background cleanup thread"""
        def cleanup_worker():
            while self.running:
                try:
                    self._cleanup_expired_entries()
                    time.sleep(60)  # Run every minute
                except Exception as e:
                    logger.error(f"Cache cleanup error: {e}")
        
        self.cleanup_thread = threading.Thread(target=cleanup_worker, daemon=True)
        self.cleanup_thread.start()
    
    def _load_cache(self):
        """Load cache from disk"""
        cache_file = self.cache_dir / "context_cache.pkl"
        if cache_file.exists():
            try:
                with open(cache_file, 'rb') as f:
                    self.cache = pickle.load(f)
                logger.info(f"Loaded {len(self.cache)} cache entries from disk")
            except Exception as e:
                logger.error(f"Failed to load cache: {e}")
                self.cache = {}
    
    def _save_cache(self):
        """Save cache to disk"""
        cache_file = self.cache_dir / "context_cache.pkl"
        try:
            with self.lock:
                with open(cache_file, 'wb') as f:
                    pickle.dump(self.cache, f)
        except Exception as e:
            logger.error(f"Failed to save cache: {e}")
    
    def _generate_cache_key(self, context: Dict[str, Any], 
                          operation: str = "context_discovery") -> str:
        """Generate a unique cache key for the given context"""
        # Create a deterministic key based on context
        key_data = {
            "operation": operation,
            "project_path": context.get("project_path", ""),
            "industry": context.get("industry", ""),
            "tech_stack": sorted(context.get("tech_stack", [])),
            "keywords": sorted(context.get("keywords", [])),
            "file_patterns": sorted(context.get("file_patterns", [])),
            "directory_patterns": sorted(context.get("directory_patterns", []))
        }
        
        # Create hash of key data
        key_string = json.dumps(key_data, sort_keys=True)
        return hashlib.sha256(key_string.encode()).hexdigest()[:16]
    
    def get(self, context: Dict[str, Any], operation: str = "context_discovery") -> Optional[Any]:
        """Get cached context data"""
        with self.lock:
            key = self._generate_cache_key(context, operation)
            
            if key in self.cache:
                entry = self.cache[key]
                
                # Check if entry is expired
                if time.time() - entry.timestamp > entry.ttl:
                    del self.cache[key]
                    self.stats.miss_count += 1
                    self.stats.eviction_count += 1
                    return None
                
                # Update access statistics
                entry.access_count += 1
                entry.last_accessed = time.time()
                self.stats.hit_count += 1
                
                logger.debug(f"Cache hit for key: {key}")
                return entry.data
            else:
                self.stats.miss_count += 1
                logger.debug(f"Cache miss for key: {key}")
                return None
    
    def put(self, context: Dict[str, Any], data: Any, 
            ttl: Optional[int] = None, operation: str = "context_discovery",
            dependencies: List[str] = None) -> str:
        """Store context data in cache"""
        with self.lock:
            key = self._generate_cache_key(context, operation)
            ttl = ttl or self.default_ttl
            
            # Create cache entry
            entry = CacheEntry(
                key=key,
                data=data,
                timestamp=time.time(),
                ttl=ttl,
                access_count=1,
                last_accessed=time.time(),
                dependencies=dependencies or [],
                industry_context=context.get("industry"),
                rule_types=context.get("rule_types", [])
            )
            
            # Check cache size and evict if necessary
            self._ensure_cache_size_limit()
            
            # Store entry
            self.cache[key] = entry
            self.stats.total_entries = len(self.cache)
            
            # Update total size
            self._update_cache_size()
            
            logger.debug(f"Cached data for key: {key}")
            return key
    
    def invalidate(self, pattern: str = None, industry: str = None, 
                   rule_type: str = None, dependencies: List[str] = None):
        """Invalidate cache entries based on pattern"""
        with self.lock:
            keys_to_remove = []
            
            for key, entry in self.cache.items():
                should_invalidate = False
                
                # Pattern-based invalidation
                if pattern and pattern in key:
                    should_invalidate = True
                
                # Industry-based invalidation
                if industry and entry.industry_context == industry:
                    should_invalidate = True
                
                # Rule type-based invalidation
                if rule_type and rule_type in (entry.rule_types or []):
                    should_invalidate = True
                
                # Dependency-based invalidation
                if dependencies and any(dep in (entry.dependencies or []) for dep in dependencies):
                    should_invalidate = True
                
                if should_invalidate:
                    keys_to_remove.append(key)
            
            # Remove invalidated entries
            for key in keys_to_remove:
                del self.cache[key]
                self.stats.eviction_count += 1
            
            self.stats.total_entries = len(self.cache)
            logger.info(f"Invalidated {len(keys_to_remove)} cache entries")
    
    def _ensure_cache_size_limit(self):
        """Ensure cache doesn't exceed size limit"""
        if self._get_cache_size() > self.max_size_bytes:
            # Evict least recently used entries
            self._evict_lru_entries()
    
    def _get_cache_size(self) -> int:
        """Get current cache size in bytes"""
        total_size = 0
        for entry in self.cache.values():
            try:
                entry_size = len(pickle.dumps(entry.data))
                total_size += entry_size
            except Exception:
                # If we can't serialize, estimate size
                total_size += 1024  # 1KB estimate
        return total_size
    
    def _update_cache_size(self):
        """Update cache size statistics"""
        self.stats.total_size_bytes = self._get_cache_size()
    
    def _evict_lru_entries(self):
        """Evict least recently used entries"""
        # Sort by last accessed time (oldest first)
        sorted_entries = sorted(self.cache.items(), 
                              key=lambda x: x[1].last_accessed)
        
        # Remove oldest entries until we're under the limit
        while self._get_cache_size() > self.max_size_bytes and sorted_entries:
            key, _ = sorted_entries.pop(0)
            del self.cache[key]
            self.stats.eviction_count += 1
        
        self.stats.total_entries = len(self.cache)
        logger.info(f"Evicted entries to maintain cache size limit")
    
    def _cleanup_expired_entries(self):
        """Remove expired entries from cache"""
        with self.lock:
            current_time = time.time()
            keys_to_remove = []
            
            for key, entry in self.cache.items():
                if current_time - entry.timestamp > entry.ttl:
                    keys_to_remove.append(key)
            
            for key in keys_to_remove:
                del self.cache[key]
                self.stats.eviction_count += 1
            
            if keys_to_remove:
                self.stats.total_entries = len(self.cache)
                logger.info(f"Cleaned up {len(keys_to_remove)} expired entries")
    
    def get_stats(self) -> CacheStats:
        """Get cache performance statistics"""
        with self.lock:
            total_requests = self.stats.hit_count + self.stats.miss_count
            self.stats.hit_rate = (self.stats.hit_count / total_requests * 100) if total_requests > 0 else 0
            return self.stats
    
    def clear(self):
        """Clear all cache entries"""
        with self.lock:
            self.cache.clear()
            self.stats = CacheStats(0, 0, 0, 0, 0, 0.0, 0.0)
            logger.info("Cache cleared")
    
    def export_cache(self, file_path: str):
        """Export cache to file"""
        with self.lock:
            export_data = {
                "entries": {k: asdict(v) for k, v in self.cache.items()},
                "stats": asdict(self.stats),
                "export_timestamp": time.time()
            }
            
            with open(file_path, 'w') as f:
                json.dump(export_data, f, indent=2)
    
    def import_cache(self, file_path: str):
        """Import cache from file"""
        with self.lock:
            try:
                with open(file_path, 'r') as f:
                    import_data = json.load(f)
                
                # Restore entries
                for key, entry_data in import_data.get("entries", {}).items():
                    entry = CacheEntry(**entry_data)
                    self.cache[key] = entry
                
                # Restore stats
                stats_data = import_data.get("stats", {})
                self.stats = CacheStats(**stats_data)
                
                logger.info(f"Imported {len(self.cache)} cache entries")
            except Exception as e:
                logger.error(f"Failed to import cache: {e}")
    
    def shutdown(self):
        """Shutdown cache manager"""
        self.running = False
        if self.cleanup_thread:
            self.cleanup_thread.join(timeout=5)
        
        # Save cache to disk
        self._save_cache()
        logger.info("Cache manager shutdown complete")

class ContextCacheOptimizer:
    """Optimizes cache performance based on usage patterns"""
    
    def __init__(self, cache_manager: ContextCacheManager):
        self.cache_manager = cache_manager
        self.optimization_rules = self._load_optimization_rules()
    
    def _load_optimization_rules(self) -> Dict[str, Any]:
        """Load cache optimization rules"""
        return {
            "industry_ttl_adjustments": {
                "healthcare": 7200,  # 2 hours - high compliance requirements
                "finance": 7200,     # 2 hours - high security requirements
                "ecommerce": 3600,   # 1 hour - moderate requirements
                "enterprise": 5400,  # 1.5 hours - moderate requirements
                "default": 3600      # 1 hour default
            },
            "rule_type_ttl_adjustments": {
                "security": 1800,    # 30 minutes - frequently changing
                "compliance": 3600,  # 1 hour - moderately stable
                "industry": 7200,    # 2 hours - stable
                "quality": 5400,     # 1.5 hours - moderately stable
                "workflow": 3600,    # 1 hour - moderately stable
                "project": 7200      # 2 hours - stable
            },
            "access_pattern_optimization": {
                "high_frequency_threshold": 10,
                "ttl_multiplier": 1.5,
                "low_frequency_threshold": 2,
                "ttl_divisor": 2
            }
        }
    
    def optimize_cache_entry(self, entry: CacheEntry) -> int:
        """Optimize TTL for a cache entry based on usage patterns"""
        base_ttl = entry.ttl
        
        # Industry-based adjustment
        industry = entry.industry_context
        if industry in self.optimization_rules["industry_ttl_adjustments"]:
            industry_ttl = self.optimization_rules["industry_ttl_adjustments"][industry]
            base_ttl = min(base_ttl, industry_ttl)
        
        # Rule type-based adjustment
        if entry.rule_types:
            for rule_type in entry.rule_types:
                if rule_type in self.optimization_rules["rule_type_ttl_adjustments"]:
                    rule_ttl = self.optimization_rules["rule_type_ttl_adjustments"][rule_type]
                    base_ttl = min(base_ttl, rule_ttl)
        
        # Access pattern-based adjustment
        access_thresholds = self.optimization_rules["access_pattern_optimization"]
        
        if entry.access_count >= access_thresholds["high_frequency_threshold"]:
            # High frequency access - increase TTL
            base_ttl = int(base_ttl * access_thresholds["ttl_multiplier"])
        elif entry.access_count <= access_thresholds["low_frequency_threshold"]:
            # Low frequency access - decrease TTL
            base_ttl = int(base_ttl / access_thresholds["ttl_divisor"])
        
        return max(base_ttl, 300)  # Minimum 5 minutes
    
    def optimize_cache(self):
        """Optimize entire cache based on usage patterns"""
        with self.cache_manager.lock:
            for key, entry in self.cache_manager.cache.items():
                optimized_ttl = self.optimize_cache_entry(entry)
                if optimized_ttl != entry.ttl:
                    entry.ttl = optimized_ttl
                    logger.debug(f"Optimized TTL for {key}: {entry.ttl}s")

def main():
    """Main function for command-line usage"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Context Cache Manager")
    parser.add_argument("--cache-dir", default=".cursor/dev-workflow/cache", 
                       help="Cache directory")
    parser.add_argument("--max-size", type=int, default=100, 
                       help="Maximum cache size in MB")
    parser.add_argument("--operation", choices=["stats", "clear", "export", "import", "optimize"],
                       help="Cache operation")
    parser.add_argument("--file", help="File for export/import operations")
    
    args = parser.parse_args()
    
    # Initialize cache manager
    cache_manager = ContextCacheManager(args.cache_dir, args.max_size)
    
    try:
        if args.operation == "stats":
            stats = cache_manager.get_stats()
            print(f"Cache Statistics:")
            print(f"  Total Entries: {stats.total_entries}")
            print(f"  Hit Rate: {stats.hit_rate:.2f}%")
            print(f"  Total Size: {stats.total_size_bytes / 1024 / 1024:.2f} MB")
            print(f"  Evictions: {stats.eviction_count}")
        
        elif args.operation == "clear":
            cache_manager.clear()
            print("Cache cleared")
        
        elif args.operation == "export":
            if not args.file:
                print("Error: --file required for export operation")
                return
            cache_manager.export_cache(args.file)
            print(f"Cache exported to {args.file}")
        
        elif args.operation == "import":
            if not args.file:
                print("Error: --file required for import operation")
                return
            cache_manager.import_cache(args.file)
            print(f"Cache imported from {args.file}")
        
        elif args.operation == "optimize":
            optimizer = ContextCacheOptimizer(cache_manager)
            optimizer.optimize_cache()
            print("Cache optimized")
        
        else:
            print("No operation specified")
    
    finally:
        cache_manager.shutdown()

if __name__ == "__main__":
    main()
