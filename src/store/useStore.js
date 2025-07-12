import { useState, useEffect } from 'react';

// Generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Storage keys
const STORAGE_KEYS = {
  projects: 'ulysses-editor-projects',
  settings: 'ulysses-editor-settings',
  analytics: 'ulysses-editor-analytics'
};

// Default settings
const DEFAULT_SETTINGS = {
  theme: 'light',
  pageSize: 'A4',
  margins: { top: 2.5, right: 2.5, bottom: 2.5, left: 2.5 },
  dailyGoal: 1000,
  autoSave: true,
  exportFormat: 'pdf'
};

// Default project and section
const createDefaultProject = () => ({
  id: generateId(),
  title: 'My First Project',
  description: 'A collection of thoughts and ideas',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  sections: [
    {
      id: generateId(),
      title: 'Introduction',
      content: `# Welcome to your writing journey

This is your first section. Start writing here and let your thoughts flow.

## Getting Started

- Write in **Markdown** for rich formatting
- Use *italic* and **bold** text as needed
- Create lists and structure your content
- Each section is automatically saved

> "The first draft of anything is shit." - Ernest Hemingway

Remember, the goal is to get your ideas down first. You can always refine later.`,
      wordCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      order: 0
    }
  ]
});

export const useStore = () => {
  const [projects, setProjects] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [analytics, setAnalytics] = useState({
    dailyWords: {},
    totalWords: 0,
    streak: 0,
    lastWriteDate: null
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedProjects = localStorage.getItem(STORAGE_KEYS.projects);
    const savedSettings = localStorage.getItem(STORAGE_KEYS.settings);
    const savedAnalytics = localStorage.getItem(STORAGE_KEYS.analytics);

    if (savedProjects) {
      const parsedProjects = JSON.parse(savedProjects);
      setProjects(parsedProjects);
      if (parsedProjects.length > 0) {
        setActiveProjectId(parsedProjects[0].id);
        if (parsedProjects[0].sections.length > 0) {
          setActiveSectionId(parsedProjects[0].sections[0].id);
        }
      }
    } else {
      const defaultProject = createDefaultProject();
      setProjects([defaultProject]);
      setActiveProjectId(defaultProject.id);
      setActiveSectionId(defaultProject.sections[0].id);
    }

    if (savedSettings) {
      setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) });
    }

    if (savedAnalytics) {
      setAnalytics(JSON.parse(savedAnalytics));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(projects));
    }
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.analytics, JSON.stringify(analytics));
  }, [analytics]);

  // Helper functions
  const getActiveProject = () => {
    return projects.find(p => p.id === activeProjectId) || null;
  };

  const getActiveSection = () => {
    const project = getActiveProject();
    if (!project) return null;
    return project.sections.find(s => s.id === activeSectionId) || null;
  };

  const countWords = (text) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const updateWordCount = (sectionId, newContent) => {
    const wordCount = countWords(newContent);
    const today = new Date().toISOString().split('T')[0];
    
    setAnalytics(prev => ({
      ...prev,
      dailyWords: {
        ...prev.dailyWords,
        [today]: (prev.dailyWords[today] || 0) + Math.max(0, wordCount - (getActiveSection()?.wordCount || 0))
      },
      lastWriteDate: today
    }));

    return wordCount;
  };

  // Project management
  const createProject = (title, description = '') => {
    const newProject = {
      id: generateId(),
      title,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sections: []
    };
    setProjects(prev => [...prev, newProject]);
    setActiveProjectId(newProject.id);
    return newProject;
  };

  const updateProject = (projectId, updates) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId 
        ? { ...p, ...updates, updatedAt: new Date().toISOString() }
        : p
    ));
  };

  const deleteProject = (projectId) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (activeProjectId === projectId) {
      const remainingProjects = projects.filter(p => p.id !== projectId);
      if (remainingProjects.length > 0) {
        setActiveProjectId(remainingProjects[0].id);
        setActiveSectionId(remainingProjects[0].sections[0]?.id || null);
      } else {
        setActiveProjectId(null);
        setActiveSectionId(null);
      }
    }
  };

  // Section management
  const createSection = (projectId, title, content = '') => {
    const newSection = {
      id: generateId(),
      title,
      content,
      wordCount: countWords(content),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      order: 0
    };

    setProjects(prev => prev.map(p => 
      p.id === projectId 
        ? { 
            ...p, 
            sections: [...p.sections, { ...newSection, order: p.sections.length }],
            updatedAt: new Date().toISOString()
          }
        : p
    ));

    return newSection;
  };

  const updateSection = (projectId, sectionId, updates) => {
    const wordCount = updates.content ? updateWordCount(sectionId, updates.content) : undefined;
    
    setProjects(prev => prev.map(p => 
      p.id === projectId 
        ? {
            ...p,
            sections: p.sections.map(s => 
              s.id === sectionId 
                ? { 
                    ...s, 
                    ...updates, 
                    wordCount: wordCount !== undefined ? wordCount : s.wordCount,
                    updatedAt: new Date().toISOString() 
                  }
                : s
            ),
            updatedAt: new Date().toISOString()
          }
        : p
    ));
  };

  const deleteSection = (projectId, sectionId) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId 
        ? { 
            ...p, 
            sections: p.sections.filter(s => s.id !== sectionId),
            updatedAt: new Date().toISOString()
          }
        : p
    ));

    if (activeSectionId === sectionId) {
      const project = getActiveProject();
      const remainingSections = project?.sections.filter(s => s.id !== sectionId) || [];
      setActiveSectionId(remainingSections[0]?.id || null);
    }
  };

  const reorderSections = (projectId, newOrder) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId 
        ? {
            ...p,
            sections: newOrder.map((section, index) => ({ ...section, order: index })),
            updatedAt: new Date().toISOString()
          }
        : p
    ));
  };

  return {
    // State
    projects,
    activeProjectId,
    activeSectionId,
    settings,
    analytics,

    // Computed values
    activeProject: getActiveProject(),
    activeSection: getActiveSection(),

    // Actions
    setActiveProjectId,
    setActiveSectionId,
    createProject,
    updateProject,
    deleteProject,
    createSection,
    updateSection,
    deleteSection,
    reorderSections,
    updateSettings: setSettings,
    countWords
  };
}; 