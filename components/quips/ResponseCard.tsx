"use client"

import { QuipResponse } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { timeAgo } from "@/lib/utils"

interface ResponseCardProps {
  response: QuipResponse
  userDepartment?: string // Department from Users sheet (optional, falls back to response.department)
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

export function ResponseCard({ response, userDepartment }: ResponseCardProps) {
  // Use userDepartment from Users sheet if available, otherwise fall back to response.department
  const department = userDepartment || response.department || "Unknown"

  return (
    <Card className="h-full">
      <CardContent className="pt-6 space-y-4">
        <p className="text-sm leading-relaxed text-gray-800">{response.response}</p>
        <div className="flex items-center justify-between">
          {department && (
            <Badge variant="secondary" className={getDepartmentColor(department)}>
              {department}
            </Badge>
          )}
          <span className="text-xs text-gray-400">
            {timeAgo(response.created_at)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
