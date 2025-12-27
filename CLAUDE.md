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

This is a TypeScript React resume builder application with a modern Jobseeker.com-inspired UI. Users select a template, fill in resume details via forms, see live preview, and export to PDF.

### Tech Stack

- **React 19** with TypeScript
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin
- **Context API** for state management
- **html2canvas + jsPDF** for PDF export

### Folder Structure

```
src/
├── types/resume.ts          # TypeScript interfaces
├── context/
│   ├── AppContext.tsx       # Navigation and template selection state
│   └── ResumeContext.tsx    # Resume data state with localStorage persistence
├── components/
│   ├── ui/                  # Reusable UI components (Button, Input, Accordion, etc.)
│   ├── forms/               # Resume section editors
│   ├── templates/           # 6 resume template designs
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
- **ResumeContext**: Manages `resumeData` with CRUD operations for each section, persists to localStorage

### Navigation Flow

1. **Template Selection** (`/`) - User picks from 6 templates
2. **Resume Editor** - Left panel: forms, Right panel: live A4 preview
3. **PDF Export** - Download button generates PDF via html2canvas

### Templates

Six template designs in `src/components/templates/`:
- Classic (two-column, serif)
- Modern (single column, clean)
- Minimal (maximized whitespace)
- Professional (colored header banner)
- Creative (gradient sidebar)
- Executive (elegant, serif typography)

All templates receive `IResumeData` prop and render at A4 size (794px × 1123px).

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
