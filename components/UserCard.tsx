"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import type { User } from "@/lib/types"
import { Edit, Trash2, Mail, UserIcon } from "lucide-react"

interface UserCardProps {
  user: User
  onEdit: () => void
  onDelete: () => void
}

export default function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="p-6">
        <div className="flex items-center space-x-4">
          <div className="relative flex-shrink-0 h-16 w-16">
            <Image
              src={user.avatar || "/placeholder.svg"}
              alt={`${user.first_name} ${user.last_name}`}
              width={64}
              height={64}
              className="rounded-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-900 truncate">
              {user.first_name} {user.last_name}
            </h2>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <Mail className="h-4 w-4 mr-1" />
              <p className="truncate">{user.email}</p>
            </div>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <UserIcon className="h-4 w-4 mr-1" />
              <p>User ID: {user.id}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 bg-gray-50 px-6 py-3 flex justify-between">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEdit}
          className="inline-flex items-center px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition-colors"
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (window.confirm(`Are you sure you want to delete ${user.first_name} ${user.last_name}?`)) {
              onDelete()
            }
          }}
          className="inline-flex items-center px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </motion.button>
      </div>
    </motion.div>
  )
}

