import React from 'react';
import { TemplateProps } from '@/types/resume';

const TemplateTech: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages } = data;

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  return (
    <div
      className="a4-page bg-slate-900 text-white"
      style={{
        width: '794px',
        height: '1123px',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-10">
        <h1 className="text-4xl font-bold mb-2">{personalInfo.fullName || 'Your Name'}</h1>
        <p className="text-xl text-cyan-100 font-medium mb-4">{personalInfo.jobTitle || 'Job Title'}</p>
        <div className="flex flex-wrap gap-4 text-sm text-white/90">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              {personalInfo.location}
            </span>
          )}
        </div>
      </div>

      <div className="p-8">
        {/* Summary */}
        {summary && (
          <div className="mb-6">
            <p className="text-slate-300 leading-relaxed">{summary}</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Experience */}
            {experience.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-cyan-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-cyan-400"></div>
                  Experience
                </h2>
                <div className="space-y-5">
                  {experience.map((exp) => (
                    <div key={exp.id} className="border-l-2 border-slate-700 pl-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-white">{exp.role}</h3>
                          <p className="text-cyan-400">{exp.company}</p>
                        </div>
                        <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">
                          {formatDate(exp.startDate)} - {exp.isCurrentRole ? 'Present' : formatDate(exp.endDate)}
                        </span>
                      </div>
                      {exp.responsibilities.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {exp.responsibilities.map((resp, idx) => (
                            <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                              <span className="text-cyan-400 mt-1">▹</span>
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
                <h2 className="text-lg font-bold text-cyan-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-cyan-400"></div>
                  Projects
                </h2>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="bg-slate-800/50 rounded-lg p-4">
                      <h3 className="font-bold text-white">{project.name}</h3>
                      <p className="text-sm text-slate-300 mt-1">{project.description}</p>
                      {project.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {project.techStack.map((tech, idx) => (
                            <span key={idx} className="px-2 py-0.5 text-xs bg-cyan-500/20 text-cyan-300 rounded">
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

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Skills */}
            {skills.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-cyan-400 uppercase tracking-wider mb-3">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 text-sm bg-slate-800 text-slate-200 rounded-full border border-slate-700">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {education.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-cyan-400 uppercase tracking-wider mb-3">Education</h2>
                <div className="space-y-3">
                  {education.map((edu) => (
                    <div key={edu.id}>
                      <h3 className="font-semibold text-white text-sm">{edu.degree}</h3>
                      <p className="text-sm text-slate-400">{edu.institution}</p>
                      <p className="text-xs text-slate-500">{edu.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-cyan-400 uppercase tracking-wider mb-3">Languages</h2>
                <ul className="space-y-1">
                  {languages.map((lang, idx) => (
                    <li key={idx} className="text-sm text-slate-300">{lang}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-cyan-400 uppercase tracking-wider mb-3">Certifications</h2>
                <ul className="space-y-1">
                  {certifications.map((cert, idx) => (
                    <li key={idx} className="text-sm text-slate-300">{cert}</li>
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

export default TemplateTech;
