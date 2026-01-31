# Quibi - Cursor Setup Guide

## Project Overview

Quibi is an anonymous employee feedback platform built with Next.js 15, TypeScript, Tailwind CSS v4, and shadcn/ui. This project was exported from v0 and requires minor adjustments to run locally without Vercel-specific dependencies.

---

## Quick Start

### 1. Remove Vercel Analytics

Open `app/layout.tsx` and make these changes:

**Remove this import:**
```tsx
import { Analytics } from "@vercel/analytics/next"
```

**Remove this component from the JSX (near the bottom):**
```tsx
<Analytics />
```

### 2. Install and Run

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:3000`

---

## Project Structure

```
quibi/
├── app/
│   ├── layout.tsx          # Root layout with Navbar + Footer
│   ├── page.tsx            # Home page with hero and features
│   ├── globals.css         # Design tokens (indigo primary color)
│   ├── feedback/
│   │   └── page.tsx        # Feedback submission (placeholder)
│   └── dashboard/
│       └── page.tsx        # Admin dashboard (placeholder)
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx      # Navigation with active state highlighting
│   │   └── Footer.tsx      # Anonymity notice footer
│   └── ui/                 # shadcn/ui components
├── types/
│   └── index.ts            # TypeScript interfaces
├── .cursorrules            # AI assistant context
└── README.md               # Full documentation
```

---

## Verification Checklist

After setup, verify these features work:

- [ ] Home page (`/`) displays hero section with "Your Voice Matters" headline
- [ ] Three feature cards show: Anonymous, AI-Categorized, Insights
- [ ] "Submit Feedback" button links to `/feedback`
- [ ] Feedback page (`/feedback`) shows placeholder with back link
- [ ] Dashboard page (`/dashboard`) shows admin badge and placeholder
- [ ] Navbar appears on all pages with "Quibi" logo
- [ ] Active page is highlighted with indigo background in navbar
- [ ] Footer shows lock icon and "Your feedback is always anonymous"
- [ ] Primary color is indigo/violet (#4F46E5)

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15 | React framework (App Router) |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling |
| shadcn/ui | Latest | UI components |

---

## Design Tokens

The primary brand color and theme are defined in `app/globals.css`:

```css
--primary: oklch(0.455 0.24 264);        /* Indigo/violet */
--primary-foreground: oklch(1 0 0);       /* White text on primary */
```

---

## Development Roadmap

### Current: V0.1 (Complete)
- Basic navigation and layout
- Placeholder pages
- Design system setup

### Next: V0.2
- Feedback submission form with categories
- Local storage for draft feedback

### Future: V0.3+
- Database integration (Supabase recommended)
- AI categorization with sentiment analysis
- Admin dashboard with analytics
- Authentication for admin access

---

## Key Files to Modify

| Task | File(s) |
|------|---------|
| Add new pages | `app/[route]/page.tsx` |
| Update navigation | `components/layout/Navbar.tsx` |
| Change colors/theme | `app/globals.css` |
| Add TypeScript types | `types/index.ts` |
| Modify layout | `app/layout.tsx` |

---

## Useful Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## Notes

- The `.cursorrules` file provides AI context about project conventions
- All components use the `cn()` utility from `lib/utils.ts` for conditional classes
- Follow existing patterns when adding new features
- Refer to `README.md` for comprehensive documentation
