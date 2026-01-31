// lib/api.ts
// Google Sheets API integration

import type { Feedback } from "@/lib/data/feedbacks"
import { parseDateSafely } from "@/lib/data/feedbacks"

// Google Sheets Configuration
const SHEET_NAME = "Open-Feedback"
const SHEET_RANGE = `${SHEET_NAME}!A2:M` // Skip header row, get columns A-M

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
      // row[5] = process_area (F) - not used for category
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
        category: "Other" as const, // Default to "Other" as per requirements
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
