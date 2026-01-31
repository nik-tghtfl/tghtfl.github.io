// lib/api.ts
// Google Sheets API integration and Google Gemini API for summary generation

import type { Feedback } from "@/lib/data/feedbacks"

// Google Sheets Configuration
const SHEET_NAME = "Open-Feedback"
const SHEET_RANGE = `${SHEET_NAME}!A2:M` // Skip header row, get columns A-M

/**
 * Generate a summary from feedback text using Google Gemini API
 */
export async function generateSummaryFromFeedback(
  feedbackText: string
): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY

  // If no API key, fallback to truncated text
  if (!apiKey) {
    return feedbackText.length > 100
      ? feedbackText.substring(0, 100) + "..."
      : feedbackText
  }

  try {
    const prompt = `Summarize this employee feedback in one short sentence: ${feedbackText}`
    // #region agent log
    const debugLog1 = {location:'lib/api.ts:26',message:'Calling Gemini API',data:{promptLength:prompt.length,feedbackTextLength:feedbackText.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'};
    console.log('[DEBUG]', debugLog1);
    fetch('http://127.0.0.1:7242/ingest/94295a68-58c0-4c7f-a369-b8d6564b2c9c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(debugLog1)}).catch(()=>{});
    // #endregion
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    )
    // #region agent log
    const debugLog2 = {location:'lib/api.ts:47',message:'Gemini API response received',data:{status:response.status,statusText:response.statusText,ok:response.ok},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'};
    console.log('[DEBUG]', debugLog2);
    fetch('http://127.0.0.1:7242/ingest/94295a68-58c0-4c7f-a369-b8d6564b2c9c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(debugLog2)}).catch(()=>{});
    // #endregion

    if (!response.ok) {
      const errorText = await response.text().catch(()=>'');
      // #region agent log
      const debugLog3 = {location:'lib/api.ts:50',message:'Gemini API error response',data:{status:response.status,statusText:response.statusText,errorText:errorText.substring(0,500)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'};
      console.error('[DEBUG]', debugLog3);
      fetch('http://127.0.0.1:7242/ingest/94295a68-58c0-4c7f-a369-b8d6564b2c9c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(debugLog3)}).catch(()=>{});
      // #endregion
      throw new Error(`Gemini API error: ${response.statusText} - ${errorText.substring(0,200)}`)
    }

    const data = await response.json()
    // #region agent log
    const debugLog4 = {location:'lib/api.ts:57',message:'Gemini API data parsed',data:{hasCandidates:!!data.candidates,candidatesLength:data.candidates?.length||0,hasContent:!!data.candidates?.[0]?.content,hasParts:!!data.candidates?.[0]?.content?.parts,rawResponse:JSON.stringify(data).substring(0,500)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'};
    console.log('[DEBUG]', debugLog4);
    fetch('http://127.0.0.1:7242/ingest/94295a68-58c0-4c7f-a369-b8d6564b2c9c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(debugLog4)}).catch(()=>{});
    // #endregion
    const summary =
      data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || ""
    // #region agent log
    const debugLog5 = {location:'lib/api.ts:60',message:'Summary extracted',data:{summaryLength:summary.length,summary:summary.substring(0,100)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'};
    console.log('[DEBUG]', debugLog5);
    fetch('http://127.0.0.1:7242/ingest/94295a68-58c0-4c7f-a369-b8d6564b2c9c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(debugLog5)}).catch(()=>{});
    // #endregion

    // If summary is empty or too long, fallback to truncated text
    if (!summary || summary.length > 200) {
      // #region agent log
      const debugLog6 = {location:'lib/api.ts:63',message:'Summary invalid, using fallback',data:{summaryLength:summary.length,usingFallback:true},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'};
      console.warn('[DEBUG]', debugLog6);
      fetch('http://127.0.0.1:7242/ingest/94295a68-58c0-4c7f-a369-b8d6564b2c9c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(debugLog6)}).catch(()=>{});
      // #endregion
      return feedbackText.length > 100
        ? feedbackText.substring(0, 100) + "..."
        : feedbackText
    }

    return summary
  } catch (error) {
    // #region agent log
    const debugLog7 = {location:'lib/api.ts:72',message:'Gemini API error caught',data:{errorMessage:error instanceof Error?error.message:String(error),errorStack:error instanceof Error?error.stack?.substring(0,300):null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'};
    console.error('[DEBUG]', debugLog7);
    fetch('http://127.0.0.1:7242/ingest/94295a68-58c0-4c7f-a369-b8d6564b2c9c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(debugLog7)}).catch(()=>{});
    // #endregion
    console.error("Failed to generate summary with Gemini:", error)
    // Fallback to truncated text on error
    return feedbackText.length > 100
      ? feedbackText.substring(0, 100) + "..."
      : feedbackText
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
  const debugLog = {location:'lib/api.ts:95',message:'getFeedbacksFromSheet called',data:{hasSheetId:!!process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID,hasApiKey:!!process.env.NEXT_PUBLIC_GOOGLE_API_KEY,sheetIdLength:process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID?.length||0,apiKeyLength:process.env.NEXT_PUBLIC_GOOGLE_API_KEY?.length||0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'};
  console.log('[DEBUG]', debugLog);
  fetch('http://127.0.0.1:7242/ingest/94295a68-58c0-4c7f-a369-b8d6564b2c9c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(debugLog)}).catch(()=>{});
  // #endregion
  const sheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY

  if (!sheetId || !apiKey) {
    // #region agent log
    const debugLog = {location:'lib/api.ts:100',message:'Missing credentials',data:{hasSheetId:!!sheetId,hasApiKey:!!apiKey},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'};
    console.error('[DEBUG]', debugLog);
    fetch('http://127.0.0.1:7242/ingest/94295a68-58c0-4c7f-a369-b8d6564b2c9c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(debugLog)}).catch(()=>{});
    // #endregion
    console.error(
      "Google Sheets API credentials not configured. Please set NEXT_PUBLIC_GOOGLE_SHEET_ID and NEXT_PUBLIC_GOOGLE_API_KEY"
    )
    return []
  }

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${SHEET_RANGE}?key=${apiKey}`
    // #region agent log
    const debugLog = {location:'lib/api.ts:107',message:'Fetching from Google Sheets',data:{url:url.replace(apiKey,'***'),sheetRange:SHEET_RANGE},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'};
    console.log('[DEBUG]', debugLog);
    fetch('http://127.0.0.1:7242/ingest/94295a68-58c0-4c7f-a369-b8d6564b2c9c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(debugLog)}).catch(()=>{});
    // #endregion

    const response = await fetch(url)
    // #region agent log
    const debugLog = {location:'lib/api.ts:110',message:'API response received',data:{status:response.status,statusText:response.statusText,ok:response.ok},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'};
    console.log('[DEBUG]', debugLog);
    fetch('http://127.0.0.1:7242/ingest/94295a68-58c0-4c7f-a369-b8d6564b2c9c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(debugLog)}).catch(()=>{});
    // #endregion

    if (!response.ok) {
      // #region agent log
      const errorText = await response.text().catch(()=>'');
      const debugLog = {location:'lib/api.ts:112',message:'API error response',data:{status:response.status,statusText:response.statusText,errorText:errorText.substring(0,200)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'};
      console.error('[DEBUG]', debugLog);
      fetch('http://127.0.0.1:7242/ingest/94295a68-58c0-4c7f-a369-b8d6564b2c9c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(debugLog)}).catch(()=>{});
      // #endregion
      throw new Error(`Google Sheets API error: ${response.statusText}`)
    }

    const data = await response.json()
    // #region agent log
    const debugLog = {location:'lib/api.ts:115',message:'Data parsed from API',data:{hasValues:!!data.values,valuesLength:data.values?.length||0,firstRowSample:data.values?.[0]?.slice(0,3)||null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'};
    console.log('[DEBUG]', debugLog);
    fetch('http://127.0.0.1:7242/ingest/94295a68-58c0-4c7f-a369-b8d6564b2c9c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(debugLog)}).catch(()=>{});
    // #endregion

    if (!data.values || data.values.length === 0) {
      // #region agent log
      const debugLog = {location:'lib/api.ts:117',message:'No data rows found',data:{hasValues:!!data.values,valuesLength:data.values?.length||0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'};
      console.warn('[DEBUG]', debugLog);
      fetch('http://127.0.0.1:7242/ingest/94295a68-58c0-4c7f-a369-b8d6564b2c9c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(debugLog)}).catch(()=>{});
      // #endregion
      return []
    }

    // Map rows to Feedback objects
    // Column mapping: A=submission_time, B=submission_id, C=is_anonymous,
    // D=affected_department, E=feedback_text, F=process_area, G=user_id,
    // H=user_name, I=user_role, J=user_age_range, K=user_department,
    // L=user_action_recommendation, M=sentiment_analysis
    const feedbacks: Feedback[] = []

    // Process rows in parallel for summary generation (with batching to avoid rate limits)
    const batchSize = 5 // Process 5 summaries at a time
    // #region agent log
    const debugLog = {location:'lib/api.ts:129',message:'Starting row processing',data:{totalRows:data.values.length,batchSize:batchSize},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'};
    console.log('[DEBUG]', debugLog);
    fetch('http://127.0.0.1:7242/ingest/94295a68-58c0-4c7f-a369-b8d6564b2c9c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(debugLog)}).catch(()=>{});
    // #endregion
    for (let i = 0; i < data.values.length; i += batchSize) {
      const batch = data.values.slice(i, i + batchSize)
      const batchPromises = batch.map(async (row: string[], rowIndex: number) => {
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
        // row[11] = user_action_recommendation (L) - not in Feedback type
        const sentimentAnalysis = normalizeSentiment(row[12]) // M
        // #region agent log
        const debugLog = {location:'lib/api.ts:147',message:'Processing row',data:{rowIndex:i+rowIndex,hasFeedbackText:!!feedbackText.trim(),hasSubmissionId:!!submissionId,rowLength:row.length,rowSample:row.slice(0,5)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'};
        if (i + rowIndex < 3) console.log('[DEBUG]', debugLog); // Only log first 3 rows to avoid spam
        fetch('http://127.0.0.1:7242/ingest/94295a68-58c0-4c7f-a369-b8d6564b2c9c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(debugLog)}).catch(()=>{});
        // #endregion

        // Skip empty rows
        if (!feedbackText.trim() || !submissionId) {
          // #region agent log
          const debugLog = {location:'lib/api.ts:149',message:'Row skipped - missing required fields',data:{rowIndex:i+rowIndex,hasFeedbackText:!!feedbackText.trim(),hasSubmissionId:!!submissionId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'};
          if (i + rowIndex < 3) console.warn('[DEBUG]', debugLog);
          fetch('http://127.0.0.1:7242/ingest/94295a68-58c0-4c7f-a369-b8d6564b2c9c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(debugLog)}).catch(()=>{});
          // #endregion
          return null
        }

        // Generate summary using Gemini API
        const summary = await generateSummaryFromFeedback(feedbackText)

        return {
          id: submissionId,
          timestamp: submissionTime || new Date().toISOString(),
          feedback: feedbackText,
          department: affectedDepartment || "Other",
          anonymous: isAnonymous,
          category: "Other" as const, // Default to "Other" as per requirements
          sentiment: sentimentAnalysis,
          summary: summary,
          user_id: userId || "",
        } as Feedback
      })

      const batchResults = await Promise.all(batchPromises)
      const validResults = batchResults.filter((f): f is Feedback => f !== null)
      feedbacks.push(...validResults)
      // #region agent log
      const debugLog = {location:'lib/api.ts:170',message:'Batch processed',data:{batchIndex:Math.floor(i/batchSize),batchSize:batch.length,validCount:validResults.length,totalFeedbacks:feedbacks.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'};
      console.log('[DEBUG]', debugLog);
      fetch('http://127.0.0.1:7242/ingest/94295a68-58c0-4c7f-a369-b8d6564b2c9c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(debugLog)}).catch(()=>{});
      // #endregion
    }
    // #region agent log
    const debugLog = {location:'lib/api.ts:173',message:'Returning feedbacks',data:{totalFeedbacks:feedbacks.length,firstFeedbackId:feedbacks[0]?.id||null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'};
    console.log('[DEBUG]', debugLog);
    fetch('http://127.0.0.1:7242/ingest/94295a68-58c0-4c7f-a369-b8d6564b2c9c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(debugLog)}).catch(()=>{});
    // #endregion
    return feedbacks
  } catch (error) {
    // #region agent log
    const debugLog = {location:'lib/api.ts:175',message:'Error caught',data:{errorMessage:error instanceof Error?error.message:String(error),errorStack:error instanceof Error?error.stack?.substring(0,200):null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'};
    console.error('[DEBUG]', debugLog);
    fetch('http://127.0.0.1:7242/ingest/94295a68-58c0-4c7f-a369-b8d6564b2c9c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(debugLog)}).catch(()=>{});
    // #endregion
    console.error("Failed to fetch feedbacks from Google Sheet:", error)
    return []
  }
}
