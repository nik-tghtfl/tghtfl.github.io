"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Shield, BarChart3, Megaphone } from "lucide-react"
import { useAuth } from "@/lib/hooks/useAuth"
import { QuipList } from "@/components/quips/QuipList"
import { RespondModal } from "@/components/quips/RespondModal"
import { getQuipsFromSheet, submitQuipResponse } from "@/lib/api"
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

/**
 * Helper to clear all quip responses from localStorage
 * This resets the status so users can submit responses again
 */
function clearAllQuipResponses(): void {
  if (typeof window === "undefined") return
  try {
    // Clear all localStorage keys that match the quip response pattern
    const keysToRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('quibi_quip_responses_')) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key))
    console.log(`Cleared ${keysToRemove.length} quip response records`)
  } catch (error) {
    console.error("Failed to clear quip responses from localStorage:", error)
  }
}

// Expose clear function to window for easy access in browser console
if (typeof window !== "undefined") {
  (window as any).clearQuipResponses = clearAllQuipResponses
}

export default function HomePage() {
  const { user, isLoading, isAdmin } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [quips, setQuips] = useState<Quip[]>([])
  const [selectedQuip, setSelectedQuip] = useState<Quip | null>(null)
  const [respondModalOpen, setRespondModalOpen] = useState(false)
  const [respondedQuipIds, setRespondedQuipIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    setMounted(true)
  }, [])

  // Load responded quips from localStorage
  useEffect(() => {
    if (user) {
      setRespondedQuipIds(getRespondedQuipIds(user.id))
    }
  }, [user])

  // Fetch quips
  const fetchQuips = useCallback(async () => {
    if (!user) return
    try {
      const data = await getQuipsFromSheet()
      // Filter to only active quips for users
      const activeQuips = data.filter(q => q.status === "active")
      setQuips(activeQuips)
    } catch (error) {
      console.error("Failed to fetch quips:", error)
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

  // Show default button during loading to avoid layout shift
  const showDashboardButton = mounted && !isLoading && isAdmin

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Welcome to <span className="text-primary">Quippi</span>
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Your voice matters. Share your feedback anonymously.
        </p>
        <p className="mx-auto mt-6 max-w-2xl text-muted-foreground leading-relaxed">
          Quippi is a safe space for employees to share honest feedback without
          fear of judgment. Our AI automatically categorizes your input, helping
          leaders understand what matters most to their teams.
        </p>
        <div className="mt-8">
          {showDashboardButton ? (
            <Button asChild size="lg" className="rounded-lg px-8 py-6 text-lg">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <Button asChild size="lg" className="rounded-lg px-8 py-6 text-lg">
              <Link href="/feedback">Submit Feedback</Link>
            </Button>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto mt-20 max-w-4xl">
        <div className="grid gap-6 sm:grid-cols-3">
          <Card className="border-border bg-card transition-transform duration-200 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10">
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">Anonymous</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Your identity is never revealed
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card transition-transform duration-200 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10">
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">
                AI-Categorized
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Feedback is automatically organized
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card transition-transform duration-200 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10">
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">Insights</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Leaders see aggregated trends
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quips Section */}
      {user && (
        <section className="mx-auto mt-20 max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Megaphone className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Open Quips</h2>
                <p className="text-muted-foreground">
                  Share your anonymous feedback on these topics.
                </p>
              </div>
            </div>
            {quips.length > 0 && (
              <Button variant="outline" asChild>
                <Link href="/quips">View All Quips</Link>
              </Button>
            )}
          </div>

          {quips.length === 0 ? (
            <Card className="border-dashed border-2 border-border bg-muted/30">
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <Megaphone className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium text-muted-foreground">
                  No Open Quips
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Check back later for new feedback opportunities.
                </p>
              </CardContent>
            </Card>
          ) : (
            <QuipList
              quips={quips.slice(0, 3)}
              variant="employee"
              respondedQuipIds={respondedQuipIds}
              onRespond={handleRespond}
              emptyMessage="No open quips right now."
            />
          )}
        </section>
      )}

      {/* Placeholder for non-authenticated users */}
      {!user && (
        <section className="mx-auto mt-20 max-w-3xl">
          <Card className="border-dashed border-2 border-border bg-muted/30">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium text-muted-foreground">
                Open Feedback Programs
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Active feedback programs will be displayed here.
              </p>
            </CardContent>
          </Card>
        </section>
      )}

      <RespondModal
        open={respondModalOpen}
        onOpenChange={setRespondModalOpen}
        quip={selectedQuip}
        defaultDepartment={user?.team || ""}
        onSubmit={handleSubmitResponse}
      />
    </div>
  )
}
