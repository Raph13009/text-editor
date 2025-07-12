import React, { useState } from 'react';
import { useStore } from './store/useStore';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import StatsBar from './components/StatsBar';
import ExportMenu from './components/ExportMenu';
import SettingsModal from './components/SettingsModal';
import { Settings, Download, Moon, Sun } from 'lucide-react';

function App() {
  const store = useStore();
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Add dark mode class to document
    document.documentElement.classList.toggle('dark', !darkMode);
  };

  if (!store.activeProject) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-garamond text-ink mb-4">Welcome to Your Writing Space</h1>
          <p className="text-ink-light mb-6">Create your first project to get started</p>
          <button
            onClick={() => store.createProject('My First Project', 'A collection of thoughts and ideas')}
            className="button-primary"
          >
            Create Project
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-paper ${darkMode ? 'dark' : ''}`}>
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-88 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-garamond font-medium text-ink mb-4">
              Writing Studio
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => setShowExportMenu(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                title="Export"
              >
                <Download size={16} />
                Export
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                title="Settings"
              >
                <Settings size={16} />
              </button>
              <button
                onClick={toggleDarkMode}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                title="Toggle Dark Mode"
              >
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <Sidebar store={store} />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Stats Bar */}
          <div className="bg-white border-b border-gray-200 px-6 py-3">
            <StatsBar store={store} />
          </div>

          {/* Editor */}
          <div className="flex-1 overflow-y-auto">
            <Editor store={store} />
          </div>
        </div>
      </div>

      {/* Modals */}
      {showExportMenu && (
        <ExportMenu
          store={store}
          onClose={() => setShowExportMenu(false)}
        />
      )}

      {showSettings && (
        <SettingsModal
          store={store}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

export default App; 