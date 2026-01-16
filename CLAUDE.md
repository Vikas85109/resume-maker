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

TypeScript React CV/resume builder application. Users browse templates, select one, fill in resume details via step-by-step wizard forms, see live preview, and export to PDF. All data stored in localStorage (no backend).

### Tech Stack

- **React 19** with TypeScript (strict mode enabled)
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin
- **react-router-dom** for routing
- **Context API** for state management
- **html2canvas + jsPDF** for PDF export
- **Path alias**: `@/` maps to `src/`

### Key Files

- `src/types/resume.ts` - All TypeScript interfaces (`IResumeData`, `TemplateId`, etc.) and `generateId()` utility
- `src/context/AppContext.tsx` - Navigation state; use via `useApp()` hook
- `src/context/ResumeContext.tsx` - Resume data with localStorage persistence (`resume-builder-data` key); use via `useResume()` hook
- `src/context/AuthContext.tsx` - Authentication state with localStorage persistence; use via `useAuth()` hook
- `src/components/templates/index.ts` - Exports `templateComponents` map for dynamic template rendering
- `src/utils/pdfExport.ts` - PDF generation utilities
- `src/data/defaultResume.ts` - Default/sample resume data and template metadata list

### Routing

Routes defined in `src/App.tsx`:
- `/` - Homepage with hero, features, testimonials
- `/templates` - Template selection page (protected)
- `/editor` - Resume editor with step-by-step wizard (protected)
- `/profile` - User profile page (protected)
- `/about` - About us page
- `/pricing` - Pricing information
- `/faq` - Frequently asked questions
- `/contact` - Contact form
- `/login` - Login page
- `/register` - Registration page

### State Management

Three Context providers wrap the app (see `src/main.tsx`):
- **AuthContext**: User authentication with `login`, `register`, `logout`, `updateProfile`
- **AppContext**: `currentStep` ('templates' | 'editor') and `selectedTemplate`
- **ResumeContext**: `resumeData` with CRUD operations for each section, auto-persists to localStorage per user

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

`exportToPdf()` in `src/utils/pdfExport.ts` finds `.a4-page` elements, captures via dom-to-image-more at high quality, outputs A4 PDF via jsPDF.

### Components Structure

- `src/components/layout/` - Navbar, Footer, Header
- `src/components/forms/` - Form components for each resume section (PersonalInfoForm, SummaryForm, ExperienceForm, EducationForm, SkillsForm, ProjectsForm)
- `src/components/templates/` - Resume templates
- `src/components/ui/` - Reusable UI components (Button, Input, Card, Accordion, etc.)
- `src/components/ProtectedRoute.tsx` - Route guard for authenticated routes

### Pages

- `HomePage.tsx` - Landing page with hero, features, how-it-works, testimonials
- `TemplateSelection.tsx` - Browse and select resume templates
- `ResumeEditor.tsx` - Step-by-step wizard for editing resume with live preview
- `LoginPage.tsx` / `RegisterPage.tsx` - Authentication pages
- `ProfilePage.tsx` - User profile management
- `AboutPage.tsx` - Company information
- `PricingPage.tsx` - Pricing plans (currently free)
- `FAQPage.tsx` - Frequently asked questions with search
- `ContactPage.tsx` - Contact form
