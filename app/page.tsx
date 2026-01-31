import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Shield, BarChart3 } from "lucide-react"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Welcome to <span className="text-primary">Quibi</span>
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Your voice matters. Share your feedback anonymously.
        </p>
        <p className="mx-auto mt-6 max-w-2xl text-muted-foreground leading-relaxed">
          Quibi is a safe space for employees to share honest feedback without
          fear of judgment. Our AI automatically categorizes your input, helping
          leaders understand what matters most to their teams.
        </p>
        <div className="mt-8">
          <Button asChild size="lg" className="rounded-lg px-8 py-6 text-lg">
            <Link href="/feedback">Submit Feedback</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto mt-20 max-w-4xl">
        <div className="grid gap-6 sm:grid-cols-3">
          <Card className="border-border bg-card">
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">Anonymous</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Your identity is never revealed
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">
                AI-Categorized
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Feedback is automatically organized
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">Insights</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Leaders see aggregated trends
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Placeholder for Open Programs */}
      <section className="mx-auto mt-20 max-w-3xl">
        <Card className="border-dashed border-2 border-border bg-muted/30">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium text-muted-foreground">
              Open Feedback Programs
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Active feedback programs will be displayed here.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
