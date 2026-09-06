# Deployment Guide

This guide covers deploying FarmLink to various hosting platforms.

---

## Vercel (Recommended)

Vercel provides the best experience for deploying Next.js applications.

### Steps

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import project in Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository

3. **Configure build settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **Set environment variables**
   Add all required environment variables in the Vercel dashboard under Settings > Environment Variables.

5. **Deploy**
   - Click "Deploy"
   - Vercel auto-detects Next.js and configures everything
   - Your app will be live at `https://your-project.vercel.app`

### Vercel Database Options

Since Vercel doesn't include PostgreSQL by default, use one of these:

- **Vercel Postgres** - Built-in PostgreSQL (available on Pro plan)
- **Neon** - Serverless PostgreSQL with generous free tier
- **Supabase** - Open-source Firebase alternative with PostgreSQL
- **Railway** - Full-stack database hosting

Update your `DATABASE_URL` accordingly.

---

## Netlify

### Steps

1. **Connect GitHub repo**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" > "Import an existing project"
   - Select your GitHub repository

2. **Configure build settings**
   | Setting | Value |
   |---------|-------|
   | Build command | `npm run build` |
   | Publish directory | `.next` |
   | Node version | 18 |

3. **Add environment variables**
   - Go to Site settings > Environment variables
   - Add all required variables from `.env.example`

4. **Add Next.js plugin**
   Install the `@netlify/plugin-nextjs` plugin for Next.js support:
   ```bash
   npm install -D @netlify/plugin-nextjs
   ```

   Create `netlify.toml` in project root:
   ```toml
   [[plugins]]
     package = "@netlify/plugin-nextjs"

   [build]
     command = "npm run build"
     publish = ".next"
   ```

5. **Deploy**
   - Netlify auto-deploys on push to main branch

---

## Docker

### Dockerfile

```dockerfile
FROM node:18-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### Using Docker Compose

```bash
# Start all services (app + PostgreSQL)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild after code changes
docker-compose up -d --build
```

`docker-compose.yml`:
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://farmlink:farmlink123@db:5432/farmlink_db
      - JWT_SECRET=your-jwt-secret
      - NEXTAUTH_SECRET=your-nextauth-secret
      - NEXT_PUBLIC_APP_URL=http://localhost:3000
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: farmlink
      POSTGRES_PASSWORD: farmlink123
      POSTGRES_DB: farmlink_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

### Using Docker Only

```bash
# Build the image
docker build -t farmlink .

# Run the container
docker run -p 3000:3000 --env-file .env.local farmlink
```

---

## Environment Variables Required

All deployments require the following environment variables:

### Required (Must Have)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/farmlink_db` |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | `your-super-secret-jwt-key-2026` |
| `NEXTAUTH_SECRET` | NextAuth encryption secret | `your-nextauth-secret` |
| `NEXT_PUBLIC_APP_URL` | Public app URL | `https://farmlink.vercel.app` |

### Optional (Recommended)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXTAUTH_URL` | NextAuth callback URL | `https://farmlink.vercel.app` |
| `NEXT_PUBLIC_APP_NAME` | Display name | `FarmLink` |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |
| `NODE_ENV` | Environment mode | `production` |

### Optional (Feature-Specific)

| Variable | Description | Example |
|----------|-------------|---------|
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your-cloud-name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your-secret` |
| `SMTP_HOST` | Email server host | `smtp.gmail.com` |
| `SMTP_PORT` | Email server port | `587` |
| `SMTP_USER` | Email username | `noreply@farmlink.in` |
| `SMTP_PASS` | Email password | `app-password` |

---

## Post-Deployment Checklist

- [ ] Verify all environment variables are set
- [ ] Run database migrations on production database
- [ ] Seed production database with initial data
- [ ] Test authentication flow (login/register)
- [ ] Test produce listing creation and AI grading
- [ ] Test order placement and tracking
- [ ] Verify image uploads work with Cloudinary
- [ ] Check API rate limiting is active
- [ ] Verify HTTPS is enabled
- [ ] Test mobile responsiveness
- [ ] Monitor error logs for first 24 hours
