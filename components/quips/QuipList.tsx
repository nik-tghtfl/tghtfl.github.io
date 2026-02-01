"use client"

import { Quip } from "@/types"
import { QuipCard } from "./QuipCard"
import { Megaphone } from "lucide-react"

interface QuipListProps {
  quips: Quip[]
  variant: "admin" | "employee"
  respondedQuipIds?: Set<string>
  onViewResponses?: (quip: Quip) => void
  onRespond?: (quip: Quip) => void
  onClose?: (quip: Quip) => void
  emptyMessage?: string
}

export function QuipList({
  quips,
  variant,
  respondedQuipIds = new Set(),
  onViewResponses,
  onRespond,
  onClose,
  emptyMessage = "No quips yet.",
}: QuipListProps) {
  if (quips.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/50 rounded-lg">
        <Megaphone className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="font-medium mb-1">{emptyMessage}</h3>
        {variant === "admin" && (
          <p className="text-sm text-muted-foreground">
            Create your first one to start collecting feedback!
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {quips.map((quip) => (
        <QuipCard
          key={quip.id}
          quip={quip}
          variant={variant}
          hasResponded={respondedQuipIds.has(quip.id)}
          onViewResponses={() => onViewResponses?.(quip)}
          onRespond={() => onRespond?.(quip)}
          onClose={() => onClose?.(quip)}
        />
      ))}
    </div>
  )
}
