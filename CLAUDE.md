# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (Vite)
npm run build    # Production build
npm run lint     # Run ESLint
npm run preview  # Preview production build
npx tsc --noEmit # TypeScript type check
```

## Architecture

TypeScript React resume builder with a Jobseeker.com-inspired UI. Users select a template, fill in resume details via forms, see live preview, and export to PDF.

### Tech Stack

- **React 19** with TypeScript
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin
- **Context API** for state management
- **TipTap** for rich text editing
- **html2canvas + jsPDF** for PDF export (also includes @react-pdf/renderer, html2pdf.js, react-to-print)

### Folder Structure

```
src/
├── types/resume.ts          # TypeScript interfaces (IResumeData, TemplateId, etc.)
├── context/
│   ├── AppContext.tsx       # Navigation and template selection state
│   └── ResumeContext.tsx    # Resume data state with localStorage persistence
├── components/
│   ├── ui/                  # Reusable UI components (Button, Input, Accordion, etc.)
│   ├── forms/               # Resume section editors
│   ├── templates/           # 10 resume template designs
│   └── layout/              # Header component
├── pages/
│   ├── TemplateSelection.tsx # Template gallery page
│   └── ResumeEditor.tsx      # Split-view editor with live preview
├── utils/pdfExport.ts       # PDF generation logic
└── data/defaultResume.ts    # Default resume data and template list
```

### State Management

Two Context providers wrap the app:
- **AppContext**: Tracks `currentStep` ('templates' | 'editor') and `selectedTemplate`
- **ResumeContext**: Manages `resumeData` with CRUD operations for each section, persists to localStorage under key `resume-builder-data`

### Navigation Flow

1. **Template Selection** (`/`) - User picks from 10 templates
2. **Resume Editor** - Left panel: forms, Right panel: live A4 preview
3. **PDF Export** - Download button generates PDF via html2canvas

### Templates

Ten template designs in `src/components/templates/`:
- ATS, Classic, Modern, Minimal, Professional, Creative, Executive, Tech, Elegant, Bold

All templates receive `TemplateProps` (containing `IResumeData`) and render at A4 size (794px × 1123px).

Template IDs are defined as: `'ats' | 'classic' | 'modern' | 'minimal' | 'professional' | 'creative' | 'executive' | 'tech' | 'elegant' | 'bold'`

### PDF Export

Located in `src/utils/pdfExport.ts`. Clones `.a4-page` elements, converts to canvas at 2x scale, generates PDF with proper A4 dimensions.

### Key Types

```typescript
interface IResumeData {
  personalInfo: IPersonalInfo;
  summary: string;
  experience: IExperience[];
  education: IEducation[];
  skills: string[];
  projects: IProject[];
  certifications: string[];
  languages: string[];
}
```
