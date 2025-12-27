import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';
import TagInput from '@/components/ui/TagInput';
import Accordion from '@/components/ui/Accordion';
import { useResume } from '@/context/ResumeContext';
import { IProject, generateId } from '@/types/resume';

const ProjectsForm: React.FC = () => {
  const { resumeData, addProject, updateProject, removeProject } = useResume();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleAdd = () => {
    const newProject: IProject = {
      id: generateId(),
      name: '',
      description: '',
      techStack: [],
    };
    addProject(newProject);
    setExpandedId(newProject.id);
  };

  return (
    <Accordion title="Projects" badge={resumeData.projects.length}>
      <div className="space-y-3">
        {resumeData.projects.map((project) => (
          <div key={project.id} className="border border-slate-200 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setExpandedId(expandedId === project.id ? null : project.id)}
              className="w-full px-3 py-2.5 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors text-left"
            >
              <div>
                <p className="text-sm font-medium text-slate-900">{project.name || 'New Project'}</p>
                <p className="text-xs text-slate-500">
                  {project.techStack.length > 0 ? project.techStack.slice(0, 3).join(', ') : 'No tech stack'}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeProject(project.id); }}
                  className="p-1 text-slate-400 hover:text-red-500"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <svg className={`w-4 h-4 text-slate-400 transition-transform ${expandedId === project.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {expandedId === project.id && (
              <div className="p-3 space-y-3 border-t border-slate-200">
                <Input
                  label="Project Name"
                  placeholder="E-commerce Platform"
                  value={project.name}
                  onChange={(e) => updateProject(project.id, { name: e.target.value })}
                />

                <TextArea
                  label="Description"
                  placeholder="Brief description of the project..."
                  value={project.description}
                  onChange={(e) => updateProject(project.id, { description: e.target.value })}
                  rows={2}
                />

                <TagInput
                  label="Tech Stack"
                  tags={project.techStack}
                  onChange={(tags) => updateProject(project.id, { techStack: tags })}
                  placeholder="React, Node.js..."
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
          + Add Project
        </button>
      </div>
    </Accordion>
  );
};

export default ProjectsForm;
