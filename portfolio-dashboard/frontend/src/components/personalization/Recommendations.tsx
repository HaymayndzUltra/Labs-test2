'use client';

import { useState, useCallback } from 'react';
import { Star, TrendingUp, RefreshCw, Sparkles, Target, Users, Zap } from 'lucide-react';
import { type ProductRecommendation, type InsightRecommendation } from '../../hooks/useRecommendationEngine';

interface RecommendationsProps {
  productRecommendations: ProductRecommendation[];
  insightRecommendations: InsightRecommendation[];
  isLoading?: boolean;
  onRefresh?: () => void;
  onProductClick?: (product: ProductRecommendation) => void;
  onInsightClick?: (insight: InsightRecommendation) => void;
  className?: string;
}

export function Recommendations({ 
  productRecommendations,
  insightRecommendations,
  isLoading = false,
  onRefresh,
  onProductClick,
  onInsightClick,
  className = '' 
}: RecommendationsProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'insights'>('products');

  const handleProductClick = useCallback((product: ProductRecommendation) => {
    if (onProductClick) {
      onProductClick(product);
    }
  }, [onProductClick]);

  const handleInsightClick = useCallback((insight: InsightRecommendation) => {
    if (onInsightClick) {
      onInsightClick(insight);
    }
  }, [onInsightClick]);

  const getRecommendationTypeIcon = (type: ProductRecommendation['type']) => {
    switch (type) {
      case 'trending':
        return <TrendingUp className="w-4 h-4 text-orange-500" />;
      case 'similar':
        return <Users className="w-4 h-4 text-blue-500" />;
      case 'personalized':
        return <Target className="w-4 h-4 text-purple-500" />;
      case 'cross_sell':
        return <Zap className="w-4 h-4 text-green-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-neutral-500" />;
    }
  };

  const getInsightTypeIcon = (type: InsightRecommendation['type']) => {
    switch (type) {
      case 'metric':
        return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case 'trend':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'alert':
        return <Zap className="w-4 h-4 text-red-500" />;
      case 'opportunity':
        return <Target className="w-4 h-4 text-purple-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-neutral-500" />;
    }
  };

  const getPriorityColor = (priority: InsightRecommendation['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50';
      case 'low':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-neutral-200 bg-neutral-50';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={`bg-white rounded-lg border border-neutral-200 ${className}`}>
      <div className="flex items-center justify-between p-4 border-b border-neutral-200">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-neutral-900">Recommendations</h3>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex bg-neutral-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'products'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Products ({productRecommendations.length})
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'insights'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Insights ({insightRecommendations.length})
            </button>
          </div>
          
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 text-neutral-400 hover:text-neutral-600 disabled:opacity-50 transition-colors"
              aria-label="Refresh recommendations"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-sm text-neutral-600">Loading recommendations...</span>
          </div>
        ) : (
          <>
            {activeTab === 'products' && (
              <div className="space-y-3">
                {productRecommendations.length === 0 ? (
                  <div className="text-center py-8">
                    <Sparkles className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
                    <p className="text-sm text-neutral-600">No product recommendations available</p>
                  </div>
                ) : (
                  productRecommendations.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 cursor-pointer transition-colors"
                      onClick={() => handleProductClick(product)}
                    >
                      <div className="flex-shrink-0">
                        {getRecommendationTypeIcon(product.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-medium text-neutral-900 truncate">
                            {product.name}
                          </h4>
                          <span className="px-2 py-1 text-xs font-medium text-neutral-600 bg-neutral-100 rounded-full">
                            {product.type.replace('_', ' ')}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-neutral-600">
                          <span>{product.category}</span>
                          <span>{product.brand}</span>
                          <span className="font-medium text-neutral-900">${product.price}</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{product.rating}</span>
                          </div>
                        </div>
                        
                        <p className="text-xs text-neutral-500 mt-1">{product.reason}</p>
                      </div>
                      
                      <div className="flex-shrink-0 text-right">
                        <div className={`text-xs font-medium ${getConfidenceColor(product.confidence)}`}>
                          {Math.round(product.confidence * 100)}%
                        </div>
                        <div className="text-xs text-neutral-500">confidence</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'insights' && (
              <div className="space-y-3">
                {insightRecommendations.length === 0 ? (
                  <div className="text-center py-8">
                    <Sparkles className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
                    <p className="text-sm text-neutral-600">No insight recommendations available</p>
                  </div>
                ) : (
                  insightRecommendations.map((insight) => (
                    <div
                      key={insight.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${getPriorityColor(insight.priority)}`}
                      onClick={() => handleInsightClick(insight)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getInsightTypeIcon(insight.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-medium text-neutral-900 truncate">
                              {insight.title}
                            </h4>
                            <span className="px-2 py-1 text-xs font-medium text-neutral-600 bg-neutral-100 rounded-full">
                              {insight.type}
                            </span>
                            {insight.actionable && (
                              <span className="px-2 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full">
                                Actionable
                              </span>
                            )}
                          </div>
                          
                          <p className="text-xs text-neutral-700 mb-2">{insight.description}</p>
                          <p className="text-xs text-neutral-500">{insight.reason}</p>
                        </div>
                        
                        <div className="flex-shrink-0 text-right">
                          <div className={`text-xs font-medium ${getConfidenceColor(insight.confidence)}`}>
                            {Math.round(insight.confidence * 100)}%
                          </div>
                          <div className="text-xs text-neutral-500">confidence</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
