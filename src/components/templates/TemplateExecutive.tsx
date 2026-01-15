import React from 'react';
import { TemplateProps } from '@/types/resume';

const TemplateExecutive: React.FC<TemplateProps> = ({ data }) => {
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
        height: '1123px',
        fontFamily: 'Palatino, Georgia, serif',
      }}
    >
      {/* Elegant Top Border */}
      <div className="h-2 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800"></div>

      <div className="p-10">
        {/* Header */}
        <div className="text-center mb-8 pb-6 border-b-2 border-slate-200">
          <h1 className="text-4xl font-normal tracking-wide text-slate-900 mb-2">
            {personalInfo.fullName?.toUpperCase() || 'YOUR NAME'}
          </h1>
          <p className="text-lg text-slate-600 tracking-wider mb-4">
            {personalInfo.jobTitle || 'Job Title'}
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-1 text-sm text-slate-600">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
          </div>
          <div className="flex justify-center gap-x-8 text-sm text-slate-500 mt-1">
            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
            {personalInfo.portfolio && <span>{personalInfo.portfolio}</span>}
          </div>
        </div>

        {/* Summary */}
        {summary && (
          <div className="mb-8 text-center max-w-2xl mx-auto">
            <p className="text-slate-700 leading-relaxed italic">{summary}</p>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="col-span-2 space-y-6">
            {/* Experience */}
            {experience.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold tracking-[0.2em] text-slate-800 uppercase border-b border-slate-300 pb-2 mb-4">
                  Professional Experience
                </h2>
                <div className="space-y-5">
                  {experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-lg font-semibold text-slate-900">{exp.role}</h3>
                        <span className="text-sm text-slate-500 italic">
                          {formatDate(exp.startDate)} – {exp.isCurrentRole ? 'Present' : formatDate(exp.endDate)}
                        </span>
                      </div>
                      <p className="text-slate-700 font-medium mb-2">{exp.company}</p>
                      {exp.responsibilities.length > 0 && (
                        <ul className="space-y-1">
                          {exp.responsibilities.map((resp, idx) => (
                            <li key={idx} className="text-sm text-slate-600 pl-4 relative before:content-['—'] before:absolute before:left-0 before:text-slate-400">
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

            {/* Projects */}
            {projects.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold tracking-[0.2em] text-slate-800 uppercase border-b border-slate-300 pb-2 mb-4">
                  Key Projects
                </h2>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id}>
                      <h3 className="font-semibold text-slate-900">{project.name}</h3>
                      <p className="text-sm text-slate-600 mt-1">{project.description}</p>
                      {project.techStack.length > 0 && (
                        <p className="text-xs text-slate-500 mt-1 italic">
                          Technologies: {project.techStack.join(', ')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Side Column */}
          <div className="space-y-6">
            {/* Education */}
            {education.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold tracking-[0.2em] text-slate-800 uppercase border-b border-slate-300 pb-2 mb-4">
                  Education
                </h2>
                <div className="space-y-4">
                  {education.map((edu) => (
                    <div key={edu.id}>
                      <h3 className="font-semibold text-slate-900 text-sm">{edu.degree}</h3>
                      <p className="text-sm text-slate-600">{edu.institution}</p>
                      <p className="text-xs text-slate-500 italic">{edu.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Expertise */}
            {skills.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold tracking-[0.2em] text-slate-800 uppercase border-b border-slate-300 pb-2 mb-4">
                  Areas of Expertise
                </h2>
                <div className="space-y-1">
                  {skills.map((skill, idx) => (
                    <p key={idx} className="text-sm text-slate-700">
                      {skill}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold tracking-[0.2em] text-slate-800 uppercase border-b border-slate-300 pb-2 mb-4">
                  Languages
                </h2>
                <div className="space-y-1">
                  {languages.map((lang, idx) => (
                    <p key={idx} className="text-sm text-slate-700">{lang}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold tracking-[0.2em] text-slate-800 uppercase border-b border-slate-300 pb-2 mb-4">
                  Certifications
                </h2>
                <div className="space-y-1">
                  {certifications.map((cert, idx) => (
                    <p key={idx} className="text-sm text-slate-700">{cert}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Elegant Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800"></div>
    </div>
  );
};

export default TemplateExecutive;
