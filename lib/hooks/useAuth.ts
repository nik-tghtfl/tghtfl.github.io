"use client"

import { useState, useEffect } from "react"
import { getUser, logout as authLogout, isAdmin, isMember } from "@/lib/auth"
import type { User } from "@/types"

interface UseAuthReturn {
  user: User | null
  isLoading: boolean
  isAdmin: boolean
  isMember: boolean
  logout: () => void
}

/**
 * Custom hook for managing authentication state
 * Handles SSR-safe auth state checking and prevents hydration mismatches
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined") {
      const updateUser = () => {
        try {
          const currentUser = getUser()
          // #region agent log
          console.log('[AUTH DEBUG] updateUser called', { hasUser: !!currentUser });
          fetch('http://127.0.0.1:7242/ingest/94295a68-58c0-4c7f-a369-b8d6564b2c9c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/hooks/useAuth.ts:26',message:'updateUser called',data:{hasUser:!!currentUser},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
          // #endregion
          setUser(currentUser)
          setIsLoading(false)
          // #region agent log
          console.log('[AUTH DEBUG] isLoading set to false');
          // #endregion
        } catch (error) {
          // #region agent log
          console.error('[AUTH DEBUG] updateUser error', error);
          fetch('http://127.0.0.1:7242/ingest/94295a68-58c0-4c7f-a369-b8d6564b2c9c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/hooks/useAuth.ts:35',message:'updateUser error',data:{error:error instanceof Error ? error.message : String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H'})}).catch(()=>{});
          // #endregion
          setUser(null)
          setIsLoading(false)
        }
      }

      // Initial check
      updateUser()

      // Listen for storage changes (e.g., when login happens in another tab/component)
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === "quibi_user" || e.key === null) {
          updateUser()
        }
      }

      window.addEventListener("storage", handleStorageChange)

      // Also listen for custom event for same-tab updates
      const handleAuthChange = () => {
        updateUser()
      }

      window.addEventListener("auth-change", handleAuthChange)

      return () => {
        window.removeEventListener("storage", handleStorageChange)
        window.removeEventListener("auth-change", handleAuthChange)
      }
    }
  }, [])

  const handleLogout = () => {
    authLogout()
    setUser(null)
  }

  return {
    user,
    isLoading,
    isAdmin: isAdmin(),
    isMember: isMember(),
    logout: handleLogout,
  }
}
