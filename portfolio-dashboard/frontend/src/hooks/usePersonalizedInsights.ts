'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useUserPreferences } from './useUserPreferences';

export interface PersonalizedInsight {
  id: string;
  title: string;
  description: string;
  metricId: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  trend?: 'up' | 'down' | 'steady';
  value?: string;
  change?: number;
}

export interface UserBehavior {
  viewedProducts: string[];
  searchedTerms: string[];
  clickedCategories: string[];
  clickedBrands: string[];
  timeSpent: number;
  lastActivity: Date;
}

interface PersonalizedInsightsProps {
  userBehavior?: UserBehavior;
  dashboardData?: any;
}

export function usePersonalizedInsights({ userBehavior, dashboardData }: PersonalizedInsightsProps) {
  const { preferences } = useUserPreferences();
  const [insights, setInsights] = useState<PersonalizedInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Generate insights based on user behavior and preferences
  const generateInsights = useCallback(() => {
    if (!userBehavior || !dashboardData) return [];

    const newInsights: PersonalizedInsight[] = [];

    // 1. Category recommendations based on user behavior
    const topCategories = userBehavior.clickedCategories.slice(0, 3);
    if (topCategories.length > 0) {
      newInsights.push({
        id: 'category-recommendation',
        title: 'Explore Your Favorite Categories',
        description: `Based on your browsing history, you might be interested in these trending products in ${topCategories[0]}.`,
        metricId: 'category_engagement',
        priority: 'medium',
        actionable: true,
        trend: 'up',
        value: `${topCategories.length} categories`,
        change: 15
      });
    }

    // 2. Brand recommendations
    const topBrands = userBehavior.clickedBrands.slice(0, 2);
    if (topBrands.length > 0) {
      newInsights.push({
        id: 'brand-recommendation',
        title: 'New Arrivals from Your Preferred Brands',
        description: `${topBrands[0]} has released new products that match your preferences.`,
        metricId: 'brand_engagement',
        priority: 'medium',
        actionable: true,
        trend: 'up',
        value: `${topBrands.length} brands`,
        change: 8
      });
    }

    // 3. Search trend insights
    if (userBehavior.searchedTerms.length > 0) {
      newInsights.push({
        id: 'search-trend',
        title: 'Popular Search Trends',
        description: `"${userBehavior.searchedTerms[0]}" is trending in your region. Explore related products.`,
        metricId: 'search_trends',
        priority: 'low',
        actionable: false,
        trend: 'up',
        value: `${userBehavior.searchedTerms.length} searches`,
        change: 25
      });
    }

    // 4. Dashboard performance insights
    if (dashboardData?.overview_metrics) {
      const revenueMetric = dashboardData.overview_metrics.find((m: any) => m.id === 'total_revenue');
      if (revenueMetric && revenueMetric.change > 10) {
        newInsights.push({
          id: 'revenue-growth',
          title: 'Strong Revenue Growth',
          description: `Your revenue increased by ${revenueMetric.change}% this period.`,
          metricId: 'total_revenue',
          priority: 'high',
          actionable: true,
          trend: 'up',
          value: revenueMetric.value,
          change: revenueMetric.change
        });
      }
    }

    // 5. User preference insights
    if (preferences.dashboard.defaultView === 'analytics') {
      newInsights.push({
        id: 'analytics-focus',
        title: 'Analytics Dashboard Focus',
        description: 'You prefer analytics view. Consider exploring advanced metrics and trends.',
        metricId: 'user_preferences',
        priority: 'low',
        actionable: false,
        trend: 'steady',
        value: 'Analytics view',
        change: 0
      });
    }

    return newInsights;
  }, [userBehavior, dashboardData, preferences]);

  // Load insights
  const loadInsights = useCallback(async () => {
    setIsLoading(true);
    try {
      const generatedInsights = generateInsights();
      
      // Load saved insights from localStorage
      const savedInsights = typeof window !== 'undefined' 
        ? JSON.parse(localStorage.getItem('personalized-insights') || '[]')
        : [];
      
      // Ensure both are arrays
      const safeGeneratedInsights = Array.isArray(generatedInsights) ? generatedInsights : [];
      const safeSavedInsights = Array.isArray(savedInsights) ? savedInsights : [];
      
      // Combine and deduplicate insights
      const allInsights = [...safeGeneratedInsights, ...safeSavedInsights];
      const uniqueInsights = allInsights.filter((insight, index, self) => 
        index === self.findIndex(i => i.id === insight.id)
      );
      
      setInsights(uniqueInsights);
    } catch (error) {
      console.error('Failed to load personalized insights:', error);
      setInsights([]); // Ensure insights is always an array
    } finally {
      setIsLoading(false);
    }
  }, [generateInsights]);

  // Save insights to localStorage
  const saveInsights = useCallback((insightsToSave: PersonalizedInsight[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('personalized-insights', JSON.stringify(insightsToSave));
    }
  }, []);

  // Dismiss insight
  const dismissInsight = useCallback((insightId: string) => {
    setInsights(prev => {
      const updated = prev.filter(insight => insight.id !== insightId);
      saveInsights(updated);
      return updated;
    });
  }, [saveInsights]);

  // Mark insight as read
  const markAsRead = useCallback((insightId: string) => {
    setInsights(prev => {
      const updated = prev.map(insight => 
        insight.id === insightId ? { ...insight } : insight
      );
      saveInsights(updated);
      return updated;
    });
  }, [saveInsights]);

  // Memoized insights by priority
  const insightsByPriority = useMemo(() => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return insights.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
  }, [insights]);

  // Memoized insights by category
  const insightsByCategory = useMemo(() => {
    return insights.reduce((acc, insight) => {
      const category = insight.metricId;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(insight);
      return acc;
    }, {} as Record<string, PersonalizedInsight[]>);
  }, [insights]);

  // Load insights on mount and when dependencies change
  useEffect(() => {
    loadInsights();
  }, [loadInsights]);

  return {
    insights,
    insightsByPriority,
    insightsByCategory,
    isLoading,
    dismissInsight,
    markAsRead,
    refreshInsights: loadInsights
  };
}