"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import 'tailwindcss/tailwind.css'; 

const RegisterForm = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    const userData = { email, password, username }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem("authToken", data.token)
        setMessage("Registration successful! Redirecting...")
        setTimeout(() => {
          window.location.href = "/details"
        }, 2000)
      } else {
        setMessage(data.message || "Registration failed.")
      }
    } catch (error) {
      console.error("Registration error:", error)
      setMessage("Error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg  border border-gray-200">
      <h2 className="text-4xl font-bold mb-6 text-[#591B0C]">Create your account</h2>
      <div className="mb-6 bg-[#ffefdb]  p-4">
        <div className="w-full bg-[#ffdbb5] rounded-full h-2.5">
          <div className="bg-[#591B0C] h-2.5 rounded-full" style={{ width: '25%' }}></div>
        </div>
        <p className="text-center text-sm mt-2 text-[#591B0C]">Step 1 of 4: Account Information</p>
      </div>
      <form onSubmit={handleRegister} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
              <input
                id="username"
                name="username"
                type="text"
                required
                className="mt-1 block w-full h-9  border-[#591B0C] border-2 shadow-sm focus:border-[#ff3003] focus:ring-[#ff3003] sm:text-sm"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full h-9  border-[#591B0C] border-2 shadow-sm focus:border-[#ff3003] focus:ring-[#ff3003] sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 block w-full h-9  border-[#591B0C] border-2 shadow-sm focus:border-[#ff3003] focus:ring-[#ff3003] sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </div>
        </div>
        <div className="flex justify-between mt-8">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 border border-transparent shadow-sm text-sm font-medium text-white bg-[#591B0C] hover:bg-[#ff3003] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff3003]"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </div>
      </form>
      {message && (
        <div
          className={`mt-4 text-center text-sm ${message.includes("successful") ? "text-green-600" : "text-red-600"}`}
        >
          {message}
        </div>
      )}
    </div>
  )
}

export default RegisterForm
