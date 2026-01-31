import * as React from "react"
import { cn } from "@/lib/utils"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "success" | "error" | "loading"
  title?: string
  message?: string
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "success", title, message, children, ...props }, ref) => {
    const icons = {
      success: CheckCircle2,
      error: XCircle,
      loading: Loader2,
    }

    const styles = {
      success: "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200",
      error: "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200",
      loading: "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200",
    }

    const Icon = icons[variant]

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full rounded-lg border p-4",
          styles[variant],
          className
        )}
        {...props}
      >
        <div className="flex items-start gap-3">
          <Icon
            className={cn(
              "h-5 w-5 shrink-0",
              variant === "loading" && "animate-spin"
            )}
          />
          <div className="flex-1 space-y-1">
            {title && (
              <div className="text-sm font-semibold leading-none">{title}</div>
            )}
            {message && (
              <div className="text-sm leading-relaxed">{message}</div>
            )}
            {children}
          </div>
        </div>
      </div>
    )
  }
)
Alert.displayName = "Alert"

export { Alert }
