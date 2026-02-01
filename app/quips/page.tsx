"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Megaphone } from "lucide-react"
import { useAuth } from "@/lib/hooks/useAuth"
import { QuipList } from "@/components/quips/QuipList"
import { RespondModal } from "@/components/quips/RespondModal"
import { getQuipsFromMock, submitQuipResponse } from "@/lib/api"
import type { Quip, QuipResponse } from "@/types"

/**
 * Helper to get responded quip IDs from localStorage
 */
function getRespondedQuipIds(userId: string): Set<string> {
  if (typeof window === "undefined") return new Set()
  try {
    const key = `quibi_quip_responses_${userId}`
    const stored = localStorage.getItem(key)
    if (stored) {
      return new Set(JSON.parse(stored))
    }
  } catch (error) {
    console.error("Failed to read responded quips from localStorage:", error)
  }
  return new Set()
}

/**
 * Helper to save responded quip ID to localStorage
 */
function saveRespondedQuipId(userId: string, quipId: string): void {
  if (typeof window === "undefined") return
  try {
    const key = `quibi_quip_responses_${userId}`
    const responded = getRespondedQuipIds(userId)
    responded.add(quipId)
    localStorage.setItem(key, JSON.stringify(Array.from(responded)))
  } catch (error) {
    console.error("Failed to save responded quip to localStorage:", error)
  }
}

export default function QuipsPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [quips, setQuips] = useState<Quip[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedQuip, setSelectedQuip] = useState<Quip | null>(null)
  const [respondModalOpen, setRespondModalOpen] = useState(false)
  const [respondedQuipIds, setRespondedQuipIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading && !user) {
      router.push("/login")
    }
  }, [mounted, isLoading, user, router])

  // Load responded quips from localStorage
  useEffect(() => {
    if (user) {
      setRespondedQuipIds(getRespondedQuipIds(user.id))
    }
  }, [user])

  // Fetch quips
  const fetchQuips = useCallback(async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const data = await getQuipsFromMock()
      // Filter to only active quips for users
      const activeQuips = data.filter(q => q.status === "active")
      setQuips(activeQuips)
    } catch (error) {
      console.error("Failed to fetch quips:", error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (mounted && !isLoading && user) {
      fetchQuips()
    }
  }, [mounted, isLoading, user, fetchQuips])

  const handleRespond = (quip: Quip) => {
    setSelectedQuip(quip)
    setRespondModalOpen(true)
  }

  const handleSubmitResponse = async (
    newResponse: Omit<QuipResponse, "id" | "created_at">
  ) => {
    if (!user) return

    try {
      await submitQuipResponse(newResponse)
      // Save to localStorage
      saveRespondedQuipId(user.id, newResponse.quip_id)
      setRespondedQuipIds(prev => new Set([...prev, newResponse.quip_id]))
      // Refresh quips to update response counts
      await fetchQuips()
    } catch (error) {
      console.error("Failed to submit response:", error)
      throw error
    }
  }

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Megaphone className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Open Quips</h1>
              <p className="text-muted-foreground">
                Share your anonymous feedback on these topics.
              </p>
            </div>
          </div>
          <Button variant="outline" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="h-8 w-48 animate-pulse rounded bg-muted mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Loading quips...</p>
          </div>
        ) : (
          <QuipList
            quips={quips}
            variant="employee"
            respondedQuipIds={respondedQuipIds}
            onRespond={handleRespond}
            emptyMessage="No open quips right now."
          />
        )}
      </div>

      <RespondModal
        open={respondModalOpen}
        onOpenChange={setRespondModalOpen}
        quip={selectedQuip}
        defaultDepartment={user.team}
        onSubmit={handleSubmitResponse}
      />
    </div>
  )
}
