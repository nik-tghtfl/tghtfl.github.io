import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MessageSquarePlus } from "lucide-react"

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

        <Card className="mt-8 border-dashed border-2 border-border bg-muted/30">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <MessageSquarePlus className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="mt-4 text-muted-foreground">
              Feedback Form Coming Soon
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">
              The feedback form will go here. You will be able to submit
              anonymous feedback that gets automatically categorized by AI.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
