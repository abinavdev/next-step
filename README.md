## NextStep Career Path

An opinionated React + TypeScript web app for planning your career path, exploring roles, and tracking the skills and milestones you need to progress.

### Tech stack

- **Build tool**: Vite
- **Language**: TypeScript
- **Framework**: React
- **UI**: shadcn/ui + Tailwind CSS
- **State**: Zustand
- **Routing**: React Router

### Getting started (local development)

Prerequisites:

- **Node.js** (LTS recommended)
- **npm** (comes with Node)

Steps:

```sh
# 1. Clone the repository
git clone <YOUR_GIT_URL>

# 2. Go into the project directory
cd nextstep-career-path

# 3. Install dependencies
npm install

# 4. Start the dev server
npm run dev
```

The dev server will print a local URL (typically `http://localhost:5173`); open it in your browser to view the app.

### Available scripts

- **`npm run dev`**: Start the Vite development server.
- **`npm run build`**: Create a production build.
- **`npm run preview`**: Preview the production build locally.
- **`npm run lint`**: Run ESLint over the project.
- **`npm run test`**: Run the test suite once.
- **`npm run test:watch`**: Run tests in watch mode.

### Project structure (high level)

- `src/pages`: Top-level pages such as dashboard, roadmap, careers, onboarding, etc.
- `src/components`: Reusable UI components (dashboard widgets, onboarding steps, roadmap views, and base UI).
- `src/stores`: Global state (e.g. user store).
- `src/hooks`: Custom React hooks.
- `src/lib`: Utility functions.

### Deployment

You can deploy the production build to any static hosting provider.

Typical flow:

```sh
npm run build
```

This outputs static assets into the `dist` folder. Upload `dist` to your preferred platform (Netlify, Vercel, GitHub Pages, Cloudflare Pages, etc.).

### Customization

- Update application metadata (title, description, og tags) in `index.html`.
- Tweak global styles in `src/index.css` and `src/App.css`.
- Extend UI components or add new pages under `src/components` and `src/pages`.

This repository is set up for iterative development and customization, as if you built the app from scratch.
