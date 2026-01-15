import React from 'react';
import { TemplateProps } from '@/types/resume';

const TemplateCreative: React.FC<TemplateProps> = ({ data }) => {
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
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div className="flex h-full">
        {/* Left Sidebar */}
        <div className="w-1/3 bg-gradient-to-b from-purple-600 to-indigo-700 text-white p-6">
          {/* Profile Circle */}
          <div className="w-24 h-24 rounded-full bg-white/20 mx-auto mb-4 flex items-center justify-center">
            <span className="text-4xl font-bold text-white/80">
              {personalInfo.fullName ? personalInfo.fullName.charAt(0).toUpperCase() : '?'}
            </span>
          </div>

          {/* Name & Title */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold">{personalInfo.fullName || 'Your Name'}</h1>
            <p className="text-purple-200 text-sm mt-1">{personalInfo.jobTitle || 'Job Title'}</p>
          </div>

          {/* Contact */}
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-purple-200 mb-3">Contact</h2>
            <div className="space-y-2 text-sm">
              {personalInfo.email && (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="break-all text-xs">{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span className="text-xs">{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                  <span className="text-xs">{personalInfo.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-purple-200 mb-3">Skills</h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-white/10 text-white text-xs rounded-full"
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
              <h2 className="text-xs font-bold uppercase tracking-wider text-purple-200 mb-3">Languages</h2>
              <ul className="space-y-1">
                {languages.map((lang, idx) => (
                  <li key={idx} className="text-sm text-purple-100">{lang}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-purple-200 mb-3">Certifications</h2>
              <ul className="space-y-1">
                {certifications.map((cert, idx) => (
                  <li key={idx} className="text-sm text-purple-100">{cert}</li>
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
              <h2 className="text-lg font-bold text-purple-700 mb-2 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-purple-500"></span>
                About Me
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">{summary}</p>
            </div>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-purple-700 mb-4 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-purple-500"></span>
                Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp, index) => (
                  <div key={exp.id} className="relative pl-6">
                    <div className="absolute left-0 top-0 w-3 h-3 bg-purple-500 rounded-full"></div>
                    {index !== experience.length - 1 && (
                      <div className="absolute left-1.5 top-3 w-0.5 h-full bg-purple-200"></div>
                    )}
                    <div className="mb-1">
                      <h3 className="font-bold text-slate-900">{exp.role}</h3>
                      <p className="text-sm text-purple-600">{exp.company}</p>
                      <p className="text-xs text-slate-500">
                        {formatDate(exp.startDate)} - {exp.isCurrentRole ? 'Present' : formatDate(exp.endDate)}
                      </p>
                    </div>
                    {exp.responsibilities.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {exp.responsibilities.map((resp, idx) => (
                          <li key={idx} className="text-sm text-slate-600 flex items-start">
                            <span className="text-purple-400 mr-2">◆</span>
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
              <h2 className="text-lg font-bold text-purple-700 mb-4 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-purple-500"></span>
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{edu.degree}</h3>
                      <p className="text-sm text-slate-600">{edu.institution}</p>
                      <p className="text-xs text-slate-500">{edu.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-purple-700 mb-4 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-purple-500"></span>
                Projects
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {projects.map((project) => (
                  <div key={project.id} className="bg-purple-50 rounded-lg p-3">
                    <h3 className="font-semibold text-slate-900 text-sm">{project.name}</h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{project.description}</p>
                    {project.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.techStack.slice(0, 3).map((tech, idx) => (
                          <span key={idx} className="text-[10px] bg-purple-200 text-purple-700 px-1.5 py-0.5 rounded">
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
      </div>
    </div>
  );
};

export default TemplateCreative;
