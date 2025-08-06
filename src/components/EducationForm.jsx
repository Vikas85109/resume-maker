import React, { useState } from "react";

const EducationForm = ({ data, onChange, onDelete, onDone }) => {
  const [education, setEducation] = useState(data);

  const handleChange = (field, value) => {
    const updated = { ...education, [field]: value };
    setEducation(updated);
    onChange(updated);
  };

  return (
    <div className="border p-4 rounded-md mb-4 shadow-sm w-full max-w-md">
      <div className="mb-4 w-full">
        <label className="block font-semibold text-sm mb-1">Education</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-black-100"
          value={education.degree}
          onChange={(e) => handleChange("degree", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-semibold mb-1">School</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-2 rounded"
            value={education.school}
            onChange={(e) => handleChange("school", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">City</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-2 rounded"
            value={education.city}
            onChange={(e) => handleChange("city", e.target.value)}
          />
        </div>
      </div>

      <div className="mb-4 w-full">
        <label className="block text-sm font-semibold mb-1">Start Date</label>
        <div className="flex gap-2 w-full">
          <select
            className="w-1/2 border p-2 rounded"
            value={education.startMonth}
            onChange={(e) => handleChange("startMonth", e.target.value)}
          >
            <option>Month</option>
            {months.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
          <select
            className="w-1/2 border p-2 rounded"
            value={education.startYear}
            onChange={(e) => handleChange("startYear", e.target.value)}
          >
            <option>Year</option>
            {years.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {!education.present && (
        <div className="mb-4 w-full">
          <label className="block text-sm font-semibold mb-1">End Date</label>
          <div className="flex gap-2 w-full">
            <select
              className="w-1/2 border p-2 rounded"
              value={education.endMonth}
              onChange={(e) => handleChange("endMonth", e.target.value)}
            >
              <option>Month</option>
              {months.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
            <select
              className="w-1/2 border p-2 rounded"
              value={education.endYear}
              onChange={(e) => handleChange("endYear", e.target.value)}
            >
              <option>Year</option>
              {years.map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          checked={education.present}
          onChange={() => handleChange("present", !education.present)}
        />
        <label className="text-sm">Present</label>
      </div>

      <div className="mb-4 w-full">
        <label className="block text-sm font-semibold mb-1">Description</label>
        <textarea
          className="w-full border border-gray-300 p-2 rounded resize-none"
          rows="4"
          placeholder="Start typing here..."
          value={education.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={onDelete}
          className="text-red-600 border border-red-600 rounded px-3 py-1 text-sm hover:bg-red-50"
        >
          🗑 Delete
        </button>
        <button
          onClick={onDone}
          className="bg-purple-600 text-white px-4 py-1 rounded text-sm hover:bg-purple-700"
        >
          ✓ Done
        </button>
      </div>
    </div>
  );
};

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const years = Array.from({ length: 50 }, (_, i) => 2025 - i);

export default EducationForm;
