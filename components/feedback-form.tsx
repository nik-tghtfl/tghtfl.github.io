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
import type { User } from "@/types"

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

const ageRanges = [
  "18-24",
  "25-34",
  "35-44",
  "45-54",
  "55+",
  "Prefer not to say",
]

type SubmissionState = "idle" | "loading" | "success" | "error"

interface FeedbackFormProps {
  user: User
}

export function FeedbackForm({ user }: FeedbackFormProps) {
  const [feedback, setFeedback] = useState("")
  const [department, setDepartment] = useState("")
  const [processArea, setProcessArea] = useState("")
  const [userAgeRange, setUserAgeRange] = useState("")
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

    if (!processArea) {
      setErrorMessage("Please select a process area.")
      setState("error")
      return false
    }

    if (!userAgeRange) {
      setErrorMessage("Please select your age range.")
      setState("error")
      return false
    }

    return true
  }

  // API call to n8n webhook
  const submitToN8n = async (formData: {
    feedback: string
    department: string
    processArea: string
    userAgeRange: string
    isAnonymous: boolean
    user: User
  }): Promise<void> => {
    // Use environment variable if set, otherwise use the default webhook URL
    const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 
      "https://niktaughtful.app.n8n.cloud/webhook-test/8cc771d8-78fc-44bb-90ad-b3d5ac2ab7e4"

    if (!webhookUrl) {
      throw new Error("Webhook URL is not configured.")
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
      user_age_range: formData.userAgeRange,
      user_department: formData.department,
      k_anonymity_passed: formData.isAnonymous,
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
        department,
        processArea,
        userAgeRange,
        isAnonymous,
        user,
      })

      // Success state
      setState("success")

      // Reset form after successful submission
      setTimeout(() => {
        setFeedback("")
        setDepartment("")
        setProcessArea("")
        setUserAgeRange("")
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
          In which department is this issue most visible?
        </Label>
        <Select value={department} onValueChange={setDepartment} required>
          <SelectTrigger
            id="department"
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

      {/* Age Range Select */}
      <div className="space-y-3">
        <Label htmlFor="userAgeRange" className="text-sm font-medium">
          Age Range
        </Label>
        <Select value={userAgeRange} onValueChange={setUserAgeRange} required>
          <SelectTrigger
            id="userAgeRange"
            className="h-12 rounded-xl border-border/60 bg-background px-4 focus:ring-primary"
          >
            <SelectValue placeholder="Select your age range" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {ageRanges.map((range) => (
              <SelectItem
                key={range}
                value={range}
                className="rounded-lg"
              >
                {range}
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
