# My Personal Page - Monorepo

A modern fullstack portfolio monorepo built with Next.js, featuring 3D interactive elements, dark/light theme support, and PostgreSQL backend.

## 📁 Project Structure

```
my-personal-page/
├── apps/
│   └── web/                    # Main Next.js fullstack application
│       ├── src/               # Source code
│       ├── prisma/            # Database schema & migrations
│       ├── public/            # Static assets
│       └── package.json       # Web app dependencies
└── package.json               # Root workspace config
```

This is a **monorepo** using **npm workspaces**. The structure allows for easy scaling by adding more apps (e.g., `apps/api`, `apps/admin`) or shared packages (e.g., `packages/ui`) in the future.

## 🚀 Tech Stack

### Frontend

- **Next.js 15.5** - React framework with App Router
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Three.js + React Three Fiber** - 3D graphics
- **Radix UI** - Accessible component primitives

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - Type-safe ORM
- **PostgreSQL** - Database (deployed on Neon)

### Tools

- **npm workspaces** - Monorepo management
- **ESLint** - Code linting
- **Vercel Analytics** - Usage analytics

## 🛠️ Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- PostgreSQL database (recommended: [Neon](https://neon.tech))

### Installation

1. **Clone and install**

   ```bash
   git clone <repo-url>
   cd my-personal-page
   npm install
   ```

2. **Setup environment**

   ```bash
   cd apps/web
   cp .env.example .env
   # Edit .env and add your DATABASE_URL
   ```

3. **Setup database**
   ```bash
   cd apps/web
   npx prisma generate
   npx prisma migrate dev --name init
   ```

### Development

Run from **root directory**:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

**From root:**

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Lint all code

**From apps/web:**

- `npx prisma studio` - Open database GUI
- `npx prisma migrate dev` - Create database migration
- `npx prisma generate` - Generate Prisma Client

## 🗄️ Database

The app uses Prisma with PostgreSQL. Main models:

- Projects (with highlights & images)
- Experiences
- Skills & Tech Stacks
- Social Links & About sections

Schema: `apps/web/prisma/schema.prisma`

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Set `DATABASE_URL` environment variable
4. Deploy

### Environment Variables

```env
DATABASE_URL="postgresql://user:password@host:port/db?sslmode=require"
```

## 📦 Adding More Apps

To add a new app to the monorepo:

```bash
mkdir apps/new-app
cd apps/new-app
npm init -y
# Setup your app...
```

## 👨‍💻 Author

**Shendy**

- Portfolio: https://shendyppy.vercel.app/
- GitHub: [@shendyppy](https://github.com/shendyppy)
