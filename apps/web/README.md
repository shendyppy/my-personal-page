# Personal Portfolio - Web App

The main Next.js fullstack application for the personal portfolio.

## 🎯 About

This is a modern, interactive portfolio website featuring:
- 3D animated hero section with Three.js
- Dark/light theme toggle
- Dynamic content management via PostgreSQL
- Responsive design for all devices
- Server-side rendering for optimal performance

## 🏗️ Architecture

This app follows Next.js 15 App Router architecture:

```
apps/web/
├── src/
│   ├── app/
│   │   ├── api/              # Backend API routes
│   │   ├── projects/[slug]/  # Dynamic project pages
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   ├── components/
│   │   ├── ui/              # Base UI components (Button, Card, etc.)
│   │   ├── molecules/       # Small composite components
│   │   ├── organisms/       # Large composite components
│   │   └── sections/        # Page sections (Hero, About, Projects, etc.)
│   ├── data/                # Static data (to be migrated to API)
│   ├── lib/                 # Utility functions
│   ├── types/               # TypeScript definitions
│   └── generated/prisma/    # Auto-generated Prisma Client
├── prisma/
│   └── schema.prisma        # Database schema
└── public/
    └── assets/              # Images, fonts, etc.
```

## 🚀 Quick Start

### Development

```bash
# From this directory (apps/web)
npm run dev

# Or from root
cd ../..
npm run dev
```

### Database

```bash
# Open Prisma Studio (database GUI)
npx prisma studio

# Create a new migration
npx prisma migrate dev --name your_migration_name

# Generate Prisma Client after schema changes
npx prisma generate

# Reset database (⚠️ deletes all data)
npx prisma migrate reset
```

### Build

```bash
npm run build
npm start
```

## 📂 Key Files

- `src/app/page.tsx` - Home page with all sections
- `src/app/layout.tsx` - Root layout with providers
- `src/app/providers/ThemeProvider.tsx` - Theme context
- `prisma/schema.prisma` - Database schema
- `next.config.ts` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration

## 🎨 Styling

Uses **Tailwind CSS 4** with custom configuration:
- Custom color palette with CSS variables
- Dark/light mode support
- Custom animations
- Responsive breakpoints

## 🗄️ Database Models

Main Prisma models:
- **Project** - Portfolio projects
- **ProjectHighlight** - Project features/highlights
- **ProjectImage** - Project screenshots
- **Experience** - Work experience
- **Skill** - Technical skills
- **TechStack** - Technologies used
- **SocialLink** - Social media links
- **AboutSection** - About page content
- **Love** - Personal interests

## 🔐 Environment Variables

Required in `.env`:

```env
DATABASE_URL="postgresql://..."
```

Optional:
```env
NEXT_PUBLIC_SITE_URL="https://your-domain.com"
```

## 🌐 API Routes

Will be created in `src/app/api/`:
- `GET /api/projects` - Get all projects
- `GET /api/projects/[slug]` - Get project by slug
- `GET /api/experiences` - Get work experiences
- `GET /api/skills` - Get skills
- `GET /api/about` - Get about section data

## 📱 Features

- ✅ Responsive design (mobile-first)
- ✅ Dark/light theme with persistence
- ✅ 3D interactive hero section
- ✅ Dynamic project pages
- ✅ Smooth animations
- ✅ SEO optimized
- ✅ Type-safe with TypeScript
- ✅ Analytics ready

## 🧪 Testing

```bash
# Lint code
npm run lint

# Type check
npx tsc --noEmit
```

## 📦 Key Dependencies

- `next` - React framework
- `react`, `react-dom` - UI library
- `@prisma/client` - Database ORM
- `three`, `@react-three/fiber`, `@react-three/drei` - 3D graphics
- `tailwindcss` - Styling
- `@radix-ui/react-*` - Accessible UI primitives
- `lucide-react` - Icons

## 🚢 Deployment

This app is designed to be deployed on **Vercel**:

1. Push to GitHub
2. Import to Vercel
3. Set environment variables
4. Deploy

Vercel automatically handles:
- Building Next.js
- Running `prisma generate`
- Deploying API routes as serverless functions

## 📝 Notes

- All API routes are serverless functions
- Database is connected via Prisma ORM
- Images are optimized with Next.js Image component
- 3D graphics are lazy-loaded for performance

---

Part of the [my-personal-page monorepo](../../README.md)
