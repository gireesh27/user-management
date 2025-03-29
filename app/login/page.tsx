"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Mail, Lock, Loader2, CheckCircle } from "lucide-react"
import LoginForm from "@/components/loginform"
export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      <Suspense fallback={
        <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-xl flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  )
}
