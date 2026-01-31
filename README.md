# Quippi - Anonymous Employee Feedback Platform

An anonymous employee feedback platform that enables organizations to collect, categorize (via AI), and analyze feedback while ensuring complete anonymity.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4 + shadcn/ui components
- **Language:** TypeScript
- **Fonts:** Geist Sans & Geist Mono

## Project Structure

```
/
├── app/
│   ├── layout.tsx          # Root layout with Navbar & Footer
│   ├── page.tsx            # Home/landing page
│   ├── globals.css         # Global styles & design tokens
│   ├── feedback/
│   │   └── page.tsx        # Feedback submission page (placeholder)
│   └── dashboard/
│       └── page.tsx        # Admin dashboard page (placeholder)
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx      # Navigation with active state
│   │   └── Footer.tsx      # Anonymity notice footer
│   └── ui/                 # shadcn/ui components (pre-installed)
├── hooks/                  # Custom React hooks
├── lib/
│   └── utils.ts            # Utility functions (cn helper)
└── types/
    └── index.ts            # Shared TypeScript interfaces
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

## Development Roadmap

### V0.1 - Foundation (Current)
- [x] Project scaffolding with Next.js 16
- [x] Navbar with navigation links and active state
- [x] Footer with anonymity notice
- [x] Home page with hero section and feature cards
- [x] Placeholder pages for Feedback and Dashboard
- [x] Indigo/violet primary color theme
- [x] TypeScript types for Feedback and FeedbackProgram

### V0.2 - Database & Feedback Form (Next)
- [ ] Database integration (Supabase or Neon recommended)
- [ ] Feedback submission form with textarea
- [ ] Store feedback in database
- [ ] Display submitted feedback confirmation

### V0.3 - AI Categorization
- [ ] Integrate AI SDK for feedback categorization
- [ ] Auto-categorize feedback on submission
- [ ] Categories: Culture, Process, Management, Tools, Other

### V0.4 - Admin Dashboard
- [ ] Authentication for admin access
- [ ] View all feedback with categories
- [ ] Filter and search feedback
- [ ] Basic analytics (feedback count, category breakdown)

### V0.5 - Feedback Programs
- [ ] CRUD for feedback programs
- [ ] Associate feedback with programs
- [ ] Program-specific dashboards

## Design Tokens

Primary color is indigo/violet. Key tokens defined in `globals.css`:

| Token | Usage |
|-------|-------|
| `--primary` | Buttons, links, active states |
| `--background` | Page background |
| `--foreground` | Primary text |
| `--muted` | Secondary backgrounds |
| `--accent` | Hover states, highlights |

## Key Files to Modify

| Task | Files |
|------|-------|
| Add new pages | `app/[route]/page.tsx` |
| Update navigation | `components/layout/Navbar.tsx` |
| Add types | `types/index.ts` |
| Global styles | `app/globals.css` |
| New components | `components/[feature]/` |

## Environment Variables

When adding features, you may need:

```env
# Database (choose one)
DATABASE_URL=           # Neon/PostgreSQL connection string
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# AI (for categorization)
OPENAI_API_KEY=         # Or use Vercel AI Gateway
```

## Coding Conventions

- Use TypeScript for all files
- Use `cn()` helper from `lib/utils` for conditional classes
- Follow existing component patterns in `components/ui/`
- Use Server Components by default, Client Components only when needed
- Prefix client components with `"use client"`

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Continuing Development in Cursor

1. Clone this repository
2. Open in Cursor
3. Run `npm install`
4. Reference this README for project structure
5. Check `types/index.ts` for data models
6. Use existing shadcn/ui components from `components/ui/`

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Vercel AI SDK](https://sdk.vercel.ai)
