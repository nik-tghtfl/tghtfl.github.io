"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, MessageSquareText, RefreshCw, Network, Plus, Megaphone, RotateCcw } from "lucide-react"
import { useAuth } from "@/lib/hooks/useAuth"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { CategoryChart } from "@/components/dashboard/category-chart"
import { FilterChips } from "@/components/dashboard/filter-chips"
import { FeedbackList } from "@/components/dashboard/feedback-list"
import { 
  calculateStatsFromFeedbacks,
  calculateCategoryDistributionFromFeedbacks,
  convertFeedbackArray,
  type Feedback
} from "@/lib/data/feedbacks"
import { getFeedbacksFromSheet, getQuipsFromSheet, getQuipResponsesFromSheet, createQuipInMock, updateQuipStatus, sendDebugLog } from "@/lib/api"
import type { Category, FeedbackItem, DashboardStats, CategoryData, Quip, QuipResponse } from "@/types"
import { QuipList } from "@/components/quips/QuipList"
import { QuipDetail } from "@/components/quips/QuipDetail"
import { CreateQuipModal } from "@/components/quips/CreateQuipModal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isLoading, isAdmin } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [activeFilter, setActiveFilter] = useState<Category>("All")
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quips, setQuips] = useState<Quip[]>([])
  const [selectedQuip, setSelectedQuip] = useState<Quip | null>(null)
  const [quipResponses, setQuipResponses] = useState<QuipResponse[]>([])
  const [createQuipModalOpen, setCreateQuipModalOpen] = useState(false)
  const [activeQuipTab, setActiveQuipTab] = useState<"active" | "closed">("active")
  const [resetSuccess, setResetSuccess] = useState(false)
  
  // Calculate everything from the fetched feedbacks
  const feedbackItems = convertFeedbackArray(feedbacks)
  const stats = calculateStatsFromFeedbacks(feedbacks)
  const categoryDistribution = calculateCategoryDistributionFromFeedbacks(feedbacks)

  // Fetch feedbacks from Google Sheets
  const fetchFeedbacks = useCallback(async () => {
    // #region agent log
    const debugLog = {location:'app/dashboard/page.tsx:38',message:'fetchFeedbacks called',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'};
    console.log('[DEBUG]', debugLog);
    sendDebugLog(debugLog);
    // #endregion
    setLoading(true)
    setError(null)
    try {
      const data = await getFeedbacksFromSheet()
      // #region agent log
      const debugLog1 = {location:'app/dashboard/page.tsx:42',message:'Data received from API',data:{dataLength:data.length,firstItemId:data[0]?.id||null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'};
      console.log('[DEBUG]', debugLog1);
      sendDebugLog(debugLog1);
      // #endregion
      setFeedbacks(data)
      // #region agent log
      const debugLog2 = {location:'app/dashboard/page.tsx:43',message:'State updated with feedbacks',data:{dataLength:data.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'};
      console.log('[DEBUG]', debugLog2);
      sendDebugLog(debugLog2);
      // #endregion
    } catch (err) {
      // #region agent log
      const errorMsg = err instanceof Error ? err.message : String(err)
      const debugLog = {location:'app/dashboard/page.tsx:59',message:'Error in fetchFeedbacks',data:{errorMessage:errorMsg,errorStack:err instanceof Error?err.stack?.substring(0,500):null,errorType:err instanceof Error?err.constructor.name:typeof err},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'};
      console.error('[DEBUG] Error in fetchFeedbacks:', debugLog);
      sendDebugLog(debugLog);
      // #endregion
      console.error("Failed to fetch feedbacks:", err)
      // Show more specific error message
      const userFriendlyError = errorMsg.includes("credentials not configured")
        ? "API credentials not configured. Please check environment variables."
        : errorMsg.includes("API error")
        ? `API Error: ${errorMsg}`
        : "Failed to load feedback data. Please check the console for details."
      setError(userFriendlyError)
    } finally {
      setLoading(false)
      // #region agent log
      const debugLog = {location:'app/dashboard/page.tsx:48',message:'Loading set to false',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'};
      console.log('[DEBUG]', debugLog);
      sendDebugLog(debugLog);
      // #endregion
    }
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading && !user) {
      router.push("/login")
    }
  }, [mounted, isLoading, user, router])

  const handleViewResponses = useCallback(async (quip: Quip) => {
    setSelectedQuip(quip)
    try {
      const allResponses = await getQuipResponsesFromSheet()
      // Filter responses for this specific quip
      const responses = allResponses.filter((r) => r.quip_id === quip.id)
      setQuipResponses(responses)
    } catch (error) {
      console.error("Failed to fetch responses:", error)
      setQuipResponses([])
    }
  }, [])

  // Fetch quips
  const fetchQuips = useCallback(async () => {
    if (!isAdmin) return
    try {
      const data = await getQuipsFromSheet()
      
      // Fetch all quip responses and calculate counts
      try {
        const allResponses = await getQuipResponsesFromSheet()
        
        // Calculate response counts per quip
        const countsByQuipId: Record<string, number> = {}
        allResponses.forEach((response) => {
          countsByQuipId[response.quip_id] = (countsByQuipId[response.quip_id] || 0) + 1
        })
        
        // Attach response counts to quips
        const quipsWithCounts = data.map((quip) => ({
          ...quip,
          responses: countsByQuipId[quip.id] || 0,
        }))
        
        setQuips(quipsWithCounts)
        
        // Check if there's a quipId in URL params and auto-select it
        const quipIdFromUrl = searchParams?.get("quipId")
        if (quipIdFromUrl) {
          const quipToSelect = quipsWithCounts.find((q) => q.id === quipIdFromUrl)
          if (quipToSelect) {
            handleViewResponses(quipToSelect)
            // Clear the URL parameter
            router.replace("/dashboard", { scroll: false })
          }
        }
      } catch (error) {
        // If responses can't be fetched, still show quips without counts
        console.warn("Failed to fetch quip responses, showing quips without counts:", error)
        setQuips(data.map((quip) => ({ ...quip, responses: 0 })))
      }
    } catch (error) {
      console.error("Failed to fetch quips:", error)
    }
  }, [isAdmin, searchParams, router, handleViewResponses])

  // Fetch feedbacks when component mounts and user is authenticated
  useEffect(() => {
    // #region agent log
    const debugLog1 = {location:'app/dashboard/page.tsx:63',message:'useEffect check',data:{mounted,isLoading,hasUser:!!user,isAdmin},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'};
    console.log('[DEBUG]', debugLog1);
    sendDebugLog(debugLog1);
    // #endregion
    if (mounted && !isLoading && user && isAdmin) {
      // #region agent log
      const debugLog2 = {location:'app/dashboard/page.tsx:65',message:'Calling fetchFeedbacks from useEffect',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'};
      console.log('[DEBUG]', debugLog2);
      sendDebugLog(debugLog2);
      // #endregion
      fetchFeedbacks()
      fetchQuips()
    }
  }, [mounted, isLoading, user, isAdmin, fetchFeedbacks, fetchQuips])

  const handleCreateQuip = async (
    newQuip: Omit<Quip, "id" | "created_at" | "responses">
  ) => {
    if (!user) return
    try {
      await createQuipInMock({
        ...newQuip,
        created_by: user.id,
      })
      await fetchQuips()
    } catch (error) {
      console.error("Failed to create quip:", error)
      throw error
    }
  }

  const handleCloseQuip = async (quip: Quip) => {
    try {
      await updateQuipStatus(quip.id, "closed")
      await fetchQuips()
    } catch (error) {
      console.error("Failed to close quip:", error)
    }
  }

  /**
   * Clear all quip response tracking from localStorage
   * This allows users to submit responses to quips again
   */
  const handleResetQuipResponses = () => {
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
      
      setResetSuccess(true)
      setTimeout(() => setResetSuccess(false), 3000)
    } catch (error) {
      console.error("Failed to clear quip responses from localStorage:", error)
    }
  }

  // Show loading state while checking auth or fetching data
  if (!mounted || isLoading || !user || (isAdmin && loading)) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-12">
        <div className="text-center">
          <div className="h-8 w-48 animate-pulse rounded bg-muted mx-auto mb-4" />
          <div className="h-4 w-32 animate-pulse rounded bg-muted mx-auto" />
          {isAdmin && loading && (
            <p className="mt-4 text-sm text-muted-foreground">Loading feedback data...</p>
          )}
        </div>
      </div>
    )
  }

  // Show access denied for non-admin users
  if (!isAdmin) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <div className="p-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-destructive">Access Denied</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              You need admin privileges to access this page.
            </p>
            <Button asChild variant="default" className="mt-6">
              <Link href="/">Go to Home</Link>
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // Filter feedback based on active filter
  const filteredFeedback = activeFilter === "All" 
    ? feedbackItems
    : feedbackItems.filter(item => item.category === activeFilter)

  // Filter quips by status
  const activeQuips = quips.filter((q) => q.status === "active")
  const closedQuips = quips.filter((q) => q.status === "closed")

  // Show quip detail view if selected
  if (selectedQuip) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto p-6">
          <QuipDetail
            quip={selectedQuip}
            responses={quipResponses}
            onBack={() => {
              setSelectedQuip(null)
              setQuipResponses([])
            }}
          />
        </div>
      </div>
    )
  }

  // Show dashboard content for admin users
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600">
                <MessageSquareText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">TechFlow GmbH</h1>
                <p className="text-sm text-gray-500">Feedback Dashboard</p>
              </div>
            </div>
            <button
              onClick={() => fetchFeedbacks()}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh data from Google Sheets"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
            <Button
              onClick={() => fetchFeedbacks()}
              variant="outline"
              size="sm"
              className="mt-3"
            >
              Try Again
            </Button>
          </div>
        )}
        {feedbacks.length === 0 && !loading && !error && (
          <div className="mb-6 rounded-lg border border-yellow-500/50 bg-yellow-50 p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                No feedback data found. The Google Sheet might be empty or the tab name might be incorrect.
              </p>
            </div>
          </div>
        )}
        <div className="space-y-8">
          <StatsCards 
            total={stats.total}
            thisWeek={stats.thisWeek}
            topCategory={stats.topCategory}
            sentimentScore={stats.sentimentScore}
            sentimentTrend={stats.sentimentTrend}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CategoryChart data={categoryDistribution} />
            
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Feedback Overview</h3>
              <FilterChips 
                activeFilter={activeFilter} 
                onFilterChange={setActiveFilter} 
              />
              <div className="mt-4">
                <FeedbackList feedback={filteredFeedback} />
              </div>
            </div>
          </div>

          {/* Quips Section */}
          <section className="mt-12">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="mb-6">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg">
                    <Megaphone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Quips</h2>
                    <p className="text-sm text-gray-500">
                      Create questions and collect anonymous feedback from your team.
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 sm:flex-none border-orange-500 text-orange-600 hover:bg-orange-50 flex items-center justify-center"
                    onClick={handleResetQuipResponses}
                    title="Reset quip response tracking - allows users to submit responses again"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset Responses
                  </Button>
                  <Button
                    className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
                    onClick={() => setCreateQuipModalOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Quip
                  </Button>
                </div>
              </div>

              {resetSuccess && (
                <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3">
                  <div className="flex items-center gap-2 text-sm text-green-800">
                    <AlertCircle className="h-4 w-4" />
                    <span>Quip response tracking has been reset. Users can now submit responses again.</span>
                  </div>
                </div>
              )}

              <Tabs
                value={activeQuipTab}
                onValueChange={(v) => setActiveQuipTab(v as "active" | "closed")}
              >
                <TabsList>
                  <TabsTrigger value="active">
                    Active ({activeQuips.length})
                  </TabsTrigger>
                  <TabsTrigger value="closed">
                    Closed ({closedQuips.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="mt-4">
                  <QuipList
                    quips={activeQuips}
                    variant="admin"
                    onViewResponses={handleViewResponses}
                    onClose={handleCloseQuip}
                    emptyMessage="No active quips."
                  />
                </TabsContent>

                <TabsContent value="closed" className="mt-4">
                  <QuipList
                    quips={closedQuips}
                    variant="admin"
                    onViewResponses={handleViewResponses}
                    emptyMessage="No closed quips."
                  />
                </TabsContent>
              </Tabs>
            </div>
          </section>

          {/* Coming Soon: Clustering */}
          <section className="mx-auto mt-12 max-w-3xl">
            <Card className="border-dashed border-2 border-border bg-muted/30">
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <Network className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium text-muted-foreground">
                  Clustering
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Ask a question and see answers specifically to these clusters. Coming soon.
                </p>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      <CreateQuipModal
        open={createQuipModalOpen}
        onOpenChange={setCreateQuipModalOpen}
        onCreate={handleCreateQuip}
      />
    </div>
  )
}
