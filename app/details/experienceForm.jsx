import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';
import { toast } from 'react-toastify';

const ExperienceForm = ({ nextStep, thisStep, skipStep, userId }) => {
  const [experienceData, setExperienceData] = useState({
    userId: userId,
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const handleInputChange = (e) => {
    setExperienceData({ ...experienceData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    const currentDate = new Date();

    if (!experienceData.company.trim()) newErrors.company = "Company name is required.";
    if (!experienceData.position.trim()) newErrors.position = "Position is required.";
    if (!experienceData.startDate) {
      newErrors.startDate = "Start date is required.";
    } else if (new Date(experienceData.startDate) > currentDate) {
      newErrors.startDate = "Start date cannot be in the future.";
    }
    if (experienceData.endDate) {
      if (new Date(experienceData.endDate) < new Date(experienceData.startDate)) {
        newErrors.endDate = "End date cannot be before start date.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitExperienceData = async (redirectAfterSubmit) => {
    if (!validateForm()) return;
    const token = localStorage.getItem("authToken");
    

    if (!token) {
      console.error("No token found. User might not be logged in.");
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/experience`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(experienceData),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success("Experience added successfully!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        if (redirectAfterSubmit) {
          nextStep(); 
          window.location.href = "/dashboard";
        } else {
          
          
          setExperienceData({ 
            userId: userId,
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: ''
          });
          thisStep(); 
        }
        setLoading(false);
        
      } else {
        toast.error(data.message || "Failed to add experience.", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleSkip = () => {
    skipStep();

    window.location.href = "/dashboard"; 
  };

 

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg  border border-gray-200">
      <h2 className="text-4xl font-bold mb-6 text-[#591B0C]">Experience Details</h2>
      <div className="mb-6 bg-[#ffefdb]  p-4">
        <div className="w-full bg-[#ffdbb5] rounded-full h-2.5">
          <div className="bg-[#591B0C] h-2.5 rounded-full" style={{ width: '100%' }}></div>
        </div>
        <p className="text-center text-sm mt-2 text-[#591B0C]">Step 4 of 4: Experience Information</p>
      </div>
      <form  className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Company
              <input
                type="text"
                name="company"
                value={experienceData.company}
                onChange={handleInputChange}
                className="mt-1 block w-full h-9  border-[#591B0C] border-2 shadow-sm focus:border-[#ff3003] focus:ring-[#ff3003] sm:text-sm"
                required
              />
            </label>
            {errors.company && <p className="mt-1 text-sm text-red-600">{errors.company}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Position
              <input
                type="text"
                name="position"
                value={experienceData.position}
                onChange={handleInputChange}
                className="mt-1 block w-full h-9  border-[#591B0C] border-2 shadow-sm focus:border-[#ff3003] focus:ring-[#ff3003] sm:text-sm"
                required
              />
            </label>
            {errors.position && <p className="mt-1 text-sm text-red-600">{errors.position}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date
              <input
                type="date"
                name="startDate"
                value={experienceData.startDate}
                onChange={handleInputChange}
                className="mt-1 block w-full h-9  border-[#591B0C] border-2 shadow-sm focus:border-[#ff3003] focus:ring-[#ff3003] sm:text-sm"
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
                value={experienceData.endDate}
                onChange={handleInputChange}
                className="mt-1 block w-full h-9  border-[#591B0C] border-2 shadow-sm focus:border-[#ff3003] focus:ring-[#ff3003] sm:text-sm"
              />
            </label>
            {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
              <textarea
                name="description"
                value={experienceData.description}
                onChange={handleInputChange}
                className="mt-1 block w-full h-9  border-[#591B0C] border-2 shadow-sm focus:border-[#ff3003] focus:ring-[#ff3003] sm:text-sm"
              />
            </label>
          </div>
        </div>
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={handleSkip}
            className="px-4 py-2 border border-[#591B0C]  text-sm font-medium text-[#591B0C] hover:bg-[#ffefdb] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff3003]"
          >
            Skip for Now
          </button>
          <div className='flex  justify-between w-[24%]'>
          <button
            type="button"
            onClick={() => submitExperienceData(false)}
            className="px-6 py-2 border border-transparent  shadow-sm text-sm font-medium text-white bg-[#591B0C] hover:bg-[#ff3003] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff3003]"
          >
           {loading ? "Saving..." : "Add More"}
          </button>
          <button
            type="submit"
            onClick={() => submitExperienceData(true)}
            className="px-6 py-2 border border-transparent  shadow-sm text-sm font-medium text-white bg-[#591B0C] hover:bg-[#ff3003] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff3003]"
          >
           {loading ? "Saving..." : "Next"}
          </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ExperienceForm;

