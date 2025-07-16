
# CampusConnect

CampusConnect is a modern, minimal, and professional campus-based social media platform built with React, Vite, TypeScript, shadcn-ui, and Tailwind CSS.

## Features

- Clean, scalable folder structure
- Multiple unique color palettes and theme switching
- Modern UI with shadcn-ui components
- Infinite scroll feed, trending topics, events, and suggested connections
- Authentication-ready routing structure

## Folder Structure

```
src/
  components/
    feed/         # Feed-related UI (CreatePost, PostCard, etc.)
    layout/       # Layout, navigation, theme, palette providers/selectors
    ui/           # Reusable UI primitives (button, card, badge, etc.)
  hooks/          # Custom React hooks
  lib/            # Utilities and helpers
  pages/          # Page-level components (Feed, Chat, Login, etc.)
  routes/         # App routing setup
  index.css       # Tailwind and theme CSS
  main.tsx        # App entry point
```

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
