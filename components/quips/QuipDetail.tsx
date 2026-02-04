"use client"

import { useEffect, useState } from "react"
import { Quip, QuipResponse } from "@/types"
import { ResponseCard } from "./ResponseCard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Megaphone, MessageSquare } from "lucide-react"
import { getUsersFromSheet } from "@/lib/api"

interface QuipDetailProps {
  quip: Quip
  responses: QuipResponse[]
  onBack: () => void
}

export function QuipDetail({ quip, responses, onBack }: QuipDetailProps) {
  const [users, setUsers] = useState<Map<string, { name: string; department: string }>>(new Map())

  useEffect(() => {
    async function loadUsers() {
      try {
        const userMap = await getUsersFromSheet()
        setUsers(userMap)
      } catch (error) {
        console.error("Failed to fetch users:", error)
      }
    }
    loadUsers()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back to quips</span>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold">{quip.title}</h2>
            <Badge
              variant={quip.status === "active" ? "default" : "secondary"}
              className={
                quip.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }
            >
              {quip.status === "active" ? "Active" : "Closed"}
            </Badge>
          </div>
          {quip.description && (
            <p className="text-muted-foreground mt-1">{quip.description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <MessageSquare className="h-4 w-4" />
        <span>{responses.length} responses</span>
      </div>

      {responses.length === 0 ? (
        <div className="text-center py-12 bg-muted/50 rounded-lg">
          <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-medium mb-1">No responses yet</h3>
          <p className="text-sm text-muted-foreground">
            Responses will appear here as team members submit their feedback.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {responses.map((response) => {
            // Get department from Users sheet if available, otherwise use response.department
            const userData = users.get(response.user_id)
            const userDepartment = userData?.department

            return (
              <ResponseCard
                key={response.id}
                response={response}
                userDepartment={userDepartment}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
