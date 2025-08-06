import React, { useState } from "react";

const SkillsSection = () => {
  const [skills, setSkills] = useState([]);
  const [currentSkill, setCurrentSkill] = useState({ skill: "", level: "" });

  const handleAddSkill = () => {
    if (currentSkill.skill && currentSkill.level) {
      setSkills([...skills, currentSkill]);
      setCurrentSkill({ skill: "", level: "" });
    }
  };

  const handleDeleteSkill = (index) => {
    const updated = [...skills];
    updated.splice(index, 1);
    setSkills(updated);
  };

  return (
    <div className="p-4 border rounded-md mb-4">
      
      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 w-full rounded"
          placeholder="Skill"
          value={currentSkill.skill}
          onChange={(e) =>
            setCurrentSkill({ ...currentSkill, skill: e.target.value })
          }
        />
        <select
          className="border p-2 w-full rounded"
          value={currentSkill.level}
          onChange={(e) =>
            setCurrentSkill({ ...currentSkill, level: e.target.value })
          }
        >
          <option value="">Make a choice</option>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
        {/* <button
          className="bg-purple-600 text-white px-4 rounded"
          onClick={handleAddSkill}
        >
          ✔ Done
        </button> */}
      </div>
      

      <div className="flex flex-wrap gap-2 mb-4">
        {skills.map((item, index) => (
          <div
            key={index}
            className="bg-gray-100 px-3 py-1 rounded flex items-center gap-2"
          >
            {item.skill} ({item.level})
            <button
              className="text-red-500"
              onClick={() => handleDeleteSkill(index)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button className="border px-4 py-2 rounded hover:bg-gray-100" onClick={handleAddSkill}>
        + Add skill
      </button>
    </div>
  );
};

export default SkillsSection;
