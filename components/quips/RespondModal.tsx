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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Quip, QuipResponse, DEPARTMENTS } from "@/types"
import { CheckCircle2 } from "lucide-react"

interface RespondModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  quip: Quip | null
  defaultDepartment?: string
  onSubmit: (response: Omit<QuipResponse, "id" | "created_at">) => void
}

export function RespondModal({
  open,
  onOpenChange,
  quip,
  defaultDepartment = "",
  onSubmit,
}: RespondModalProps) {
  const [response, setResponse] = useState("")
  const [department, setDepartment] = useState(defaultDepartment)
  const [isAnonymous, setIsAnonymous] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!quip || !response.trim() || !department) return

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    onSubmit({
      quip_id: quip.id,
      response: response.trim(),
      department,
      user_id: "user-1",
      sentiment: undefined,
    })

    setIsSuccess(true)
    
    // Auto close after showing success
    setTimeout(() => {
      setResponse("")
      setDepartment(defaultDepartment)
      setIsSuccess(false)
      setIsSubmitting(false)
      onOpenChange(false)
    }, 1500)
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setResponse("")
      setDepartment(defaultDepartment)
      setIsSuccess(false)
      setIsSubmitting(false)
    }
    onOpenChange(newOpen)
  }

  if (!quip) return null

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {isSuccess ? (
          <div className="py-12 text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
            <DialogTitle className="text-xl">Thanks!</DialogTitle>
            <p className="text-muted-foreground">
              Your feedback has been recorded.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{quip.title}</DialogTitle>
              {quip.description && (
                <DialogDescription>{quip.description}</DialogDescription>
              )}
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="response">Your Feedback</Label>
                <Textarea
                  id="response"
                  placeholder="Share your thoughts..."
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your department" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label htmlFor="anonymous">Submit Anonymously</Label>
                  <p className="text-xs text-muted-foreground">
                    Your name will not be attached to this response.
                  </p>
                </div>
                <Switch
                  id="anonymous"
                  checked={isAnonymous}
                  onCheckedChange={setIsAnonymous}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={!response.trim() || !department || isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Feedback"}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
