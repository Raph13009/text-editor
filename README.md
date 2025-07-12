# Ulysses-Inspired Text Editor

A minimalist yet powerful text editor built with React, designed for distraction-free writing and structured document creation. Inspired by Ulysses, this editor provides a clean, book-style writing environment perfect for authors, bloggers, and content creators.

## ✨ Features

### 🎯 Core Writing Experience
- **Distraction-free interface** with clean typography using EB Garamond
- **Markdown support** with live preview and syntax highlighting
- **Real-time auto-save** functionality
- **Keyboard shortcuts** for common formatting (Cmd+B for bold, Cmd+1 for heading, etc.)
- **Responsive layout** with adjustable margins and page formats

### 📚 Project & Section Management
- **Hierarchical organization** with Projects containing multiple Sections
- **Drag & drop reordering** of sections within projects
- **Quick navigation** between projects and sections
- **Section duplication** and management tools
- **Word count tracking** for each section

### 📊 Writing Analytics
- **Daily word count tracking** with visual progress bars
- **Writing streak monitoring** to maintain motivation
- **Project-wide statistics** showing total words and reading time
- **Customizable daily goals** with progress visualization
- **Historical writing data** storage and display

### 📤 Export Capabilities
- **PDF export** with multiple themes (Classic, Dark, Paper, Minimal)
- **DOCX export** for further editing in Word processors
- **Single section or entire project** export options
- **Consistent formatting** preservation across export formats
- **Custom page sizes** and margin settings

### ⚙️ Settings & Customization
- **Page layout customization** (A4, US Letter, Legal, A5, Custom)
- **Margin adjustment** for print-optimized output
- **Daily writing goals** configuration
- **Auto-save preferences** management
- **Data backup and restore** functionality

## 🛠️ Technology Stack

- **React 18** with modern hooks and functional components
- **Tailwind CSS** for responsive and clean styling
- **Vite** for fast development and building
- **ReactMarkdown** for markdown parsing and rendering
- **html2pdf.js** for PDF generation
- **docx** library for Word document export
- **LocalStorage** for offline data persistence

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd text-editor
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## 📖 Usage Guide

### Getting Started
1. **Create your first project** using the "New Project" button in the sidebar
2. **Add sections** to organize your content into chapters or topics
3. **Start writing** in the main editor with full markdown support
4. **Use the preview** to see how your content will look when exported

### Writing Features
- **Bold text**: `**bold**` or Cmd+B
- **Italic text**: `*italic*` or Cmd+I
- **Headings**: `# Heading 1` or Cmd+1, `## Heading 2` or Cmd+2
- **Lists**: `- item` for bullets, `1. item` for numbered lists
- **Quotes**: `> quote text` or Cmd+Shift+.
- **Code**: `inline code` or Cmd+Shift+K

### Exporting Documents
1. Click the **Export** button in the top toolbar
2. Choose your **format** (PDF or DOCX)
3. Select **content scope** (current section or entire project)
4. Pick a **theme** (PDF only) and configure options
5. Click **Export** to download your document

### Managing Projects
- **Rename** projects and sections using the context menu (⋮)
- **Duplicate** sections to reuse content structure
- **Delete** sections or projects when no longer needed
- **Reorder** sections by dragging and dropping

## 🎨 Design Philosophy

This editor embraces the principles of minimalist design:
- **Typography-first** approach with beautiful EB Garamond font
- **Distraction-free** interface that keeps focus on writing
- **Book-style layout** mimicking traditional publishing
- **Consistent visual hierarchy** across all interface elements
- **Print-optimized** output with professional formatting

## 💾 Data Storage

All your data is stored locally in your browser using LocalStorage:
- **100% offline** - no internet connection required
- **Privacy-focused** - no data sent to external servers
- **Backup support** - export your data as JSON for safekeeping
- **Cross-session** persistence - your work is always saved

## 📱 Browser Compatibility

Tested and optimized for:
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🔒 Privacy

This application is completely privacy-focused:
- No tracking or analytics
- No external API calls
- No data collection
- All content stays on your device

## 🤝 Contributing

This project is open for contributions! Areas where help is welcome:
- Additional export formats
- Enhanced markdown features
- Mobile responsiveness improvements
- New themes and customization options

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Inspired by the excellent [Ulysses](https://ulysses.app/) writing app
- Typography powered by [EB Garamond](https://fonts.google.com/specimen/EB+Garamond)
- Icons provided by [Lucide](https://lucide.dev/)
- Built with [React](https://reactjs.org/) and [Tailwind CSS](https://tailwindcss.com/)

---

**Happy Writing!** 📝✨