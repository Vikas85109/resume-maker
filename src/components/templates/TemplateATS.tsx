import React from 'react';
import { TemplateProps } from '@/types/resume';

const TemplateATS: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages } = data;

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  return (
    <div
      className="a4-page"
      style={{
        width: '794px',
        height: '1123px',
        backgroundColor: '#ffffff',
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '10pt',
        lineHeight: '1.5',
        color: '#1a1a1a',
        padding: '0',
        margin: '0',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: '40px 50px' }}>
        {/* Header Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '20px',
          paddingBottom: '16px',
          borderBottom: '2px solid #1a1a1a'
        }}>
          <h1 style={{
            fontSize: '24pt',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            margin: '0 0 8px 0',
            color: '#1a1a1a'
          }}>
            {personalInfo.fullName || 'YOUR NAME'}
          </h1>
          <p style={{
            fontSize: '12pt',
            color: '#444444',
            margin: '0 0 10px 0',
            fontWeight: '500'
          }}>
            {personalInfo.jobTitle || 'Professional Title'}
          </p>
          <div style={{
            fontSize: '9pt',
            color: '#555555',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '8px'
          }}>
            {personalInfo.email && (
              <span>{personalInfo.email}</span>
            )}
            {personalInfo.email && personalInfo.phone && <span>|</span>}
            {personalInfo.phone && (
              <span>{personalInfo.phone}</span>
            )}
            {personalInfo.phone && personalInfo.location && <span>|</span>}
            {personalInfo.location && (
              <span>{personalInfo.location}</span>
            )}
            {personalInfo.location && personalInfo.linkedin && <span>|</span>}
            {personalInfo.linkedin && (
              <span>{personalInfo.linkedin}</span>
            )}
            {personalInfo.linkedin && personalInfo.portfolio && <span>|</span>}
            {personalInfo.portfolio && (
              <span>{personalInfo.portfolio}</span>
            )}
          </div>
        </div>

        {/* Professional Summary */}
        {summary && (
          <div style={{ marginBottom: '18px' }}>
            <h2 style={{
              fontSize: '11pt',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              borderBottom: '1px solid #1a1a1a',
              paddingBottom: '4px',
              marginBottom: '10px',
              letterSpacing: '1px',
              color: '#1a1a1a'
            }}>
              Professional Summary
            </h2>
            <p style={{
              fontSize: '10pt',
              color: '#333333',
              lineHeight: '1.6',
              margin: '0',
              textAlign: 'justify'
            }}>
              {summary}
            </p>
          </div>
        )}

        {/* Work Experience */}
        {experience.length > 0 && (
          <div style={{ marginBottom: '18px' }}>
            <h2 style={{
              fontSize: '11pt',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              borderBottom: '1px solid #1a1a1a',
              paddingBottom: '4px',
              marginBottom: '10px',
              letterSpacing: '1px',
              color: '#1a1a1a'
            }}>
              Professional Experience
            </h2>
            <div>
              {experience.map((exp, index) => (
                <div key={exp.id} style={{ marginBottom: index < experience.length - 1 ? '14px' : '0' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '4px'
                  }}>
                    <div>
                      <h3 style={{
                        fontSize: '11pt',
                        fontWeight: 'bold',
                        margin: '0',
                        color: '#1a1a1a'
                      }}>
                        {exp.role}
                      </h3>
                      <p style={{
                        fontSize: '10pt',
                        color: '#444444',
                        margin: '2px 0 0 0',
                        fontStyle: 'italic'
                      }}>
                        {exp.company}
                      </p>
                    </div>
                    <p style={{
                      fontSize: '9pt',
                      color: '#555555',
                      margin: '0',
                      textAlign: 'right',
                      whiteSpace: 'nowrap'
                    }}>
                      {formatDate(exp.startDate)} - {exp.isCurrentRole ? 'Present' : formatDate(exp.endDate)}
                    </p>
                  </div>
                  {exp.responsibilities.length > 0 && (
                    <ul style={{
                      margin: '8px 0 0 0',
                      paddingLeft: '18px',
                      listStyleType: 'disc'
                    }}>
                      {exp.responsibilities.map((resp, idx) => (
                        <li key={idx} style={{
                          fontSize: '9.5pt',
                          color: '#333333',
                          marginBottom: '3px',
                          lineHeight: '1.5'
                        }}>
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
          <div style={{ marginBottom: '18px' }}>
            <h2 style={{
              fontSize: '11pt',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              borderBottom: '1px solid #1a1a1a',
              paddingBottom: '4px',
              marginBottom: '10px',
              letterSpacing: '1px',
              color: '#1a1a1a'
            }}>
              Education
            </h2>
            <div>
              {education.map((edu, index) => (
                <div key={edu.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: index < education.length - 1 ? '10px' : '0'
                }}>
                  <div>
                    <h3 style={{
                      fontSize: '10.5pt',
                      fontWeight: 'bold',
                      margin: '0',
                      color: '#1a1a1a'
                    }}>
                      {edu.degree}
                    </h3>
                    <p style={{
                      fontSize: '10pt',
                      color: '#444444',
                      margin: '2px 0 0 0'
                    }}>
                      {edu.institution}
                    </p>
                    {edu.gpa && (
                      <p style={{
                        fontSize: '9pt',
                        color: '#555555',
                        margin: '2px 0 0 0'
                      }}>
                        GPA: {edu.gpa}
                      </p>
                    )}
                  </div>
                  <p style={{
                    fontSize: '9pt',
                    color: '#555555',
                    margin: '0'
                  }}>
                    {edu.year}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div style={{ marginBottom: '18px' }}>
            <h2 style={{
              fontSize: '11pt',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              borderBottom: '1px solid #1a1a1a',
              paddingBottom: '4px',
              marginBottom: '10px',
              letterSpacing: '1px',
              color: '#1a1a1a'
            }}>
              Technical Skills
            </h2>
            <p style={{
              fontSize: '10pt',
              color: '#333333',
              margin: '0',
              lineHeight: '1.6'
            }}>
              {skills.join('  •  ')}
            </p>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div style={{ marginBottom: '18px' }}>
            <h2 style={{
              fontSize: '11pt',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              borderBottom: '1px solid #1a1a1a',
              paddingBottom: '4px',
              marginBottom: '10px',
              letterSpacing: '1px',
              color: '#1a1a1a'
            }}>
              Projects
            </h2>
            <div>
              {projects.map((project, index) => (
                <div key={project.id} style={{ marginBottom: index < projects.length - 1 ? '12px' : '0' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <h3 style={{
                      fontSize: '10.5pt',
                      fontWeight: 'bold',
                      margin: '0',
                      color: '#1a1a1a'
                    }}>
                      {project.name}
                    </h3>
                    {project.link && (
                      <span style={{ fontSize: '9pt', color: '#555555' }}>
                        | {project.link}
                      </span>
                    )}
                  </div>
                  <p style={{
                    fontSize: '9.5pt',
                    color: '#333333',
                    margin: '4px 0',
                    lineHeight: '1.5'
                  }}>
                    {project.description}
                  </p>
                  {project.techStack.length > 0 && (
                    <p style={{
                      fontSize: '9pt',
                      color: '#555555',
                      margin: '0'
                    }}>
                      <strong>Technologies:</strong> {project.techStack.join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <div style={{ marginBottom: '18px' }}>
            <h2 style={{
              fontSize: '11pt',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              borderBottom: '1px solid #1a1a1a',
              paddingBottom: '4px',
              marginBottom: '10px',
              letterSpacing: '1px',
              color: '#1a1a1a'
            }}>
              Certifications
            </h2>
            <ul style={{
              margin: '0',
              paddingLeft: '18px',
              listStyleType: 'disc'
            }}>
              {certifications.map((cert, idx) => (
                <li key={idx} style={{
                  fontSize: '10pt',
                  color: '#333333',
                  marginBottom: '3px'
                }}>
                  {cert}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Languages */}
        {languages && languages.length > 0 && (
          <div style={{ marginBottom: '0' }}>
            <h2 style={{
              fontSize: '11pt',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              borderBottom: '1px solid #1a1a1a',
              paddingBottom: '4px',
              marginBottom: '10px',
              letterSpacing: '1px',
              color: '#1a1a1a'
            }}>
              Languages
            </h2>
            <p style={{
              fontSize: '10pt',
              color: '#333333',
              margin: '0'
            }}>
              {languages.join('  •  ')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateATS;
