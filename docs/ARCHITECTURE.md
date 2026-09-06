# Architecture

FarmLink follows a modern serverless architecture using Next.js App Router.

---

## Overview

```
┌──────────────────────────────────────────────────────────────┐
│                        Client Layer                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ Consumer  │  │  Farmer  │  │  Buyer   │  │  Admin   │    │
│  │   Pages   │  │  Pages   │  │  Pages   │  │  Pages   │    │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘    │
│       └──────────────┼────────────┼──────────────┘           │
│                      ▼                                        │
│              ┌───────────────┐                                │
│              │  React Query   │  (Server State Management)    │
│              │  + Context     │  (Client State Management)    │
│              └───────┬───────┘                                │
│                      ▼                                        │
│              ┌───────────────┐                                │
│              │  Framer Motion │  (Animations & Transitions)   │
│              └───────┬───────┘                                │
└──────────────────────┼───────────────────────────────────────┘
                       │
┌──────────────────────┼───────────────────────────────────────┐
│                  API Layer (Next.js)                          │
│                      ▼                                        │
│  ┌──────────────────────────────────────────────────────┐    │
│  │              Next.js Middleware                        │    │
│  │  • JWT Authentication                                  │    │
│  │  • Role-Based Access Control                           │    │
│  │  • Rate Limiting                                       │    │
│  └──────────────────────┬───────────────────────────────┘    │
│                         ▼                                     │
│  ┌──────────────────────────────────────────────────────┐    │
│  │              API Routes (REST)                         │    │
│  │  • Input Validation (Zod)                              │    │
│  │  • Business Logic                                      │    │
│  │  • Response Formatting                                 │    │
│  └──────────────────────┬───────────────────────────────┘    │
└─────────────────────────┼────────────────────────────────────┘
                          │
┌─────────────────────────┼────────────────────────────────────┐
│                  Data Layer                                   │
│                         ▼                                     │
│  ┌──────────────────────────────────────────────────────┐    │
│  │              Prisma ORM                                │    │
│  │  • Type-safe queries                                   │    │
│  │  • migrations                                          │    │
│  │  • Connection pooling                                  │    │
│  └──────────────────────┬───────────────────────────────┘    │
│                         ▼                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  PostgreSQL   │  │  Cloudinary  │  │  OpenStreet   │       │
│  │  (Database)   │  │  (Images)    │  │  Map (Maps)   │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└──────────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### App Router with Route Groups

Next.js App Router organizes pages using file-based routing with route groups for layout sharing:

```
app/
├── (auth)/          → Shared auth layout (login, register)
├── (consumer)/      → Consumer pages with consumer layout
├── (farmer)/        → Farmer pages with farmer dashboard layout
├── (buyer)/         → Bulk buyer pages with buyer layout
└── (admin)/         → Admin pages with admin dashboard layout
```

### Component Strategy

| Type | Usage | Examples |
|------|-------|----------|
| **Server Components** | Static content, data fetching, SEO | Layouts, product listings, admin tables |
| **Client Components** | Interactive UI, browser APIs | Forms, maps, cart, search filters |
| **Shared Components** | Reused across roles | Navbar, buttons, modals, cards |

### State Management

**React Query (Server State)**
- All API data fetching and caching
- Optimistic updates for mutations
- Automatic cache invalidation
- Background refetching for fresh data

**React Context (Client State)**
- `AuthContext` - User authentication state and methods
- `CartContext` - Shopping cart items and operations
- `ThemeContext` - Dark/light mode preferences

### Animations

Framer Motion provides smooth transitions throughout the app:
- Page transitions between routes
- Card hover and click animations
- Modal enter/exit animations
- Loading skeleton animations
- Staggered list animations

---

## Backend Architecture

### API Routes (REST)

All backend logic lives in `src/app/api/` following Next.js App Router conventions:

```
api/
├── auth/           → Login, register, logout, current user
├── users/          → User CRUD and management
├── produce/        → Produce listings CRUD
├── orders/         → Order management
├── bulk-orders/    → Wholesale order management
├── cart/           → Shopping cart operations
├── wishlist/       → Wishlist management
├── grading/        → AI grading analysis
├── logistics/      → Shipment tracking
├── payments/       → Payment processing
├── notifications/  → User notifications
├── reviews/        → Product reviews
├── search/         → Full-text search
└── analytics/      → Platform analytics
```

### Authentication Middleware

Every protected API route passes through JWT verification:

1. Extract `Authorization` header from request
2. Verify JWT token against `JWT_SECRET`
3. Decode user ID and role from token payload
4. Attach user object to request context
5. Check role permissions for the specific endpoint

### Input Validation

All API inputs are validated using Zod schemas defined in `src/lib/validators.ts`:

```typescript
// Example validation schema
const createProduceSchema = z.object({
  name: z.string().min(2).max(100),
  category: z.enum(['VEGETABLES', 'FRUITS', 'GRAINS']),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
  // ...
});
```

### RBAC (Role-Based Access Control)

| Role | Permissions |
|------|-------------|
| **Consumer** | Browse, purchase, review, manage cart/wishlist |
| **Farmer** | CRUD own listings, manage orders, AI grading, view analytics |
| **Bulk Buyer** | Wholesale marketplace, bulk orders, contracts, GST invoices |
| **Admin** | Full platform access, user management, verification, moderation |

---

## Data Flow

### Standard Request Flow

```
1. User Action (click, form submit)
       │
       ▼
2. React Component calls API via React Query
       │
       ▼
3. Next.js Middleware intercepts request
   ├── Verify JWT token
   ├── Check role permissions
   └── Apply rate limiting
       │
       ▼
4. API Route handler executes
   ├── Validate input with Zod
   ├── Execute business logic
   └── Query database via Prisma
       │
       ▼
5. PostgreSQL returns data
       │
       ▼
6. API Route formats and returns JSON response
       │
       ▼
7. React Query receives response
   ├── Updates cache
   ├── Triggers re-render
   └── UI updates with new data
```

### AI Grading Flow

```
1. Farmer uploads produce images
       │
       ▼
2. Images sent to /api/grading/analyze
       │
       ▼
3. Image preprocessing (resize, normalize)
       │
       ▼
4. Feature extraction
   ├── Color analysis
   ├── Size measurement
   ├── Texture assessment
   ├── Freshness detection
   └── Defect identification
       │
       ▼
5. Weighted score calculation
       │
       ▼
6. Grade assignment (Premium / A / B / C)
       │
       ▼
7. GradingReport saved to database
       │
       ▼
8. Results returned to farmer dashboard
```

---

## Security

### Password Security

- Passwords hashed with **bcrypt** (12 salt rounds)
- Minimum password requirements enforced via Zod
- No plaintext passwords ever stored or logged

### JWT Authentication

- Tokens signed with HS256 algorithm
- **7-day expiry** by default
- Tokens include user ID, email, and role
- Stateless authentication - no server-side sessions
- Tokens invalidated on logout via client-side removal

### Rate Limiting

- API routes rate-limited to prevent abuse
- Stricter limits on auth endpoints (login, register)
- Configurable per-route limits

### Input Validation

- All API inputs validated with **Zod** schemas
- SQL injection prevented by Prisma parameterized queries
- XSS prevention through React's automatic escaping
- CSRF protection via SameSite cookies

### Role-Based Access Control

- Middleware checks user role before route handler executes
- Each API endpoint declares required roles
- Unauthorized access returns 403 Forbidden
- Users can only access their own resources (resource ownership checks)

### Data Protection

- Sensitive data excluded from JWT payloads
- Database connections use SSL in production
- Environment variables for all secrets (never hardcoded)
- `.env` files excluded from version control via `.gitignore`
