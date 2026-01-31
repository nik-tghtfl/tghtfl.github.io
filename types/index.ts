// Quippi TypeScript Types
// This file will contain shared types for the application

export type UserRole = "member" | "admin"

export interface User {
  id: string
  username: string
  displayName: string
  role: UserRole
  team: string
  ageRange?: string
}

export interface Feedback {
  id: string
  content: string
  category?: string
  createdAt: Date
}

export interface FeedbackProgram {
  id: string
  title: string
  description: string
  isActive: boolean
  createdAt: Date
}

// Dashboard Types
export type Category = "All" | "Process" | "Communication" | "Tools" | "Culture" | "Other"

export type FeedbackCategory = Exclude<Category, "All">

export type Sentiment = "positive" | "neutral" | "negative"

export interface FeedbackItem {
  id: string
  category: FeedbackCategory
  sentiment: Sentiment
  summary: string
  date: string
  createdAt?: string
  source?: string
}

export interface CategoryData {
  name: string
  count: number
  fill: string
}

export interface DashboardStats {
  total: number
  thisWeek: number
  topCategory: string
  sentimentScore: number
  sentimentTrend: number
}

export interface DashboardData {
  stats: DashboardStats
  categoryDistribution: CategoryData[]
  feedback: FeedbackItem[]
}
