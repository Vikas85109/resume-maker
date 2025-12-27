import React from 'react';
import { TemplateProps } from '@/types/resume';

const TemplateBold: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages } = data;

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  return (
    <div
      className="a4-page bg-white"
      style={{
        width: '794px',
        minHeight: '1123px',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Bold Header */}
      <div className="bg-rose-600 text-white px-8 py-10">
        <h1 className="text-5xl font-black uppercase tracking-tight mb-2">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <p className="text-xl font-light text-rose-100 mb-6">
          {personalInfo.jobTitle || 'Job Title'}
        </p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            {personalInfo.email && (
              <p className="flex items-center gap-2">
                <span className="w-5 h-5 bg-white/20 rounded flex items-center justify-center text-xs">@</span>
                {personalInfo.email}
              </p>
            )}
            {personalInfo.phone && (
              <p className="flex items-center gap-2">
                <span className="w-5 h-5 bg-white/20 rounded flex items-center justify-center text-xs">#</span>
                {personalInfo.phone}
              </p>
            )}
          </div>
          <div className="space-y-1">
            {personalInfo.location && (
              <p className="flex items-center gap-2">
                <span className="w-5 h-5 bg-white/20 rounded flex items-center justify-center text-xs">⌖</span>
                {personalInfo.location}
              </p>
            )}
            {personalInfo.linkedin && (
              <p className="flex items-center gap-2">
                <span className="w-5 h-5 bg-white/20 rounded flex items-center justify-center text-xs">in</span>
                {personalInfo.linkedin}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Summary */}
        {summary && (
          <div className="mb-8 p-4 bg-gray-50 border-l-4 border-rose-500">
            <p className="text-gray-700 leading-relaxed">{summary}</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="col-span-2 space-y-8">
            {/* Experience */}
            {experience.length > 0 && (
              <div>
                <h2 className="text-2xl font-black text-gray-900 uppercase mb-4">Experience</h2>
                <div className="space-y-6">
                  {experience.map((exp, index) => (
                    <div key={exp.id} className="relative">
                      <div className="absolute -left-4 top-0 w-8 h-8 bg-rose-600 text-white flex items-center justify-center font-bold text-sm">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <div className="pl-8">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{exp.role}</h3>
                            <p className="text-rose-600 font-semibold">{exp.company}</p>
                          </div>
                          <span className="text-sm text-gray-500 font-medium">
                            {formatDate(exp.startDate)} - {exp.isCurrentRole ? 'Present' : formatDate(exp.endDate)}
                          </span>
                        </div>
                        {exp.responsibilities.length > 0 && (
                          <ul className="mt-3 space-y-1">
                            {exp.responsibilities.map((resp, idx) => (
                              <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                                <span className="text-rose-500 font-bold">→</span>
                                {resp}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <div>
                <h2 className="text-2xl font-black text-gray-900 uppercase mb-4">Projects</h2>
                <div className="grid grid-cols-2 gap-4">
                  {projects.map((project) => (
                    <div key={project.id} className="p-4 border-2 border-gray-200 hover:border-rose-500 transition-colors">
                      <h3 className="font-bold text-gray-900">{project.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                      {project.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {project.techStack.map((tech, idx) => (
                            <span key={idx} className="px-2 py-0.5 text-xs bg-rose-100 text-rose-700 font-medium">
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
                <h2 className="text-lg font-black text-gray-900 uppercase mb-3">Skills</h2>
                <div className="space-y-2">
                  {skills.map((skill, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-rose-500"></div>
                      <span className="text-sm text-gray-700">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {education.length > 0 && (
              <div>
                <h2 className="text-lg font-black text-gray-900 uppercase mb-3">Education</h2>
                <div className="space-y-3">
                  {education.map((edu) => (
                    <div key={edu.id}>
                      <h3 className="font-bold text-gray-900 text-sm">{edu.degree}</h3>
                      <p className="text-sm text-rose-600">{edu.institution}</p>
                      <p className="text-xs text-gray-500">{edu.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <div>
                <h2 className="text-lg font-black text-gray-900 uppercase mb-3">Languages</h2>
                <ul className="space-y-1">
                  {languages.map((lang, idx) => (
                    <li key={idx} className="text-sm text-gray-600">{lang}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <div>
                <h2 className="text-lg font-black text-gray-900 uppercase mb-3">Certifications</h2>
                <ul className="space-y-1">
                  {certifications.map((cert, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-rose-500">✓</span>
                      {cert}
                    </li>
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

export default TemplateBold;
