# Quippi

Anonymous employee feedback platform built with Next.js 14+, TypeScript, and Tailwind CSS.

> **Note:** This site is deployed via GitHub Actions. The README is not the live site.

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Package Manager:** npm

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with Navbar + Footer
│   ├── page.tsx            # Home/Landing page
│   ├── feedback/           # Feedback submission page
│   └── dashboard/          # Admin dashboard
├── components/
│   ├── layout/             # Layout components (Navbar, Footer)
│   └── ui/                 # shadcn/ui components
├── lib/                    # Utility functions and API helpers
└── types/                  # TypeScript type definitions
```

## Features

- 🏠 Home page with welcome message and feedback submission CTA
- 📝 Feedback submission page (placeholder)
- 📊 Admin dashboard (placeholder)
- 🎨 Modern, responsive UI with indigo color scheme
- 🔒 Anonymous feedback assurance

## Deployment

This project can be deployed to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **GitHub Pages** (requires static export configuration)

## License

MIT
