import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';
import TagInput from '@/components/ui/TagInput';
import Button from '@/components/ui/Button';
import Accordion from '@/components/ui/Accordion';
import { useResume } from '@/context/ResumeContext';
import { IProject, generateId } from '@/types/resume';

const ProjectsForm: React.FC = () => {
  const { resumeData, addProject, updateProject, removeProject } = useResume();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleAddProject = () => {
    const newProject: IProject = {
      id: generateId(),
      name: '',
      description: '',
      techStack: [],
    };
    addProject(newProject);
    setExpandedId(newProject.id);
  };

  const handleUpdateField = (id: string, field: keyof IProject, value: unknown) => {
    updateProject(id, { [field]: value });
  };

  return (
    <Accordion
      title="Projects"
      subtitle="Showcase your notable work"
      badge={resumeData.projects.length}
      icon={
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          />
        </svg>
      }
    >
      <div className="space-y-4">
        {resumeData.projects.map((project) => (
          <div
            key={project.id}
            className="border border-slate-200 rounded-lg overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setExpandedId(expandedId === project.id ? null : project.id)}
              className="w-full px-4 py-3 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <div className="text-left">
                <p className="font-medium text-slate-900">
                  {project.name || 'Untitled Project'}
                </p>
                <p className="text-sm text-slate-500">
                  {project.techStack.length > 0
                    ? project.techStack.slice(0, 3).join(', ') +
                      (project.techStack.length > 3 ? '...' : '')
                    : 'No tech stack added'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeProject(project.id);
                  }}
                  className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
                <svg
                  className={`w-5 h-5 text-slate-400 transition-transform ${
                    expandedId === project.id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {expandedId === project.id && (
              <div className="p-4 space-y-4 border-t border-slate-200">
                <Input
                  label="Project Name"
                  placeholder="E-commerce Platform"
                  value={project.name}
                  onChange={(e) => handleUpdateField(project.id, 'name', e.target.value)}
                />

                <TextArea
                  label="Description"
                  placeholder="Briefly describe the project, its purpose, and your role"
                  value={project.description}
                  onChange={(e) => handleUpdateField(project.id, 'description', e.target.value)}
                  rows={3}
                />

                <TagInput
                  label="Tech Stack"
                  tags={project.techStack}
                  onChange={(tags) => handleUpdateField(project.id, 'techStack', tags)}
                  placeholder="e.g., React, Node.js, PostgreSQL"
                />
              </div>
            )}
          </div>
        ))}

        <Button
          variant="secondary"
          onClick={handleAddProject}
          className="w-full"
          leftIcon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }
        >
          Add Project
        </Button>
      </div>
    </Accordion>
  );
};

export default ProjectsForm;
