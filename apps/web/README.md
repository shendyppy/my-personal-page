# Personal Portfolio - Web App

The main Next.js fullstack application for the personal portfolio.

## 🎯 About

This is a modern, interactive portfolio website featuring:
- Scroll-driven deep-dive journey (GSAP + Lenis) with a persistent R3F ocean scene
- A procedural research submersible you can drag to spin in every chapter
- Dynamic content management via PostgreSQL
- Responsive design for all devices
- Server-side rendering for optimal performance

## 🏗️ Architecture

This app follows Next.js 16 App Router architecture:

```
apps/web/
├── src/
│   ├── app/
│   │   ├── projects/[slug]/  # Dynamic project pages
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   ├── components/
│   │   ├── ui/              # Base UI components (Button, Card, etc.)
│   │   ├── molecules/       # Small composite components
│   │   ├── organisms/       # Large composite components
│   │   ├── sections/dive/   # One server component per chapter (Surface … Seafloor)
│   │   └── three/dive/      # R3F scene pieces (water, sub, particles, floor)
│   ├── lib/dive/            # Pure journey maths (depth, pose, lanes, timelines)
│   ├── server/queries/      # Server-only data access
│   └── types/               # TypeScript definitions
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

- `src/app/page.tsx` - Landing page: fetches content and composes the six chapters
- `src/app/layout.tsx` - Root layout (dark-only)
- `src/constants/dive.ts` - Chapter registry and journey copy
- `prisma/schema.prisma` - Database schema
- `next.config.ts` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration

## 🎨 Styling

Uses **Tailwind CSS 4** with custom configuration:
- Custom color palette with CSS variables
- Dark-only palette with a fixed lime accent
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

## 📱 Features

- ✅ Responsive design (mobile-first)
- ✅ Scroll-driven deep-dive journey with a persistent 3D scene
- ✅ Reduced-motion fallback (no pins, no canvas, all content visible)
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

# Unit tests (Vitest)
npm test
```

## 📦 Key Dependencies

- `next` - React framework
- `react`, `react-dom` - UI library
- `@prisma/client` - Database ORM
- `three`, `@react-three/fiber`, `@react-three/drei` - 3D graphics
- `gsap`, `lenis` - Scroll choreography and smooth scrolling
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
