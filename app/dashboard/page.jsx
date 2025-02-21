"use client"

import { useState } from "react"
import { Home, Users, UserCircle } from "lucide-react"
import HomeComponent from "../components/dashboard/HomeComponent"
import ProfilesComponent from "../components/dashboard/ProfilesComponent"
import MyProfileComponent from "../components/dashboard/MyProfileComponent"
import Footer from "../components/footer"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("home")

  const tabs = [
    {
      id: "home",
      label: "Home",
      icon: Home,
    },
    {
      id: "profiles",
      label: "Profiles",
      icon: Users,
    },
    {
      id: "my-profile",
      label: "My Profile",
      icon: UserCircle,
    },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <HomeComponent />
      case "profiles":
        return <ProfilesComponent />
      case "my-profile":
        return <MyProfileComponent />
      default:
        return <HomeComponent />
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 flex flex-wrap justify-between text-[#591B0C] ">
      
      <div className="flex w-full items-center md:w-1/4 lg:w-1/4 mb-8 border-b-2 text-[#591B0C] border-[#591B0C]">
        <div className=" text-center text-4xl font-bold">AdvocateInfo</div>
      </div>

      <div className="w-full md:w-3/4 lg:w-3/4 mb-8 border-b-2 text-[#591B0C] border-[#591B0C] flex flex-wrap justify-end">
        <div className="flex flex-wrap justify-end space-x-4 md:space-x-8 lg:space-x-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-semibold text-md transition-colors ${
                activeTab === tab.id
                  ? "border-[#591B0C] text-[#591B0C]"
                  : "border-transparent text-gray-600 hover:text-[#591B0C] hover:border-[#591B0C]"
              }`}
            >
              <tab.icon className="w-5 h-5  text-[#591B0C]" />
              <span className="text-lg">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      
      <div className="min-h-screen w-full">{renderContent()}</div>
      <Footer/>
    </div>
    
  )
}

