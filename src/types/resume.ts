// Personal Information
export interface IPersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
}

// Work Experience
export interface IExperience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  isCurrentRole: boolean;
  responsibilities: string[];
}

// Education
export interface IEducation {
  id: string;
  degree: string;
  institution: string;
  year: string;
  description: string;
}

// Project
export interface IProject {
  id: string;
  name: string;
  description: string;
  techStack: string[];
}

// Complete Resume Data
export interface IResumeData {
  personalInfo: IPersonalInfo;
  summary: string;
  experience: IExperience[];
  education: IEducation[];
  skills: string[];
  projects: IProject[];
  certifications: string[];
  languages: string[];
}

// Template Types
export type TemplateId = 'classic' | 'modern' | 'minimal' | 'professional' | 'creative' | 'executive';

export interface ITemplate {
  id: TemplateId;
  name: string;
  description: string;
  thumbnail: string;
}

// App State
export type AppStep = 'templates' | 'editor';

export interface IAppState {
  currentStep: AppStep;
  selectedTemplate: TemplateId;
}

// Context Types
export interface IResumeContextType {
  resumeData: IResumeData;
  updatePersonalInfo: (info: Partial<IPersonalInfo>) => void;
  updateSummary: (summary: string) => void;
  addExperience: (experience: IExperience) => void;
  updateExperience: (id: string, experience: Partial<IExperience>) => void;
  removeExperience: (id: string) => void;
  addEducation: (education: IEducation) => void;
  updateEducation: (id: string, education: Partial<IEducation>) => void;
  removeEducation: (id: string) => void;
  updateSkills: (skills: string[]) => void;
  addProject: (project: IProject) => void;
  updateProject: (id: string, project: Partial<IProject>) => void;
  removeProject: (id: string) => void;
  updateCertifications: (certifications: string[]) => void;
  updateLanguages: (languages: string[]) => void;
  resetResume: () => void;
}

export interface IAppContextType {
  currentStep: AppStep;
  selectedTemplate: TemplateId;
  setCurrentStep: (step: AppStep) => void;
  setSelectedTemplate: (template: TemplateId) => void;
  goToEditor: (template: TemplateId) => void;
  goToTemplates: () => void;
}

// Component Props
export interface TemplateProps {
  data: IResumeData;
}

export interface TemplateCardProps {
  template: ITemplate;
  isSelected: boolean;
  onSelect: () => void;
}

// Form Props
export interface FormSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

// Utility function to generate unique IDs
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};
