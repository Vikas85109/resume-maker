import React from 'react';
import { TemplateProps } from '@/types/resume';

const TemplateModern: React.FC<TemplateProps> = ({ data }) => {
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
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div className="p-8">
        {/* Header */}
        <div className="text-center mb-6 pb-6 border-b border-slate-200">
          <h1 className="text-3xl font-bold text-slate-900 mb-1">
            {personalInfo.fullName || 'Your Name'}
          </h1>
          <p className="text-lg text-indigo-600 font-medium mb-3">
            {personalInfo.jobTitle || 'Job Title'}
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>•</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>•</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
          </div>
          <div className="flex justify-center gap-4 text-sm text-slate-500 mt-1">
            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
            {personalInfo.portfolio && <span>•</span>}
            {personalInfo.portfolio && <span>{personalInfo.portfolio}</span>}
          </div>
        </div>

        {/* Summary */}
        {summary && (
          <div className="mb-6">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              About
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">{summary}</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="col-span-2 space-y-6">
            {/* Experience */}
            {experience.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Experience
                </h2>
                <div className="space-y-4">
                  {experience.map((exp) => (
                    <div key={exp.id} className="relative pl-4 border-l-2 border-indigo-200">
                      <div className="absolute w-2 h-2 bg-indigo-500 rounded-full -left-[5px] top-1.5" />
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="font-semibold text-slate-900">{exp.role}</h3>
                          <p className="text-sm text-indigo-600">{exp.company}</p>
                        </div>
                        <p className="text-xs text-slate-500 whitespace-nowrap">
                          {formatDate(exp.startDate)} - {exp.isCurrentRole ? 'Present' : formatDate(exp.endDate)}
                        </p>
                      </div>
                      {exp.responsibilities.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {exp.responsibilities.map((resp, idx) => (
                            <li key={idx} className="text-sm text-slate-600 flex">
                              <span className="mr-2 text-indigo-400">→</span>
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

            {/* Projects */}
            {projects.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Projects
                </h2>
                <div className="space-y-3">
                  {projects.map((project) => (
                    <div key={project.id} className="bg-slate-50 rounded-lg p-3">
                      <h3 className="font-semibold text-slate-900">{project.name}</h3>
                      <p className="text-sm text-slate-600 mt-1">{project.description}</p>
                      {project.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {project.techStack.map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Side Column */}
          <div className="space-y-6">
            {/* Skills */}
            {skills.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Skills
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {education.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Education
                </h2>
                <div className="space-y-3">
                  {education.map((edu) => (
                    <div key={edu.id}>
                      <h3 className="font-semibold text-slate-900 text-sm">{edu.degree}</h3>
                      <p className="text-sm text-slate-600">{edu.institution}</p>
                      <p className="text-xs text-slate-500">{edu.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Languages
                </h2>
                <ul className="space-y-1">
                  {languages.map((lang, idx) => (
                    <li key={idx} className="text-sm text-slate-600">{lang}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Certifications
                </h2>
                <ul className="space-y-1">
                  {certifications.map((cert, idx) => (
                    <li key={idx} className="text-sm text-slate-600">{cert}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateModern;
