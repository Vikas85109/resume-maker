import { IResumeData, ITemplate, generateId } from '@/types/resume';

export const defaultResumeData: IResumeData = {
  personalInfo: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    portfolio: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
};

export const sampleResumeData: IResumeData = {
  personalInfo: {
    fullName: 'John Smith',
    jobTitle: 'Senior Software Engineer',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/johnsmith',
    portfolio: 'johnsmith.dev',
  },
  summary:
    'Passionate software engineer with 8+ years of experience building scalable web applications. Expertise in React, TypeScript, and Node.js. Led teams to deliver high-impact projects serving millions of users.',
  experience: [
    {
      id: generateId(),
      company: 'Tech Corp',
      role: 'Senior Software Engineer',
      startDate: '2021-01',
      endDate: '',
      isCurrentRole: true,
      responsibilities: [
        'Led development of customer-facing dashboard used by 2M+ users',
        'Mentored team of 5 junior developers',
        'Reduced application load time by 40% through optimization',
      ],
    },
    {
      id: generateId(),
      company: 'StartupXYZ',
      role: 'Software Engineer',
      startDate: '2018-06',
      endDate: '2020-12',
      isCurrentRole: false,
      responsibilities: [
        'Built RESTful APIs using Node.js and Express',
        'Implemented CI/CD pipelines reducing deployment time by 60%',
        'Collaborated with design team to improve UX',
      ],
    },
  ],
  education: [
    {
      id: generateId(),
      degree: 'B.S. Computer Science',
      institution: 'Stanford University',
      year: '2018',
      description: 'Graduated with honors. Focus on distributed systems.',
    },
  ],
  skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'GraphQL', 'PostgreSQL'],
  projects: [
    {
      id: generateId(),
      name: 'Open Source CLI Tool',
      description: 'Built a developer productivity tool with 5K+ GitHub stars',
      techStack: ['TypeScript', 'Node.js', 'Commander.js'],
    },
  ],
  certifications: ['AWS Solutions Architect', 'Google Cloud Professional'],
  languages: ['English (Native)', 'Spanish (Intermediate)'],
};

export const templates: ITemplate[] = [
  {
    id: 'ats',
    name: 'ATS Friendly',
    description: 'Simple format optimized for Applicant Tracking Systems',
    thumbnail: '/templates/ats.png',
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional two-column layout with a professional feel',
    thumbnail: '/templates/classic.png',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean single-column design for tech professionals',
    thumbnail: '/templates/modern.png',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Ultra-clean design with maximum whitespace',
    thumbnail: '/templates/minimal.png',
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Bold header design for corporate roles',
    thumbnail: '/templates/professional.png',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Unique layout for creative industries',
    thumbnail: '/templates/creative.png',
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Elegant design for senior leadership roles',
    thumbnail: '/templates/executive.png',
  },
  {
    id: 'tech',
    name: 'Tech',
    description: 'Dark theme for developers and engineers',
    thumbnail: '/templates/tech.png',
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Sophisticated serif design with gold accents',
    thumbnail: '/templates/elegant.png',
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'High contrast design that makes a statement',
    thumbnail: '/templates/bold.png',
  },
];
