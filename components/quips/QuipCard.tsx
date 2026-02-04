"use client"

import { Quip } from "@/types"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Megaphone,
  Clock,
  MessageSquare,
  MoreVertical,
  CheckCircle2,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface QuipCardProps {
  quip: Quip
  variant: "admin" | "employee"
  hasResponded?: boolean
  onViewResponses?: () => void
  onRespond?: () => void
  onClose?: () => void
}

function getTimeRemaining(deadline?: string): string {
  if (!deadline) return "No deadline"
  const now = new Date()
  const end = new Date(deadline)
  const diff = end.getTime() - now.getTime()

  if (diff < 0) return "Ended"

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  if (days > 0) return `${days} day${days > 1 ? "s" : ""} left`
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} left`
  return "Ending soon"
}

function isNew(createdAt: string): boolean {
  const created = new Date(createdAt)
  const now = new Date()
  const diff = now.getTime() - created.getTime()
  return diff < 24 * 60 * 60 * 1000 // 24 hours
}

function isEndingSoon(deadline?: string): boolean {
  if (!deadline) return false
  const end = new Date(deadline)
  const now = new Date()
  const diff = end.getTime() - now.getTime()
  return diff > 0 && diff < 2 * 24 * 60 * 60 * 1000 // 2 days
}

export function QuipCard({
  quip,
  variant,
  hasResponded = false,
  onViewResponses,
  onRespond,
  onClose,
}: QuipCardProps) {
  const timeRemaining = getTimeRemaining(quip.deadline)
  const isNewQuip = isNew(quip.created_at)
  const endingSoon = isEndingSoon(quip.deadline)

  return (
    <Card className="relative transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-100/80">
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div className="flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-base">{quip.title}</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          {variant === "admin" ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onViewResponses}>
                  View Responses
                </DropdownMenuItem>
                {quip.status === "active" && (
                  <DropdownMenuItem onClick={onClose}>
                    Close Quip
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              {isNewQuip && quip.status === "active" && (
                <Badge className="bg-blue-600 text-white">NEW</Badge>
              )}
              {hasResponded && (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700"
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Responded
                </Badge>
              )}
            </>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-muted-foreground text-sm">
          {'"'}
          {quip.description || quip.title}
          {'"'}
        </p>

        {variant === "admin" ? (
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-1.5 text-sm">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{quip.responses || 0}</span>
              <span className="text-muted-foreground">responses</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{timeRemaining}</span>
            </div>
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
        ) : (
          <div className="flex items-center gap-1.5 text-sm">
            <Clock
              className={`h-4 w-4 ${endingSoon ? "text-orange-500" : "text-muted-foreground"}`}
            />
            <span
              className={endingSoon ? "text-orange-500 font-medium" : "text-muted-foreground"}
            >
              {quip.status === "closed" ? "Closed" : `Ends in ${timeRemaining.replace(" left", "")}`}
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter>
        {variant === "admin" ? (
          <Button
            variant="outline"
            className="w-full bg-transparent"
            onClick={onViewResponses}
          >
            View Responses
          </Button>
        ) : (
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={onRespond}
            disabled={quip.status === "closed" || hasResponded}
          >
            {hasResponded ? "You've Responded" : "Share Your Feedback"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
