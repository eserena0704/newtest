# Beauskin Luxury

A React application built with Vite, TypeScript, and shadcn-ui.

## Getting started

Requirements: Node.js & npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

```sh
# Install dependencies
npm i

# Start the development server
npm run dev
```

## Tech stack

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Instagram feed (optional)

To show your **live Instagram feed** (recent posts from @beauskin.sg) instead of placeholder images:

1. Sign up free at [Elfsight Instagram Feed](https://elfsight.com/instagram-feed-instashow/) (no credit card).
2. Create a widget, add source **@beauskin.sg** (works with personal accounts).
3. In the embed code they give you, copy the **Widget ID** (the long ID in `data-elfsight-app-id="..."` or in the div class).
4. Create a `.env` file in the project root and add:
   ```bash
   VITE_ELFSIGHT_INSTAGRAM_WIDGET_ID=your-widget-id-here
   ```
5. Restart the dev server. The section will show your real Instagram posts and update automatically.

Without this, the site still works and shows the default placeholder images.

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run preview` — preview production build
- `npm run lint` — run ESLint
- `npm run test` — run tests
