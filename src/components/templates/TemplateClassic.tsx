import React from 'react';
import { TemplateProps } from '@/types/resume';

const TemplateClassic: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages } = data;

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
        fontFamily: 'Georgia, serif',
      }}
    >
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-1/3 bg-slate-800 text-white p-6">
          {/* Name & Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold leading-tight">{personalInfo.fullName || 'Your Name'}</h1>
            <p className="text-slate-300 text-sm mt-1">{personalInfo.jobTitle || 'Job Title'}</p>
          </div>

          {/* Contact */}
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Contact</h2>
            <div className="space-y-2 text-sm">
              {personalInfo.email && (
                <div className="flex items-start gap-2">
                  <span className="text-slate-400">@</span>
                  <span className="break-all">{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-start gap-2">
                  <span className="text-slate-400">#</span>
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-start gap-2">
                  <span className="text-slate-400">@</span>
                  <span>{personalInfo.location}</span>
                </div>
              )}
              {personalInfo.linkedin && (
                <div className="flex items-start gap-2">
                  <span className="text-slate-400">in</span>
                  <span className="break-all">{personalInfo.linkedin}</span>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Skills</h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-slate-700 text-slate-200 text-xs rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Languages</h2>
              <ul className="space-y-1 text-sm">
                {languages.map((lang, idx) => (
                  <li key={idx} className="text-slate-300">{lang}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Certifications</h2>
              <ul className="space-y-1 text-sm">
                {certifications.map((cert, idx) => (
                  <li key={idx} className="text-slate-300">{cert}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="w-2/3 p-6">
          {/* Summary */}
          {summary && (
            <div className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-3">
                Professional Summary
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">{summary}</p>
            </div>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-3">
                Work Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-slate-900">{exp.role}</h3>
                        <p className="text-sm text-slate-600">{exp.company}</p>
                      </div>
                      <p className="text-xs text-slate-500">
                        {formatDate(exp.startDate)} - {exp.isCurrentRole ? 'Present' : formatDate(exp.endDate)}
                      </p>
                    </div>
                    {exp.responsibilities.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {exp.responsibilities.map((resp, idx) => (
                          <li key={idx} className="text-sm text-slate-700 flex">
                            <span className="mr-2">•</span>
                            <span>{resp}</span>
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
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-3">
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-slate-900">{edu.degree}</h3>
                        <p className="text-sm text-slate-600">{edu.institution}</p>
                      </div>
                      <p className="text-xs text-slate-500">{edu.year}</p>
                    </div>
                    {edu.description && (
                      <p className="text-sm text-slate-600 mt-1">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-3">
                Projects
              </h2>
              <div className="space-y-3">
                {projects.map((project) => (
                  <div key={project.id}>
                    <h3 className="font-bold text-slate-900">{project.name}</h3>
                    <p className="text-sm text-slate-700 mt-1">{project.description}</p>
                    {project.techStack.length > 0 && (
                      <p className="text-xs text-slate-500 mt-1">
                        Tech: {project.techStack.join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateClassic;
