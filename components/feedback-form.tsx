"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
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
import type { User } from "@/types"
import confetti from "canvas-confetti"

const departments = [
  "Engineering",
  "Marketing",
  "Sales",
  "HR",
  "Operations",
  "Customer Success",
  "Product",
  "Other",
]

const processAreas = [
  "Process",
  "Communication",
  "Tools",
  "Culture",
  "Other",
]

type SubmissionState = "idle" | "loading" | "success" | "error"

interface FeedbackFormProps {
  user: User
}

export function FeedbackForm({ user }: FeedbackFormProps) {
  const [feedback, setFeedback] = useState("")
  const [affectedDepartment, setAffectedDepartment] = useState("")
  const [processArea, setProcessArea] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(true)
  const [state, setState] = useState<SubmissionState>("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const buttonRef = useRef<HTMLButtonElement>(null)

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

    if (!affectedDepartment) {
      setErrorMessage("Please select the department where this issue is most visible.")
      setState("error")
      return false
    }

    if (!processArea) {
      setErrorMessage("Please select a process area.")
      setState("error")
      return false
    }

    return true
  }

  /**
   * Cluster age range to match required format
   */
  const clusterAgeRange = (ageRange?: string): string => {
    if (!ageRange) return "25-34" // Default
    
    // Map existing ranges to new clusters
    const ageMap: Record<string, string> = {
      "18-24": "18-24",
      "25-34": "25-34",
      "35-44": "35-44",
      "45-54": "45-54",
      "55+": "55-64", // Map old 55+ to 55-64
    }
    
    // If already in correct format, return as-is
    if (ageMap[ageRange]) {
      return ageMap[ageRange]
    }
    
    // Try to parse numeric age and cluster
    const numericAge = parseInt(ageRange)
    if (!isNaN(numericAge)) {
      if (numericAge >= 18 && numericAge <= 24) return "18-24"
      if (numericAge >= 25 && numericAge <= 34) return "25-34"
      if (numericAge >= 35 && numericAge <= 44) return "35-44"
      if (numericAge >= 45 && numericAge <= 54) return "45-54"
      if (numericAge >= 55 && numericAge <= 64) return "55-64"
      if (numericAge >= 65) return "65+"
    }
    
    // Default fallback
    return "25-34"
  }

  // API call to n8n webhook
  const submitToN8n = async (formData: {
    feedback: string
    affectedDepartment: string
    processArea: string
    isAnonymous: boolean
    user: User
  }): Promise<void> => {
    const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL

    if (!webhookUrl) {
      throw new Error("Webhook URL is not configured. Please set NEXT_PUBLIC_N8N_WEBHOOK_URL in your environment variables.")
    }

    // Generate unique submission ID
    const submissionId = `sub-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    const submissionTime = new Date().toISOString()

    // Prepare payload with all required fields
    // Note: user name is included so n8n can filter it out if anonymous
    const payload = {
      submission_time: submissionTime,
      submission_id: submissionId,
      feedback_text: formData.feedback.trim(),
      process_area: formData.processArea,
      user_role: formData.user.role,
      user_age_range: clusterAgeRange(formData.user.ageRange),
      user_department: formData.user.team, // User's own department
      affected_department: formData.affectedDepartment, // Department where issue is visible
      is_anonymous: formData.isAnonymous,
      // Include user name for n8n to filter if anonymous
      user_name: formData.user.displayName,
      user_id: formData.user.id,
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
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
        affectedDepartment,
        processArea,
        isAnonymous,
        user,
      })

      // Success state
      setState("success")

      // Trigger confetti animation around the button
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect()
        const x = (rect.left + rect.right) / 2 / window.innerWidth
        const y = (rect.top + rect.bottom) / 2 / window.innerHeight

        // Create confetti burst from button position
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { x, y },
          colors: ['#4F46E5', '#F97316', '#10B981', '#3B82F6', '#8B5CF6'],
        })

        // Add a second burst for extra celebration
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x, y },
            colors: ['#4F46E5', '#F97316', '#10B981'],
          })
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x, y },
            colors: ['#3B82F6', '#8B5CF6', '#F97316'],
          })
        }, 250)
      }

      // Reset form after successful submission
      setTimeout(() => {
        setFeedback("")
        setAffectedDepartment("")
        setProcessArea("")
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

      {/* Affected Department Select */}
      <div className="space-y-3">
        <Label htmlFor="affectedDepartment" className="text-sm font-medium">
          In which department is this issue most visible?
        </Label>
        <Select value={affectedDepartment} onValueChange={setAffectedDepartment} required>
          <SelectTrigger
            id="affectedDepartment"
            className="h-12 rounded-xl border-border/60 bg-background px-4 focus:ring-primary"
          >
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {departments.map((dept) => (
              <SelectItem
                key={dept}
                value={dept}
                className="rounded-lg"
              >
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Process Area Select */}
      <div className="space-y-3">
        <Label htmlFor="processArea" className="text-sm font-medium">
          Area of Improvement
        </Label>
        <Select value={processArea} onValueChange={setProcessArea} required>
          <SelectTrigger
            id="processArea"
            className="h-12 rounded-xl border-border/60 bg-background px-4 focus:ring-primary"
          >
            <SelectValue placeholder="Select area of improvement" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {processAreas.map((area) => (
              <SelectItem
                key={area}
                value={area}
                className="rounded-lg"
              >
                {area}
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
        ref={buttonRef}
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
