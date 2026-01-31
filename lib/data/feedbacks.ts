// lib/data/feedbacks.ts
// Utility functions for feedback data processing

import type { FeedbackItem, DashboardStats, CategoryData } from "@/types"

export type Feedback = {
  id: string;
  timestamp: string;
  feedback: string;
  department: string;
  anonymous: boolean;
  category: "Process" | "Communication" | "Tools" | "Culture" | "Other";
  sentiment: "positive" | "neutral" | "negative";
  summary: string;
  user_id: string;
  actionRecommendation?: string;
};

/**
 * Safely parse a date string, returning a valid Date or current date as fallback
 */
export function parseDateSafely(dateString: string): Date {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return new Date()
    }
    return date
  } catch {
    return new Date()
  }
}

/**
 * Convert a Feedback to FeedbackItem format
 */
export function convertToFeedbackItem(feedback: Feedback): FeedbackItem {
  const date = parseDateSafely(feedback.timestamp)
  const dateStr = date.toISOString().split("T")[0] // YYYY-MM-DD format

  return {
    id: feedback.id,
    category: feedback.category,
    sentiment: feedback.sentiment,
    summary: feedback.summary,
    date: dateStr,
    createdAt: feedback.timestamp,
    source: "n8n",
    actionRecommendation: feedback.actionRecommendation,
  }
}

/**
 * Convert an array of Feedback to FeedbackItem[]
 */
export function convertFeedbackArray(feedbacks: Feedback[]): FeedbackItem[] {
  return feedbacks.map(convertToFeedbackItem)
}

/**
 * Calculate stats from a specific array of feedbacks
 */
export function calculateStatsFromFeedbacks(feedbacks: Feedback[]): DashboardStats {
  const total = feedbacks.length
  
  // Calculate this week's feedback
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  const thisWeek = feedbacks.filter(f => {
    const date = parseDateSafely(f.timestamp)
    return date > weekAgo
  }).length

  // Calculate category distribution
  const byCategory = {
    Process: feedbacks.filter(f => f.category === "Process").length,
    Communication: feedbacks.filter(f => f.category === "Communication").length,
    Tools: feedbacks.filter(f => f.category === "Tools").length,
    Culture: feedbacks.filter(f => f.category === "Culture").length,
    Other: feedbacks.filter(f => f.category === "Other").length,
  }

  // Calculate sentiment distribution
  const bySentiment = {
    positive: feedbacks.filter(f => f.sentiment === "positive").length,
    neutral: feedbacks.filter(f => f.sentiment === "neutral").length,
    negative: feedbacks.filter(f => f.sentiment === "negative").length,
  }

  // Find top category
  const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]?.[0] || "Process"

  // Calculate sentiment score (percentage of positive)
  const sentimentScore = total > 0
    ? Math.round((bySentiment.positive / total) * 100)
    : 0

  // Calculate sentiment trend: compare last 7 days vs previous 7 days (days 7-14 prior)
  const now = new Date()
  const sevenDaysAgo = new Date(now)
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const fourteenDaysAgo = new Date(now)
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)

  // Last 7 days (current week)
  const lastWeekFeedbacks = feedbacks.filter(f => {
    const date = parseDateSafely(f.timestamp)
    return date > sevenDaysAgo && date <= now
  })

  // Previous 7 days (days 7-14 prior)
  const previousWeekFeedbacks = feedbacks.filter(f => {
    const date = parseDateSafely(f.timestamp)
    return date > fourteenDaysAgo && date <= sevenDaysAgo
  })

  // Calculate positive sentiment percentage for each period
  const lastWeekPositive = lastWeekFeedbacks.filter(f => f.sentiment === "positive").length
  const lastWeekTotal = lastWeekFeedbacks.length
  const lastWeekPositivePercent = lastWeekTotal > 0
    ? (lastWeekPositive / lastWeekTotal) * 100
    : 0

  const previousWeekPositive = previousWeekFeedbacks.filter(f => f.sentiment === "positive").length
  const previousWeekTotal = previousWeekFeedbacks.length
  const previousWeekPositivePercent = previousWeekTotal > 0
    ? (previousWeekPositive / previousWeekTotal) * 100
    : 0

  // Calculate percentage change: ((current - previous) / previous) * 100
  let sentimentTrend = 0
  if (previousWeekTotal > 0 && lastWeekTotal > 0) {
    const change = lastWeekPositivePercent - previousWeekPositivePercent
    sentimentTrend = previousWeekPositivePercent > 0
      ? Math.round((change / previousWeekPositivePercent) * 100)
      : (change > 0 ? 100 : (change < 0 ? -100 : 0))
  } else if (lastWeekTotal > 0 && previousWeekTotal === 0) {
    // If we have data now but not before, show positive trend
    sentimentTrend = 100
  } else if (lastWeekTotal === 0 && previousWeekTotal > 0) {
    // If we had data before but not now, show negative trend
    sentimentTrend = -100
  }

  return {
    total,
    thisWeek,
    topCategory,
    sentimentScore,
    sentimentTrend
  }
}

/**
 * Calculate category distribution from a specific array of feedbacks
 */
export function calculateCategoryDistributionFromFeedbacks(feedbacks: Feedback[]): CategoryData[] {
  const byCategory = {
    Process: feedbacks.filter(f => f.category === "Process").length,
    Communication: feedbacks.filter(f => f.category === "Communication").length,
    Tools: feedbacks.filter(f => f.category === "Tools").length,
    Culture: feedbacks.filter(f => f.category === "Culture").length,
    Other: feedbacks.filter(f => f.category === "Other").length,
  }
  
  const colors: Record<string, string> = {
    Process: "#2563EB",
    Communication: "#3B82F6",
    Tools: "#60A5FA",
    Culture: "#93C5FD",
    Other: "#BFDBFE"
  }

  const categories: Feedback["category"][] = ["Process", "Communication", "Tools", "Culture", "Other"]

  return categories.map(category => ({
    name: category,
    count: byCategory[category] || 0,
    fill: colors[category]
  }))
}
