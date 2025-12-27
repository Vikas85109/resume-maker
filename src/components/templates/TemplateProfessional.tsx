import React from 'react';
import { TemplateProps } from '@/types/resume';

const TemplateProfessional: React.FC<TemplateProps> = ({ data, scale = 1 }) => {
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
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
      }}
    >
      {/* Header Banner */}
      <div className="bg-indigo-700 text-white px-8 py-8">
        <h1 className="text-3xl font-bold mb-1">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <p className="text-indigo-200 text-lg mb-4">
          {personalInfo.jobTitle || 'Job Title'}
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-indigo-100">
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {personalInfo.location}
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              {personalInfo.linkedin}
            </span>
          )}
        </div>
      </div>

      <div className="p-8">
        {/* Summary */}
        {summary && (
          <div className="mb-6 pb-6 border-b border-slate-200">
            <p className="text-slate-700 leading-relaxed">{summary}</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="col-span-2 space-y-6">
            {/* Experience */}
            {experience.length > 0 && (
              <div>
                <h2 className="flex items-center gap-2 text-lg font-bold text-indigo-700 mb-4">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  Work Experience
                </h2>
                <div className="space-y-5">
                  {experience.map((exp) => (
                    <div key={exp.id} className="bg-slate-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-slate-900">{exp.role}</h3>
                          <p className="text-sm text-indigo-600 font-medium">{exp.company}</p>
                        </div>
                        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                          {formatDate(exp.startDate)} - {exp.isCurrentRole ? 'Present' : formatDate(exp.endDate)}
                        </span>
                      </div>
                      {exp.responsibilities.length > 0 && (
                        <ul className="space-y-1 mt-3">
                          {exp.responsibilities.map((resp, idx) => (
                            <li key={idx} className="text-sm text-slate-600 flex items-start">
                              <span className="text-indigo-500 mr-2">▸</span>
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
                <h2 className="flex items-center gap-2 text-lg font-bold text-indigo-700 mb-4">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  Projects
                </h2>
                <div className="space-y-3">
                  {projects.map((project) => (
                    <div key={project.id} className="border border-slate-200 rounded-lg p-3">
                      <h3 className="font-semibold text-slate-900">{project.name}</h3>
                      <p className="text-sm text-slate-600 mt-1">{project.description}</p>
                      {project.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {project.techStack.map((tech, idx) => (
                            <span key={idx} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
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
                <h2 className="text-sm font-bold text-indigo-700 uppercase tracking-wider mb-3">
                  Skills
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill, idx) => (
                    <span key={idx} className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-md border border-indigo-100">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {education.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-indigo-700 uppercase tracking-wider mb-3">
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

            {/* Languages & Certifications */}
            {(languages.length > 0 || certifications.length > 0) && (
              <div className="space-y-4">
                {languages.length > 0 && (
                  <div>
                    <h2 className="text-sm font-bold text-indigo-700 uppercase tracking-wider mb-2">
                      Languages
                    </h2>
                    <ul className="space-y-1">
                      {languages.map((lang, idx) => (
                        <li key={idx} className="text-sm text-slate-600">{lang}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {certifications.length > 0 && (
                  <div>
                    <h2 className="text-sm font-bold text-indigo-700 uppercase tracking-wider mb-2">
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateProfessional;
