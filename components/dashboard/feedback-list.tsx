"use client"

import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Lightbulb } from "lucide-react"
import type { FeedbackItem } from "@/types"
import { cn } from "@/lib/utils"

interface FeedbackListProps {
  feedback: FeedbackItem[]
}

const categoryColors: Record<string, string> = {
  Process: "bg-blue-100 text-blue-700 border-blue-200",
  Communication: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Tools: "bg-purple-100 text-purple-700 border-purple-200",
  Culture: "bg-orange-100 text-orange-700 border-orange-200",
  Other: "bg-gray-100 text-gray-700 border-gray-200",
}

const sentimentEmojis: Record<string, string> = {
  positive: "😊",
  neutral: "😐",
  negative: "😟",
}

export function FeedbackList({ feedback }: FeedbackListProps) {
  if (feedback.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No feedback entries found for this filter.
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2">
        {feedback.map((item) => (
          <div
            key={item.id}
            className="relative p-4 rounded-lg border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors transition-transform duration-150 ease-out hover:-translate-y-0.5 hover:shadow-md hover:shadow-gray-200/70"
          >
            {item.actionRecommendation && (
              <div className="absolute top-3 right-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="text-amber-500 hover:text-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded"
                      aria-label="AI recommendation"
                    >
                      <Lightbulb className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="max-w-xs">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-indigo-900">
                        AI Recommendation
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {item.actionRecommendation}
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
            <div className="flex items-start gap-3 pr-6">
              <span className="text-xl" role="img" aria-label={item.sentiment}>
                {sentimentEmojis[item.sentiment]}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge 
                    variant="outline"
                    className={cn("text-xs", categoryColors[item.category])}
                  >
                    {item.category}
                  </Badge>
                  <span className="text-xs text-gray-400">
                    {new Date(item.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {item.summary}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </TooltipProvider>
  )
}
