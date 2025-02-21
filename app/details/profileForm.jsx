"use client"
import React, { useState,useEffect } from 'react';
import 'tailwindcss/tailwind.css';



const ProfileForm = ({ nextStep, skipStep, userId }) => {
  
 
  const [profileData, setProfileData] = useState({
    userId: userId,
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    profileImage: '',
    bio: ''
  });
  
  useEffect(() => {
    if (userId) {
      setProfileData(prev => ({ ...prev, userId }));
    }
  }, [userId]);

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'fullName':
        if (value.length < 2) error = 'Full name must be at least 2 characters long';
        break;
      case 'email':
        if (!/\S+@\S+\.\S+/.test(value)) error = 'Invalid email';
        break;
      case 'phone':
        if (!/^\d{10,}$/.test(value)) error = 'Phone must be at least 10 digits';
        break;
      case 'dateOfBirth':
        if (!value) error = 'Date of birth is required';
        break;
      case 'gender':
        if (!value) error = 'Select a gender';
        break;
      case 'bio':
        if (value.length > 500) error = 'Bio must be 500 characters or less';
        break;
      default:
        break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };
 

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    
   const token = localStorage.getItem("authToken");
  
    
  
    if (!token) {
      console.error("No token found. User might not be logged in.");
      return;
    }
  
    if (Object.values(errors).some(error => error)) return;
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(profileData),
      });
  
      const responseData = await response.json(); 
  
      if (response.ok) {
        
        nextStep();
      } else {
        console.error("Profile creation failed:", responseData);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg  border border-gray-200">
      
      <h2 className="text-4xl font-bold mb-6 text-[#591B0C]">Create Your Profile</h2>
      <div className="mb-6 bg-[#ffefdb] p-4">
        <div className="w-full bg-[#ffdbb5] rounded-full h-2.5">
          <div className="bg-[#591B0C] h-2.5 rounded-full" style={{ width: '50%' }}></div>
        </div>
        <p className="text-center text-sm mt-2 text-[#591B0C]">Step 2 of 4: Personal Information</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
              <input
                type="text"
                name="fullName"
                value={profileData.fullName}
                onChange={handleInputChange}
                className="mt-1 block w-full h-9 border-[#591B0C] border-2 shadow-sm focus:border-[#ff3003] focus:ring-[#ff3003] sm:text-sm"
                required
              />
            </label>
            {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full h-9  border-[#591B0C] border-2 shadow-sm focus:border-[#ff3003] focus:ring-[#ff3003] sm:text-sm"
                required
              />
            </label>
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleInputChange}
                className="mt-1 block w-full h-9  border-[#591B0C] border-2 shadow-sm focus:border-[#ff3003] focus:ring-[#ff3003] sm:text-sm"
                required
              />
            </label>
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date of Birth
              <input
                type="date"
                name="dateOfBirth"
                value={profileData.dateOfBirth}
                onChange={handleInputChange}
                className="mt-1 block w-full h-9  border-[#591B0C] border-2 shadow-sm focus:border-[#ff3003] focus:ring-[#ff3003] sm:text-sm"
                required
              />
            </label>
            {errors.dateOfBirth && <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          <div className="flex space-x-4">
            {['Male', 'Female', 'Other'].map((gender) => (
              <label key={gender} className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="gender"
                  value={gender}
                  checked={profileData.gender === gender}
                  onChange={handleInputChange}
                  className=" border-[#591B0C] border-2 text-[#591B0C] shadow-sm focus:border-[#ff3003] focus:ring focus:ring-[#ff3003] focus:ring-opacity-50 accent-[#ff3003]"
                />
                <span className="ml-2 text-gray-700">{gender}</span>
              </label>
            ))}
          </div>
          {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Profile Image URL
            <input
              type="text"
              name="profileImage"
              value={profileData.profileImage}
              onChange={handleInputChange}
              className="mt-1 block w-full h-9  border-[#591B0C] border-2 shadow-sm focus:border-[#ff3003] focus:ring-[#ff3003] sm:text-sm"
            />
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Bio
            <textarea
              name="bio"
              value={profileData.bio}
              onChange={handleInputChange}
              rows="4"
              className="mt-1 block w-full h-9  border-[#591B0C] border-2 shadow-sm focus:border-[#ff3003] focus:ring-[#ff3003] sm:text-sm"
            />
          </label>
          {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio}</p>}
        </div>
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={skipStep}
            className="px-4 py-2 border border-[#591B0C]  text-sm font-medium text-[#591B0C] hover:bg-[#ffefdb] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff3003]"
          >
            Skip for Now
          </button>
          <button
            type="submit"
            className="px-6 py-2 border border-transparent  shadow-sm text-sm font-medium text-white bg-[#591B0C] hover:bg-[#ff3003] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff3003]"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
