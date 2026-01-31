"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, MessageSquareText, RefreshCw, Network } from "lucide-react"
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
import { getFeedbacksFromSheet } from "@/lib/api"
import type { Category, FeedbackItem, DashboardStats, CategoryData } from "@/types"

/**
 * Helper to send debug logs only in development (localhost)
 */
function sendDebugLog(logData: any) {
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    fetch('http://127.0.0.1:7242/ingest/94295a68-58c0-4c7f-a369-b8d6564b2c9c', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logData)
    }).catch(() => {})
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading, isAdmin } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [activeFilter, setActiveFilter] = useState<Category>("All")
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
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
    }
  }, [mounted, isLoading, user, isAdmin, fetchFeedbacks])

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
    </div>
  )
}
