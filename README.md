# Quippi - Anonymous Employee Feedback Platform

An anonymous employee feedback platform that enables organizations to collect, categorize (via AI), and analyze feedback while ensuring complete anonymity.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4 + shadcn/ui components
- **Language:** TypeScript
- **Fonts:** Geist Sans & Geist Mono
- **Deployment:** GitHub Pages (static export)
- **Integration:** n8n webhooks for feedback submission

## Project Structure

```
/
├── app/
│   ├── layout.tsx          # Root layout with Navbar & Footer
│   ├── page.tsx            # Home/landing page
│   ├── globals.css         # Global styles & design tokens
│   ├── feedback/
│   │   └── page.tsx        # Feedback submission page
│   └── dashboard/
│       └── page.tsx        # Admin dashboard (placeholder)
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx      # Navigation with active state & logo
│   │   └── Footer.tsx      # Anonymity notice footer
│   ├── feedback-form.tsx   # Feedback form component
│   └── ui/                 # shadcn/ui components
│       ├── alert.tsx       # Alert component for success/error states
│       ├── button.tsx
│       ├── card.tsx
│       ├── label.tsx
│       ├── select.tsx
│       ├── switch.tsx
│       └── textarea.tsx
├── lib/
│   ├── api.ts              # Google Sheets & Gemini API integration
│   ├── data/
│   │   └── feedbacks.ts    # Feedback type definitions & utility functions
│   └── utils.ts            # Utility functions (cn helper)
└── types/
    └── index.ts            # TypeScript interfaces
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Building for Production

```bash
# Build static site for GitHub Pages
npm run build

# Output will be in the /out directory
```

## Development Roadmap

### V0.1 - Foundation ✅ Complete
- [x] Project scaffolding with Next.js 16
- [x] Navbar with navigation links, active state, and logo
- [x] Footer with anonymity notice
- [x] Home page with hero section and feature cards
- [x] Placeholder pages for Feedback and Dashboard
- [x] Indigo/violet primary color theme
- [x] TypeScript types for Feedback and FeedbackProgram
- [x] GitHub Pages deployment configuration

### V0.2 - Feedback Form ✅ Complete
- [x] Feedback submission form with textarea
- [x] Department selection dropdown
- [x] Anonymous toggle switch
- [x] Form validation (feedback length, required fields)
- [x] n8n webhook integration
- [x] Loading, success, and error states
- [x] Alert component for user feedback

### V0.3 - AI Categorization (Next)
- [ ] Integrate AI SDK for feedback categorization
- [ ] Auto-categorize feedback on submission
- [ ] Categories: Culture, Process, Management, Tools, Other

### V0.4 - Google Sheets Integration ✅ Complete
- [x] Connect dashboard to Google Sheets API
- [x] Fetch real feedback data from Google Sheet
- [x] Google Gemini API integration for AI-generated summaries
- [x] Real-time stats and analytics from sheet data
- [x] Refresh button to reload latest data
- [x] Error handling and loading states

### V0.5 - Feedback Programs
- [ ] CRUD for feedback programs
- [ ] Associate feedback with programs
- [ ] Program-specific dashboards

## Environment Variables

### Required for V0.2+ (Feedback Submission)

```env
# n8n Webhook URL (required for feedback submission)
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-id
```

### Required for V0.4+ (Dashboard - Google Sheets Integration)

```env
# Google Sheets API credentials
NEXT_PUBLIC_GOOGLE_SHEET_ID=your_google_sheet_id_here
NEXT_PUBLIC_GOOGLE_API_KEY=your_google_api_key_here

# Google Gemini API (for AI-generated summaries)
NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
```

**Google Sheet Setup:**
- Document name: "Feedback_Data"
- Tab/Worksheet name: "Open-Feedback"
- Columns: A-M (submission_time, submission_id, is_anonymous, affected_department, feedback_text, process_area, user_id, user_name, user_role, user_age_range, user_department, user_action_recommendation, sentiment_analysis)
- The sheet must be publicly readable (or use OAuth for private sheets)

**Getting API Keys:**
1. **Google Sheets API Key:**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing
   - Enable "Google Sheets API"
   - Go to "Credentials" → "Create Credentials" → "API Key"
   - Restrict the key to "Google Sheets API" (recommended)

2. **Google Gemini API Key:**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the key for use in environment variables

### Setting up for GitHub Pages

1. Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**
2. Add the following repository secrets:
   - `NEXT_PUBLIC_N8N_WEBHOOK_URL` - Your n8n webhook URL
   - `NEXT_PUBLIC_GOOGLE_SHEET_ID` - Your Google Sheet ID (from the sheet URL)
   - `NEXT_PUBLIC_GOOGLE_API_KEY` - Your Google Sheets API key
   - `NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY` - Your Google Gemini API key

3. Click **New repository secret** for each variable
4. Enter the name and value, then click **Add secret**

The GitHub Actions workflow will automatically use these secrets during the build process.

### For Local Development

Create a `.env.local` file in the project root:

```env
# n8n Webhook (V0.2+)
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-id

# Google Sheets Integration (V0.4+)
NEXT_PUBLIC_GOOGLE_SHEET_ID=your_google_sheet_id_here
NEXT_PUBLIC_GOOGLE_API_KEY=your_google_api_key_here
NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
```

**Note:** `.env.local` is already in `.gitignore` and won't be committed.

## Design Tokens

Primary color is indigo/violet. Key tokens defined in `app/globals.css`:

| Token | Usage |
|-------|-------|
| `--primary` | Buttons, links, active states |
| `--background` | Page background |
| `--foreground` | Primary text |
| `--muted` | Secondary backgrounds |
| `--accent` | Hover states, highlights |

## Key Features

### Feedback Form
- **Validation:** Minimum 10 characters, required department selection
- **Anonymous Submission:** Toggle to submit anonymously (default: enabled)
- **Department Selection:** Engineering, Marketing, Sales, HR, Operations, Other
- **Real-time Feedback:** Loading, success, and error states with clear messaging
- **n8n Integration:** Automatic submission to configured webhook

### UI Components
- Built with shadcn/ui for consistency
- Accessible components with proper ARIA labels
- Responsive design for all screen sizes
- Dark mode support (via design tokens)

## Coding Conventions

- Use TypeScript for all files
- Use `cn()` helper from `lib/utils` for conditional classes
- Follow existing component patterns in `components/ui/`
- Use Server Components by default, Client Components only when needed
- Prefix client components with `"use client"`
- Define shared types in `types/index.ts`

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production (static export)
npm run start    # Start production server (not used for GitHub Pages)
npm run lint     # Run ESLint
```

## Deployment

This project is configured for GitHub Pages deployment:

- **Static Export:** Uses `output: 'export'` in `next.config.mjs`
- **Base Path:** Configured for subdirectory deployment (`/tghtfl.github.io`)
- **GitHub Actions:** Automated deployment on push to `main` branch
- **Workflow:** `.github/workflows/deploy.yml`

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [n8n Documentation](https://docs.n8n.io)

## License

Private project - All rights reserved
