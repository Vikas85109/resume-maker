import React, { useState } from "react";

const PersonalDetailsSection = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [details, setDetails] = useState({
    givenName: "",
    familyName: "",
    jobTitle: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postcode: "",
    nationality: "",
    website: "",
    linkedin: "",
  });

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  return (
   <div className=" space-y-4">
          {/* Photo and Name Row */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* <div className="w-full sm:w-1/4 bg-gray-100 flex items-center justify-center h-28 rounded">Photo</div> */}
            <div className="w-full flex gap-4">
              <input
                type="text"
                name="givenName"
                placeholder="Given name"
                className="w-1/2 border p-2 rounded"
                value={details.givenName}
                onChange={handleChange}
              />
              <input
                type="text"
                name="familyName"
                placeholder="Family name"
                className="w-1/2 border p-2 rounded"
                value={details.familyName}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Job Title */}
          <input
            type="text"
            name="jobTitle"
            placeholder="Desired job position"
            className="w-full border p-2 rounded"
            value={details.jobTitle}
            onChange={handleChange}
          />

          {/* Email & Phone */}
          <div className="flex gap-4">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              className="w-1/2 border p-2 rounded"
              value={details.email}
              onChange={handleChange}
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone number"
              className="w-1/2 border p-2 rounded"
              value={details.phone}
              onChange={handleChange}
            />
          </div>

          {/* Address */}
          <input
            type="text"
            name="address"
            placeholder="Address"
            className="w-full border p-2 rounded"
            value={details.address}
            onChange={handleChange}
          />

          {/* Postcode & City */}
          <div className="flex gap-4">
            <input
              type="text"
              name="postcode"
              placeholder="Post code"
              className="w-1/2 border p-2 rounded"
              value={details.postcode}
              onChange={handleChange}
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              className="w-1/2 border p-2 rounded"
              value={details.city}
              onChange={handleChange}
            />
          </div>

          {/* Nationality */}
          <input
            type="text"
            name="nationality"
            placeholder="Nationality"
            className="w-full border p-2 rounded"
            value={details.nationality}
            onChange={handleChange}
          />

          {/* Website & LinkedIn */}
          <div className="flex gap-4">
            <input
              type="text"
              name="website"
              placeholder="Website"
              className="w-1/2 border p-2 rounded"
              value={details.website}
              onChange={handleChange}
            />
            <input
              type="text"
              name="linkedin"
              placeholder="LinkedIn"
              className="w-1/2 border p-2 rounded"
              value={details.linkedin}
              onChange={handleChange}
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-2 pt-2">
            {[
              "Date of birth",
              "Place of birth",
              "Driver's license",
              "Gender",
              "Civil status",
              "Custom field",
            ].map((label) => (
              <button
                key={label}
                className="text-sm border border-gray-300 px-3 py-1 rounded bg-white hover:bg-gray-100"
              >
                + {label}
              </button>
            ))}
          </div>
    </div>
     
   
  );
};

export default PersonalDetailsSection;
