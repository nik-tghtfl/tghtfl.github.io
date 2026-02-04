// lib/api.ts
// Google Sheets API integration

import type { Feedback } from "@/lib/data/feedbacks"
import { parseDateSafely } from "@/lib/data/feedbacks"
import type { Quip, QuipResponse } from "@/types"

// Google Sheets Configuration
const SHEET_NAME = "Open-Feedback"
const SHEET_RANGE = `${SHEET_NAME}!A2:M` // Skip header row, get columns A-M
const QUIPS_SHEET_NAME = "Quips"
const QUIPS_SHEET_RANGE = `${QUIPS_SHEET_NAME}!A2:G` // Skip header row, get columns A-G (G=status if exists)

/**
 * Helper to send debug logs only in development (localhost)
 * Exported for use in other files
 */
export function sendDebugLog(logData: any) {
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    fetch('http://127.0.0.1:7242/ingest/94295a68-58c0-4c7f-a369-b8d6564b2c9c', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logData)
    }).catch(() => {})
  }
}

/**
 * Convert string to boolean (handles "true"/"false", "1"/"0", etc.)
 */
function parseBoolean(value: string | undefined): boolean {
  if (!value) return false
  const lower = value.toLowerCase().trim()
  return lower === "true" || lower === "1" || lower === "yes"
}

/**
 * Validate and normalize sentiment value
 */
function normalizeSentiment(value: string | undefined): "positive" | "neutral" | "negative" {
  if (!value) return "neutral"
  const lower = value.toLowerCase().trim()
  if (lower === "positive") return "positive"
  if (lower === "negative") return "negative"
  return "neutral"
}

/**
 * Normalize process_area to a valid Feedback category
 */
function normalizeCategory(value: string | undefined): "Process" | "Communication" | "Tools" | "Culture" | "Other" {
  if (!value) return "Other"
  const normalized = value.trim()
  // Case-insensitive matching for valid categories
  const lower = normalized.toLowerCase()
  if (lower === "process") return "Process"
  if (lower === "communication") return "Communication"
  if (lower === "tools") return "Tools"
  if (lower === "culture") return "Culture"
  if (lower === "other") return "Other"
  // If it doesn't match, default to "Other"
  return "Other"
}

/**
 * Fetch all feedbacks from Google Sheet and convert to Feedback[]
 */
export async function getFeedbacksFromSheet(): Promise<Feedback[]> {
  // #region agent log
  const sheetIdCheck = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID
  const apiKeyCheck = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  const debugLog = {location:'lib/api.ts:132',message:'getFeedbacksFromSheet called',data:{hasSheetId:!!sheetIdCheck,hasApiKey:!!apiKeyCheck,sheetIdValue:sheetIdCheck?.substring(0,10)||'missing',apiKeyValue:apiKeyCheck?.substring(0,10)||'missing',allEnvVars:Object.keys(process.env).filter(k=>k.startsWith('NEXT_PUBLIC')).join(',')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'};
  console.log('[DEBUG]', debugLog);
  sendDebugLog(debugLog);
  // #endregion
  const sheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY

  if (!sheetId || !apiKey) {
    // #region agent log
    const debugLog = {location:'lib/api.ts:140',message:'Missing credentials',data:{hasSheetId:!!sheetId,hasApiKey:!!apiKey,sheetIdValue:sheetId||'undefined',apiKeyValue:apiKey||'undefined'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'};
    console.error('[DEBUG] Missing credentials:', debugLog);
    sendDebugLog(debugLog);
    // #endregion
    console.error(
      "Google Sheets API credentials not configured. Please set NEXT_PUBLIC_GOOGLE_SHEET_ID and NEXT_PUBLIC_GOOGLE_API_KEY"
    )
    throw new Error("Google Sheets API credentials not configured. Check environment variables.")
  }

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${SHEET_RANGE}?key=${apiKey}`
    // #region agent log
    const debugLog = {location:'lib/api.ts:107',message:'Fetching from Google Sheets',data:{url:url.replace(apiKey,'***'),sheetRange:SHEET_RANGE},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'};
    console.log('[DEBUG]', debugLog);
    sendDebugLog(debugLog);
    // #endregion

    const response = await fetch(url)
    // #region agent log
    {
      const debugLog = {location:'lib/api.ts:110',message:'API response received',data:{status:response.status,statusText:response.statusText,ok:response.ok},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'};
      console.log('[DEBUG]', debugLog);
      sendDebugLog(debugLog);
    }
    // #endregion

    if (!response.ok) {
      // #region agent log
      const errorText = await response.text().catch(()=>'');
      {
        const debugLog = {location:'lib/api.ts:112',message:'API error response',data:{status:response.status,statusText:response.statusText,errorText:errorText.substring(0,200)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'};
        console.error('[DEBUG]', debugLog);
        sendDebugLog(debugLog);
      }
      // #endregion
      throw new Error(`Google Sheets API error: ${response.statusText}`)
    }

    const data = await response.json()
    // #region agent log
    {
      const debugLog = {location:'lib/api.ts:115',message:'Data parsed from API',data:{hasValues:!!data.values,valuesLength:data.values?.length||0,firstRowSample:data.values?.[0]?.slice(0,3)||null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'};
      console.log('[DEBUG]', debugLog);
      sendDebugLog(debugLog);
    }
    // #endregion

    if (!data.values || data.values.length === 0) {
      // #region agent log
      const debugLog = {location:'lib/api.ts:117',message:'No data rows found',data:{hasValues:!!data.values,valuesLength:data.values?.length||0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'};
      console.warn('[DEBUG]', debugLog);
      sendDebugLog(debugLog);
      // #endregion
      return []
    }

    // Map rows to Feedback objects
    // Column mapping: A=submission_time, B=submission_id, C=is_anonymous,
    // D=affected_department, E=feedback_text, F=process_area, G=user_id,
    // H=user_name, I=user_role, J=user_age_range, K=user_department,
    // L=user_action_recommendation, M=sentiment_analysis
    const feedbacks: Feedback[] = []

    // Process rows
    for (let i = 0; i < data.values.length; i++) {
      const row = data.values[i]
      
      // Extract values from row (columns A-M)
      const submissionTime = row[0] || "" // A
      const submissionId = row[1] || "" // B
      const isAnonymous = parseBoolean(row[2]) // C
      const affectedDepartment = row[3] || "" // D
      const feedbackText = row[4] || "" // E
      const processArea = row[5] || "" // F - process_area
      const userId = row[6] || "" // G
      // row[7] = user_name (H) - not in Feedback type
      // row[8] = user_role (I) - not in Feedback type
      // row[9] = user_age_range (J) - not in Feedback type
      // row[10] = user_department (K) - not in Feedback type
      const actionRecommendation = row[11] || "" // L - user_action_recommendation
      const sentimentAnalysis = normalizeSentiment(row[12]) // M

      // Skip empty rows
      if (!feedbackText.trim() || !submissionId) {
        continue
      }

      // Generate summary from feedback text (truncate if needed)
      const summary = feedbackText.length > 100
        ? feedbackText.substring(0, 100) + "..."
        : feedbackText

      // Safely parse timestamp - ensure it's a valid ISO string
      const validTimestamp = submissionTime
        ? parseDateSafely(submissionTime).toISOString()
        : new Date().toISOString()

      feedbacks.push({
        id: submissionId,
        timestamp: validTimestamp,
        feedback: feedbackText,
        department: affectedDepartment || "Other",
        anonymous: isAnonymous,
        category: normalizeCategory(processArea), // Read from process_area column
        sentiment: sentimentAnalysis,
        summary: summary,
        user_id: userId || "",
        actionRecommendation: actionRecommendation.trim() || undefined,
      } as Feedback)
    }
    // #region agent log
    {
      const debugLog = {location:'lib/api.ts:173',message:'Returning feedbacks',data:{totalFeedbacks:feedbacks.length,firstFeedbackId:feedbacks[0]?.id||null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'};
      console.log('[DEBUG]', debugLog);
      sendDebugLog(debugLog);
    }
    // #endregion
    return feedbacks
  } catch (error) {
    // #region agent log
    const debugLog = {location:'lib/api.ts:175',message:'Error caught',data:{errorMessage:error instanceof Error?error.message:String(error),errorStack:error instanceof Error?error.stack?.substring(0,200):null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'};
    console.error('[DEBUG]', debugLog);
    sendDebugLog(debugLog);
    // #endregion
    console.error("Failed to fetch feedbacks from Google Sheet:", error)
    return []
  }
}

/**
 * Fetch all quips from Google Sheet
 */
export async function getQuipsFromSheet(): Promise<Quip[]> {
  const sheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY

  if (!sheetId || !apiKey) {
    console.error(
      "Google Sheets API credentials not configured. Please set NEXT_PUBLIC_GOOGLE_SHEET_ID and NEXT_PUBLIC_GOOGLE_API_KEY"
    )
    throw new Error("Google Sheets API credentials not configured. Check environment variables.")
  }

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${QUIPS_SHEET_RANGE}?key=${apiKey}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.statusText}`)
    }

    const data = await response.json()

    if (!data.values || data.values.length === 0) {
      return []
    }

    // Map rows to Quip objects
    // Column mapping based on webhook payload:
    // A=quip_submission_time, B=quip_id, C=quip_title, D=quip_text, E=quip_title_user_id, F=quip_deadline, G=status (optional)
    const quips: Quip[] = []

    for (let i = 0; i < data.values.length; i++) {
      const row = data.values[i]
      
      // Extract values from row (columns A-G)
      const submissionTime = row[0] || "" // A - quip_submission_time
      const quipId = row[1] || "" // B - quip_id
      const title = row[2] || "" // C - quip_title
      const description = row[3] || "" // D - quip_text
      const createdBy = row[4] || "" // E - quip_title_user_id
      const deadline = row[5] || "" // F - quip_deadline
      const statusColumn = row[6] || "" // G - status (optional)

      // Skip empty rows
      if (!quipId || !title) {
        continue
      }

      // Determine status: use column G if present, otherwise infer from deadline
      let status: "active" | "closed" = "active"
      if (statusColumn) {
        const statusLower = statusColumn.toLowerCase().trim()
        if (statusLower === "closed" || statusLower === "inactive") {
          status = "closed"
        } else {
          status = "active"
        }
      } else if (deadline) {
        // If no status column, infer from deadline
        try {
          const deadlineDate = parseDateSafely(deadline)
          const now = new Date()
          if (deadlineDate < now) {
            status = "closed"
          }
        } catch (error) {
          // If date parsing fails, default to active
          console.warn(`Failed to parse deadline for quip ${quipId}:`, error)
        }
      }

      // Parse created_at date
      const createdAt = submissionTime || new Date().toISOString()

      quips.push({
        id: quipId,
        title: title.trim(),
        description: description?.trim() || undefined,
        created_at: createdAt,
        deadline: deadline || undefined,
        status,
        created_by: createdBy || "admin",
        responses: 0, // Will be calculated separately if needed
      })
    }

    return quips
  } catch (error) {
    console.error("Failed to fetch quips from Google Sheets:", error)
    throw error
  }
}

/**
 * Fetch all quip responses from Google Sheet
 */
export async function getQuipResponsesFromSheet(): Promise<QuipResponse[]> {
  const sheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY

  if (!sheetId || !apiKey) {
    console.error(
      "Google Sheets API credentials not configured. Please set NEXT_PUBLIC_GOOGLE_SHEET_ID and NEXT_PUBLIC_GOOGLE_API_KEY"
    )
    return []
  }

  // Try multiple sheet name variations
  const QUIP_RESPONSES_SHEET_NAMES = [
    "Quips Responses", // Prioritize the correct plural name
    "Quip Responses",
    "QuipResponses",
    "Quip_Responses",
    "quip_responses",
    "Quip-Responses"
  ]
  const QUIP_RESPONSES_SHEET_RANGE = `!A2:I` // Extended to column I for user_name

  // Try each sheet name variation
  for (const sheetName of QUIP_RESPONSES_SHEET_NAMES) {
    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(sheetName)}${QUIP_RESPONSES_SHEET_RANGE}?key=${apiKey}`
      const response = await fetch(url)

      if (!response.ok) {
        // If 400 error, try next sheet name
        if (response.status === 400) {
          continue
        }
        throw new Error(`Google Sheets API error: ${response.statusText}`)
      }

      const data = await response.json()

      if (!data.values || data.values.length === 0) {
        return []
      }

      // Map rows to QuipResponse objects
      // Column mapping: A=quip_response_id, B=quip_id, C=response_text, D=department,
      // E=user_id, F=created_at, G=sentiment, H=is_anonymous, I=quip_response_user_name
      const responses: QuipResponse[] = []

      for (let i = 0; i < data.values.length; i++) {
        const row = data.values[i]

        // Extract values from row (columns A-I)
        const responseId = (row[0] || "").trim() // A - quip_response_id
        const rowQuipId = (row[1] || "").trim() // B - quip_id
        const responseText = (row[2] || "").trim() // C - response_text
        const department = (row[3] || "").trim() // D - department
        const userId = (row[4] || "").trim() // E - user_id
        const createdAt = (row[5] || "").trim() // F - created_at
        const sentiment = (row[6] || "").trim() // G - sentiment
        const isAnonymous = parseBoolean(row[7]) // H - is_anonymous
        const userName = (row[8] || "").trim() // I - quip_response_user_name

        // Skip empty rows
        if (!responseId || !rowQuipId || !responseText) {
          continue
        }

        // Parse created_at date safely
        let validCreatedAt: string
        try {
          validCreatedAt = createdAt
            ? parseDateSafely(createdAt).toISOString()
            : new Date().toISOString()
        } catch (error) {
          validCreatedAt = new Date().toISOString()
        }

        // Normalize sentiment
        const normalizedSentiment = normalizeSentiment(sentiment)

        responses.push({
          id: responseId,
          quip_id: rowQuipId,
          response: responseText,
          department: department || "Unknown",
          user_id: userId || "unknown",
          created_at: validCreatedAt,
          sentiment: normalizedSentiment === "neutral" ? undefined : normalizedSentiment,
          is_anonymous: isAnonymous,
          user_name: userName || (isAnonymous ? "Anonymous" : "Unknown User"),
        })
      }

      return responses
    } catch (error) {
      // If this sheet name failed, try the next one
      if (error instanceof Error && error.message.includes("400")) {
        continue
      }
      // If it's a different error, log it but continue trying
      console.warn(`Failed to fetch from sheet "${sheetName}":`, error)
      continue
    }
  }

  // If all sheet name variations failed, try to discover available sheets
  try {
    const metadataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?key=${apiKey}&fields=sheets.properties.title`
    const metadataResponse = await fetch(metadataUrl)

    if (metadataResponse.ok) {
      const metadata = await metadataResponse.json()
      const availableSheets = metadata.sheets?.map((s: any) => s.properties.title) || []
      console.log("[Quip Responses] Available sheets:", availableSheets)

      // Try likely response sheet names from available sheets
      const likelySheets = availableSheets.filter((name: string) =>
        name.toLowerCase().includes("response") || name.toLowerCase().includes("quip")
      )

      for (const sheetName of likelySheets) {
        try {
          const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(sheetName)}${QUIP_RESPONSES_SHEET_RANGE}?key=${apiKey}`
          const response = await fetch(url)

          if (response.ok) {
            const data = await response.json()
            if (data.values && data.values.length > 0) {
              // Parse the data (same logic as above)
              const responses: QuipResponse[] = []
              for (let i = 0; i < data.values.length; i++) {
                const row = data.values[i]
                const responseId = (row[0] || "").trim()
                const rowQuipId = (row[1] || "").trim()
                const responseText = (row[2] || "").trim()
                const department = (row[3] || "").trim()
                const userId = (row[4] || "").trim()
                const createdAt = (row[5] || "").trim()
                const sentiment = (row[6] || "").trim()
                const isAnonymous = parseBoolean(row[7])
                const userName = (row[8] || "").trim()

                if (!responseId || !rowQuipId || !responseText) {
                  continue
                }

                let validCreatedAt: string
                try {
                  validCreatedAt = createdAt
                    ? parseDateSafely(createdAt).toISOString()
                    : new Date().toISOString()
                } catch (error) {
                  validCreatedAt = new Date().toISOString()
                }

                const normalizedSentiment = normalizeSentiment(sentiment)

                responses.push({
                  id: responseId,
                  quip_id: rowQuipId,
                  response: responseText,
                  department: department || "Unknown",
                  user_id: userId || "unknown",
                  created_at: validCreatedAt,
                  sentiment: normalizedSentiment === "neutral" ? undefined : normalizedSentiment,
                  is_anonymous: isAnonymous,
                  user_name: userName || (isAnonymous ? "Anonymous" : "Unknown User"),
                })
              }
              return responses
            }
          }
        } catch (error) {
          continue
        }
      }
    }
  } catch (error) {
    console.error("Failed to discover available sheets:", error)
  }

  // If all attempts failed, return empty array
  console.warn("Could not find quip responses sheet. Tried:", QUIP_RESPONSES_SHEET_NAMES)
  return []
}

/**
 * Fetch all quips from mock data (fallback)
 */
export async function getQuipsFromMock(): Promise<Quip[]> {
  // Import mock data
  const { mockQuips, mockQuipResponses } = await import("@/lib/data/quips")
  
  // Calculate response counts
  return mockQuips.map(quip => ({
    ...quip,
    responses: mockQuipResponses.filter(r => r.quip_id === quip.id).length
  }))
}

/**
 * Create a new quip via n8n webhook
 */
export async function createQuipInMock(quip: Omit<Quip, "id" | "created_at" | "responses">): Promise<Quip> {
  // Get env var - handle both undefined and empty string cases
  // In Next.js static exports, missing env vars can become "undefined" string or actual undefined
  const envVar = process.env.NEXT_PUBLIC_N8N_QUIP_WEBHOOK_URL
  const webhookUrl = (envVar && envVar !== "undefined" && envVar.trim()) || 
    "https://niktaughtful.app.n8n.cloud/webhook/533e2bee-94c9-44b3-83ca-4da889133ca3" // Production webhook

  if (!webhookUrl || webhookUrl === "undefined") {
    throw new Error("Quip webhook URL is not configured. Please set NEXT_PUBLIC_N8N_QUIP_WEBHOOK_URL in your environment variables.")
  }

  // Generate unique quip ID
  const quipId = `quip-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  const submissionTime = new Date().toISOString()

  // Map to n8n webhook column format
  const payload = {
    quip_submission_time: submissionTime,
    quip_id: quipId,
    quip_title: quip.title.trim(),
    quip_text: quip.description?.trim() || "",
    quip_title_user_id: quip.created_by, // User ID who created the quip
    quip_deadline: quip.deadline || "",
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Failed to create quip: ${response.statusText}`)
  }

  // Return the created quip object
  const newQuip: Quip = {
    ...quip,
    id: quipId,
    created_at: submissionTime,
    responses: 0,
  }

  return newQuip
}

/**
 * Fetch all responses for a specific quip from mock data
 */
export async function getQuipResponsesFromMock(quipId: string): Promise<QuipResponse[]> {
  const { mockQuipResponses } = await import("@/lib/data/quips")
  return mockQuipResponses.filter(r => r.quip_id === quipId)
}

/**
 * Submit a quip response via n8n webhook
 */
export async function submitQuipResponse(response: Omit<QuipResponse, "id" | "created_at">): Promise<QuipResponse> {
  // Get env var - handle both undefined and empty string cases
  // In Next.js static exports, missing env vars can become "undefined" string or actual undefined
  const envVar = process.env.NEXT_PUBLIC_N8N_QUIP_RESPONSE_WEBHOOK_URL
  const webhookUrl = (envVar && envVar !== "undefined" && envVar.trim()) || 
    "https://niktaughtful.app.n8n.cloud/webhook/826e3794-6377-422f-afe1-8f858dc554c9"

  if (!webhookUrl || webhookUrl === "undefined") {
    throw new Error("Quip response webhook URL is not configured. Please set NEXT_PUBLIC_N8N_QUIP_RESPONSE_WEBHOOK_URL in your environment variables.")
  }

  // Generate unique response ID
  const responseId = `response-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  const createdAt = new Date().toISOString()

  // Map to n8n webhook format
  // Note: Adjust column names based on what the webhook expects
  const payload = {
    quip_response_id: responseId,
    quip_id: response.quip_id,
    response_text: response.response.trim(),
    department: response.department,
    user_id: response.user_id,
    created_at: createdAt,
    sentiment: response.sentiment || "",
    is_anonymous: response.is_anonymous ?? true, // Default to true if not specified
  }

  const apiResponse = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!apiResponse.ok) {
    throw new Error(`Failed to submit quip response: ${apiResponse.statusText}`)
  }

  // Return the created response object
  const newResponse: QuipResponse = {
    ...response,
    id: responseId,
    created_at: createdAt,
  }

  return newResponse
}

/**
 * Fetch users from Google Sheets Users tab
 * Returns a Map of user_id -> { name: string, department: string }
 */
export async function getUsersFromSheet(): Promise<Map<string, { name: string; department: string }>> {
  const sheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY

  if (!sheetId || !apiKey) {
    console.warn("Google Sheets API credentials not configured. Cannot fetch users.")
    return new Map()
  }

  // Try multiple sheet name variations
  const USER_SHEET_NAMES = [
    "Users",
    "User",
    "user",
    "User List",
    "Users List"
  ]
  const USER_SHEET_RANGE = `!A2:F` // Skip header row, columns A-F (user_id, user_login, user_password, user_name, user_role, user_department)

  for (const sheetName of USER_SHEET_NAMES) {
    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(sheetName)}${USER_SHEET_RANGE}?key=${apiKey}`
      const response = await fetch(url)

      if (!response.ok) {
        if (response.status === 400) {
          continue // Try next sheet name
        }
        throw new Error(`Google Sheets API error: ${response.statusText}`)
      }

      const data = await response.json()

      if (!data.values || data.values.length === 0) {
        return new Map()
      }

      const userMap = new Map<string, { name: string; department: string }>()

      for (const row of data.values) {
        const userId = (row[0] || "").trim() // A - user_id
        // row[1] = user_login (B) - skip
        // row[2] = user_password (C) - skip
        const name = (row[3] || "").trim() // D - user_name
        // row[4] = user_role (E) - skip
        const department = (row[5] || "").trim() // F - user_department

        if (userId && name) {
          userMap.set(userId, {
            name,
            department: department || "Unknown",
          })
        }
      }

      return userMap
    } catch (error) {
      if (error instanceof Error && error.message.includes("400")) {
        continue // Try next sheet name
      }
      console.warn(`Failed to fetch from sheet "${sheetName}":`, error)
      continue
    }
  }

  // If all attempts failed, return empty map
  console.warn("Could not find Users sheet. Tried:", USER_SHEET_NAMES)
  return new Map()
}

/**
 * Update quip status (using mock data for now)
 */
export async function updateQuipStatus(quipId: string, status: "active" | "closed"): Promise<void> {
  // In a real implementation, this would update Google Sheets via n8n
  // For now, this is a no-op (status changes won't persist)
  console.log(`Would update quip ${quipId} to status ${status}`)
}

