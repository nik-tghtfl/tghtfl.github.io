# Google Sheets & Gemini API Setup Guide

Follow these steps to get the API keys needed for the dashboard integration.

## Step 1: Get Your Google Sheet ID

1. Open your Google Sheet named "Feedback_Data"
2. Look at the URL in your browser
3. The URL will look like: `https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit`
4. Copy the `SHEET_ID` (the long string between `/d/` and `/edit`)
5. Save this for later - you'll need it for `NEXT_PUBLIC_GOOGLE_SHEET_ID`

**Example:**
- URL: `https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j/edit`
- Sheet ID: `1a2b3c4d5e6f7g8h9i0j`

## Step 2: Create Google Cloud Project & Enable Sheets API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click the project dropdown at the top
3. Click **"New Project"**
4. Enter a project name (e.g., "Quippi Feedback Dashboard")
5. Click **"Create"**
6. Wait for the project to be created, then select it

### Enable Google Sheets API

1. In the Google Cloud Console, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google Sheets API"**
3. Click on it and click **"Enable"**
4. Wait for it to enable (takes a few seconds)

## Step 3: Create Google Sheets API Key

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** at the top
3. Select **"API key"**
4. A popup will show your API key - **copy it immediately** (you won't see it again!)
5. Click **"Restrict key"** (recommended for security)
6. Under **"API restrictions"**, select **"Restrict key"**
7. Check **"Google Sheets API"** from the list
8. Click **"Save"**

**Save this API key** - you'll need it for `NEXT_PUBLIC_GOOGLE_API_KEY`

## Step 4: Get Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"** or **"Get API Key"**
4. Select your Google Cloud project (or create a new one)
5. Copy the API key that appears

**Save this API key** - you'll need it for `NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY`

## Step 5: Make Your Google Sheet Publicly Readable (Required)

The Google Sheets API needs to read your sheet. You have two options:

### Option A: Make Sheet Public (Easiest)

1. Open your "Feedback_Data" Google Sheet
2. Click **"Share"** button (top right)
3. Click **"Change to anyone with the link"**
4. Set permission to **"Viewer"**
5. Click **"Done"**

### Option B: Use Service Account (More Secure, More Complex)

This requires additional setup with OAuth. For now, Option A is recommended.

## Step 6: Set Up Environment Variables

### For Local Development

1. Create a `.env.local` file in the project root (if it doesn't exist)
2. Add these variables:

```env
# n8n Webhook (already configured)
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://niktaughtful.app.n8n.cloud/webhook/8cc771d8-78fc-44bb-90ad-b3d5ac2ab7e4

# Google Sheets Integration
NEXT_PUBLIC_GOOGLE_SHEET_ID=your_sheet_id_here
NEXT_PUBLIC_GOOGLE_API_KEY=your_google_sheets_api_key_here
NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
```

3. Replace the placeholder values with your actual keys
4. Save the file

### For GitHub Pages Deployment

1. Go to your GitHub repository
2. Click **"Settings"** → **"Secrets and variables"** → **"Actions"**
3. Click **"New repository secret"** for each variable:
   - `NEXT_PUBLIC_GOOGLE_SHEET_ID`
   - `NEXT_PUBLIC_GOOGLE_API_KEY`
   - `NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY`
4. Paste the values and click **"Add secret"**

## Step 7: Verify Your Sheet Structure

Make sure your Google Sheet "Feedback_Data" has:
- **Tab name:** "Open-Feedback" (exact match, case-sensitive)
- **Columns A-M** with these headers in row 1:
  - A: `submission_time`
  - B: `submission_id`
  - C: `is_anonymous`
  - D: `affected_department`
  - E: `feedback_text`
  - F: `process_area`
  - G: `user_id`
  - H: `user_name`
  - I: `user_role`
  - J: `user_age_range`
  - K: `user_department`
  - L: `user_action_recommendation`
  - M: `sentiment_analysis`

## Step 8: Test the Integration

1. Make sure your `.env.local` file is set up
2. Restart your development server:
   ```bash
   npm run dev
   ```
3. Log in as an admin user
4. Go to the dashboard (`/dashboard`)
5. The dashboard should load data from your Google Sheet

## Troubleshooting

### "Failed to load feedback data"
- Check that your Sheet ID is correct
- Verify the sheet is publicly readable
- Check that the API key has Google Sheets API enabled
- Verify the tab name is exactly "Open-Feedback"

### "Google Sheets API error"
- Make sure Google Sheets API is enabled in your Google Cloud project
- Check that your API key is not restricted incorrectly
- Verify the API key is correct

### Summaries not generating
- Check that your Gemini API key is correct
- Verify the API key has proper permissions
- Check browser console for specific error messages

## Security Notes

- **Never commit `.env.local`** - it's already in `.gitignore`
- API keys in GitHub Secrets are safe for public repos
- Consider restricting API keys to specific IPs/domains in production
- The Google Sheet must be publicly readable for the API to work (or use OAuth)
