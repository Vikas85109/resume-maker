import React from 'react';
import { TemplateProps } from '@/types/resume';

const TemplateElegant: React.FC<TemplateProps> = ({ data }) => {
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
        height: '1123px',
        fontFamily: 'Georgia, serif',
      }}
    >
      {/* Elegant Header */}
      <div className="text-center py-12 px-8 border-b-2 border-amber-400">
        <h1 className="text-4xl font-normal text-gray-800 tracking-wide mb-2">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <p className="text-lg text-amber-600 italic mb-4">
          {personalInfo.jobTitle || 'Job Title'}
        </p>
        <div className="flex justify-center flex-wrap gap-6 text-sm text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>•</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>•</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
        {(personalInfo.linkedin || personalInfo.portfolio) && (
          <div className="flex justify-center gap-6 text-sm text-gray-500 mt-2">
            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
            {personalInfo.portfolio && <span>{personalInfo.portfolio}</span>}
          </div>
        )}
      </div>

      <div className="px-10 py-8">
        {/* Summary */}
        {summary && (
          <div className="mb-8 text-center max-w-2xl mx-auto">
            <p className="text-gray-600 leading-relaxed italic">"{summary}"</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-10">
          {/* Main Column */}
          <div className="col-span-2 space-y-8">
            {/* Experience */}
            {experience.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-amber-600 uppercase tracking-[0.2em] mb-4 pb-2 border-b border-amber-200">
                  Professional Experience
                </h2>
                <div className="space-y-6">
                  {experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-lg font-semibold text-gray-800">{exp.role}</h3>
                        <span className="text-sm text-gray-500 italic">
                          {formatDate(exp.startDate)} — {exp.isCurrentRole ? 'Present' : formatDate(exp.endDate)}
                        </span>
                      </div>
                      <p className="text-amber-600 mb-2">{exp.company}</p>
                      {exp.responsibilities.length > 0 && (
                        <ul className="space-y-1">
                          {exp.responsibilities.map((resp, idx) => (
                            <li key={idx} className="text-sm text-gray-600 pl-4 relative before:content-['—'] before:absolute before:left-0 before:text-amber-400">
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
                <h2 className="text-sm font-semibold text-amber-600 uppercase tracking-[0.2em] mb-4 pb-2 border-b border-amber-200">
                  Notable Projects
                </h2>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id}>
                      <h3 className="font-semibold text-gray-800">{project.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                      {project.techStack.length > 0 && (
                        <p className="text-xs text-amber-600 mt-1 italic">
                          {project.techStack.join(' • ')}
                        </p>
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
                <h2 className="text-sm font-semibold text-amber-600 uppercase tracking-[0.2em] mb-3 pb-2 border-b border-amber-200">
                  Expertise
                </h2>
                <ul className="space-y-1">
                  {skills.map((skill, idx) => (
                    <li key={idx} className="text-sm text-gray-600">{skill}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Education */}
            {education.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-amber-600 uppercase tracking-[0.2em] mb-3 pb-2 border-b border-amber-200">
                  Education
                </h2>
                <div className="space-y-3">
                  {education.map((edu) => (
                    <div key={edu.id}>
                      <h3 className="font-semibold text-gray-800 text-sm">{edu.degree}</h3>
                      <p className="text-sm text-gray-600 italic">{edu.institution}</p>
                      <p className="text-xs text-gray-500">{edu.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-amber-600 uppercase tracking-[0.2em] mb-3 pb-2 border-b border-amber-200">
                  Languages
                </h2>
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
                <h2 className="text-sm font-semibold text-amber-600 uppercase tracking-[0.2em] mb-3 pb-2 border-b border-amber-200">
                  Certifications
                </h2>
                <ul className="space-y-1">
                  {certifications.map((cert, idx) => (
                    <li key={idx} className="text-sm text-gray-600">{cert}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400"></div>
    </div>
  );
};

export default TemplateElegant;
