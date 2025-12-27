import React from 'react';
import { TemplateProps } from '@/types/resume';

const TemplateATS: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages } = data;

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  return (
    <div
      className="a4-page bg-white"
      style={{
        width: '794px',
        minHeight: '1123px',
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '11pt',
        lineHeight: '1.4',
        color: '#000000',
      }}
    >
      <div className="p-12">
        {/* Header - Simple and Clean */}
        <div className="text-center mb-6 pb-4 border-b-2 border-black">
          <h1 className="text-2xl font-bold uppercase tracking-wide mb-2">
            {personalInfo.fullName || 'YOUR NAME'}
          </h1>
          <p className="text-base mb-2">{personalInfo.jobTitle || 'Professional Title'}</p>
          <div className="text-sm">
            {[
              personalInfo.email,
              personalInfo.phone,
              personalInfo.location,
              personalInfo.linkedin,
              personalInfo.portfolio
            ].filter(Boolean).join(' | ')}
          </div>
        </div>

        {/* Professional Summary */}
        {summary && (
          <div className="mb-6">
            <h2 className="text-base font-bold uppercase border-b border-black pb-1 mb-3">
              Professional Summary
            </h2>
            <p className="text-sm">{summary}</p>
          </div>
        )}

        {/* Work Experience */}
        {experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-base font-bold uppercase border-b border-black pb-1 mb-3">
              Professional Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-bold">{exp.role}</h3>
                      <p className="text-sm">{exp.company}</p>
                    </div>
                    <p className="text-sm text-right">
                      {formatDate(exp.startDate)} - {exp.isCurrentRole ? 'Present' : formatDate(exp.endDate)}
                    </p>
                  </div>
                  {exp.responsibilities.length > 0 && (
                    <ul className="mt-2 ml-4 space-y-1">
                      {exp.responsibilities.map((resp, idx) => (
                        <li key={idx} className="text-sm list-disc">
                          {resp}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-base font-bold uppercase border-b border-black pb-1 mb-3">
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between">
                  <div>
                    <h3 className="font-bold">{edu.degree}</h3>
                    <p className="text-sm">{edu.institution}</p>
                  </div>
                  <p className="text-sm">{edu.year}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-base font-bold uppercase border-b border-black pb-1 mb-3">
              Skills
            </h2>
            <p className="text-sm">{skills.join(', ')}</p>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="mb-6">
            <h2 className="text-base font-bold uppercase border-b border-black pb-1 mb-3">
              Projects
            </h2>
            <div className="space-y-3">
              {projects.map((project) => (
                <div key={project.id}>
                  <h3 className="font-bold">{project.name}</h3>
                  <p className="text-sm">{project.description}</p>
                  {project.techStack.length > 0 && (
                    <p className="text-sm mt-1">
                      <span className="font-semibold">Technologies:</span> {project.techStack.join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div className="mb-6">
            <h2 className="text-base font-bold uppercase border-b border-black pb-1 mb-3">
              Certifications
            </h2>
            <ul className="ml-4 space-y-1">
              {certifications.map((cert, idx) => (
                <li key={idx} className="text-sm list-disc">{cert}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div className="mb-6">
            <h2 className="text-base font-bold uppercase border-b border-black pb-1 mb-3">
              Languages
            </h2>
            <p className="text-sm">{languages.join(', ')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateATS;
