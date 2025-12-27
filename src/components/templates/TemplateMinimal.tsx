import React from 'react';
import { TemplateProps } from '@/types/resume';

const TemplateMinimal: React.FC<TemplateProps> = ({ data, scale = 1 }) => {
  const { personalInfo, summary, experience, education, skills, projects, languages } = data;

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  return (
    <div
      className="a4-page bg-white shadow-lg"
      style={{
        width: '794px',
        minHeight: '1123px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
      }}
    >
      <div className="p-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-light text-slate-900 mb-2">
            {personalInfo.fullName || 'Your Name'}
          </h1>
          <p className="text-lg text-slate-500 mb-4">
            {personalInfo.jobTitle || 'Job Title'}
          </p>
          <div className="flex flex-wrap gap-6 text-sm text-slate-600">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          </div>
        </div>

        {/* Summary */}
        {summary && (
          <div className="mb-8">
            <p className="text-slate-700 leading-relaxed max-w-2xl">{summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-4">
              Experience
            </h2>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-lg font-medium text-slate-900">{exp.role}</h3>
                    <span className="text-sm text-slate-400">
                      {formatDate(exp.startDate)} — {exp.isCurrentRole ? 'Present' : formatDate(exp.endDate)}
                    </span>
                  </div>
                  <p className="text-slate-600 mb-2">{exp.company}</p>
                  {exp.responsibilities.length > 0 && (
                    <ul className="space-y-1">
                      {exp.responsibilities.map((resp, idx) => (
                        <li key={idx} className="text-sm text-slate-600 pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-slate-300 before:rounded-full">
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

        {/* Two Column Layout for Education & Skills */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Education */}
          {education.length > 0 && (
            <div>
              <h2 className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-4">
                Education
              </h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="font-medium text-slate-900">{edu.degree}</h3>
                    <p className="text-sm text-slate-600">{edu.institution}</p>
                    <p className="text-sm text-slate-400">{edu.year}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <h2 className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-4">
                Skills
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {skills.join(' • ')}
              </p>

              {languages.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-3">
                    Languages
                  </h2>
                  <p className="text-sm text-slate-600">
                    {languages.join(' • ')}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Projects */}
        {projects.length > 0 && (
          <div>
            <h2 className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-4">
              Projects
            </h2>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id}>
                  <h3 className="font-medium text-slate-900">{project.name}</h3>
                  <p className="text-sm text-slate-600 mt-1">{project.description}</p>
                  {project.techStack.length > 0 && (
                    <p className="text-xs text-slate-400 mt-1">
                      {project.techStack.join(' • ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateMinimal;
