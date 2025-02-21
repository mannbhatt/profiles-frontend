"use client"

import { useState } from "react"
import 'tailwindcss/tailwind.css';

const EducationForm = ({ nextStep, thisStep, skipStep, userId }) => {
  const [educationData, setEducationData] = useState({
    userId: userId,
    institution: "",
    degree: "",
    startDate: "",
    endDate: "",
    grade: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setEducationData({ ...educationData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    const currentDate = new Date();

    if (!educationData.institution.trim()) newErrors.institution = "Institution name is required.";
    if (!educationData.degree.trim()) newErrors.degree = "Degree is required.";
    if (!educationData.startDate) {
      newErrors.startDate = "Start date is required.";
    } else if (new Date(educationData.startDate) > currentDate) {
      newErrors.startDate = "Start date cannot be in the future.";
    }
    if (educationData.endDate) {
      if (new Date(educationData.endDate) < new Date(educationData.startDate)) {
        newErrors.endDate = "End date cannot be before start date.";
      }
    }
    if (educationData.grade && !/^[0-9]\.[0-9]$|^[0-4]\.00$/.test(educationData.grade)) {
      newErrors.grade = "Grade should be in the format 0.0 to 4.0";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitEducationData = async (redirectAfterSubmit) => {
    if (!validateForm()) return;

    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("No token found. User might not be logged in.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/education`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(educationData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Education added successfully!");
        
        if (redirectAfterSubmit) {
          nextStep();
        } else {
          
          
          setEducationData({ 
            userId: userId,
            institution: "",
            degree: "",
            startDate: "",
            endDate: "",
            grade: "",
          });
          thisStep(); 
        }
      } else {
        alert(data.message || "Failed to add education.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg border border-gray-200">
      <h2 className="text-4xl font-bold mb-6 text-[#591B0C]">Education Details</h2>
      <div className="mb-6 bg-[#ffefdb] p-4">
        <div className="w-full bg-[#ffdbb5] rounded-full h-2.5">
          <div className="bg-[#591B0C] h-2.5 rounded-full" style={{ width: '75%' }}></div>
        </div>
        <p className="text-center text-sm mt-2 text-[#591B0C]">Step 3 of 4: Education Information</p>
      </div>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Institution
              <input
                type="text"
                name="institution"
                value={educationData.institution}
                onChange={handleInputChange}
                className="mt-1 block w-full h-9 border-[#591B0C] border-2 shadow-sm focus:border-[#ff3003] focus:ring-[#ff3003] sm:text-sm"
                required
              />
            </label>
            {errors.institution && <p className="mt-1 text-sm text-red-600">{errors.institution}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Degree
              <input
                type="text"
                name="degree"
                value={educationData.degree}
                onChange={handleInputChange}
                className="mt-1 block w-full h-9 border-[#591B0C] border-2 shadow-sm focus:border-[#ff3003] focus:ring-[#ff3003] sm:text-sm"
                required
              />
            </label>
            {errors.degree && <p className="mt-1 text-sm text-red-600">{errors.degree}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date
              <input
                type="date"
                name="startDate"
                value={educationData.startDate}
                onChange={handleInputChange}
                className="mt-1 block w-full h-9 border-[#591B0C] border-2 shadow-sm focus:border-[#ff3003] focus:ring-[#ff3003] sm:text-sm"
                required
              />
            </label>
            {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              End Date (or expected)
              <input
                type="date"
                name="endDate"
                value={educationData.endDate}
                onChange={handleInputChange}
                className="mt-1 block w-full h-9 border-[#591B0C] border-2 shadow-sm focus:border-[#ff3003] focus:ring-[#ff3003] sm:text-sm"
              />
            </label>
            {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Grade (GPA)
              <input
                type="text"
                name="grade"
                value={educationData.grade}
                onChange={handleInputChange}
                className="mt-1 block w-full h-9 border-[#591B0C] border-2 shadow-sm focus:border-[#ff3003] focus:ring-[#ff3003] sm:text-sm"
              />
            </label>
            {errors.grade && <p className="mt-1 text-sm text-red-600">{errors.grade}</p>}
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={skipStep}
            className="px-6 py-2 border border-transparent  shadow-sm text-sm font-medium text-white bg-[#591B0C] hover:bg-[#ff3003] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff3003]"
          >
            Skip for Now
          </button>
          <div className="flex justify-between w-[24%]">
            <button 
              type="button" 
              onClick={() => submitEducationData(false)} 
              className="px-6 py-2 border border-transparent  shadow-sm text-sm font-medium text-white bg-[#591B0C] hover:bg-[#ff3003] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff3003]"
              disabled={loading}
            >
              {loading ? "Saving..." : "Add More"}
            </button>
            <button 
              type="button" 
              onClick={() => submitEducationData(true)} 
              className="px-6 py-2 border border-transparent  shadow-sm text-sm font-medium text-white bg-[#591B0C] hover:bg-[#ff3003] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff3003]"
              disabled={loading}
            >
              {loading ? "Saving..." : "Next"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EducationForm;
