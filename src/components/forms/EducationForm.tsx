import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import Accordion from '@/components/ui/Accordion';
import { useResume } from '@/context/ResumeContext';
import { IEducation, generateId } from '@/types/resume';

const EducationForm: React.FC = () => {
  const { resumeData, addEducation, updateEducation, removeEducation } = useResume();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleAdd = () => {
    const newEdu: IEducation = {
      id: generateId(),
      degree: '',
      institution: '',
      year: '',
      description: '',
    };
    addEducation(newEdu);
    setExpandedId(newEdu.id);
  };

  return (
    <Accordion title="Education" badge={resumeData.education.length}>
      <div className="space-y-3">
        {resumeData.education.map((edu) => (
          <div key={edu.id} className="border border-slate-200 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setExpandedId(expandedId === edu.id ? null : edu.id)}
              className="w-full px-3 py-2.5 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors text-left"
            >
              <div>
                <p className="text-sm font-medium text-slate-900">{edu.degree || 'New Degree'}</p>
                <p className="text-xs text-slate-500">{edu.institution || 'Institution'}</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeEducation(edu.id); }}
                  className="p-1 text-slate-400 hover:text-red-500"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <svg className={`w-4 h-4 text-slate-400 transition-transform ${expandedId === edu.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {expandedId === edu.id && (
              <div className="p-3 space-y-3 border-t border-slate-200">
                <Input
                  label="Degree"
                  placeholder="B.S. Computer Science"
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Institution"
                    placeholder="Stanford University"
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                  />
                  <Input
                    label="Year"
                    placeholder="2020"
                    value={edu.year}
                    onChange={(e) => updateEducation(edu.id, { year: e.target.value })}
                  />
                </div>
              </div>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={handleAdd}
          className="w-full py-2 text-sm text-slate-600 border border-dashed border-slate-300 rounded-lg hover:border-slate-400 hover:text-slate-900 transition-colors"
        >
          + Add Education
        </button>
      </div>
    </Accordion>
  );
};

export default EducationForm;
