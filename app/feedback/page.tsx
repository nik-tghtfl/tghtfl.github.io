"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { FeedbackForm } from "@/components/feedback-form"
import { useAuth } from "@/lib/hooks/useAuth"

export default function FeedbackPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading && !user) {
      router.push("/login")
    }
  }, [mounted, isLoading, user, router])

  // Show loading state while checking auth
  if (!mounted || isLoading || !user) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-12">
        <div className="text-center">
          <div className="h-8 w-48 animate-pulse rounded bg-muted mx-auto mb-4" />
          <div className="h-4 w-32 animate-pulse rounded bg-muted mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <Button
          variant="ghost"
          asChild
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Submit Feedback
        </h1>
        <p className="mt-2 text-muted-foreground">
          Share your thoughts, concerns, or suggestions anonymously.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Submitting as: <span className="font-medium text-foreground">{user.displayName}</span>
        </p>

        <div className="mt-8">
          <FeedbackForm user={user} />
        </div>
      </div>
    </div>
  )
}
