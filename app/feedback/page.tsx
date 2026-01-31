import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { FeedbackForm } from "@/components/feedback-form"

export default function FeedbackPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <Button
          variant="ghost"
          asChild
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Submit Feedback
        </h1>
        <p className="mt-2 text-muted-foreground">
          Share your thoughts, concerns, or suggestions anonymously.
        </p>

        <div className="mt-8">
          <FeedbackForm />
        </div>
      </div>
    </div>
  )
}
