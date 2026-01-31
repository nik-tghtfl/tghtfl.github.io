// lib/data/feedbacks.ts
// Utility functions for feedback data processing
// Note: Mock data (ALL_FEEDBACKS) is deprecated - use getFeedbacksFromSheet() from lib/api.ts instead

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
};

/**
 * @deprecated Use getFeedbacksFromSheet() from lib/api.ts instead
 * This mock data is kept for reference only and will be removed in a future version.
 */
const ALL_FEEDBACKS: Feedback[] = [
  {
    "id": "1",
    "timestamp": "2026-01-31T12:12:06.804Z",
    "feedback": "Love the new CI/CD pipeline! Deployments are smoother now.",
    "department": "Marketing",
    "anonymous": true,
    "category": "Process",
    "sentiment": "positive",
    "summary": "CI/CD pipeline working great",
    "user_id": "3"
  },
  {
    "id": "2",
    "timestamp": "2026-01-31T00:48:51.836Z",
    "feedback": "Parking situation is stressful.",
    "department": "Customer Success",
    "anonymous": true,
    "category": "Other",
    "sentiment": "negative",
    "summary": "Parking issues",
    "user_id": "4"
  },
  {
    "id": "3",
    "timestamp": "2026-01-31T00:31:06.044Z",
    "feedback": "Great improvement on the onboarding process!",
    "department": "Marketing",
    "anonymous": true,
    "category": "Process",
    "sentiment": "positive",
    "summary": "Onboarding improved",
    "user_id": "3"
  },
  {
    "id": "4",
    "timestamp": "2026-01-30T22:41:53.443Z",
    "feedback": "The new weekly newsletter is fantastic!",
    "department": "Customer Success",
    "anonymous": true,
    "category": "Communication",
    "sentiment": "positive",
    "summary": "Newsletter very helpful",
    "user_id": "4"
  },
  {
    "id": "5",
    "timestamp": "2026-01-30T20:27:59.236Z",
    "feedback": "Love the open-door policy with leadership.",
    "department": "Marketing",
    "anonymous": false,
    "category": "Communication",
    "sentiment": "positive",
    "summary": "Leadership accessibility appreciated",
    "user_id": "3"
  },
  {
    "id": "6",
    "timestamp": "2026-01-30T15:40:54.365Z",
    "feedback": "Would be nice to have more snack options.",
    "department": "Customer Success",
    "anonymous": true,
    "category": "Other",
    "sentiment": "neutral",
    "summary": "More snacks requested",
    "user_id": "4"
  },
  {
    "id": "7",
    "timestamp": "2026-01-29T21:36:36.592Z",
    "feedback": "Jira is a nightmare. Can we please switch to Linear?",
    "department": "Engineering",
    "anonymous": false,
    "category": "Tools",
    "sentiment": "negative",
    "summary": "Request to switch from Jira",
    "user_id": "2"
  },
  {
    "id": "8",
    "timestamp": "2026-01-29T09:42:22.310Z",
    "feedback": "Our standup format works, but maybe we should try async.",
    "department": "Engineering",
    "anonymous": false,
    "category": "Process",
    "sentiment": "neutral",
    "summary": "Consider async standups",
    "user_id": "2"
  },
  {
    "id": "9",
    "timestamp": "2026-01-28T15:18:19.761Z",
    "feedback": "The new project management workflow is really helping.",
    "department": "Customer Success",
    "anonymous": true,
    "category": "Process",
    "sentiment": "positive",
    "summary": "New PM workflow effective",
    "user_id": "4"
  },
  {
    "id": "10",
    "timestamp": "2026-01-28T12:01:25.183Z",
    "feedback": "There is a blame culture when things go wrong.",
    "department": "Product",
    "anonymous": true,
    "category": "Culture",
    "sentiment": "negative",
    "summary": "Blame culture present",
    "user_id": "1"
  },
  {
    "id": "11",
    "timestamp": "2026-01-27T19:01:26.005Z",
    "feedback": "Love the new CI/CD pipeline! Deployments are smoother now.",
    "department": "Engineering",
    "anonymous": true,
    "category": "Process",
    "sentiment": "positive",
    "summary": "CI/CD pipeline working great",
    "user_id": "2"
  },
  {
    "id": "12",
    "timestamp": "2026-01-27T10:13:17.874Z",
    "feedback": "Email response times vary a lot across teams.",
    "department": "Customer Success",
    "anonymous": true,
    "category": "Communication",
    "sentiment": "neutral",
    "summary": "Inconsistent response times",
    "user_id": "4"
  },
  {
    "id": "13",
    "timestamp": "2026-01-26T04:16:23.871Z",
    "feedback": "The office temperature is inconsistent.",
    "department": "Engineering",
    "anonymous": true,
    "category": "Other",
    "sentiment": "neutral",
    "summary": "Temperature control issues",
    "user_id": "2"
  },
  {
    "id": "14",
    "timestamp": "2026-01-24T08:51:43.400Z",
    "feedback": "Best team I have ever worked with. Everyone helps each other.",
    "department": "Product",
    "anonymous": false,
    "category": "Culture",
    "sentiment": "positive",
    "summary": "Excellent team support",
    "user_id": "1"
  },
  {
    "id": "15",
    "timestamp": "2026-01-24T04:44:46.850Z",
    "feedback": "The new design system is saving us so much time.",
    "department": "Customer Success",
    "anonymous": true,
    "category": "Tools",
    "sentiment": "positive",
    "summary": "Design system very effective",
    "user_id": "4"
  },
  {
    "id": "16",
    "timestamp": "2026-01-24T01:26:12.281Z",
    "feedback": "Our standup format works, but maybe we should try async.",
    "department": "Engineering",
    "anonymous": false,
    "category": "Process",
    "sentiment": "neutral",
    "summary": "Consider async standups",
    "user_id": "2"
  },
  {
    "id": "17",
    "timestamp": "2026-01-24T00:11:24.297Z",
    "feedback": "Best team I have ever worked with. Everyone helps each other.",
    "department": "Marketing",
    "anonymous": true,
    "category": "Culture",
    "sentiment": "positive",
    "summary": "Excellent team support",
    "user_id": "3"
  },
  {
    "id": "18",
    "timestamp": "2026-01-22T00:29:54.632Z",
    "feedback": "Too many approval steps for simple changes.",
    "department": "Product",
    "anonymous": true,
    "category": "Process",
    "sentiment": "negative",
    "summary": "Approval workflow too complex",
    "user_id": "1"
  },
  {
    "id": "19",
    "timestamp": "2026-01-21T15:42:49.954Z",
    "feedback": "Our internal tools are outdated and constantly breaking.",
    "department": "Customer Success",
    "anonymous": false,
    "category": "Tools",
    "sentiment": "negative",
    "summary": "Internal tools need updating",
    "user_id": "4"
  },
  {
    "id": "20",
    "timestamp": "2026-01-20T19:16:03.587Z",
    "feedback": "The new weekly newsletter is fantastic!",
    "department": "Customer Success",
    "anonymous": false,
    "category": "Communication",
    "sentiment": "positive",
    "summary": "Newsletter very helpful",
    "user_id": "4"
  },
  {
    "id": "21",
    "timestamp": "2026-01-19T07:05:35.615Z",
    "feedback": "Career growth paths are completely unclear.",
    "department": "Marketing",
    "anonymous": true,
    "category": "Culture",
    "sentiment": "negative",
    "summary": "Unclear career progression",
    "user_id": "3"
  },
  {
    "id": "22",
    "timestamp": "2026-01-18T04:51:59.681Z",
    "feedback": "Figma works fine for design, collaboration could be better.",
    "department": "Customer Success",
    "anonymous": false,
    "category": "Tools",
    "sentiment": "neutral",
    "summary": "Figma collaboration needs work",
    "user_id": "4"
  },
  {
    "id": "23",
    "timestamp": "2026-01-17T04:44:48.206Z",
    "feedback": "The new weekly newsletter is fantastic!",
    "department": "Product",
    "anonymous": true,
    "category": "Communication",
    "sentiment": "positive",
    "summary": "Newsletter very helpful",
    "user_id": "1"
  },
  {
    "id": "24",
    "timestamp": "2026-01-16T22:57:08.192Z",
    "feedback": "The new weekly newsletter is fantastic!",
    "department": "Customer Success",
    "anonymous": true,
    "category": "Communication",
    "sentiment": "positive",
    "summary": "Newsletter very helpful",
    "user_id": "4"
  },
  {
    "id": "25",
    "timestamp": "2026-01-16T11:16:10.821Z",
    "feedback": "Recognition for good work is rare.",
    "department": "Customer Success",
    "anonymous": true,
    "category": "Culture",
    "sentiment": "negative",
    "summary": "Lack of recognition",
    "user_id": "4"
  },
  {
    "id": "26",
    "timestamp": "2026-01-15T20:14:56.050Z",
    "feedback": "Flexible hours have completely changed my productivity.",
    "department": "Marketing",
    "anonymous": false,
    "category": "Culture",
    "sentiment": "positive",
    "summary": "Flex hours working well",
    "user_id": "3"
  },
  {
    "id": "27",
    "timestamp": "2026-01-15T15:23:32.647Z",
    "feedback": "Figma works fine for design, collaboration could be better.",
    "department": "Marketing",
    "anonymous": true,
    "category": "Tools",
    "sentiment": "neutral",
    "summary": "Figma collaboration needs work",
    "user_id": "3"
  },
  {
    "id": "28",
    "timestamp": "2026-01-15T12:28:22.909Z",
    "feedback": "Remote team members are often left out of discussions.",
    "department": "Marketing",
    "anonymous": true,
    "category": "Communication",
    "sentiment": "negative",
    "summary": "Remote workers excluded",
    "user_id": "3"
  },
  {
    "id": "29",
    "timestamp": "2026-01-15T04:07:18.161Z",
    "feedback": "Recognition for good work is rare.",
    "department": "Product",
    "anonymous": true,
    "category": "Culture",
    "sentiment": "negative",
    "summary": "Lack of recognition",
    "user_id": "1"
  },
  {
    "id": "30",
    "timestamp": "2026-01-14T17:13:02.439Z",
    "feedback": "Would be nice to have more snack options.",
    "department": "Customer Success",
    "anonymous": false,
    "category": "Other",
    "sentiment": "neutral",
    "summary": "More snacks requested",
    "user_id": "4"
  },
  {
    "id": "31",
    "timestamp": "2026-01-14T16:43:09.794Z",
    "feedback": "Weekly all-hands are fine, could be more interactive.",
    "department": "Engineering",
    "anonymous": true,
    "category": "Communication",
    "sentiment": "neutral",
    "summary": "All-hands could be more engaging",
    "user_id": "2"
  },
  {
    "id": "32",
    "timestamp": "2026-01-13T23:12:16.334Z",
    "feedback": "Our internal tools are outdated and constantly breaking.",
    "department": "Product",
    "anonymous": true,
    "category": "Tools",
    "sentiment": "negative",
    "summary": "Internal tools need updating",
    "user_id": "1"
  },
  {
    "id": "33",
    "timestamp": "2026-01-13T23:04:10.146Z",
    "feedback": "Love the new CI/CD pipeline! Deployments are smoother now.",
    "department": "Engineering",
    "anonymous": true,
    "category": "Process",
    "sentiment": "positive",
    "summary": "CI/CD pipeline working great",
    "user_id": "2"
  },
  {
    "id": "34",
    "timestamp": "2026-01-13T11:59:37.514Z",
    "feedback": "The new design system is saving us so much time.",
    "department": "Customer Success",
    "anonymous": false,
    "category": "Tools",
    "sentiment": "positive",
    "summary": "Design system very effective",
    "user_id": "4"
  },
  {
    "id": "35",
    "timestamp": "2026-01-13T03:05:56.278Z",
    "feedback": "Flexible hours have completely changed my productivity.",
    "department": "Marketing",
    "anonymous": true,
    "category": "Culture",
    "sentiment": "positive",
    "summary": "Flex hours working well",
    "user_id": "3"
  },
  {
    "id": "36",
    "timestamp": "2026-01-13T02:00:46.654Z",
    "feedback": "Recognition for good work is rare.",
    "department": "Marketing",
    "anonymous": true,
    "category": "Culture",
    "sentiment": "negative",
    "summary": "Lack of recognition",
    "user_id": "3"
  },
  {
    "id": "37",
    "timestamp": "2026-01-12T12:20:04.619Z",
    "feedback": "The new design system is saving us so much time.",
    "department": "Marketing",
    "anonymous": true,
    "category": "Tools",
    "sentiment": "positive",
    "summary": "Design system very effective",
    "user_id": "3"
  },
  {
    "id": "38",
    "timestamp": "2026-01-11T14:48:39.520Z",
    "feedback": "Parking situation is stressful.",
    "department": "Marketing",
    "anonymous": true,
    "category": "Other",
    "sentiment": "negative",
    "summary": "Parking issues",
    "user_id": "3"
  },
  {
    "id": "39",
    "timestamp": "2026-01-10T00:47:35.007Z",
    "feedback": "Figma works fine for design, collaboration could be better.",
    "department": "Marketing",
    "anonymous": true,
    "category": "Tools",
    "sentiment": "neutral",
    "summary": "Figma collaboration needs work",
    "user_id": "3"
  },
  {
    "id": "40",
    "timestamp": "2026-01-09T22:02:28.673Z",
    "feedback": "Parking situation is stressful.",
    "department": "Customer Success",
    "anonymous": true,
    "category": "Other",
    "sentiment": "negative",
    "summary": "Parking issues",
    "user_id": "4"
  },
  {
    "id": "41",
    "timestamp": "2026-01-09T00:29:03.340Z",
    "feedback": "Love the new CI/CD pipeline! Deployments are smoother now.",
    "department": "Engineering",
    "anonymous": false,
    "category": "Process",
    "sentiment": "positive",
    "summary": "CI/CD pipeline working great",
    "user_id": "2"
  },
  {
    "id": "42",
    "timestamp": "2026-01-08T16:26:05.178Z",
    "feedback": "Parking situation is stressful.",
    "department": "Engineering",
    "anonymous": false,
    "category": "Other",
    "sentiment": "negative",
    "summary": "Parking issues",
    "user_id": "2"
  },
  {
    "id": "43",
    "timestamp": "2026-01-07T08:05:22.545Z",
    "feedback": "New office plants really brighten up the space!",
    "department": "Product",
    "anonymous": true,
    "category": "Other",
    "sentiment": "positive",
    "summary": "Office plants appreciated",
    "user_id": "1"
  },
  {
    "id": "44",
    "timestamp": "2026-01-04T22:53:02.421Z",
    "feedback": "Best team I have ever worked with. Everyone helps each other.",
    "department": "Customer Success",
    "anonymous": true,
    "category": "Culture",
    "sentiment": "positive",
    "summary": "Excellent team support",
    "user_id": "4"
  },
  {
    "id": "45",
    "timestamp": "2026-01-04T16:31:00.102Z",
    "feedback": "Parking situation is stressful.",
    "department": "Marketing",
    "anonymous": true,
    "category": "Other",
    "sentiment": "negative",
    "summary": "Parking issues",
    "user_id": "3"
  },
  {
    "id": "46",
    "timestamp": "2026-01-03T17:28:08.428Z",
    "feedback": "Parking situation is stressful.",
    "department": "Product",
    "anonymous": true,
    "category": "Other",
    "sentiment": "negative",
    "summary": "Parking issues",
    "user_id": "1"
  },
  {
    "id": "47",
    "timestamp": "2026-01-03T13:21:34.260Z",
    "feedback": "Love the new CI/CD pipeline! Deployments are smoother now.",
    "department": "Customer Success",
    "anonymous": true,
    "category": "Process",
    "sentiment": "positive",
    "summary": "CI/CD pipeline working great",
    "user_id": "4"
  },
  {
    "id": "48",
    "timestamp": "2026-01-02T17:03:30.800Z",
    "feedback": "Cross-team communication is basically non-existent.",
    "department": "Marketing",
    "anonymous": true,
    "category": "Communication",
    "sentiment": "negative",
    "summary": "Poor cross-team communication",
    "user_id": "3"
  },
  {
    "id": "49",
    "timestamp": "2026-01-02T02:41:44.447Z",
    "feedback": "No proper staging environment for testing.",
    "department": "Marketing",
    "anonymous": true,
    "category": "Tools",
    "sentiment": "negative",
    "summary": "Missing staging environment",
    "user_id": "3"
  },
  {
    "id": "50",
    "timestamp": "2026-01-01T19:46:06.009Z",
    "feedback": "Team retrospectives have really improved our communication.",
    "department": "Engineering",
    "anonymous": true,
    "category": "Communication",
    "sentiment": "positive",
    "summary": "Retros improving communication",
    "user_id": "2"
  }
];

// Get random subset for dashboard
/**
 * @deprecated Use getFeedbacksFromSheet() from lib/api.ts instead
 * This function is kept for backward compatibility but will be removed in a future version.
 */
export function getRandomFeedbacks(count: number = 25): Feedback[] {
  const shuffled = [...ALL_FEEDBACKS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Get all feedbacks sorted by date
export function getAllFeedbacks(): Feedback[] {
  return [...ALL_FEEDBACKS].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

// Get stats for dashboard cards
export function getStats() {
  const total = ALL_FEEDBACKS.length;
  
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const thisWeek = ALL_FEEDBACKS.filter(f => new Date(f.timestamp) > weekAgo).length;

  const byCategory = {
    Process: ALL_FEEDBACKS.filter(f => f.category === "Process").length,
    Communication: ALL_FEEDBACKS.filter(f => f.category === "Communication").length,
    Tools: ALL_FEEDBACKS.filter(f => f.category === "Tools").length,
    Culture: ALL_FEEDBACKS.filter(f => f.category === "Culture").length,
    Other: ALL_FEEDBACKS.filter(f => f.category === "Other").length,
  };

  const bySentiment = {
    positive: ALL_FEEDBACKS.filter(f => f.sentiment === "positive").length,
    neutral: ALL_FEEDBACKS.filter(f => f.sentiment === "neutral").length,
    negative: ALL_FEEDBACKS.filter(f => f.sentiment === "negative").length,
  };

  const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0][0];

  return { total, thisWeek, byCategory, bySentiment, topCategory };
}

// Filter feedbacks by category and/or sentiment
export function filterFeedbacks(
  category?: string,
  sentiment?: string
): Feedback[] {
  let filtered = [...ALL_FEEDBACKS];
  if (category && category !== "all" && category !== "All") {
    filtered = filtered.filter(f => f.category === category);
  }
  if (sentiment && sentiment !== "all") {
    filtered = filtered.filter(f => f.sentiment === sentiment);
  }
  return filtered.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

// Get feedbacks for a specific user (for "my feedback" feature)
export function getFeedbacksByUser(userId: string, limit?: number): Feedback[] {
  const userFeedbacks = ALL_FEEDBACKS
    .filter(f => f.user_id === userId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return limit ? userFeedbacks.slice(0, limit) : userFeedbacks;
}

// Adapter functions to convert Feedback to FeedbackItem

/**
 * Convert a Feedback to FeedbackItem format
 */
export function convertToFeedbackItem(feedback: Feedback): FeedbackItem {
  // Safely parse timestamp - handle invalid dates
  let date: Date
  try {
    date = new Date(feedback.timestamp)
    // Check if date is valid
    if (isNaN(date.getTime())) {
      // If invalid, use current date as fallback
      date = new Date()
    }
  } catch {
    date = new Date()
  }
  const dateStr = date.toISOString().split("T")[0] // YYYY-MM-DD format

  return {
    id: feedback.id,
    category: feedback.category,
    sentiment: feedback.sentiment,
    summary: feedback.summary,
    date: dateStr,
    createdAt: feedback.timestamp,
    source: "n8n"
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
  const thisWeek = feedbacks.filter(f => new Date(f.timestamp) > weekAgo).length

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

  // Sentiment trend (mock for now, can be calculated from historical data later)
  const sentimentTrend = Math.floor(Math.random() * 11) - 5 // Random between -5 and +5

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

/**
 * Get dashboard stats in DashboardStats format (from all feedbacks)
 */
export function getDashboardStats(): DashboardStats {
  const stats = getStats()
  
  // Calculate sentiment score (percentage of positive)
  const sentimentScore = stats.total > 0
    ? Math.round((stats.bySentiment.positive / stats.total) * 100)
    : 0

  // Sentiment trend (mock for now, can be calculated from historical data later)
  const sentimentTrend = Math.floor(Math.random() * 11) - 5 // Random between -5 and +5

  return {
    total: stats.total,
    thisWeek: stats.thisWeek,
    topCategory: stats.topCategory,
    sentimentScore,
    sentimentTrend
  }
}

/**
 * Convert category stats to CategoryData[] format for the chart (from all feedbacks)
 */
export function getCategoryDistribution(): CategoryData[] {
  const stats = getStats()
  
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
    count: stats.byCategory[category] || 0,
    fill: colors[category]
  }))
}
