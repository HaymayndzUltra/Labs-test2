'use client';

import { useState, useCallback } from 'react';
import { Settings, Save, RotateCcw, Bell, Palette, Globe, BarChart3 } from 'lucide-react';
import { type UserPreferences } from '../../hooks/useUserPreferences';

interface PersonalizationSettingsProps {
  preferences: UserPreferences;
  onPreferencesChange: (preferences: UserPreferences) => void;
  className?: string;
}

export function PersonalizationSettings({ 
  preferences, 
  onPreferencesChange,
  className = '' 
}: PersonalizationSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localPreferences, setLocalPreferences] = useState(preferences);
  const [hasChanges, setHasChanges] = useState(false);

  const handlePreferenceChange = useCallback((key: string, value: any) => {
    setLocalPreferences(prev => {
      const newPrefs = { ...prev };
      const keys = key.split('.');
      
      if (keys.length === 1) {
        newPrefs[key as keyof UserPreferences] = value;
      } else if (keys.length === 2) {
        (newPrefs[keys[0] as keyof UserPreferences] as any)[keys[1]] = value;
      }
      
      return newPrefs;
    });
    setHasChanges(true);
  }, []);

  const handleSave = useCallback(() => {
    onPreferencesChange(localPreferences);
    setHasChanges(false);
    setIsOpen(false);
  }, [localPreferences, onPreferencesChange]);

  const handleReset = useCallback(() => {
    setLocalPreferences(preferences);
    setHasChanges(false);
  }, [preferences]);

  const handleCancel = useCallback(() => {
    setLocalPreferences(preferences);
    setHasChanges(false);
    setIsOpen(false);
  }, [preferences]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2 px-3 py-2 text-sm text-neutral-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors ${className}`}
        aria-label="Open personalization settings"
      >
        <Settings className="w-4 h-4" />
        <span>Personalize</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <h2 className="text-xl font-semibold text-neutral-900">Personalization Settings</h2>
              <button
                onClick={handleCancel}
                className="text-neutral-400 hover:text-neutral-600 transition-colors"
                aria-label="Close settings"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-8">
                {/* Theme Settings */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-medium text-neutral-900">
                    <Palette className="w-5 h-5" />
                    <span>Appearance</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Theme
                      </label>
                      <select
                        value={localPreferences.theme}
                        onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Language & Region */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-medium text-neutral-900">
                    <Globe className="w-5 h-5" />
                    <span>Language & Region</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Language
                      </label>
                      <select
                        value={localPreferences.language}
                        onChange={(e) => handlePreferenceChange('language', e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Currency
                      </label>
                      <select
                        value={localPreferences.currency}
                        onChange={(e) => handlePreferenceChange('currency', e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="JPY">JPY (¥)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Notifications */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-medium text-neutral-900">
                    <Bell className="w-5 h-5" />
                    <span>Notifications</span>
                  </div>
                  
                  <div className="space-y-3">
                    {Object.entries(localPreferences.notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <label className="text-sm font-medium text-neutral-700 capitalize">
                          {key} notifications
                        </label>
                        <button
                          onClick={() => handlePreferenceChange(`notifications.${key}`, !value)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            value ? 'bg-primary' : 'bg-neutral-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              value ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dashboard Preferences */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-medium text-neutral-900">
                    <BarChart3 className="w-5 h-5" />
                    <span>Dashboard</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Default View
                      </label>
                      <select
                        value={localPreferences.dashboard.defaultView}
                        onChange={(e) => handlePreferenceChange('dashboard.defaultView', e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      >
                        <option value="analytics">Analytics</option>
                        <option value="catalog">Product Catalog</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Items Per Page
                      </label>
                      <select
                        value={localPreferences.dashboard.itemsPerPage}
                        onChange={(e) => handlePreferenceChange('dashboard.itemsPerPage', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-neutral-700">
                          Show Insights
                        </label>
                        <button
                          onClick={() => handlePreferenceChange('dashboard.showInsights', !localPreferences.dashboard.showInsights)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            localPreferences.dashboard.showInsights ? 'bg-primary' : 'bg-neutral-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              localPreferences.dashboard.showInsights ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-neutral-700">
                          Auto Refresh
                        </label>
                        <button
                          onClick={() => handlePreferenceChange('dashboard.autoRefresh', !localPreferences.dashboard.autoRefresh)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            localPreferences.dashboard.autoRefresh ? 'bg-primary' : 'bg-neutral-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              localPreferences.dashboard.autoRefresh ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-6 border-t border-neutral-200 bg-neutral-50">
              <button
                onClick={handleReset}
                disabled={!hasChanges}
                className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-600 hover:text-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm text-neutral-600 hover:text-neutral-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!hasChanges}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
