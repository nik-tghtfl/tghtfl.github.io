import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Users } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Dashboard
            </h1>
            <p className="mt-2 text-muted-foreground">
              View aggregated feedback insights and trends.
            </p>
          </div>
          <Badge
            variant="secondary"
            className="flex items-center gap-1.5 px-3 py-1"
          >
            <Users className="h-3.5 w-3.5" />
            Team Leads / Admins
          </Badge>
        </div>

        <Card className="mt-8 border-dashed border-2 border-border bg-muted/30">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="mt-4 text-muted-foreground">
              Analytics Coming Soon
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">
              Statistics and feedback overview will appear here. You will see
              charts, category breakdowns, and sentiment analysis.
            </p>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          This page is intended for Team Leads and Admins only.
        </p>
      </div>
    </div>
  )
}
