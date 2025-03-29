"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import UserCard from "@/components/UserCard"
import Pagination from "@/components/Pagination"
import type { User } from "@/lib/types"
import { LogOut, Search, Plus, Users as UsersIcon } from 'lucide-react'

export default function Users() {
  const [apiUsers, setApiUsers] = useState<User[]>([])
  const [localUsers, setLocalUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [showDeleteMessage, setShowDeleteMessage] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    
    // Load local users from localStorage
    const loadLocalUsers = () => {
      const localUsersJSON = localStorage.getItem('localUsers')
      if (localUsersJSON) {
        try {
          const parsedUsers = JSON.parse(localUsersJSON)
          setLocalUsers(parsedUsers)
        } catch (e) {
          console.error("Error parsing local users:", e)
          localStorage.removeItem('localUsers') // Clear invalid data
        }
      }
    }
    
    loadLocalUsers()
    fetchUsers(currentPage)
  }, [currentPage, router])
 
  const fetchUsers = async (page: number) => {
    setLoading(true)
    try {
      const response = await fetch(`https://reqres.in/api/users?page=${page}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      
      const data = await response.json()
      setApiUsers(data.data)
      setTotalPages(data.total_pages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
  }

  const handleDeleteUser = async (id: number, name: string) => {
    try {
      // Check if it's a local user first
      const isLocalUser = localUsers.some(user => user.id === id)
      
      if (isLocalUser) {
        // Delete from local storage
        const updatedLocalUsers = localUsers.filter(user => user.id !== id)
        setLocalUsers(updatedLocalUsers)
        localStorage.setItem('localUsers', JSON.stringify(updatedLocalUsers))
      } else {
        // Delete from API
        const response = await fetch(`https://reqres.in/api/users/${id}`, {
          method: "DELETE",
        })
        
        if (!response.ok && response.status !== 204) {
          throw new Error("Failed to delete user")
        }
        
        // Remove user from the API users list
        setApiUsers(apiUsers.filter((user) => user.id !== id))
      }
      
      // Show success message
      setShowDeleteMessage(`${name} has been deleted successfully`)
      setTimeout(() => setShowDeleteMessage(null), 3000)
    } catch (err) {
      alert(err instanceof Error ? err.message : "An error occurred")
    }
  }

  // Combine API users and local users
  const allUsers = [...apiUsers, ...localUsers]
  
  const filteredUsers = allUsers.filter((user) => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase()
    return fullName.includes(searchTerm.toLowerCase()) || 
           user.email.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  if (loading && allUsers.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="text-center">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
            className="mx-auto w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-indigo-800 font-medium"
          >
            Loading users...
          </motion.p>
        </div>
      </div>
    )
  }

  if (error && allUsers.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-xl shadow-xl">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">{error}</h3>
            <p className="mt-2 text-sm text-gray-500">We couldn't load the users. Please try again.</p>
            <div className="mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fetchUsers(currentPage)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Try Again
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <AnimatePresence>
        {showDeleteMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 inset-x-0 mx-auto w-auto max-w-sm bg-green-50 border border-green-200 rounded-lg p-4 flex items-center shadow-lg"
            style={{ zIndex: 50 }}
          >
            <svg className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-green-800">{showDeleteMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center">
            <UsersIcon className="h-6 w-6 mr-2 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </motion.button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => router.push("/users/create")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </motion.button>
        </div>
        {filteredUsers.length === 0 && !loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white rounded-lg shadow-md"
          >
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? "Try adjusting your search term." : "Get started by adding a new user."}
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onDelete={() => handleDeleteUser(user.id, `${user.first_name} ${user.last_name}`)}
                onEdit={() => router.push(`/users/edit/${user.id}`)}
              />
            ))}
          </motion.div>
        )}
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </main>
    </div>
  )
}
