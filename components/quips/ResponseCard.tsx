"use client"

import { QuipResponse } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ResponseCardProps {
  response: QuipResponse
}

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

function getSentimentEmoji(sentiment?: "positive" | "neutral" | "negative"): string {
  switch (sentiment) {
    case "positive":
      return "😊"
    case "negative":
      return "😔"
    case "neutral":
    default:
      return "😐"
  }
}

function getDepartmentColor(department: string): string {
  const colors: Record<string, string> = {
    Engineering: "bg-blue-100 text-blue-700",
    Product: "bg-purple-100 text-purple-700",
    Design: "bg-pink-100 text-pink-700",
    Marketing: "bg-orange-100 text-orange-700",
    Sales: "bg-green-100 text-green-700",
    Operations: "bg-yellow-100 text-yellow-700",
    Finance: "bg-teal-100 text-teal-700",
    HR: "bg-red-100 text-red-700",
  }
  return colors[department] || "bg-gray-100 text-gray-700"
}

export function ResponseCard({ response }: ResponseCardProps) {
  return (
    <Card className="h-full">
      <CardContent className="pt-6 space-y-3">
        <p className="text-sm leading-relaxed">{response.response}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className={getDepartmentColor(response.department)}>
              {response.department}
            </Badge>
            {response.sentiment && (
              <span className="text-base" aria-label={`Sentiment: ${response.sentiment}`}>
                {getSentimentEmoji(response.sentiment)}
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {getRelativeTime(response.created_at)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
