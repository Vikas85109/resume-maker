import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';
import Accordion from '@/components/ui/Accordion';
import { useResume } from '@/context/ResumeContext';
import { IExperience, generateId } from '@/types/resume';

const ExperienceForm: React.FC = () => {
  const { resumeData, addExperience, updateExperience, removeExperience } = useResume();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleAdd = () => {
    const newExp: IExperience = {
      id: generateId(),
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      isCurrentRole: false,
      responsibilities: [],
    };
    addExperience(newExp);
    setExpandedId(newExp.id);
  };

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  return (
    <Accordion title="Work Experience" badge={resumeData.experience.length}>
      <div className="space-y-3">
        {resumeData.experience.map((exp) => (
          <div key={exp.id} className="border border-slate-200 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
              className="w-full px-3 py-2.5 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors text-left"
            >
              <div>
                <p className="text-sm font-medium text-slate-900">{exp.role || 'New Position'}</p>
                <p className="text-xs text-slate-500">
                  {exp.company || 'Company'} {exp.startDate && `· ${formatDate(exp.startDate)}`}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeExperience(exp.id); }}
                  className="p-1 text-slate-400 hover:text-red-500"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <svg className={`w-4 h-4 text-slate-400 transition-transform ${expandedId === exp.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {expandedId === exp.id && (
              <div className="p-3 space-y-3 border-t border-slate-200">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Job Title"
                    placeholder="Software Engineer"
                    value={exp.role}
                    onChange={(e) => updateExperience(exp.id, { role: e.target.value })}
                  />
                  <Input
                    label="Company"
                    placeholder="Google"
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Start Date"
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                  />
                  <div>
                    <Input
                      label="End Date"
                      type="month"
                      value={exp.endDate}
                      onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                      disabled={exp.isCurrentRole}
                    />
                    <label className="flex items-center gap-2 mt-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={exp.isCurrentRole}
                        onChange={(e) => updateExperience(exp.id, { isCurrentRole: e.target.checked, endDate: '' })}
                        className="w-3.5 h-3.5 text-slate-900 border-slate-300 rounded"
                      />
                      <span className="text-xs text-slate-600">Current role</span>
                    </label>
                  </div>
                </div>

                <TextArea
                  label="Key Responsibilities"
                  placeholder="• Led development of...&#10;• Improved performance by..."
                  value={exp.responsibilities.join('\n')}
                  onChange={(e) => updateExperience(exp.id, { responsibilities: e.target.value.split('\n').filter(l => l.trim()) })}
                  rows={3}
                />
              </div>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={handleAdd}
          className="w-full py-2 text-sm text-slate-600 border border-dashed border-slate-300 rounded-lg hover:border-slate-400 hover:text-slate-900 transition-colors"
        >
          + Add Experience
        </button>
      </div>
    </Accordion>
  );
};

export default ExperienceForm;
