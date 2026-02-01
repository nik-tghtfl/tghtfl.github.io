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
  actionRecommendation?: string
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

// Quips Types
export interface Quip {
  id: string
  title: string
  description?: string
  created_at: string
  deadline?: string
  status: "active" | "closed"
  created_by: string
  responses?: number
}

export interface QuipResponse {
  id: string
  quip_id: string
  response: string
  department: string
  user_id: string
  created_at: string
  sentiment?: "positive" | "neutral" | "negative"
}

export const DEPARTMENTS = [
  "Engineering",
  "Product",
  "Design",
  "Marketing",
  "Sales",
  "Operations",
  "Finance",
  "HR",
] as const

export type Department = (typeof DEPARTMENTS)[number]

