"use client"

import { useState, FormEvent, useEffect } from "react"
import { useRouter } from "next/navigation"
import { login, getDemoCredentials } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  // #region agent log
  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      fetch('http://127.0.0.1:7242/ingest/94295a68-58c0-4c7f-a369-b8d6564b2c9c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/login/page.tsx:18',message:'LoginPage component mounted',data:{pathname:window.location.pathname,hostname:window.location.hostname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    }
  }, []);
  // #endregion

  // #region agent log
  let demoCredentials;
  try {
    demoCredentials = getDemoCredentials();
    if (typeof window !== 'undefined') {
      console.log('[LOGIN DEBUG] getDemoCredentials success', demoCredentials);
    }
  } catch (error) {
    console.error('[LOGIN DEBUG] getDemoCredentials error', error);
    if (typeof window !== 'undefined') {
      fetch('http://127.0.0.1:7242/ingest/94295a68-58c0-4c7f-a369-b8d6564b2c9c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/login/page.tsx:28',message:'getDemoCredentials error',data:{error:error instanceof Error ? error.message : String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    }
    demoCredentials = { member: { username: 'lisa', password: 'demo' }, admin: { username: 'admin', password: 'admin' } };
  }
  
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      fetch('http://127.0.0.1:7242/ingest/94295a68-58c0-4c7f-a369-b8d6564b2c9c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/login/page.tsx:35',message:'LoginPage rendering',data:{hasDemoCredentials:!!demoCredentials,mounted:mounted},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    }
  }, [mounted]);
  // #endregion

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const user = login(username, password)

    if (!user) {
      setError("Invalid username or password")
      setIsLoading(false)
      return
    }

    // Redirect based on role
    if (user.role === "admin") {
      router.push("/dashboard")
    } else {
      router.push("/")
    }
  }

  // #region agent log
  if (typeof window !== 'undefined') {
    console.log('[LOGIN DEBUG] Component rendering', { mounted, hasDemoCredentials: !!demoCredentials });
    fetch('http://127.0.0.1:7242/ingest/94295a68-58c0-4c7f-a369-b8d6564b2c9c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/login/page.tsx:42',message:'LoginPage about to render',data:{mounted:mounted,hasDemoCredentials:!!demoCredentials,username:username.length,error:error.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  }
  // #endregion

  if (!mounted) {
    // #region agent log
    if (typeof window !== 'undefined') {
      console.log('[LOGIN DEBUG] Not mounted, showing loading');
    }
    // #endregion
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-12">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  // #region agent log
  if (typeof window !== 'undefined') {
    console.log('[LOGIN DEBUG] Rendering login form');
  }
  // #endregion

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Login to Quippi</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
                {error}
              </div>
            )}

            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                disabled={isLoading}
                autoComplete="username"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          {/* Demo Credentials Hint */}
          <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4">
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Demo Credentials:
            </p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>
                Employee: <span className="font-mono">{demoCredentials.member.username}</span> /{" "}
                <span className="font-mono">{demoCredentials.member.password}</span>
              </p>
              <p>
                Admin: <span className="font-mono">{demoCredentials.admin.username}</span> /{" "}
                <span className="font-mono">{demoCredentials.admin.password}</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
