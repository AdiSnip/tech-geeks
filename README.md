# Tech Geeks

A starter Next.js application focused on connecting small entrepreneurs with mentors, marketplace features, and learning modules. The project uses the Next.js App Router (src/app), TypeScript, and Tailwind CSS for styling. This README explains the project structure, development setup, and contribution guidelines.

## Key Features

- Authentication pages (signup, login)
- Marketplace for listing and viewing products
- Mentorship directory and booking flow
- Learning modules and community features
- Serverless API routes for common actions

## Quick Start (Development)

Prerequisites:

- Node.js 18+ (recommended)
- yarn or npm

Steps:

1. Clone the repository

	git clone <repo-url>

2. Install dependencies

	npm install
	# or
	yarn

3. Start the development server

	npm run dev
	# or
	yarn dev

4. Open http://localhost:3000 in your browser.

## Project Structure (high-level)

This project follows a predictable structure to help you quickly find and understand the important parts.

- public/ — static assets (images, icons, favicons)
- src/
  - app/ — Next.js App Router pages and API routes
	 - (auth)/ — grouped routes for authentication (login, signup)
		- login/page.tsx
		- signup/page.tsx
	 - (main)/ — authenticated user area (dashboard, marketplace, mentorship, learning, community)
	 - api/ — serverless API routes (products, mentors, users)
	 - layout.tsx, globals.css — top-level layout and global styles
  - components/ — reusable UI components grouped by feature
  - libs/ — shared utilities, DB clients, types, helpers
  - models/ — TypeScript models for domain objects (User, Product, Mentor, Module)

Other files:

- next.config.ts — Next.js configuration
- package.json — dependencies and scripts
- README.md — this file

## Development Notes & Conventions

- TypeScript is used across the project for type safety.
- Tailwind CSS is used for styling (see `globals.css` for configuration).
- Pages are implemented with the App Router under `src/app`.
- API routes are serverless functions located under `src/app/api`.
- Keep components small and focused (one responsibility per component).

## How to Contribute

1. Fork the repository and create a feature branch:

	git checkout -b feat/some-feature

2. Make changes and run the dev server to verify your work.

3. Commit and open a pull request describing the change.

## Useful Commands

- npm run dev — Start development server
- npm run build — Build the production bundle
- npm run start — Start the production server (after build)
- npm run lint — Run linter

## Troubleshooting

- If Tailwind classes aren't updating, ensure `npm run dev` is running and that `globals.css` is properly imported in `src/app/layout.tsx`.
- For CORS or API issues, check the API route code in `src/app/api` and your server console logs.

## License

This project is licensed under the GPU 3.0 License. See the LICENSE file for details.

---

If you want, I can also:

- Add a short 'How to run tests' section (if tests are added).
- Add code examples for customizing Tailwind or connecting a database.
- Generate a CONTRIBUTING.md with PR and code style guidelines.

Would you like me to add any of the above? 
