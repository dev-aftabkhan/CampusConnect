
# CampusConnect

CampusConnect is a modern, minimal, and professional campus-based social media platform built with React, Vite, TypeScript, shadcn-ui, and Tailwind CSS.

## Features

- Clean, scalable folder structure
- Multiple unique color palettes and theme switching
- Modern UI with shadcn-ui components
- Infinite scroll feed, trending topics, events, and suggested connections
- Authentication-ready routing structure

## Code Structure (2024)

Below is the recommended, clean, and scalable folder structure for CampusConnect. This structure keeps UI kit, layouts, pages, and logic clearly separated for easy development and contribution.

```
src/
  api/                # All API calls (auth.ts, user.ts, post.ts, etc.)
  components/
    ui/               # UI kit: buttons, cards, dialogs, etc. (generic, reusable)
  hooks/              # Custom React hooks (useMobile, useToast, etc.)
  layouts/
    AuthLayout.tsx    # Layout for login/register pages (no navbar)
    MainLayout.tsx    # Layout for authenticated pages (navbar, etc.)
  pages/
    Feed/
      Feed.tsx        # Main feed page
      CreatePost.tsx  # Feed-specific component
      PostCard.tsx    # Feed-specific component
    auth/
      LoginPage.tsx   # Login page (uses AuthLayout)
      Register.tsx    # Register page (uses AuthLayout)
      Login.tsx       # Login form component
    Chat.tsx          # Chat page
    Discover.tsx      # Discover page
    Index.tsx         # Landing page (if any)
    NotFound.tsx      # 404 page
    Profile.tsx       # User profile page
  routes/
    AppRouter.tsx     # Main router logic
    routes.tsx        # Route definitions
    AuthRoute.tsx     # (if you have route guards)
  theme/
    ThemeProvider.tsx
    PaletteProvider.tsx
    ThemeSelector.tsx
    ThemeToggle.tsx
  types/              # TypeScript types/interfaces
    user.ts
    post.ts
    chat.ts
    notification.ts
  utils/              # Utility/helper functions
    utils.ts
  App.tsx
  App.css
  index.css
  main.tsx
  vite-env.d.ts
```

- **UI kit** is in `components/ui/` only.
- **Feature/page-specific components** are inside their respective `pages/` subfolders.
- **Only two layouts:** `AuthLayout.tsx` and `MainLayout.tsx`.
- **API, hooks, types, utils** are all in their own folders.
- **Routes** are centralized in `routes/`.
- **Theme** logic is in its own folder.

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Start the dev server:**
   ```sh
   npm run dev
   ```

## Technologies Used

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [shadcn-ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## Theming

CampusConnect supports multiple unique color palettes and dark/light/system themes. Use the palette/theme selector in the UI to personalize your experience.

## Contributing

1. Fork the repo
2. Create a new branch
3. Make your changes
4. Open a pull request

## License

MIT
## How can I deploy this project?
