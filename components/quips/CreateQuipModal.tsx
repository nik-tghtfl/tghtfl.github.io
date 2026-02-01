"use client"

import React from "react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Quip } from "@/types"

interface CreateQuipModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (quip: Omit<Quip, "id" | "created_at" | "responses">) => void
}

export function CreateQuipModal({
  open,
  onOpenChange,
  onCreate,
}: CreateQuipModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [deadline, setDeadline] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    onCreate({
      title: title.trim(),
      description: description.trim() || undefined,
      deadline: deadline ? new Date(deadline).toISOString() : undefined,
      status: "active",
      created_by: "", // Will be set by the parent component
    })

    setTitle("")
    setDescription("")
    setDeadline("")
    setIsSubmitting(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Quip</DialogTitle>
          <DialogDescription>
            Send a question to your team and collect anonymous feedback.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              What topic do you want feedback on? <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g., Q1 Tool Satisfaction"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Add context or specific questions</Label>
            <Textarea
              id="description"
              placeholder="e.g., We're evaluating our tool stack for Q2. What's working and what isn't?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline (optional)</Label>
            <Input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!title.trim() || isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Quip"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
