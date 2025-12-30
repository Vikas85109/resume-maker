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

TypeScript React resume builder. Users select a template, fill in resume details via forms, see live preview, and export to PDF.

### Tech Stack

- **React 19** with TypeScript (strict mode enabled)
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin
- **Context API** for state management
- **TipTap** for rich text editing
- **html2canvas + jsPDF** for PDF export
- **Path alias**: `@/` maps to `src/`

### Key Files

- `src/types/resume.ts` - All TypeScript interfaces (`IResumeData`, `TemplateId`, etc.) and `generateId()` utility
- `src/context/AppContext.tsx` - Navigation state; use via `useApp()` hook
- `src/context/ResumeContext.tsx` - Resume data with localStorage persistence (`resume-builder-data` key); use via `useResume()` hook
- `src/components/templates/index.ts` - Exports `templateComponents` map for dynamic template rendering
- `src/utils/pdfExport.ts` - PDF generation via html2canvas
- `src/data/defaultResume.ts` - Default/sample resume data and template metadata list

### State Management

Two Context providers wrap the app:
- **AppContext**: `currentStep` ('templates' | 'editor') and `selectedTemplate`
- **ResumeContext**: `resumeData` with CRUD operations for each section, auto-persists to localStorage

### Templates

Ten templates in `src/components/templates/Template*.tsx`:
- ATS, Classic, Modern, Minimal, Professional, Creative, Executive, Tech, Elegant, Bold

All templates receive `TemplateProps` (containing `IResumeData`) and must include the `.a4-page` class with dimensions 794px × 1123px for PDF export to work.

Access templates dynamically via:
```typescript
import { templateComponents } from '@/components/templates';
const Component = templateComponents[templateId]; // templateId: TemplateId
```

### PDF Export

`exportToPdf()` in `src/utils/pdfExport.ts` finds `.a4-page` elements, captures at 2x scale with html2canvas, outputs A4 PDF via jsPDF.
