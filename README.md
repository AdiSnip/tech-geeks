<h1>Folder Structure</h1>

├── public/                 # Static assets (images, fonts, favicons)
│   └── images/
│       └── logo.svg
├── src/                    # All core application code
│   ├── app/                # Main router and pages (Next.js App Router)
│   │   ├── (auth)/         # Grouped routes for sign-up, login, etc.
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── signup/
│   │   │       └── page.tsx
│   │   ├── (main)/         # Grouped routes for the authenticated user experience
│   │   │   ├── dashboard/  # The landing page after login
│   │   │   │   └── page.tsx
│   │   │   ├── marketplace/
│   │   │   │   ├── [productId]/ # Dynamic route for single product detail
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── page.tsx     # Main marketplace listing page
│   │   │   │   └── create/      # Page for entrepreneurs to list a new product
│   │   │   │       └── page.tsx
│   │   │   ├── mentorship/
│   │   │   │   ├── [mentorId]/  # Dynamic route for a specific mentor's profile
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── page.tsx     # Main mentor directory
│   │   │   │   └── connect/     # Page for booking a session
│   │   │   │       └── page.tsx
│   │   │   ├── learning/        # Financial literacy and skill modules
│   │   │   │   ├── [moduleId]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── community/       # Peer-to-peer forum/Q&A
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx       # Layout for all authenticated pages (Header, Nav, Footer)
│   │   │   └── template.tsx     # Optional: For shared UI state/loading
│   │   ├── api/                # Backend API routes (Serverless functions)
│   │   │   ├── products/
│   │   │   │   ├── route.ts     # GET (fetch all) and POST (create new) products
│   │   │   ├── mentors/
│   │   │   │   └── route.ts
│   │   │   └── users/
│   │   │       └── route.ts
│   │   ├── page.tsx            # Root landing page (Home)
│   │   ├── layout.tsx          # Root layout (HTML, Body tags, global providers)
│   │   └── globals.css         # Global styles (Tailwind config, custom theme variables)
│   │
│   ├── components/
│   │   ├── ui/                 # Reusable, unstyled components (e.g., Button, Card)
│   │   │   ├── Button.tsx
│   │   │   └── Card.tsx
│   │   ├── shared/             # General components (used across multiple pages)
│   │   │   ├── Header.tsx      # Main site header
│   │   │   ├── Footer.tsx
│   │   │   └── LanguageSwitcher.tsx
│   │   ├── dashboard/          # Components specific to the dashboard
│   │   │   └── RecommendationWidget.tsx # AI/Mock-AI recommendations
│   │   └── marketplace/
│   │       ├── ProductCard.tsx
│   │       └── ProductForm.tsx # Component for creating a new listing
│   │
│   ├── lib/                    # Utility functions, hooks, and configuration
│   │   ├── db.ts               # Database connection/client setup
│   │   ├── types.ts            # TypeScript interfaces/types (e.g., Product, Mentor)
│   │   ├── utils.ts            # General helper functions
│   │   └── i18n.ts             # Internationalization (multilingual) setup
│   │
│   └── actions/                # Next.js Server Actions (optional replacement for API Routes)
│       ├── market.ts           # Server-side logic for marketplace actions (e.g., listProduct)
│       └── auth.ts
│
├── next.config.js          # Next.js configuration settings
└── package.json