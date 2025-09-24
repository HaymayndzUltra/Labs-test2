'use client';

import { useState, useCallback } from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, Info, Sparkles } from 'lucide-react';
import { type PersonalizedInsight } from '../../hooks/usePersonalizedInsights';

interface PersonalizedInsightsProps {
  insights: PersonalizedInsight[];
  onInsightClick?: (insight: PersonalizedInsight) => void;
  isLoading?: boolean;
  className?: string;
}

export function PersonalizedInsights({ 
  insights, 
  onInsightClick,
  isLoading = false,
  className = '' 
}: PersonalizedInsightsProps) {
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);
  
  // Ensure insights is always an array
  const safeInsights = Array.isArray(insights) ? insights : [];

  const handleInsightClick = useCallback((insight: PersonalizedInsight) => {
    if (onInsightClick) {
      onInsightClick(insight);
    }
  }, [onInsightClick]);

  const toggleExpanded = useCallback((insightId: string) => {
    setExpandedInsight(prev => prev === insightId ? null : insightId);
  }, []);

  const getPriorityIcon = (priority: PersonalizedInsight['priority']) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'medium':
        return <Info className="w-4 h-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Info className="w-4 h-4 text-neutral-500" />;
    }
  };

  const getTrendIcon = (trend?: PersonalizedInsight['trend']) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'steady':
        return <Minus className="w-4 h-4 text-neutral-500" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority: PersonalizedInsight['priority']) => {
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

  if (isLoading) {
    return (
      <div className={`p-6 text-center ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
        <h3 className="text-lg font-medium text-neutral-900 mb-2">Loading Insights</h3>
        <p className="text-sm text-neutral-600">
          Analyzing your data to provide personalized insights...
        </p>
      </div>
    );
  }

  if (safeInsights.length === 0) {
    return (
      <div className={`p-6 text-center ${className}`}>
        <Sparkles className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-neutral-900 mb-2">No Personalized Insights</h3>
        <p className="text-sm text-neutral-600">
          We're analyzing your data to provide personalized insights. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-neutral-900">Personalized Insights</h3>
        <span className="px-2 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full">
          {safeInsights.length} insights
        </span>
      </div>

      <div className="space-y-3">
        {safeInsights.map((insight) => (
          <div
            key={insight.id}
            className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md cursor-pointer ${getPriorityColor(insight.priority)}`}
            onClick={() => handleInsightClick(insight)}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getPriorityIcon(insight.priority)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-sm font-semibold text-neutral-900 truncate">
                    {insight.title}
                  </h4>
                  {getTrendIcon(insight.trend)}
                  {insight.actionable && (
                    <span className="px-2 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full">
                      Actionable
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-neutral-700 mb-3">
                  {insight.description}
                </p>
                
                {(insight.value || insight.change !== undefined) && (
                  <div className="flex items-center gap-4 text-sm">
                    {insight.value && (
                      <div className="flex items-center gap-1">
                        <span className="text-neutral-600">Value:</span>
                        <span className="font-medium text-neutral-900">{insight.value}</span>
                      </div>
                    )}
                    {insight.change !== undefined && (
                      <div className="flex items-center gap-1">
                        <span className="text-neutral-600">Change:</span>
                        <span className={`font-medium ${
                          insight.change > 0 ? 'text-green-600' : 
                          insight.change < 0 ? 'text-red-600' : 'text-neutral-600'
                        }`}>
                          {insight.change > 0 ? '+' : ''}{insight.change}%
                        </span>
                      </div>
                    )}
                  </div>
                )}
                
                {expandedInsight === insight.id && (
                  <div className="mt-3 pt-3 border-t border-neutral-200">
                    <div className="text-xs text-neutral-600">
                      <div className="mb-1">
                        <span className="font-medium">Metric ID:</span> {insight.metricId}
                      </div>
                      <div className="mb-1">
                        <span className="font-medium">Priority:</span> {insight.priority}
                      </div>
                      <div>
                        <span className="font-medium">Actionable:</span> {insight.actionable ? 'Yes' : 'No'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpanded(insight.id);
                }}
                className="flex-shrink-0 text-neutral-400 hover:text-neutral-600 transition-colors"
                aria-label={expandedInsight === insight.id ? 'Collapse' : 'Expand'}
              >
                <svg 
                  className={`w-4 h-4 transition-transform ${expandedInsight === insight.id ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-xs text-neutral-500 text-center pt-2">
        Insights are personalized based on your preferences and data patterns
      </div>
    </div>
  );
}
