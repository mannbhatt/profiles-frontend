"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import ProfileCard from "../ProfileCard"

export default function ProfilesComponent() {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAllProfiles, setShowAllProfiles] = useState(true)

  useEffect(() => {
    fetchProfiles()
  }, [])

  const fetchProfiles = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch profiles")
      }

      const data = await response.json()
      setProfiles(data.profiles)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredProfiles =
    profiles && Array.isArray(profiles)
      ? profiles.filter(
          (profile) =>
            profile.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            profile.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            profile.expertise?.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      : []

  const handleSearch = () => {
    if (searchTerm === "") {
      setShowAllProfiles(true)
    } else {
      setShowAllProfiles(false)
    }
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error: {error}</p>
        <button
          onClick={fetchProfiles}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profiles</h1>
        <p className="mt-2 text-gray-600">Browse and discover amazing profiles</p>
      </div>

      
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search profiles..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onBlur={handleSearch}
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md h-64 animate-pulse">
              <div className="h-32 bg-gray-200 rounded-t-lg" />
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {showAllProfiles ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {profiles.map((profile) => (
                <ProfileCard key={profile._id} profile={profile} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProfiles.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No profiles found</p>
                </div>
              ) : (
                filteredProfiles.map((profile) => <ProfileCard key={profile._id} profile={profile} />)
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

