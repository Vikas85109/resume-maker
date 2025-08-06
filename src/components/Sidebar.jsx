import React from 'react';
import SectionEditor from './SectionEditor';
import TemplateSelector from './TemplateSelector';

const sections = ['personalDetails'];

export default function Sidebar({ selected, setSelected, data, updateSection, handleClick }) {
  return (
    <div className="w-1/3 p-4 overflow-y-auto border-r">
      <div>
        <div>
          <TemplateSelector
            selected={selected}
            setSelected={setSelected}
          // selected={selectedTemplate}
          // onSelect={setSelectedTemplate}
          // settings={templateSettings}
          // setSettings={setTemplateSettings}
          />
        </div>
        <div>
          <button onClick={handleClick}  style={{cursor:"pointer"}}  className="bg-purple-600 text-white px-4 py-2 mb-4 rounded">
            Download PDF
          </button>
        </div>
      </div>
      {sections.map(section => (
        <SectionEditor
          key={section}
          section={section}
          data={data[section]}
          updateSection={updateSection}
        />
      ))}

    </div>
  );
}
