"use client"

import React from "react"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

const departments = [
  "Engineering",
  "Marketing",
  "Sales",
  "HR",
  "Operations",
  "Other",
]

export function FeedbackForm() {
  const [feedback, setFeedback] = useState("")
  const [department, setDepartment] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ feedback, department, isAnonymous })
    // Reset form
    setFeedback("")
    setDepartment("")
    setIsAnonymous(true)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-8">
      {/* Feedback Textarea */}
      <div className="space-y-3">
        <Label htmlFor="feedback" className="text-sm font-medium">
          Your Feedback
        </Label>
        <Textarea
          id="feedback"
          placeholder="What's on your mind today?"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="min-h-[140px] resize-none rounded-xl border-border/60 bg-background px-4 py-3 text-base placeholder:text-muted-foreground/60 focus-visible:ring-orange-500"
          required
        />
      </div>

      {/* Department Select */}
      <div className="space-y-3">
        <Label htmlFor="department" className="text-sm font-medium">
          Department
        </Label>
        <Select value={department} onValueChange={setDepartment} required>
          <SelectTrigger
            id="department"
            className="h-12 rounded-xl border-border/60 bg-background px-4 focus:ring-orange-500"
          >
            <SelectValue placeholder="Select your department" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {departments.map((dept) => (
              <SelectItem
                key={dept}
                value={dept.toLowerCase()}
                className="rounded-lg"
              >
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Anonymous Toggle */}
      <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/30 p-4">
        <div className="space-y-0.5">
          <Label htmlFor="anonymous" className="text-sm font-medium">
            Submit Anonymously
          </Label>
          <p className="text-xs text-muted-foreground">
            Your identity will be hidden
          </p>
        </div>
        <Switch
          id="anonymous"
          checked={isAnonymous}
          onCheckedChange={setIsAnonymous}
          className="data-[state=checked]:bg-orange-500"
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="h-12 w-full rounded-xl bg-orange-500 text-base font-medium text-white hover:bg-orange-600 focus-visible:ring-orange-500"
      >
        Send Feedback
      </Button>
    </form>
  )
}
