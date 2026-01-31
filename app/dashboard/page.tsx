"use client"

import { useEffect, useState } from "react"
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
import { getMockDashboardData } from "@/lib/data/mock-data"
import type { Category, DashboardData } from "@/types"

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading, isAdmin } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [activeFilter, setActiveFilter] = useState<Category>("All")
  // Get fresh random data each time component mounts
  const [dashboardData] = useState<DashboardData>(() => getMockDashboardData())

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
    ? dashboardData.feedback
    : dashboardData.feedback.filter(item => item.category === activeFilter)

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
              onClick={() => {
                // Refresh data by re-initializing (in future, this could trigger a data refresh)
                window.location.reload()
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh data"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <StatsCards 
            total={dashboardData.stats.total}
            thisWeek={dashboardData.stats.thisWeek}
            topCategory={dashboardData.stats.topCategory}
            sentimentScore={dashboardData.stats.sentimentScore}
            sentimentTrend={dashboardData.stats.sentimentTrend}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CategoryChart data={dashboardData.categoryDistribution} />
            
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
