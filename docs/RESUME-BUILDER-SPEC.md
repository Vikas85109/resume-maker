# Resume Builder Specification

## Overview

A comprehensive resume builder similar to Jobseeker.com with guided creation, template selection, AI assistance, and multi-format export.

---

## 1. User Flow & UX

### Landing Page Components

| Component | Description |
|-----------|-------------|
| Hero Section | Headline, CTAs ("Build My Resume"), trust badges |
| Template Carousel | 3-5 featured templates with hover preview |
| How It Works | 4-step visual guide |
| Features | AI assistance, ATS-friendly, real-time preview |
| Pricing | Free vs Premium comparison |

### Guided Creation Process (8 Steps)

```
Step 1: Personal Details (Required) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        Name, email, phone, photo, links

Step 2: Professional Summary (AI Assist) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        Career objective, 2-4 sentences

Step 3: Work Experience (AI Assist) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        Job history with bullet points

Step 4: Education ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        Degrees, certifications, schools

Step 5: Skills (AI Assist) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        Technical & soft skills with proficiency

Step 6: Additional Sections ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        Certifications, projects, languages, awards

Step 7: Choose Template ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        Select and customize design

Step 8: Preview & Download ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        Final review and export
```

### Live Preview

- **Layout**: Split-screen (form left, preview right)
- **Features**: Real-time updates, zoom controls, page navigation, full-screen mode
- **Sync**: Instant with 100ms debounce

---

## 2. Form Sections & Fields

### Personal Details

| Field | Type | Required |
|-------|------|----------|
| First Name | text | Yes |
| Last Name | text | Yes |
| Email | email | Yes |
| Phone | tel | Yes |
| Photo | file (with cropper) | No |
| Address, City, Country | text/select | No |
| LinkedIn, Portfolio, GitHub | url | No |

### Professional Summary

- Rich text editor with formatting
- AI-powered suggestions
- Word/character count
- Style options: Formal, Conversational, Impactful

### Work Experience (Repeatable)

| Field | Type |
|-------|------|
| Job Title | text with autocomplete |
| Company | text with autocomplete |
| Location | text |
| Start/End Date | month-year picker |
| Currently Working | checkbox |
| Responsibilities | rich text with bullet points |

**AI Features**: Generate bullet points, improve descriptions, add metrics, suggest action verbs

### Education (Repeatable)

| Field | Type |
|-------|------|
| Degree | select (with custom option) |
| Field of Study | text |
| School | text with autocomplete |
| Start/End Date | month-year |
| GPA | text |
| Achievements | rich text bullets |

### Skills

| Display Modes | Description |
|---------------|-------------|
| Tags | Compact tag view |
| Progress Bars | Visual proficiency |
| Categories | Grouped by type |
| Two Columns | Side-by-side layout |

### Additional Sections

- **Certifications**: Name, issuer, dates, credential ID/URL
- **Projects**: Name, role, dates, description, technologies, URLs
- **Languages**: Language + proficiency level
- **Awards**: Name, issuer, date, description
- **Publications**: Title, publisher, date, URL
- **Volunteer Work**: Role, organization, dates, description
- **Interests**: Simple tag list
- **References**: Name, title, company, contact info
- **Custom Sections**: User-defined sections

### Cover Letter Builder

- Recipient info and company details
- Opening, body, and closing paragraphs
- AI generation from resume + job description
- Multiple template styles

---

## 3. Templates & Customization

### 12 Template Categories

| Category | Templates | ATS Score | Best For |
|----------|-----------|-----------|----------|
| Classic | Classic Professional | 95% | Corporate, Finance, Legal |
| Modern | Minimalist, Sidebar | 85-90% | Tech, Startups |
| Creative | Bold, Visual | 70-75% | Design, Media |
| Executive | Elegant | 92% | C-Level, Directors |
| Specialized | Academic, Tech Dev, Healthcare, Sales | 88-92% | Industry-specific |
| Entry Level | Fresh | 90% | Graduates, First Jobs |

### Customization Options

**Colors**
- Primary, Secondary, Background, Accent
- Color picker with presets

**Fonts**
- Heading: Roboto, Montserrat, Playfair Display, etc.
- Body: Open Sans, Lato, Source Sans Pro, etc.
- Size: 10-14pt (body), 14-24pt (headings)

**Layout**
- Margins: Narrow, Normal, Wide
- Line spacing: Compact, Normal, Relaxed
- Section order: Drag-and-drop reordering

**Styling**
- Heading style: Uppercase, Capitalize, Normal
- Dividers: Line, Dots, None
- Bullets: Circle, Square, Dash, Arrow
- Date format: MM/YYYY, Month YYYY, etc.
- Icons: Toggle on/off
- Photo: Shape, size options

---

## 4. AI Assistance

### AI Features

| Feature | Description | Trigger |
|---------|-------------|---------|
| Bullet Point Generator | Achievement-focused points | Click "Generate" |
| Summary Writer | Create professional summary | "Generate Summary" button |
| Content Refiner | Improve existing text | Select + "Improve with AI" |
| Job-Specific Tailoring | Customize for job posting | Paste job description |
| Skills Suggester | Recommend relevant skills | "Suggest Skills" |
| Action Verb Optimizer | Replace weak verbs | Automatic/on-demand |
| Quantification Helper | Add metrics to achievements | "Add Metrics" |
| Cover Letter Generator | Complete letter from resume | "Generate Cover Letter" |

### Implementation

- API: OpenAI GPT-4 or Claude API
- Rate limit: 10 generations/hour (free), unlimited (premium)
- Caching for common job titles

---

## 5. ATS Compatibility

### Key Guidelines

1. Use standard section headings (not creative names)
2. Avoid tables and complex layouts
3. Use standard fonts (Arial, Calibri, etc.)
4. Include keywords from job descriptions
5. Consistent date formatting
6. Avoid headers/footers for important info
7. Don't embed text in images
8. Use .docx or .pdf format

### ATS Score Calculation

| Factor | Weight |
|--------|--------|
| Contact Info Complete | 15% |
| Standard Section Headers | 15% |
| Keyword Optimization | 25% |
| Quantified Achievements | 15% |
| Consistent Formatting | 10% |
| Appropriate Length | 10% |
| Skills Section | 10% |

**Score Ranges**: Excellent (90-100), Good (75-89), Needs Work (50-74), Poor (0-49)

---

## 6. Export Options

| Format | Description | Free |
|--------|-------------|------|
| PDF | High quality (300 DPI), multi-page | Yes |
| DOCX | Editable, ATS-optimized | Yes |
| TXT | Plain text for ATS | Yes |
| PNG | High-res image | Premium |
| JSON | Data backup/import | Yes |

### Additional Features

- Shareable link with password/expiration
- Email resume directly
- Download with/without photo
- Color or grayscale option

---

## 7. User Accounts & Persistence

### Guest Mode

- Create resume without signup
- One free download
- LocalStorage persistence
- Limited templates
- Optional watermark

### Registered Users

- **Auth**: Email, Google, LinkedIn, Apple
- Unlimited saved resumes
- Version history (10 versions)
- Share links with analytics
- Cloud sync across devices

### Auto-Save

- Every 30 seconds
- Manual save option
- Version history with restore

---

## 8. Pricing Model

### Tiers

| Feature | Free | Pro ($9.99/mo) | Premium ($19.99/mo) |
|---------|------|----------------|---------------------|
| Templates | 5 | 12+ | 12+ |
| PDF Download | Yes | Yes | Yes |
| DOCX Export | No | Yes | Yes |
| Watermark | Yes | No | No |
| AI Generations | 5/month | 50/month | Unlimited |
| Cover Letter | No | Yes | Yes |
| LinkedIn Import | No | Yes | Yes |
| Saved Resumes | 3 | Unlimited | Unlimited |
| Expert Review | No | No | Yes |

### One-Time Purchases

- Single Resume Download: $2.99
- Premium Template Pack: $14.99
- Expert Resume Review: $49.99

---

## 9. Technical Implementation

### Current Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS
- **PDF Export**: jsPDF + html2canvas
- **Rich Text**: TipTap

### Required Additions

**Backend Options**
1. Node.js + Express + PostgreSQL
2. Next.js API Routes + Prisma
3. Supabase (BaaS)

**New Packages**
- State: Zustand or Redux Toolkit
- Forms: React Hook Form + Zod
- DOCX: docx.js
- Image Crop: react-image-crop
- DnD: dnd-kit
- Payments: Stripe
- AI: OpenAI/Anthropic SDK

### Proposed Folder Structure

```
src/
├── components/
│   ├── common/       # Button, Input, Modal
│   ├── forms/        # PersonalDetailsForm, ExperienceForm
│   ├── templates/    # Resume templates
│   ├── editor/       # SectionEditor, AIAssistant
│   ├── preview/      # ResumePreview, PageBreaker
│   └── layout/       # Header, Sidebar, Footer
├── hooks/            # useResumeData, useAutoSave
├── contexts/         # AuthContext, ResumeContext
├── services/
│   ├── api/          # resume.js, auth.js, ai.js
│   └── export/       # pdfExport.js, docxExport.js
├── utils/            # validation, formatters, atsScore
└── data/             # initialData, skillsDatabase
```

---

## 10. Development Roadmap

### Phase 1: MVP

- Complete all form sections with validation
- 5 polished templates
- Real-time preview
- PDF export
- LocalStorage persistence
- Basic customization

### Phase 2: User Accounts

- User authentication
- Cloud save/load
- Multiple resumes per user
- Account dashboard

### Phase 3: AI & Premium

- AI content generation
- ATS score calculator
- More templates
- Payment integration

### Phase 4: Advanced

- Cover letter builder
- LinkedIn import
- DOCX export
- Shareable links
- Analytics dashboard
- Mobile app

---

## Files Created

1. `docs/resume-builder-specification.json` - Complete JSON specification
2. `docs/RESUME-BUILDER-SPEC.md` - This readable summary

---

*Specification created for Resume Maker project*
