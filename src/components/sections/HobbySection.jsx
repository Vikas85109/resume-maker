import React, { useState } from "react";

const HobbySection = () => {
  const [skills, setSkills] = useState([]);
  const [currentSkill, setCurrentSkill] = useState({ skill: "",  });

  const handleAddSkill = () => {
    if (currentSkill.skill) {
      setSkills([...skills, currentSkill]);
      setCurrentSkill({ skill: ""});
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
          placeholder="Hobby"
          value={currentSkill.skill}
          onChange={(e) =>
            setCurrentSkill({ ...currentSkill, skill: e.target.value })
          }
        />
       
      </div>
      

      <div className="flex flex-wrap gap-2 mb-4">
        {skills.map((item, index) => (
          <div
            key={index}
            className="bg-gray-100 px-3 py-1 rounded flex items-center gap-2"
          >
            {item.skill}  
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
        + Add Hobby
      </button>
    </div>
  );
};

export default HobbySection;
