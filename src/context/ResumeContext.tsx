import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  IResumeData,
  IResumeContextType,
  IPersonalInfo,
  IExperience,
  IEducation,
  IProject,
} from '@/types/resume';
import { defaultResumeData } from '@/data/defaultResume';
import { useAuth } from './AuthContext';

const STORAGE_KEY_PREFIX = 'resume-builder-data';

const getStorageKey = (userId: string | null) => {
  return userId ? `${STORAGE_KEY_PREFIX}-${userId}` : STORAGE_KEY_PREFIX;
};

const ResumeContext = createContext<IResumeContextType | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [resumeData, setResumeData] = useState<IResumeData>(defaultResumeData);

  // Load resume data when user changes
  useEffect(() => {
    const storageKey = getStorageKey(user?.id || null);
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setResumeData(JSON.parse(saved));
      } catch {
        setResumeData(defaultResumeData);
      }
    } else {
      setResumeData(defaultResumeData);
    }
  }, [user?.id]);

  // Persist to localStorage when data changes
  useEffect(() => {
    const storageKey = getStorageKey(user?.id || null);
    localStorage.setItem(storageKey, JSON.stringify(resumeData));
  }, [resumeData, user?.id]);

  const updatePersonalInfo = useCallback((info: Partial<IPersonalInfo>) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...info },
    }));
  }, []);

  const updateSummary = useCallback((summary: string) => {
    setResumeData((prev) => ({ ...prev, summary }));
  }, []);

  const addExperience = useCallback((experience: IExperience) => {
    setResumeData((prev) => ({
      ...prev,
      experience: [...prev.experience, experience],
    }));
  }, []);

  const updateExperience = useCallback((id: string, updates: Partial<IExperience>) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) =>
        exp.id === id ? { ...exp, ...updates } : exp
      ),
    }));
  }, []);

  const removeExperience = useCallback((id: string) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }));
  }, []);

  const addEducation = useCallback((education: IEducation) => {
    setResumeData((prev) => ({
      ...prev,
      education: [...prev.education, education],
    }));
  }, []);

  const updateEducation = useCallback((id: string, updates: Partial<IEducation>) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, ...updates } : edu
      ),
    }));
  }, []);

  const removeEducation = useCallback((id: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  }, []);

  const updateSkills = useCallback((skills: string[]) => {
    setResumeData((prev) => ({ ...prev, skills }));
  }, []);

  const addProject = useCallback((project: IProject) => {
    setResumeData((prev) => ({
      ...prev,
      projects: [...prev.projects, project],
    }));
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<IProject>) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.map((proj) =>
        proj.id === id ? { ...proj, ...updates } : proj
      ),
    }));
  }, []);

  const removeProject = useCallback((id: string) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.filter((proj) => proj.id !== id),
    }));
  }, []);

  const updateCertifications = useCallback((certifications: string[]) => {
    setResumeData((prev) => ({ ...prev, certifications }));
  }, []);

  const updateLanguages = useCallback((languages: string[]) => {
    setResumeData((prev) => ({ ...prev, languages }));
  }, []);

  const resetResume = useCallback(() => {
    setResumeData(defaultResumeData);
    const storageKey = getStorageKey(user?.id || null);
    localStorage.removeItem(storageKey);
  }, [user?.id]);

  const value: IResumeContextType = {
    resumeData,
    updatePersonalInfo,
    updateSummary,
    addExperience,
    updateExperience,
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    updateSkills,
    addProject,
    updateProject,
    removeProject,
    updateCertifications,
    updateLanguages,
    resetResume,
  };

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
};

export const useResume = (): IResumeContextType => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};
