// lib/api.ts
// Google Sheets API integration

import type { Feedback } from "@/lib/data/feedbacks"
import { parseDateSafely } from "@/lib/data/feedbacks"
import type { Quip, QuipResponse } from "@/types"

// Legacy type aliases for backward compatibility during migration
type Blast = Quip
type BlastResponse = QuipResponse

// Google Sheets Configuration
const SHEET_NAME = "Open-Feedback"
const SHEET_RANGE = `${SHEET_NAME}!A2:M` // Skip header row, get columns A-M

// Blasts Configuration
const BLASTS_SHEET_NAME = "Blasts"
const BLASTS_RANGE = `${BLASTS_SHEET_NAME}!A2:G` // Skip header row, get columns A-G (id, title, description, created_at, deadline, status, created_by)
const BLAST_RESPONSES_SHEET_NAME = "Blast-Responses"
const BLAST_RESPONSES_RANGE = `${BLAST_RESPONSES_SHEET_NAME}!A2:G` // Skip header row, get columns A-G (id, blast_id, response, department, user_id, created_at, sentiment)

/**
 * Helper to send debug logs only in development (localhost)
 */
function sendDebugLog(logData: any) {
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
 * Fetch all quips from mock data
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
 * Fetch all quips (using mock data for now)
 * @deprecated Use getQuipsFromMock instead. This will be replaced with Google Sheets integration.
 */
export async function getBlastsFromSheet(): Promise<Blast[]> {
  const sheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY

  if (!sheetId || !apiKey) {
    console.error("Google Sheets API credentials not configured")
    return []
  }

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${BLASTS_RANGE}?key=${apiKey}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.statusText}`)
    }

    const data = await response.json()

    if (!data.values || data.values.length === 0) {
      return []
    }

    // Map rows to Blast objects
    // Column mapping: A=id, B=title, C=description, D=created_at, E=deadline, F=status, G=created_by
    const blasts: Blast[] = []

    for (let i = 0; i < data.values.length; i++) {
      const row = data.values[i]
      
      const id = row[0] || "" // A
      const title = row[1] || "" // B
      const description = row[2] || "" // C
      const created_at = row[3] || "" // D
      const deadline = row[4] || "" // E
      const status = (row[5] || "active") as "active" | "closed" // F
      const created_by = row[6] || "" // G

      // Skip empty rows
      if (!title.trim() || !id) {
        continue
      }

      // Safely parse timestamps
      const validCreatedAt = created_at
        ? parseDateSafely(created_at).toISOString()
        : new Date().toISOString()
      
      const validDeadline = deadline
        ? parseDateSafely(deadline).toISOString()
        : undefined

      blasts.push({
        id,
        title: title.trim(),
        description: description.trim() || undefined,
        created_at: validCreatedAt,
        deadline: validDeadline,
        status: status === "closed" ? "closed" : "active",
        created_by,
        responses: 0, // Will be calculated separately
      })
    }

    return blasts
  } catch (error) {
    console.error("Failed to fetch blasts from Google Sheet:", error)
    return []
  }
}

/**
 * Create a new quip via n8n webhook
 */
export async function createQuipInMock(quip: Omit<Quip, "id" | "created_at" | "responses">): Promise<Quip> {
  const webhookUrl = process.env.NEXT_PUBLIC_N8N_QUIP_WEBHOOK_URL || 
    "https://niktaughtful.app.n8n.cloud/webhook-test/533e2bee-94c9-44b3-83ca-4da889133ca3"

  if (!webhookUrl) {
    throw new Error("Quip webhook URL is not configured.")
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
 * Create a new blast via n8n webhook
 * @deprecated Use createQuipInMock instead. This will be replaced with n8n integration.
 */
export async function createBlastInSheet(blast: Omit<Blast, "id" | "created_at" | "responses">): Promise<void> {
  const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 
    "https://niktaughtful.app.n8n.cloud/webhook/8cc771d8-78fc-44bb-90ad-b3d5ac2ab7e4"

  if (!webhookUrl) {
    throw new Error("Webhook URL is not configured.")
  }

  // Generate unique blast ID
  const blastId = `blast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  const createdAt = new Date().toISOString()

  const payload = {
    type: "blast",
    id: blastId,
    title: blast.title.trim(),
    description: blast.description?.trim() || "",
    created_at: createdAt,
    deadline: blast.deadline || "",
    status: blast.status,
    created_by: blast.created_by,
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Failed to create blast: ${response.statusText}`)
  }
}

/**
 * Fetch all responses for a specific quip from mock data
 */
export async function getQuipResponsesFromMock(quipId: string): Promise<QuipResponse[]> {
  const { mockQuipResponses } = await import("@/lib/data/quips")
  return mockQuipResponses.filter(r => r.quip_id === quipId)
}

/**
 * Fetch all responses for a specific blast
 * @deprecated Use getQuipResponsesFromMock instead
 */
export async function getBlastResponsesFromSheet(blastId: string): Promise<BlastResponse[]> {
  const sheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY

  if (!sheetId || !apiKey) {
    console.error("Google Sheets API credentials not configured")
    return []
  }

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${BLAST_RESPONSES_RANGE}?key=${apiKey}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.statusText}`)
    }

    const data = await response.json()

    if (!data.values || data.values.length === 0) {
      return []
    }

    // Map rows to BlastResponse objects
    // Column mapping: A=id, B=blast_id, C=response, D=department, E=user_id, F=created_at, G=sentiment
    const responses: BlastResponse[] = []

    for (let i = 0; i < data.values.length; i++) {
      const row = data.values[i]
      
      const id = row[0] || "" // A
      const rowBlastId = row[1] || "" // B
      const responseText = row[2] || "" // C
      const department = row[3] || "" // D
      const userId = row[4] || "" // E
      const created_at = row[5] || "" // F
      const sentiment = normalizeSentiment(row[6]) // G

      // Only include responses for this blast
      if (rowBlastId !== blastId || !responseText.trim() || !id) {
        continue
      }

      // Safely parse timestamp
      const validCreatedAt = created_at
        ? parseDateSafely(created_at).toISOString()
        : new Date().toISOString()

      responses.push({
        id,
        blast_id: rowBlastId,
        response: responseText.trim(),
        department,
        user_id: userId,
        created_at: validCreatedAt,
        sentiment: sentiment !== "neutral" ? sentiment : undefined,
      })
    }

    return responses
  } catch (error) {
    console.error("Failed to fetch blast responses from Google Sheet:", error)
    return []
  }
}

/**
 * Submit a quip response (using mock data for now)
 */
export async function submitQuipResponse(response: Omit<QuipResponse, "id" | "created_at">): Promise<QuipResponse> {
  const newResponse: QuipResponse = {
    ...response,
    id: `response-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    created_at: new Date().toISOString(),
  }
  // In a real implementation, this would be saved to Google Sheets via n8n
  // For now, we just return the new response (it won't persist)
  return newResponse
}

/**
 * Submit a blast response via n8n webhook
 * @deprecated Use submitQuipResponse instead. This will be replaced with n8n integration.
 */
export async function submitBlastResponse(response: Omit<BlastResponse, "id" | "created_at">): Promise<void> {
  const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 
    "https://niktaughtful.app.n8n.cloud/webhook/8cc771d8-78fc-44bb-90ad-b3d5ac2ab7e4"

  if (!webhookUrl) {
    throw new Error("Webhook URL is not configured.")
  }

  // Generate unique response ID
  const responseId = `response-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  const createdAt = new Date().toISOString()

  const payload = {
    type: "blast_response",
    id: responseId,
    blast_id: response.blast_id,
    response: response.response.trim(),
    department: response.department,
    user_id: response.user_id,
    created_at: createdAt,
    sentiment: response.sentiment || "",
  }

  const apiResponse = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!apiResponse.ok) {
    throw new Error(`Failed to submit response: ${apiResponse.statusText}`)
  }
}

/**
 * Update quip status (using mock data for now)
 */
export async function updateQuipStatus(quipId: string, status: "active" | "closed"): Promise<void> {
  // In a real implementation, this would update Google Sheets via n8n
  // For now, this is a no-op (status changes won't persist)
  console.log(`Would update quip ${quipId} to status ${status}`)
}

/**
 * Update blast status (close/reopen) via n8n webhook
 * @deprecated Use updateQuipStatus instead. This will be replaced with n8n integration.
 */
export async function updateBlastStatus(blastId: string, status: "active" | "closed"): Promise<void> {
  const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 
    "https://niktaughtful.app.n8n.cloud/webhook/8cc771d8-78fc-44bb-90ad-b3d5ac2ab7e4"

  if (!webhookUrl) {
    throw new Error("Webhook URL is not configured.")
  }

  const payload = {
    type: "blast_update",
    id: blastId,
    status: status,
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Failed to update blast status: ${response.statusText}`)
  }
}
