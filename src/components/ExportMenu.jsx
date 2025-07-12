import React, { useState } from 'react';
import { X, FileText, Download, Settings, Printer, Moon, Sun } from 'lucide-react';
import { saveAs } from 'file-saver';
import html2pdf from 'html2pdf.js';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ExportMenu = ({ store, onClose }) => {
  const [exportFormat, setExportFormat] = useState('pdf');
  const [exportTheme, setExportTheme] = useState('classic');
  const [exportScope, setExportScope] = useState('current'); // 'current' or 'project'
  const [includeStats, setIncludeStats] = useState(true);
  const [pageSettings, setPageSettings] = useState({
    size: 'A4',
    margins: { top: 2.5, right: 2.5, bottom: 2.5, left: 2.5 },
    orientation: 'portrait'
  });
  const [isExporting, setIsExporting] = useState(false);

  const themes = {
    classic: {
      name: 'Classic',
      background: '#ffffff',
      text: '#2a2a2a',
      accent: '#4a90e2',
      description: 'Clean white background with black text'
    },
    dark: {
      name: 'Dark Mode',
      background: '#1a1a1a',
      text: '#e5e5e5',
      accent: '#60a5fa',
      description: 'Dark background with light text'
    },
    paper: {
      name: 'Paper',
      background: '#fefdf8',
      text: '#2d2d2d',
      accent: '#8b7355',
      description: 'Warm paper-like background'
    },
    minimal: {
      name: 'Minimal',
      background: '#fafafa',
      text: '#333333',
      accent: '#666666',
      description: 'Minimal gray theme'
    }
  };

  const getContentToExport = () => {
    if (exportScope === 'current') {
      return store.activeSection ? [store.activeSection] : [];
    } else {
      return store.activeProject?.sections?.sort((a, b) => a.order - b.order) || [];
    }
  };

  const generateTitle = () => {
    if (exportScope === 'current') {
      return store.activeSection?.title || 'Untitled Section';
    } else {
      return store.activeProject?.title || 'Untitled Project';
    }
  };

  const renderMarkdownToHTML = (content) => {
    return new Promise((resolve) => {
      const element = document.createElement('div');
      element.style.display = 'none';
      document.body.appendChild(element);

      const root = document.createElement('div');
      element.appendChild(root);

      import('react-dom/client').then(({ createRoot }) => {
        const reactRoot = createRoot(root);
        reactRoot.render(
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        );

        setTimeout(() => {
          const html = root.innerHTML;
          document.body.removeChild(element);
          resolve(html);
        }, 100);
      });
    });
  };

  const exportToPDF = async () => {
    try {
      const sections = getContentToExport();
      const title = generateTitle();
      const theme = themes[exportTheme];
      
      let htmlContent = `
        <html>
          <head>
            <title>${title}</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');
              
              body {
                font-family: 'EB Garamond', serif;
                font-size: 16px;
                line-height: 1.7;
                color: ${theme.text};
                background-color: ${theme.background};
                max-width: 65ch;
                margin: 0 auto;
                padding: 2rem;
              }
              
              h1 {
                font-size: 2.5rem;
                line-height: 1.2;
                margin-bottom: 1.5rem;
                font-weight: 400;
                color: ${theme.text};
              }
              
              h2 {
                font-size: 2rem;
                line-height: 1.3;
                margin-bottom: 1.25rem;
                font-weight: 400;
                color: ${theme.text};
              }
              
              h3 {
                font-size: 1.5rem;
                line-height: 1.4;
                margin-bottom: 1rem;
                font-weight: 400;
                color: ${theme.text};
              }
              
              p {
                margin-bottom: 1.5rem;
                color: ${theme.text};
              }
              
              blockquote {
                border-left: 4px solid ${theme.accent};
                padding-left: 1.5rem;
                margin: 1.5rem 0;
                font-style: italic;
                color: ${theme.text};
                opacity: 0.8;
              }
              
              ul, ol {
                padding-left: 1.5rem;
                margin-bottom: 1.5rem;
              }
              
              li {
                margin-bottom: 0.5rem;
              }
              
              code {
                background-color: rgba(0, 0, 0, 0.1);
                padding: 0.2rem 0.4rem;
                border-radius: 0.25rem;
                font-family: 'Courier New', monospace;
                font-size: 0.9em;
              }
              
              pre {
                background-color: rgba(0, 0, 0, 0.1);
                padding: 1rem;
                border-radius: 0.5rem;
                overflow-x: auto;
                margin-bottom: 1.5rem;
              }
              
              a {
                color: ${theme.accent};
                text-decoration: none;
              }
              
              a:hover {
                text-decoration: underline;
              }
              
              .section-break {
                page-break-before: always;
                margin-top: 2rem;
              }
              
              .stats {
                font-size: 0.9rem;
                color: ${theme.text};
                opacity: 0.7;
                margin-bottom: 2rem;
                text-align: center;
              }
              
              .title-page {
                text-align: center;
                page-break-after: always;
                padding: 4rem 0;
              }
              
              .title-page h1 {
                font-size: 3rem;
                margin-bottom: 2rem;
              }
              
              .title-page .subtitle {
                font-size: 1.2rem;
                margin-bottom: 1rem;
                opacity: 0.8;
              }
              
              .title-page .date {
                font-size: 1rem;
                opacity: 0.6;
              }
            </style>
          </head>
          <body>
      `;

      // Add title page for multi-section exports
      if (exportScope === 'project') {
        htmlContent += `
          <div class="title-page">
            <h1>${title}</h1>
            <div class="subtitle">${store.activeProject?.description || ''}</div>
            <div class="date">${new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</div>
          </div>
        `;
      }

      // Add content
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        if (i > 0) {
          htmlContent += `<div class="section-break"></div>`;
        }
        
        htmlContent += `<h1>${section.title}</h1>`;
        
        if (includeStats && section.wordCount > 0) {
          htmlContent += `
            <div class="stats">
              ${section.wordCount} words • ${Math.ceil(section.wordCount / 200)} min read
            </div>
          `;
        }
        
        const contentHtml = await renderMarkdownToHTML(section.content || '');
        htmlContent += contentHtml;
      }

      htmlContent += `
          </body>
        </html>
      `;

      const element = document.createElement('div');
      element.innerHTML = htmlContent;
      element.style.display = 'none';
      document.body.appendChild(element);

      const options = {
        margin: [pageSettings.margins.top, pageSettings.margins.right, pageSettings.margins.bottom, pageSettings.margins.left],
        filename: `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true
        },
        jsPDF: { 
          unit: 'cm', 
          format: pageSettings.size.toLowerCase(),
          orientation: pageSettings.orientation 
        }
      };

      await html2pdf().from(element).set(options).save();
      document.body.removeChild(element);
      
    } catch (error) {
      console.error('Export to PDF failed:', error);
      alert('Failed to export to PDF. Please try again.');
    }
  };

  const exportToDocx = async () => {
    try {
      const sections = getContentToExport();
      const title = generateTitle();
      
      const doc = new Document({
        styles: {
          default: {
            document: {
              run: {
                font: 'EB Garamond',
                size: 24, // 12pt
              },
            },
          },
        },
        sections: [{
          children: [
            new Paragraph({
              text: title,
              heading: HeadingLevel.TITLE,
              spacing: { after: 400 },
            }),
            
            ...sections.flatMap(section => [
              new Paragraph({
                text: section.title,
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 400, after: 200 },
              }),
              
              ...(includeStats && section.wordCount > 0 ? [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${section.wordCount} words • ${Math.ceil(section.wordCount / 200)} min read`,
                      italics: true,
                      size: 20,
                    }),
                  ],
                  spacing: { after: 200 },
                })
              ] : []),
              
              // Convert markdown to DOCX paragraphs (simplified)
              ...(section.content || '').split('\n\n').map(paragraph => {
                if (paragraph.trim()) {
                  return new Paragraph({
                    children: [
                      new TextRun({
                        text: paragraph.replace(/[*_`#>-]/g, '').trim(),
                        size: 24,
                      }),
                    ],
                    spacing: { after: 200 },
                  });
                }
                return new Paragraph({});
              }),
            ])
          ],
        }],
      });

      const buffer = await Packer.toBuffer(doc);
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      saveAs(blob, `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.docx`);
      
    } catch (error) {
      console.error('Export to DOCX failed:', error);
      alert('Failed to export to DOCX. Please try again.');
    }
  };

  const handleExport = async () => {
    if (isExporting) return;
    
    setIsExporting(true);
    try {
      if (exportFormat === 'pdf') {
        await exportToPDF();
      } else if (exportFormat === 'docx') {
        await exportToDocx();
      }
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const sections = getContentToExport();
  const totalWords = sections.reduce((sum, section) => sum + (section.wordCount || 0), 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-garamond font-medium">Export Document</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Export Format */}
          <div>
            <label className="block text-sm font-medium mb-3">Export Format</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setExportFormat('pdf')}
                className={`p-4 border rounded-lg text-left transition-colors ${
                  exportFormat === 'pdf'
                    ? 'border-accent bg-accent-light'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <FileText size={20} />
                  <span className="font-medium">PDF</span>
                </div>
                <p className="text-sm text-ink-light">Perfect for reading and sharing</p>
              </button>
              <button
                onClick={() => setExportFormat('docx')}
                className={`p-4 border rounded-lg text-left transition-colors ${
                  exportFormat === 'docx'
                    ? 'border-accent bg-accent-light'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <FileText size={20} />
                  <span className="font-medium">DOCX</span>
                </div>
                <p className="text-sm text-ink-light">Editable Word document</p>
              </button>
            </div>
          </div>

          {/* Export Scope */}
          <div>
            <label className="block text-sm font-medium mb-3">Content to Export</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setExportScope('current')}
                className={`p-4 border rounded-lg text-left transition-colors ${
                  exportScope === 'current'
                    ? 'border-accent bg-accent-light'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-medium mb-1">Current Section</div>
                <p className="text-sm text-ink-light">
                  {store.activeSection?.title || 'No section selected'}
                </p>
                <p className="text-xs text-ink-light mt-1">
                  {store.activeSection?.wordCount || 0} words
                </p>
              </button>
              <button
                onClick={() => setExportScope('project')}
                className={`p-4 border rounded-lg text-left transition-colors ${
                  exportScope === 'project'
                    ? 'border-accent bg-accent-light'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-medium mb-1">Entire Project</div>
                <p className="text-sm text-ink-light">
                  {store.activeProject?.title || 'No project selected'}
                </p>
                <p className="text-xs text-ink-light mt-1">
                  {store.activeProject?.sections?.length || 0} sections • {totalWords} words
                </p>
              </button>
            </div>
          </div>

          {/* Theme Selection (PDF only) */}
          {exportFormat === 'pdf' && (
            <div>
              <label className="block text-sm font-medium mb-3">Theme</label>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(themes).map(([key, theme]) => (
                  <button
                    key={key}
                    onClick={() => setExportTheme(key)}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      exportTheme === key
                        ? 'border-accent bg-accent-light'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: theme.background, borderColor: theme.text }}
                      />
                      <span className="font-medium">{theme.name}</span>
                    </div>
                    <p className="text-sm text-ink-light">{theme.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Options */}
          <div>
            <label className="block text-sm font-medium mb-3">Options</label>
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeStats}
                  onChange={(e) => setIncludeStats(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Include word count and reading time</span>
              </label>
            </div>
          </div>

          {/* Export Button */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="button-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting || sections.length === 0}
              className="button-primary flex items-center gap-2"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download size={16} />
                  Export {exportFormat.toUpperCase()}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportMenu; 