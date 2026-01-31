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
import { Alert } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

const departments = [
  "Engineering",
  "Marketing",
  "Sales",
  "HR",
  "Operations",
  "Other",
]

type SubmissionState = "idle" | "loading" | "success" | "error"

export function FeedbackForm() {
  const [feedback, setFeedback] = useState("")
  const [department, setDepartment] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(true)
  const [state, setState] = useState<SubmissionState>("idle")
  const [errorMessage, setErrorMessage] = useState("")

  // Validate form data before submission
  const validateForm = (): boolean => {
    if (!feedback.trim()) {
      setErrorMessage("Please provide your feedback.")
      setState("error")
      return false
    }

    if (feedback.trim().length < 10) {
      setErrorMessage("Feedback must be at least 10 characters long.")
      setState("error")
      return false
    }

    if (!department) {
      setErrorMessage("Please select your department.")
      setState("error")
      return false
    }

    return true
  }

  // API call to n8n webhook
  const submitToN8n = async (formData: {
    feedback: string
    department: string
    isAnonymous: boolean
  }): Promise<void> => {
    const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL

    if (!webhookUrl) {
      throw new Error("Webhook URL is not configured. Please set NEXT_PUBLIC_N8N_WEBHOOK_URL environment variable.")
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        feedback: formData.feedback.trim(),
        department: formData.department,
        isAnonymous: formData.isAnonymous,
        timestamp: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to submit feedback: ${response.statusText}`)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setState("idle")
    setErrorMessage("")

    // Validate form data
    if (!validateForm()) {
      return
    }

    // Set loading state
    setState("loading")

    try {
      // Submit to n8n webhook
      await submitToN8n({
        feedback,
        department,
        isAnonymous,
      })

      // Success state
      setState("success")

      // Reset form after successful submission
      setTimeout(() => {
        setFeedback("")
        setDepartment("")
        setIsAnonymous(true)
        setState("idle")
      }, 3000)
    } catch (error) {
      // Error state
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again."
      )
      setState("error")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-8">
      {/* Success/Error Alert */}
      {state === "success" && (
        <Alert
          variant="success"
          title="Feedback submitted successfully!"
          message="Thank you for your feedback. We appreciate your input."
        />
      )}

      {state === "error" && (
        <Alert
          variant="error"
          title="Submission failed"
          message={errorMessage || "Please check your input and try again."}
        />
      )}

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
          className="min-h-[140px] resize-none rounded-xl border-border/60 bg-background px-4 py-3 text-base placeholder:text-muted-foreground/60 focus-visible:ring-primary"
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
            className="h-12 rounded-xl border-border/60 bg-background px-4 focus:ring-primary"
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
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={state === "loading"}
        className={`h-12 w-full rounded-xl text-base font-medium focus-visible:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
          state === "loading"
            ? "bg-orange-500 text-white"
            : "bg-primary text-primary-foreground hover:bg-orange-500 hover:text-white"
        }`}
      >
        {state === "loading" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Feedback"
        )}
      </Button>
    </form>
  )
}
