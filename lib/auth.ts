import type { User, UserRole } from "@/types"

// Demo users - hardcoded for V0.2-Auth
const DEMO_USERS: (User & { password: string })[] = [
  {
    id: "1",
    username: "lisa",
    password: "demo",
    displayName: "Lisa Berger",
    role: "member",
    team: "Product",
    ageRange: "25-34",
  },
  {
    id: "2",
    username: "markus",
    password: "demo",
    displayName: "Markus Hoffmann",
    role: "member",
    team: "Engineering",
    ageRange: "35-44",
  },
  {
    id: "3",
    username: "tom",
    password: "demo",
    displayName: "Tom Richter",
    role: "member",
    team: "Marketing",
    ageRange: "25-34",
  },
  {
    id: "4",
    username: "nina",
    password: "demo",
    displayName: "Nina Vogel",
    role: "member",
    team: "Customer Success",
    ageRange: "25-34",
  },
  {
    id: "5",
    username: "sarah",
    password: "admin",
    displayName: "Sarah Klein",
    role: "admin",
    team: "HR",
    ageRange: "35-44",
  },
  {
    id: "6",
    username: "admin",
    password: "admin",
    displayName: "Admin User",
    role: "admin",
    team: "Management",
    ageRange: "35-44",
  },
]

const STORAGE_KEY = "quibi_user"

/**
 * Attempts to login a user with the provided credentials
 * @param username - The username to login with
 * @param password - The password to verify
 * @returns The user object if credentials are valid, null otherwise
 */
export function login(username: string, password: string): User | null {
  if (typeof window === "undefined") {
    return null
  }

  const user = DEMO_USERS.find(
    (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
  )

  if (!user) {
    return null
  }

  // Store user WITHOUT password
  const { password: _, ...userWithoutPassword } = user
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword))

  // Dispatch custom event to notify components of auth change
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("auth-change"))
  }

  return userWithoutPassword
}

/**
 * Logs out the current user by clearing localStorage
 */
export function logout(): void {
  if (typeof window === "undefined") {
    return
  }

  localStorage.removeItem(STORAGE_KEY)

  // Dispatch custom event to notify components of auth change
  window.dispatchEvent(new Event("auth-change"))
}

/**
 * Retrieves the current logged-in user from localStorage
 * @returns The user object if logged in, null otherwise
 */
export function getUser(): User | null {
  if (typeof window === "undefined") {
    return null
  }

  try {
    const userJson = localStorage.getItem(STORAGE_KEY)
    if (!userJson) {
      return null
    }

    return JSON.parse(userJson) as User
  } catch {
    return null
  }
}

/**
 * Checks if a user is currently logged in
 * @returns true if a user is logged in, false otherwise
 */
export function isLoggedIn(): boolean {
  return getUser() !== null
}

/**
 * Checks if the current user has admin role
 * @returns true if user is admin, false otherwise
 */
export function isAdmin(): boolean {
  const user = getUser()
  return user?.role === "admin"
}

/**
 * Checks if the current user has member role
 * @returns true if user is member, false otherwise
 */
export function isMember(): boolean {
  const user = getUser()
  return user?.role === "member"
}

/**
 * Returns example credentials for display on the login page
 * @returns Object with member and admin example credentials
 */
export function getDemoCredentials(): {
  member: { username: string; password: string }
  admin: { username: string; password: string }
} {
  return {
    member: { username: "lisa", password: "demo" },
    admin: { username: "admin", password: "admin" },
  }
}
