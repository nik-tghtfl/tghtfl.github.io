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
                  text: `Summarize this employee feedback in one short sentence: ${feedbackText}`,
                },
              ],
            },
          ],
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`)
    }

    const data = await response.json()
    const summary =
      data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || ""

    // If summary is empty or too long, fallback to truncated text
    if (!summary || summary.length > 200) {
      return feedbackText.length > 100
        ? feedbackText.substring(0, 100) + "..."
        : feedbackText
    }

    return summary
  } catch (error) {
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
  const sheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY

  if (!sheetId || !apiKey) {
    console.error(
      "Google Sheets API credentials not configured. Please set NEXT_PUBLIC_GOOGLE_SHEET_ID and NEXT_PUBLIC_GOOGLE_API_KEY"
    )
    return []
  }

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${SHEET_RANGE}?key=${apiKey}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.statusText}`)
    }

    const data = await response.json()

    if (!data.values || data.values.length === 0) {
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
    for (let i = 0; i < data.values.length; i += batchSize) {
      const batch = data.values.slice(i, i + batchSize)
      const batchPromises = batch.map(async (row: string[]) => {
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

        // Skip empty rows
        if (!feedbackText.trim() || !submissionId) {
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
      feedbacks.push(...batchResults.filter((f): f is Feedback => f !== null))
    }

    return feedbacks
  } catch (error) {
    console.error("Failed to fetch feedbacks from Google Sheet:", error)
    return []
  }
}
