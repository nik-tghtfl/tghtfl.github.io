import { Lock } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-6">
      <div className="container mx-auto px-4">
        <p className="flex items-center justify-center gap-2 text-center text-sm text-muted-foreground">
          <Lock className="h-4 w-4" />
          Your feedback is anonymous and treated confidentially.
        </p>
      </div>
    </footer>
  )
}
