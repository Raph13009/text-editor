import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useHotkeys } from 'react-hotkeys-hook';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Eye,
  EyeOff,
  Type
} from 'lucide-react';

const Editor = ({ store }) => {
  const [content, setContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const textareaRef = useRef(null);
  const timeoutRef = useRef(null);

  // Load content when active section changes
  useEffect(() => {
    if (store.activeSection) {
      setContent(store.activeSection.content || '');
    }
  }, [store.activeSection]);

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && store.activeSection && content !== store.activeSection.content) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        store.updateSection(store.activeProjectId, store.activeSectionId, { content });
      }, 1000);
    }
    
    return () => clearTimeout(timeoutRef.current);
  }, [content, autoSave, store]);

  // Keyboard shortcuts
  useHotkeys('cmd+b, ctrl+b', (e) => {
    e.preventDefault();
    insertMarkdown('**', '**');
  });

  useHotkeys('cmd+i, ctrl+i', (e) => {
    e.preventDefault();
    insertMarkdown('*', '*');
  });

  useHotkeys('cmd+1, ctrl+1', (e) => {
    e.preventDefault();
    insertMarkdown('# ', '');
  });

  useHotkeys('cmd+2, ctrl+2', (e) => {
    e.preventDefault();
    insertMarkdown('## ', '');
  });

  useHotkeys('cmd+3, ctrl+3', (e) => {
    e.preventDefault();
    insertMarkdown('### ', '');
  });

  useHotkeys('cmd+shift+k, ctrl+shift+k', (e) => {
    e.preventDefault();
    insertMarkdown('`', '`');
  });

  useHotkeys('cmd+shift+., ctrl+shift+.', (e) => {
    e.preventDefault();
    insertMarkdown('> ', '');
  });

  const insertMarkdown = (before, after) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    const newContent = 
      content.substring(0, start) + 
      before + selectedText + after + 
      content.substring(end);
    
    setContent(newContent);
    
    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + before.length + selectedText.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const handleToolbarAction = (action) => {
    switch (action) {
      case 'bold':
        insertMarkdown('**', '**');
        break;
      case 'italic':
        insertMarkdown('*', '*');
        break;
      case 'underline':
        insertMarkdown('<u>', '</u>');
        break;
      case 'h1':
        insertMarkdown('# ', '');
        break;
      case 'h2':
        insertMarkdown('## ', '');
        break;
      case 'h3':
        insertMarkdown('### ', '');
        break;
      case 'ul':
        insertMarkdown('- ', '');
        break;
      case 'ol':
        insertMarkdown('1. ', '');
        break;
      case 'quote':
        insertMarkdown('> ', '');
        break;
      case 'code':
        insertMarkdown('`', '`');
        break;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      insertMarkdown('  ', '');
    }
  };

  if (!store.activeSection) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Type size={48} className="mx-auto mb-4 text-ink-light" />
          <p className="text-ink-light">Select a section to start writing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleToolbarAction('bold')}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Bold (Cmd+B)"
          >
            <Bold size={16} />
          </button>
          <button
            onClick={() => handleToolbarAction('italic')}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Italic (Cmd+I)"
          >
            <Italic size={16} />
          </button>
          <button
            onClick={() => handleToolbarAction('underline')}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Underline"
          >
            <Underline size={16} />
          </button>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        <div className="flex items-center gap-1">
          <button
            onClick={() => handleToolbarAction('h1')}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Heading 1 (Cmd+1)"
          >
            <Heading1 size={16} />
          </button>
          <button
            onClick={() => handleToolbarAction('h2')}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Heading 2 (Cmd+2)"
          >
            <Heading2 size={16} />
          </button>
          <button
            onClick={() => handleToolbarAction('h3')}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Heading 3 (Cmd+3)"
          >
            <Heading3 size={16} />
          </button>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        <div className="flex items-center gap-1">
          <button
            onClick={() => handleToolbarAction('ul')}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Bullet List"
          >
            <List size={16} />
          </button>
          <button
            onClick={() => handleToolbarAction('ol')}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Numbered List"
          >
            <ListOrdered size={16} />
          </button>
          <button
            onClick={() => handleToolbarAction('quote')}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Quote"
          >
            <Quote size={16} />
          </button>
          <button
            onClick={() => handleToolbarAction('code')}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Code"
          >
            <Code size={16} />
          </button>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`p-2 rounded transition-colors ${
              showPreview 
                ? 'bg-accent text-white' 
                : 'hover:bg-gray-100'
            }`}
            title={showPreview ? 'Hide Preview' : 'Show Preview'}
          >
            {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 flex">
        {/* Writing Area */}
        <div className={`${showPreview ? 'w-1/2' : 'w-full'} flex flex-col`}>
          <div className="flex-1 page-container">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              className="editor-textarea"
              placeholder="Start writing..."
              spellCheck="true"
              autoFocus
            />
          </div>
        </div>

        {/* Live Preview */}
        {showPreview && (
          <>
            <div className="w-px bg-gray-200" />
            <div className="w-1/2 flex flex-col">
              <div className="flex-1 page-container overflow-y-auto">
                <div className="prose prose-lg max-w-none font-garamond">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-4xl font-garamond font-normal mb-6 text-ink">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-3xl font-garamond font-normal mb-5 text-ink">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-2xl font-garamond font-normal mb-4 text-ink">
                          {children}
                        </h3>
                      ),
                      h4: ({ children }) => (
                        <h4 className="text-xl font-garamond font-normal mb-3 text-ink">
                          {children}
                        </h4>
                      ),
                      p: ({ children }) => (
                        <p className="text-lg leading-relaxed mb-4 text-ink">
                          {children}
                        </p>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-accent pl-6 italic text-ink-light my-6">
                          {children}
                        </blockquote>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc pl-6 mb-4 text-ink">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal pl-6 mb-4 text-ink">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="mb-2 text-lg leading-relaxed">
                          {children}
                        </li>
                      ),
                      code: ({ children }) => (
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                          {children}
                        </code>
                      ),
                      pre: ({ children }) => (
                        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                          {children}
                        </pre>
                      ),
                      a: ({ children, href }) => (
                        <a
                          href={href}
                          className="text-accent hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {children}
                        </a>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold text-ink">
                          {children}
                        </strong>
                      ),
                      em: ({ children }) => (
                        <em className="italic text-ink">
                          {children}
                        </em>
                      ),
                    }}
                  >
                    {content || '*Start typing to see your content here...*'}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Editor; 