"use client"

import { useState, useEffect } from "react"
import { Edit2, Save, X } from "lucide-react"
import Image from "next/image"

export default function MyProfileComponent() {
  const [profile, setProfile] = useState(null)
  const [education, setEducation] = useState([])
  const [experience, setExperience] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editMode, setEditMode] = useState({
    profile: false,
    education: false,
    experience: false,
  })

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null
      

      if (!token) throw new Error("User not authenticated")

      
      const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const profileData = profileRes.ok ? await profileRes.json() : null

     
      const eduRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/education`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const educationData = eduRes.ok ? await eduRes.json() : []

     
      const expRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/experience`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const experienceData = expRes.ok ? await expRes.json() : []

      
      setProfile(profileData.profile)
      setEducation(educationData.educationRecords)
      setExperience(experienceData.experiences
      )
      
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  };
 
  
  

  const handleSave = async (collection, data) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null
      if (!token) throw new Error("User not authenticated")

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${collection}/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error(`Failed to update ${collection}`)

      const updatedData = await response.json()


    
      if (collection === "profiles") {
        setProfile(updatedData)
      } else if (collection === "education") {
        setEducation(updatedData.updatedEducation)
      } else if (collection === "experience") {
        setExperience(updatedData.updatedExperience)
      }

      setEditMode((prev) => ({ ...prev, [collection]: false }))
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        {error}
        <button onClick={fetchUserData} className="ml-4 px-4 py-2 bg-primary text-white rounded-md">
          Retry
        </button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>

      
      <ProfileSection
        title="Personal Information"
        editMode={editMode.profile}
        onToggleEdit={() => setEditMode((prev) => ({ ...prev, profile: !prev.profile }))}
        ViewComponent={<ProfileView profile={profile} />}
        EditComponent={<ProfileEditForm profile={profile} onSave={(data) => handleSave("profiles", data)} />}
      />

     
      <ProfileSection
        title="Education"
        editMode={editMode.education}
        onToggleEdit={() => setEditMode((prev) => ({ ...prev, education: !prev.education }))}
        ViewComponent={<EducationView education={education} />}
        EditComponent={<EducationEditForm education={education} onSave={(data) => handleSave("education", data)} />}
      />

    
      <ProfileSection
        title="Experience"
        editMode={editMode.experience}
        onToggleEdit={() => setEditMode((prev) => ({ ...prev, experience: !prev.experience }))}
        ViewComponent={<ExperienceView experience={experience} />}
        EditComponent={<ExperienceEditForm experience={experience} onSave={(data) => handleSave("experience", data)} />}
      />
    </div>
  )
}


const ProfileSection = ({ title, editMode, onToggleEdit, ViewComponent, EditComponent }) => {
  return (
    <section className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
        <button onClick={onToggleEdit} className="flex items-center text-primary hover:text-primary-dark">
          {editMode ? <X className="w-5 h-5 mr-1" /> : <Edit2 className="w-5 h-5 mr-1" />}
          {editMode ? "Cancel" : "Edit"}
        </button>
      </div>
      {editMode ? EditComponent : ViewComponent}
    </section>
  )
}


const ProfileView = ({ profile }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="md:col-span-2 flex items-center space-x-4">
      <div className="relative w-24 h-24 rounded-full overflow-hidden">
        <Image
          src={profile.profileImage || "/placeholder.svg"}
          alt="Profile"
          width={96}
          height={96}
          className="object-cover"
        />
      </div>
      <div>
        <h3 className="text-xl font-semibold">{profile?.fullName || "N/A"}</h3>
        <p className="text-gray-600">{profile?.email || "N/A"}</p>
      </div>
    </div>
    <div>
      <p className="text-gray-600">Phone: {profile?.phone || "N/A"}</p>
      <p className="text-gray-600">Gender: {profile?.gender || "N/A"}</p>
    </div>
    <div>
      <p className="text-gray-600">
        Date of Birth: {profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : "N/A"}
      </p>
    </div>
    <div className="md:col-span-2">
      <p className="text-gray-600">Bio: {profile?.bio || "N/A"}</p>
    </div>
  </div>
)


const ProfileEditForm = ({ profile, onSave }) => {
  const [formState, setFormState] = useState(profile || {})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formState)
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input
          type="text"
          name="fullName"
          value={formState.fullName || ""}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formState.email || ""}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
        <input
          type="tel"
          name="phone"
          value={formState.phone || ""}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
        <select
          name="gender"
          value={formState.gender || ""}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
        <input
          type="date"
          name="dateOfBirth"
          value={formState.dateOfBirth ? new Date(formState.dateOfBirth).toISOString().split("T")[0] : ""}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image URL</label>
        <input
          type="url"
          name="profileImage"
          value={formState.profileImage || ""}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
        <textarea
          name="bio"
          value={formState.bio || ""}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="md:col-span-2 flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark flex items-center"
        >
          <Save className="w-5 h-5 mr-2" />
          Save Changes
        </button>
      </div>
    </form>
  )
}


const EducationView = ({ education }) => (
  <div className="space-y-6">
    {education.length > 0 ? (
      education.map((edu, index) => (
        <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
          <h3 className="text-lg font-semibold">{edu.degree}</h3>
          <p className="text-gray-600">{edu.institution}</p>
          <p className="text-gray-500">
            {edu.startDate} - {edu.endDate || "Present"}
          </p>
          {edu.grade && <p className="text-gray-600 mt-2">{edu.grade}</p>}
        </div>
      ))
    ) : (
      <p className="text-gray-500 text-center">No education history added yet.</p>
    )}
  </div>
)


const EducationEditForm = ({ education, onSave }) => {
  const [educationList, setEducationList] = useState(education || [])

  const handleAdd = () => {
    setEducationList([
      ...educationList,
      {
        degree: "",
        institution: "",
        startDate: "",
        endDate: "",
        grade: "",
      },
    ])
  }

  const handleChange = (index, field, value) => {
    const newList = [...educationList]
    newList[index][field] = value
    setEducationList(newList)
  }

  const handleRemove = (index) => {
    setEducationList(educationList.filter((_, i) => i !== index))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(educationList)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {educationList.map((edu, index) => (
        <div key={index} className="border p-4 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => handleChange(index, "degree", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
              <input
                type="text"
                value={edu.institution}
                onChange={(e) => handleChange(index, "institution", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={edu.startDate}
                onChange={(e) => handleChange(index, "startDate", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={edu.endDate}
                onChange={(e) => handleChange(index, "endDate", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Grade (GPA)</label>
              <input
              type="text"
                value={edu.grade}
                onChange={(e) => handleChange(index, "grade", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleRemove(index)}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Remove
          </button>
        </div>
      ))}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Add Education
        </button>

        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark flex items-center"
        >
          <Save className="w-5 h-5 mr-2" />
          Save Changes
        </button>
      </div>
    </form>
  )
}


const ExperienceView = ({ experience }) => (
  <div className="space-y-6">
    {experience.length > 0 ? (
      experience.map((exp, index) => (
        <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
          <h3 className="text-lg font-semibold">{exp.company}</h3>
          <p className="text-gray-600">{exp.position}</p>
          <p className="text-gray-500">
            {exp.startDate} - {exp.endDate || "Present"}
          </p>
          {exp.description && <p className="text-gray-600 mt-2">{exp.description}</p>}
        </div>
      ))
    ) : (
      <p className="text-gray-500 text-center">No experience history added yet.</p>
    )}
  </div>
)


const ExperienceEditForm = ({ experience, onSave }) => {
  const [experienceList, setExperienceList] = useState(experience || [])

  const handleAdd = () => {
    setExperienceList([
      ...experienceList,
      {
        position: "",
        company: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ])
  }

  const handleChange = (index, field, value) => {
    const newList = [...experienceList]
    newList[index][field] = value
    setExperienceList(newList)
  }

  const handleRemove = (index) => {
    setExperienceList(experienceList.filter((_, i) => i !== index))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(experienceList)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {experienceList.map((exp, index) => (
        <div key={index} className="border p-4 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => handleChange(index, "company", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
              <input
                type="text"
                value={exp.position}
                onChange={(e) => handleChange(index, "position", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={exp.startDate}
                onChange={(e) => handleChange(index, "startDate", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={exp.endDate}
                onChange={(e) => handleChange(index, "endDate", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={exp.description}
                onChange={(e) => handleChange(index, "description", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleRemove(index)}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Remove
          </button>
        </div>
      ))}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Add Experience
        </button>

        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark flex items-center"
        >
          <Save className="w-5 h-5 mr-2" />
          Save Changes
        </button>
      </div>
    </form>
  )
}

