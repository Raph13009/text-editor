import React, { useState } from 'react';
import { X, Save, RotateCcw } from 'lucide-react';

const SettingsModal = ({ store, onClose }) => {
  const [settings, setSettings] = useState({...store.settings});

  const pageSizes = {
    'A4': { width: 21, height: 29.7, name: 'A4 (21 × 29.7 cm)' },
    'US Letter': { width: 21.6, height: 27.9, name: 'US Letter (8.5 × 11 in)' },
    'Legal': { width: 21.6, height: 35.6, name: 'Legal (8.5 × 14 in)' },
    'A5': { width: 14.8, height: 21, name: 'A5 (14.8 × 21 cm)' },
    'Custom': { width: 0, height: 0, name: 'Custom Size' }
  };

  const themes = {
    'light': { name: 'Light', description: 'Clean and bright' },
    'dark': { name: 'Dark', description: 'Easy on the eyes' },
    'sepia': { name: 'Sepia', description: 'Warm and cozy' },
    'auto': { name: 'Auto', description: 'Follows system preference' }
  };

  const handleSave = () => {
    store.updateSettings(settings);
    onClose();
  };

  const handleReset = () => {
    const defaultSettings = {
      theme: 'light',
      pageSize: 'A4',
      margins: { top: 2.5, right: 2.5, bottom: 2.5, left: 2.5 },
      dailyGoal: 1000,
      autoSave: true,
      exportFormat: 'pdf'
    };
    setSettings(defaultSettings);
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateMargin = (side, value) => {
    setSettings(prev => ({
      ...prev,
      margins: { ...prev.margins, [side]: parseFloat(value) || 0 }
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-garamond font-medium">Settings</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Writing Goals */}
          <div>
            <h3 className="text-lg font-medium mb-4">Writing Goals</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Daily Word Goal</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={settings.dailyGoal}
                    onChange={(e) => updateSetting('dailyGoal', parseInt(e.target.value) || 0)}
                    className="input-field w-32"
                    min="0"
                    step="100"
                  />
                  <span className="text-sm text-ink-light">words per day</span>
                </div>
                <p className="text-xs text-ink-light mt-1">
                  Set to 0 to disable daily goal tracking
                </p>
              </div>
            </div>
          </div>

          {/* Page Layout */}
          <div>
            <h3 className="text-lg font-medium mb-4">Page Layout</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Page Size</label>
                <select
                  value={settings.pageSize}
                  onChange={(e) => updateSetting('pageSize', e.target.value)}
                  className="input-field w-full"
                >
                  {Object.entries(pageSizes).map(([key, size]) => (
                    <option key={key} value={key}>
                      {size.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Margins (cm)</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-ink-light mb-1">Top</label>
                    <input
                      type="number"
                      value={settings.margins.top}
                      onChange={(e) => updateMargin('top', e.target.value)}
                      className="input-field w-full"
                      min="0"
                      step="0.5"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-ink-light mb-1">Right</label>
                    <input
                      type="number"
                      value={settings.margins.right}
                      onChange={(e) => updateMargin('right', e.target.value)}
                      className="input-field w-full"
                      min="0"
                      step="0.5"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-ink-light mb-1">Bottom</label>
                    <input
                      type="number"
                      value={settings.margins.bottom}
                      onChange={(e) => updateMargin('bottom', e.target.value)}
                      className="input-field w-full"
                      min="0"
                      step="0.5"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-ink-light mb-1">Left</label>
                    <input
                      type="number"
                      value={settings.margins.left}
                      onChange={(e) => updateMargin('left', e.target.value)}
                      className="input-field w-full"
                      min="0"
                      step="0.5"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Export Settings */}
          <div>
            <h3 className="text-lg font-medium mb-4">Export Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Default Export Format</label>
                <select
                  value={settings.exportFormat}
                  onChange={(e) => updateSetting('exportFormat', e.target.value)}
                  className="input-field w-full"
                >
                  <option value="pdf">PDF</option>
                  <option value="docx">DOCX</option>
                </select>
              </div>
            </div>
          </div>

          {/* Auto-Save */}
          <div>
            <h3 className="text-lg font-medium mb-4">Auto-Save</h3>
            <div className="space-y-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.autoSave}
                  onChange={(e) => updateSetting('autoSave', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Automatically save changes</span>
              </label>
              <p className="text-xs text-ink-light">
                When enabled, your changes will be saved automatically as you type
              </p>
            </div>
          </div>

          {/* Analytics */}
          <div>
            <h3 className="text-lg font-medium mb-4">Analytics</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Total Projects:</span>
                  <span className="ml-2">{store.projects.length}</span>
                </div>
                <div>
                  <span className="font-medium">Total Sections:</span>
                  <span className="ml-2">
                    {store.projects.reduce((sum, project) => sum + project.sections.length, 0)}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Total Words:</span>
                  <span className="ml-2">
                    {store.projects.reduce((sum, project) => 
                      sum + project.sections.reduce((sectionSum, section) => 
                        sectionSum + (section.wordCount || 0), 0), 0
                    ).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Current Streak:</span>
                  <span className="ml-2">{store.analytics.streak} days</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-medium mb-2">Recent Writing Activity</h4>
                <div className="space-y-1">
                  {Object.entries(store.analytics.dailyWords)
                    .sort(([a], [b]) => new Date(b) - new Date(a))
                    .slice(0, 5)
                    .map(([date, words]) => (
                      <div key={date} className="flex justify-between text-sm">
                        <span>{new Date(date).toLocaleDateString()}</span>
                        <span>{words} words</span>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Storage */}
          <div>
            <h3 className="text-lg font-medium mb-4">Storage</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-ink-light mb-2">
                  All your data is stored locally in your browser. No data is sent to external servers.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const data = {
                        projects: store.projects,
                        settings: store.settings,
                        analytics: store.analytics
                      };
                      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `writing-backup-${new Date().toISOString().split('T')[0]}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="button-secondary text-sm"
                  >
                    Export Backup
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('This will clear all your data. Are you sure? This cannot be undone.')) {
                        localStorage.clear();
                        window.location.reload();
                      }
                    }}
                    className="button-secondary text-sm text-red-600 hover:bg-red-50"
                  >
                    Clear All Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-between">
          <button
            onClick={handleReset}
            className="button-secondary flex items-center gap-2"
          >
            <RotateCcw size={16} />
            Reset to Defaults
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="button-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="button-primary flex items-center gap-2"
            >
              <Save size={16} />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal; 