import React, { useRef } from "react";
export default function ResumePreview({ data }) {
  const { personalDetails, profile, education, experience, skills, hobbies } = data;



  return (
    <div className="w-full">

      <div className="flex flex-col md:flex-row text-sm font-sans bg-white shadow-md m-4">
        {/* Left section */}
        <div className="w-full md:w-2/3 p-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-1">{personalDetails.name}</h1>
          <p className="text-sm text-gray-600 mb-4">{personalDetails.email} | {personalDetails.phone} | {personalDetails.location}</p>

          {/* Profile */}
          <section className="mb-4">
            <h2 className="text-lg font-semibold text-blue-700 mb-1">Profile</h2>
            <p>{profile}</p>
          </section>

          {/* Education */}
          <section className="mb-4">
            <h2 className="text-lg font-semibold text-blue-700 mb-1">Education</h2>
            {education.map((edu, index) => (
              <div key={index} className="flex justify-between mb-2">
                <div>
                  <b>{edu.degree}</b>
                  {edu.institution && <div>{edu.institution}</div>}
                </div>
                <span className="text-gray-500">{edu.duration}</span>
              </div>
            ))}
          </section>

          {/* Employment */}
          <section>
            <h2 className="text-lg font-semibold text-blue-700 mb-1">Employment</h2>
            {experience.map((job, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between">
                  <b>{job.position}</b>
                  <span className="text-gray-500">{job.duration}</span>
                </div>
                <div className="italic text-sm text-gray-600 mb-1">{job.company}, {job.location}</div>
                <ul className="list-disc list-inside text-gray-700">
                  {job.tasks.map((task, i) => <li key={i}>{task}</li>)}
                </ul>
              </div>
            ))}
          </section>
        </div>

        {/* Right section */}
        <div className="w-full md:w-1/3 p-6 bg-gray-100">
          {/* Personal details */}
          <section className="mb-6">
            <h3 className="text-md font-semibold mb-2">Personal details</h3>
            <p>Nationality: {personalDetails.nationality}</p>
            <p>GitHub: <a className="text-blue-700" href={personalDetails.github}>{personalDetails.github}</a></p>
            <p>LinkedIn: <a className="text-blue-700" href={personalDetails.linkedin}>{personalDetails.linkedin}</a></p>
          </section>

          {/* Skills */}
          <section className="mb-6">
            <h3 className="text-md font-semibold mb-2">Skills</h3>
            <ul className="list-disc list-inside text-gray-800">
              {skills.map((skill, index) => <li key={index}>{skill}</li>)}
            </ul>
          </section>

          {/* Hobbies */}
          <section>
            <h3 className="text-md font-semibold mb-2">Hobbies</h3>
            <ul className="list-disc list-inside text-gray-800">
              {hobbies.map((hobby, index) => <li key={index}>{hobby}</li>)}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
