import React, { useState } from "react";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

export default function EmploymentSection() {
  const [employments, setEmployments] = useState([
    {
      position: "",
      employer: "",
      city: "",
      startMonth: "",
      startYear: "",
      endMonth: "",
      endYear: "",
      present: false,
      description: "",
      isOpen: true,
    },
  ]);

  const toggleAccordion = (index) => {
    setEmployments((prev) =>
      prev.map((item, i) => ({
        ...item,
        isOpen: i === index ? !item.isOpen : false,
      }))
    );
  };

  const handleChange = (index, field, value) => {
    const updated = [...employments];
    updated[index][field] = value;
    setEmployments(updated);
  };

  const handleAddEmployment = () => {
    setEmployments([
      ...employments,
      {
        position: "",
        employer: "",
        city: "",
        startMonth: "",
        startYear: "",
        endMonth: "",
        endYear: "",
        present: false,
        description: "",
        isOpen: true,
      },
    ]);
  };

  const handleDelete = (index) => {
    const updated = employments.filter((_, i) => i !== index);
    setEmployments(updated);
  };

  const handleDone = (index) => {
    const updated = [...employments];
    updated[index].isOpen = false;
    setEmployments(updated);
  };

  return (
    <div className="space-y-4">
     

      {employments.map((job, index) => (
        <div key={index} className="border rounded-md">
        

          {job.isOpen && (
            <div className="p-4 space-y-4">
              <input
                className="w-full border px-2 py-1 rounded"
                placeholder="Position"
                value={job.position}
                onChange={(e) => handleChange(index, "position", e.target.value)}
              />
              <div className="flex gap-2">
                <input
                  className="w-1/2 border px-2 py-1 rounded"
                  placeholder="Employer"
                  value={job.employer}
                  onChange={(e) => handleChange(index, "employer", e.target.value)}
                />
                <input
                  className="w-1/2 border px-2 py-1 rounded"
                  placeholder="City"
                  value={job.city}
                  onChange={(e) => handleChange(index, "city", e.target.value)}
                />
              </div>

              <div className="mb-4 w-full">
                <div className="block text-sm font-semibold mb-1">
                  <label>Start date</label>
                  <div className="flex gap-2">
                    <select
                      className="w-1/2 border p-2 rounded"
                      value={job.startMonth}
                      onChange={(e) => handleChange(index, "startMonth", e.target.value)}
                    >
                      <option>Month</option>
                      {months.map((month) => (
                        <option key={month}>{month}</option>
                      ))}
                    </select>
                    <select
                      className="w-1/2 border p-2 rounded"
                      value={job.startYear}
                      onChange={(e) => handleChange(index, "startYear", e.target.value)}
                    >
                      <option>Year</option>
                      {years.map((year) => (
                        <option key={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label>End date</label>
                  <div className="flex gap-2">
                    <select
                      className="w-1/2 border p-2 rounded"
                      value={job.endMonth}
                      onChange={(e) => handleChange(index, "endMonth", e.target.value)}
                      disabled={job.present}
                    >
                      <option>Month</option>
                      {months.map((month) => (
                        <option key={month}>{month}</option>
                      ))}
                    </select>
                    <select
                      className="w-1/2 border p-2 rounded"
                      value={job.endYear}
                      onChange={(e) => handleChange(index, "endYear", e.target.value)}
                      disabled={job.present}
                    >
                      <option>Year</option>
                      {years.map((year) => (
                        <option key={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <label className="flex items-center mt-5">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={job.present}
                    onChange={(e) => handleChange(index, "present", e.target.checked)}
                  />
                  Present
                </label>
              </div>

              <textarea
                className="w-full border px-2 py-1 rounded"
                placeholder="Start typing here..."
                rows={3}
                value={job.description}
                onChange={(e) => handleChange(index, "description", e.target.value)}
              />

              <div className="flex justify-end gap-2">
                <button
                  className="border px-3 py-1 rounded hover:bg-red-100"
                  onClick={() => handleDelete(index)}
                >
                  🗑️
                </button>
                <button
                  className="bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700"
                  onClick={() => handleDone(index)}
                >
                  ✓ Done
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={handleAddEmployment}
        className="border px-4 py-2 rounded hover:bg-gray-100"
      >
        + Add employment
      </button>
    </div>
  );
}
