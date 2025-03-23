This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Portfolio

This project is my new portfolio made to mimic windows 11


## structure
```
/portfolio
 ├── /public                # Static assets (icons, wallpapers, etc.)
 ├── /src
 │   ├── /app               # App Router structure
 │   │   ├── /icons         # App icons (optional)
 │   │   ├── /wallpapers    # Backgrounds and wallpapers
 │   │   ├── /about         # About page
 │   │   │   ├── page.tsx
 │   │   ├── /projects      # Projects page
 │   │   │   ├── page.tsx
 │   │   ├── /settings      # Settings page
 │   │   │   ├── page.tsx
 │   │   ├── /layout.tsx    # Root layout
 │   │   ├── /page.tsx      # Main desktop UI
 │   ├── /components        # Reusable UI components
 │   │   ├── Taskbar.tsx
 │   │   ├── Window.tsx
 │   │   ├── FileExplorer.tsx
 │   ├── /store             # Zustand state management
 │   │   ├── useWindows.ts
 │   ├── /styles            # Tailwind CSS and global styles
 │   │   ├── globals.css
 │   ├── /utils             # Helper functions
 │   │   ├── fileSystem.ts  # Mock file system
 ├── next.config.js         # Next.js configuration
 ├── tailwind.config.js     # Tailwind customization
 ├── package.json           # Dependencies
 ├── tsconfig.json          # TypeScript configuration
 ├── README.md              # Documentation
```