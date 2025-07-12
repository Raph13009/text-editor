import React, { useState } from 'react';
import { 
  Plus, 
  ChevronDown, 
  ChevronRight, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Copy,
  BookOpen,
  FileText
} from 'lucide-react';

const Sidebar = ({ store }) => {
  const [expandedProjects, setExpandedProjects] = useState(new Set([store.activeProjectId]));
  const [editingProject, setEditingProject] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [showProjectMenu, setShowProjectMenu] = useState(null);
  const [showSectionMenu, setShowSectionMenu] = useState(null);

  const toggleProject = (projectId) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  const handleCreateProject = () => {
    if (newProjectTitle.trim()) {
      store.createProject(newProjectTitle.trim());
      setNewProjectTitle('');
      setEditingProject(null);
    }
  };

  const handleCreateSection = (projectId) => {
    if (newSectionTitle.trim()) {
      const newSection = store.createSection(projectId, newSectionTitle.trim());
      store.setActiveSectionId(newSection.id);
      setNewSectionTitle('');
      setEditingSection(null);
    }
  };

  const handleRenameProject = (projectId, newTitle) => {
    if (newTitle.trim()) {
      store.updateProject(projectId, { title: newTitle.trim() });
    }
    setEditingProject(null);
  };

  const handleRenameSection = (projectId, sectionId, newTitle) => {
    if (newTitle.trim()) {
      store.updateSection(projectId, sectionId, { title: newTitle.trim() });
    }
    setEditingSection(null);
  };

  const handleDeleteProject = (projectId) => {
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      store.deleteProject(projectId);
    }
    setShowProjectMenu(null);
  };

  const handleDeleteSection = (projectId, sectionId) => {
    if (confirm('Are you sure you want to delete this section? This action cannot be undone.')) {
      store.deleteSection(projectId, sectionId);
    }
    setShowSectionMenu(null);
  };

  const handleDuplicateSection = (projectId, section) => {
    const newSection = store.createSection(
      projectId, 
      `${section.title} (Copy)`, 
      section.content
    );
    store.setActiveSectionId(newSection.id);
    setShowSectionMenu(null);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Create Project Button */}
      <div className="mb-6">
        {editingProject ? (
          <div className="space-y-2">
            <input
              type="text"
              value={newProjectTitle}
              onChange={(e) => setNewProjectTitle(e.target.value)}
              placeholder="Project title..."
              className="input-field text-sm"
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleCreateProject();
                if (e.key === 'Escape') setEditingProject(null);
              }}
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreateProject}
                className="px-2 py-1 bg-accent text-white text-xs rounded hover:bg-blue-600"
              >
                Create
              </button>
              <button
                onClick={() => setEditingProject(null)}
                className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setEditingProject(true)}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm bg-accent text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus size={16} />
            New Project
          </button>
        )}
      </div>

      {/* Projects List */}
      <div className="space-y-2">
        {store.projects.map((project) => (
          <div key={project.id} className="space-y-1">
            {/* Project Header */}
            <div className="flex items-center justify-between group">
              <div 
                className="flex items-center gap-2 flex-1 cursor-pointer"
                onClick={() => {
                  store.setActiveProjectId(project.id);
                  toggleProject(project.id);
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleProject(project.id);
                  }}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  {expandedProjects.has(project.id) ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )}
                </button>
                <BookOpen size={16} className="text-accent" />
                <span className="text-sm font-medium text-ink truncate">
                  {project.title}
                </span>
              </div>
              
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowProjectMenu(showProjectMenu === project.id ? null : project.id);
                  }}
                  className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-100 rounded transition-opacity"
                >
                  <MoreVertical size={14} />
                </button>
                
                {showProjectMenu === project.id && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                    <button
                      onClick={() => {
                        setEditingProject(project.id);
                        setNewProjectTitle(project.title);
                        setShowProjectMenu(null);
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-gray-100"
                    >
                      <Edit2 size={12} />
                      Rename
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-gray-100 text-red-600"
                    >
                      <Trash2 size={12} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Sections */}
            {expandedProjects.has(project.id) && (
              <div className="ml-6 space-y-1">
                {project.sections
                  .sort((a, b) => a.order - b.order)
                  .map((section) => (
                    <div
                      key={section.id}
                      className={`flex items-center justify-between group ${
                        store.activeSectionId === section.id
                          ? 'bg-accent-light border-l-2 border-accent'
                          : 'hover:bg-gray-50'
                      } rounded-lg px-3 py-2 cursor-pointer`}
                      onClick={() => store.setActiveSectionId(section.id)}
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <FileText size={14} className="text-ink-light" />
                        <span className="text-sm text-ink truncate">
                          {section.title}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-ink-light">
                          {section.wordCount || 0}
                        </span>
                        
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowSectionMenu(showSectionMenu === section.id ? null : section.id);
                            }}
                            className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-100 rounded transition-opacity"
                          >
                            <MoreVertical size={12} />
                          </button>
                          
                          {showSectionMenu === section.id && (
                            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                              <button
                                onClick={() => {
                                  setEditingSection(section.id);
                                  setNewSectionTitle(section.title);
                                  setShowSectionMenu(null);
                                }}
                                className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-gray-100"
                              >
                                <Edit2 size={12} />
                                Rename
                              </button>
                              <button
                                onClick={() => handleDuplicateSection(project.id, section)}
                                className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-gray-100"
                              >
                                <Copy size={12} />
                                Duplicate
                              </button>
                              <button
                                onClick={() => handleDeleteSection(project.id, section.id)}
                                className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-gray-100 text-red-600"
                              >
                                <Trash2 size={12} />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                
                {/* Add Section Button */}
                <div className="ml-2">
                  {editingSection ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={newSectionTitle}
                        onChange={(e) => setNewSectionTitle(e.target.value)}
                        placeholder="Section title..."
                        className="input-field text-sm"
                        autoFocus
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleCreateSection(project.id);
                          if (e.key === 'Escape') setEditingSection(null);
                        }}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCreateSection(project.id)}
                          className="px-2 py-1 bg-accent text-white text-xs rounded hover:bg-blue-600"
                        >
                          Create
                        </button>
                        <button
                          onClick={() => setEditingSection(null)}
                          className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditingSection(project.id)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-ink-light hover:text-ink hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Plus size={12} />
                      Add Section
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Rename Project Modal */}
      {editingProject && typeof editingProject === 'string' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Rename Project</h3>
            <input
              type="text"
              value={newProjectTitle}
              onChange={(e) => setNewProjectTitle(e.target.value)}
              className="input-field mb-4"
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleRenameProject(editingProject, newProjectTitle);
                if (e.key === 'Escape') setEditingProject(null);
              }}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setEditingProject(null)}
                className="button-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRenameProject(editingProject, newProjectTitle)}
                className="button-primary"
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Section Modal */}
      {editingSection && typeof editingSection === 'string' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Rename Section</h3>
            <input
              type="text"
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              className="input-field mb-4"
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleRenameSection(store.activeProjectId, editingSection, newSectionTitle);
                if (e.key === 'Escape') setEditingSection(null);
              }}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setEditingSection(null)}
                className="button-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRenameSection(store.activeProjectId, editingSection, newSectionTitle)}
                className="button-primary"
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar; 