import React, { useState } from "react";
import EducationForm from "../EducationForm";

const EducationSection = () => {
  const [educations, setEducations] = useState([
    getEmptyEducation(),
  ]);

  const updateEducation = (index, updated) => {
    const updatedList = [...educations];
    updatedList[index] = updated;
    setEducations(updatedList);
  };

  const addEducation = () => {
    setEducations([...educations, getEmptyEducation()]);
  };

  const deleteEducation = (index) => {
    const filtered = educations.filter((_, i) => i !== index);
    setEducations(filtered);
  };

  const markDone = (index) => {
    // you can add validation or set a flag if needed
    console.log("Saved education:", educations[index]);
  };

  return (
    <div>
     
      {educations.map((edu, i) => (
        <EducationForm
          key={i}
          data={edu}
          onChange={(updated) => updateEducation(i, updated)}
          onDelete={() => deleteEducation(i)}
          onDone={() => markDone(i)}
        />
      ))}

      <button
        className="border border-gray-400 px-4 py-2 rounded mt-2 text-sm"
        onClick={addEducation}
      >
        + Add education
      </button>
    </div>
  );
};

const getEmptyEducation = () => ({
  degree: "",
  school: "",
  city: "",
  startMonth: "",
  startYear: "",
  endMonth: "",
  endYear: "",
  present: false,
  description: "",
});

export default EducationSection;
