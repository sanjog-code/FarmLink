# 🌾 FarmLink - Smart Agriculture Marketplace

Built for **Smart India Hackathon (SIH) 2026** - Problem Statement 26033

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [User Roles](#user-roles)
- [AI Grading Module](#ai-grading-module)
- [Smart Ranking Algorithm](#smart-ranking-algorithm)
- [Deployment](#deployment)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

---

## 🌐 Overview

FarmLink is a comprehensive agricultural marketplace platform connecting farmers directly with consumers and bulk buyers. It eliminates middlemen, ensures fair pricing, and uses AI to grade produce quality.

### Problem Statement

India's agricultural supply chain suffers from excessive middlemen, inconsistent quality grading, unfair pricing, and lack of transparency. Farmers receive a fraction of the retail price while consumers pay inflated rates. Post-harvest losses account for nearly 30% of total produce due to inefficient logistics and lack of market access.

### Solution

FarmLink addresses these challenges by providing:

- **Direct farmer-to-consumer marketplace** eliminating unnecessary intermediaries
- **AI-powered produce grading** ensuring consistent quality standards
- **Smart ranking algorithm** that factors in quality, distance, and price
- **Bulk buyer marketplace** for wholesale transactions
- **Real-time logistics tracking** for transparent delivery
- **Farmer analytics dashboard** for data-driven decisions

### Impact

- Increases farmer income by 40-60% by cutting middlemen
- Reduces consumer prices by 20-30%
- Minimizes post-harvest losses through efficient logistics
- Ensures quality consistency via AI grading

---

## ✨ Features

### For Consumers 🛒

- **Fresh Produce Marketplace** - Browse and purchase farm-fresh produce directly from farmers
- **AI-Powered Smart Ranking** - Products ranked by quality, proximity, and price competitiveness
- **Advanced Search & Filter** - Filter by category, grade, distance, price range, and organic certification
- **Product Detail Pages** - View quality reports, farmer profiles, and nutritional information
- **Shopping Cart** - Add multiple items and checkout seamlessly
- **Order Tracking** - Real-time order status updates and delivery tracking
- **Wishlist** - Save favorite products for later purchase
- **Reviews & Ratings** - Rate and review purchased products
- **User Profile Management** - Manage addresses, preferences, and order history

### For Farmers 👨‍🌾

- **Farmer Dashboard** - Comprehensive analytics on sales, earnings, and performance metrics
- **Produce Listing Management** - Create, edit, and manage produce listings with images and descriptions
- **AI-Based Produce Grading** - Upload photos for automatic quality grading using machine learning
- **Order Management** - View, accept, and fulfill incoming orders
- **Logistics Tracking** - Track shipments and manage delivery schedules
- **Bulk Marketplace Listing** - List produce for wholesale buyers
- **Payment Tracking** - Monitor earnings, pending payments, and transaction history
- **Performance Analytics** - Track ratings, repeat customers, and sales trends
- **Profile Verification** - Complete verification process for trust and credibility

### For Bulk Buyers 🏪

- **Wholesale Marketplace** - Access bulk produce listings from verified farmers
- **Negotiation & Quotes** - Request quotes and negotiate prices directly with farmers
- **Bulk Order Management** - Place and manage large-scale orders efficiently
- **Contract Orders** - Establish recurring purchase agreements with farmers
- **Purchase Analytics** - Track spending patterns, supplier performance, and cost savings
- **GST Invoice Generation** - Automated GST-compliant invoices for all transactions
- **Supplier Discovery** - Find farmers by region, produce type, and certification
- **Quality Assurance** - View AI grading reports and request samples before bulk purchase

### For Admins 🔧

- **User Management** - View, manage, and moderate all platform users
- **Farmer Verification** - Review and approve farmer registration applications
- **Bulk Buyer GST Verification** - Validate GST credentials of bulk buyers
- **Listing Moderation** - Review and approve/reject produce listings
- **Platform Analytics** - Monitor platform health, user growth, transaction volume, and revenue
- **Dispute Resolution** - Handle customer complaints and farmer disputes
- **System Configuration** - Manage platform settings, categories, and grading parameters

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 15 (App Router) | React framework with SSR/SSG |
| Language | TypeScript | Type-safe development |
| Styling | TailwindCSS | Utility-first CSS framework |
| UI Components | ShadCN UI | Pre-built accessible components |
| State Management | React Query | Server state and caching |
| Global State | React Context | Client-side shared state |
| Animations | Framer Motion | Smooth page transitions |
| Backend | Next.js API Routes | Serverless API endpoints |
| Runtime | Node.js | JavaScript runtime |
| Database | PostgreSQL | Relational database |
| ORM | Prisma | Type-safe database access |
| Authentication | JWT + bcrypt | Token-based auth with hashing |
| Authorization | RBAC | Role-based access control |
| Image Storage | Cloudinary | Cloud-based image optimization |
| Maps | OpenStreetMap + Leaflet | Location and distance services |
| Charts | Recharts | Data visualization library |
| Validation | Zod | Schema-based input validation |
| Testing | Jest + React Testing Library | Unit and integration tests |
| Deployment | Vercel / Netlify / Docker | Hosting and containerization |
| Package Manager | npm | Dependency management |

---

## 📁 Project Structure

```
farmlink/
├── public/                          # Static assets
│   ├── images/                      # Image assets
│   ├── icons/                       # SVG icons
│   └── favicon.ico                  # Browser tab icon
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── (auth)/                  # Auth route group
│   │   │   ├── login/               # Login page
│   │   │   ├── register/            # Registration page
│   │   │   └── layout.tsx           # Auth layout
│   │   ├── (consumer)/              # Consumer route group
│   │   │   ├── marketplace/         # Browse marketplace
│   │   │   ├── product/[id]/        # Product detail page
│   │   │   ├── cart/                # Shopping cart
│   │   │   ├── checkout/            # Checkout flow
│   │   │   ├── orders/              # Order history & tracking
│   │   │   ├── wishlist/            # Saved products
│   │   │   └── profile/             # Consumer profile
│   │   ├── (farmer)/                # Farmer route group
│   │   │   ├── dashboard/           # Farmer dashboard
│   │   │   ├── listings/            # Produce listings management
│   │   │   ├── listings/new/        # Create new listing
│   │   │   ├── grading/             # AI grading interface
│   │   │   ├── orders/              # Order management
│   │   │   ├── logistics/           # Logistics tracking
│   │   │   ├── bulk/                # Bulk marketplace
│   │   │   ├── payments/            # Payment tracking
│   │   │   └── profile/             # Farmer profile
│   │   ├── (buyer)/                 # Bulk buyer route group
│   │   │   ├── dashboard/           # Buyer dashboard
│   │   │   ├── marketplace/         # Wholesale marketplace
│   │   │   ├── orders/              # Bulk order management
│   │   │   ├── contracts/           # Contract management
│   │   │   ├── analytics/           # Purchase analytics
│   │   │   └── profile/             # Buyer profile
│   │   ├── (admin)/                 # Admin route group
│   │   │   ├── dashboard/           # Admin dashboard
│   │   │   ├── users/               # User management
│   │   │   ├── verification/        # Farmer/buyer verification
│   │   │   ├── listings/            # Listing moderation
│   │   │   ├── analytics/           # Platform analytics
│   │   │   └── settings/            # System settings
│   │   ├── api/                     # API routes
│   │   │   ├── auth/                # Authentication endpoints
│   │   │   │   ├── login/           # POST /api/auth/login
│   │   │   │   ├── register/        # POST /api/auth/register
│   │   │   │   ├── logout/          # POST /api/auth/logout
│   │   │   │   └── me/             # GET /api/auth/me
│   │   │   ├── users/               # User management endpoints
│   │   │   ├── produce/             # Produce CRUD endpoints
│   │   │   ├── orders/              # Order management endpoints
│   │   │   ├── bulk-orders/         # Bulk order endpoints
│   │   │   ├── logistics/           # Logistics endpoints
│   │   │   ├── payments/            # Payment endpoints
│   │   │   ├── grading/             # AI grading endpoints
│   │   │   ├── notifications/       # Notification endpoints
│   │   │   ├── reviews/             # Review endpoints
│   │   │   ├── cart/                # Cart endpoints
│   │   │   ├── wishlist/            # Wishlist endpoints
│   │   │   ├── search/              # Search endpoints
│   │   │   └── analytics/           # Analytics endpoints
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Landing page
│   │   └── globals.css              # Global styles
│   ├── components/                  # Reusable components
│   │   ├── ui/                      # ShadCN UI components
│   │   ├── layout/                  # Layout components
│   │   │   ├── Navbar.tsx           # Navigation bar
│   │   │   ├── Sidebar.tsx          # Dashboard sidebar
│   │   │   ├── Footer.tsx           # Site footer
│   │   │   └── MobileNav.tsx        # Mobile navigation
│   │   ├── marketplace/             # Marketplace components
│   │   │   ├── ProductCard.tsx      # Product listing card
│   │   │   ├── ProductGrid.tsx      # Product grid layout
│   │   │   ├── FilterSidebar.tsx    # Search filters
│   │   │   ├── SortDropdown.tsx     # Sort options
│   │   │   └── SearchBar.tsx        # Search input
│   │   ├── farmer/                  # Farmer-specific components
│   │   │   ├── ListingForm.tsx      # Create/edit listing
│   │   │   ├── GradingUpload.tsx    # AI grading upload
│   │   │   ├── DashboardCharts.tsx  # Analytics charts
│   │   │   └── OrderCard.tsx        # Order display card
│   │   ├── cart/                    # Cart components
│   │   │   ├── CartItem.tsx         # Individual cart item
│   │   │   ├── CartSummary.tsx      # Cart total summary
│   │   │   └── CartEmpty.tsx        # Empty cart state
│   │   ├── admin/                   # Admin components
│   │   │   ├── UserTable.tsx        # User management table
│   │   │   ├── VerificationCard.tsx # Verification request card
│   │   │   └── StatsOverview.tsx    # Platform statistics
│   │   └── shared/                  # Shared components
│   │       ├── LoadingSpinner.tsx   # Loading indicator
│   │       ├── ErrorBoundary.tsx    # Error handling
│   │       ├── EmptyState.tsx       # Empty state display
│   │       ├── ConfirmDialog.tsx    # Confirmation modal
│   │       ├── ImageUpload.tsx      # Image upload component
│   │       ├── Pagination.tsx       # Pagination controls
│   │       └── StarRating.tsx       # Rating display
│   ├── lib/                         # Utility libraries
│   │   ├── auth.ts                  # Authentication helpers
│   │   ├── db.ts                    # Prisma client instance
│   │   ├── utils.ts                 # General utilities
│   │   ├── constants.ts             # App constants
│   │   ├── validators.ts            # Zod validation schemas
│   │   ├── grading.ts               # AI grading logic
│   │   ├── ranking.ts               # Smart ranking algorithm
│   │   └── email.ts                 # Email utilities
│   ├── hooks/                       # Custom React hooks
│   │   ├── useAuth.ts               # Authentication hook
│   │   ├── useCart.ts               # Cart management hook
│   │   ├── useProduce.ts            # Produce data hook
│   │   ├── useOrders.ts             # Orders data hook
│   │   ├── useSearch.ts             # Search functionality hook
│   │   ├── useGeolocation.ts        # Location services hook
│   │   └── useNotifications.ts      # Notifications hook
│   ├── context/                     # React Context providers
│   │   ├── AuthContext.tsx           # Authentication context
│   │   ├── CartContext.tsx           # Shopping cart context
│   │   └── ThemeContext.tsx          # Theme/dark mode context
│   ├── types/                       # TypeScript type definitions
│   │   ├── user.ts                  # User-related types
│   │   ├── produce.ts               # Produce-related types
│   │   ├── order.ts                 # Order-related types
│   │   ├── api.ts                   # API response types
│   │   └── common.ts                # Shared types
│   └── middleware.ts                 # Next.js middleware (auth guards)
├── prisma/                          # Database configuration
│   ├── schema.prisma                # Database schema definition
│   ├── seed.ts                      # Database seed script
│   └── migrations/                  # Migration history
├── docs/                            # Documentation
│   ├── DEPLOYMENT.md                # Deployment guide
│   └── ARCHITECTURE.md              # Architecture documentation
├── tests/                           # Test files
│   ├── unit/                        # Unit tests
│   │   ├── auth.test.ts             # Auth unit tests
│   │   ├── grading.test.ts          # Grading logic tests
│   │   └── ranking.test.ts          # Ranking algorithm tests
│   ├── integration/                 # Integration tests
│   │   ├── api/                     # API integration tests
│   │   └── components/              # Component integration tests
│   └── setup.ts                     # Test setup and configuration
├── .env.example                     # Environment variable template
├── .env.local                       # Local environment variables
├── .gitignore                       # Git ignore rules
├── .eslintrc.json                   # ESLint configuration
├── .prettierrc                      # Prettier configuration
├── tailwind.config.ts               # TailwindCSS configuration
├── next.config.ts                   # Next.js configuration
├── tsconfig.json                    # TypeScript configuration
├── jest.config.js                   # Jest test configuration
├── docker-compose.yml               # Docker Compose configuration
├── Dockerfile                       # Docker build configuration
├── package.json                     # Dependencies and scripts
└── README.md                        # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** v18.17 or later
- **npm** v9 or later
- **PostgreSQL** v14 or later
- **Git** (for version control)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-team/farmlink.git
   cd farmlink
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration values.

4. **Set up PostgreSQL database**
   ```bash
   # Create a new database
   createdb farmlink_db
   ```

5. **Run database migrations**
   ```bash
   npm run prisma:migrate
   ```

6. **Seed the database with sample data**
   ```bash
   npm run seed
   ```

7. **Start the development server**
   ```bash
   npm run dev
   ```

8. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint for code quality |
| `npm run typecheck` | Run TypeScript type checking |
| `npm test` | Run Jest test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run prisma:migrate` | Run Prisma migrations |
| `npm run prisma:push` | Push schema to database without migrations |
| `npm run prisma:studio` | Open Prisma Studio GUI |
| `npm run seed` | Seed database with sample data |

---

## 🔐 Environment Variables

Create a `.env.local` file in the project root with the following variables:

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string | `postgresql://user:password@localhost:5432/farmlink_db` |
| `JWT_SECRET` | ✅ | Secret key for JWT token signing | `your-super-secret-jwt-key-2026` |
| `JWT_EXPIRES_IN` | ❌ | JWT token expiry duration | `7d` |
| `NEXTAUTH_SECRET` | ✅ | NextAuth encryption secret | `your-nextauth-secret` |
| `NEXTAUTH_URL` | ✅ | Application base URL | `http://localhost:3000` |
| `NEXT_PUBLIC_APP_URL` | ✅ | Public-facing application URL | `http://localhost:3000` |
| `NEXT_PUBLIC_APP_NAME` | ❌ | Application display name | `FarmLink` |
| `CLOUDINARY_CLOUD_NAME` | ❌ | Cloudinary cloud name | `your-cloud-name` |
| `CLOUDINARY_API_KEY` | ❌ | Cloudinary API key | `123456789` |
| `CLOUDINARY_API_SECRET` | ❌ | Cloudinary API secret | `your-api-secret` |
| `NEXT_PUBLIC_MAP_TILE_URL` | ❌ | Map tile server URL | `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png` |
| `SMTP_HOST` | ❌ | Email SMTP host | `smtp.gmail.com` |
| `SMTP_PORT` | ❌ | Email SMTP port | `587` |
| `SMTP_USER` | ❌ | Email SMTP username | `noreply@farmlink.in` |
| `SMTP_PASS` | ❌ | Email SMTP password | `your-smtp-password` |
| `NODE_ENV` | ❌ | Environment mode | `development` |

---

## 📊 Database Schema

### Core Models

```
┌─────────────────────────────────────────────────────────┐
│                      User                                │
├─────────────────────────────────────────────────────────┤
│ id          UUID (PK)                                   │
│ email       String (unique)                             │
│ password    String (hashed)                             │
│ name        String                                      │
│ phone       String?                                     │
│ role        Enum (CONSUMER, FARMER, BULK_BUYER, ADMIN)  │
│ avatar      String?                                     │
│ isVerified  Boolean                                     │
│ createdAt   DateTime                                    │
│ updatedAt   DateTime                                    │
└─────────────────────────────────────────────────────────┘
         │
         ├── Consumer (profile, addresses, preferences)
         ├── Farmer (farm details, location, certifications)
         ├── BulkBuyer (company info, GST, business details)
         └── Admin (permissions, activity log)
```

### Produce Model

```
┌─────────────────────────────────────────────────────────┐
│                     Produce                              │
├─────────────────────────────────────────────────────────┤
│ id            UUID (PK)                                 │
│ name          String                                    │
│ description   String                                    │
│ category      Enum (VEGETABLES, FRUITS, GRAINS, etc.)  │
│ grade         Enum (A, B, C, PREMIUM)                   │
│ price         Decimal                                   │
│ unit          String (kg, quintal, dozen, etc.)         │
│ minQuantity   Int                                       │
│ stock         Int                                       │
│ images        String[] (Cloudinary URLs)                │
│ isOrganic     Boolean                                   │
│ farmerId      UUID (FK → User)                          │
│ latitude      Float                                     │
│ longitude     Float                                     │
│ harvestDate   DateTime                                  │
│ expiryDate    DateTime                                  │
│ isActive      Boolean                                   │
│ createdAt     DateTime                                  │
│ updatedAt     DateTime                                  │
└─────────────────────────────────────────────────────────┘
```

### Order & Transaction Models

```
┌──────────────────────┐     ┌──────────────────────┐
│       Orders         │     │     OrderItems        │
├──────────────────────┤     ├──────────────────────┤
│ id        UUID (PK)  │◄────│ id         UUID (PK) │
│ buyerId   UUID (FK)  │     │ orderId    UUID (FK)  │
│ status    Enum       │     │ produceId  UUID (FK)  │
│ total     Decimal    │     │ quantity   Int        │
│ notes     String?    │     │ price      Decimal    │
│ createdAt DateTime   │     │ subtotal   Decimal    │
└──────────────────────┘     └──────────────────────┘

┌──────────────────────┐     ┌──────────────────────┐
│     BulkOrders       │     │     Logistics        │
├──────────────────────┤     ├──────────────────────┤
│ id        UUID (PK)  │     │ id           UUID(PK) │
│ buyerId   UUID (FK)  │     │ orderId      UUID(FK) │
│ farmerId  UUID (FK)  │     │ status       Enum     │
│ produceId UUID (FK)  │     │ trackingId   String   │
│ quantity  Int        │     │ provider     String   │
│ price     Decimal    │     │ estimatedDate DateTime│
│ status    Enum       │     │ currentLat   Float    │
│ startDate DateTime   │     │ currentLng   Float    │
│ endDate   DateTime?  │     └──────────────────────┘
└──────────────────────┘
```

### Supporting Models

| Model | Description |
|-------|-------------|
| `Transactions` | Payment records with amount, status, method, and references |
| `Notifications` | User notifications with type, message, and read status |
| `Reviews` | Product reviews with ratings, comments, and farmer responses |
| `Cart` | Shopping cart items linked to users and produce |
| `Wishlist` | Saved products for later purchase |
| `GradingReports` | AI grading results with scores and recommendations |

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login and receive JWT | No |
| POST | `/api/auth/logout` | Invalidate JWT token | Yes |
| GET | `/api/auth/me` | Get current user profile | Yes |

### Users

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/users` | List all users | Yes | Admin |
| GET | `/api/users/:id` | Get user by ID | Yes | Admin |
| PUT | `/api/users/:id` | Update user profile | Yes | Self/Admin |
| DELETE | `/api/users/:id` | Delete user | Yes | Admin |
| PUT | `/api/users/:id/verify` | Verify farmer/buyer | Yes | Admin |

### Produce

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/produce` | List all produce (with filters) | No | Public |
| GET | `/api/produce/:id` | Get produce details | No | Public |
| POST | `/api/produce` | Create new listing | Yes | Farmer |
| PUT | `/api/produce/:id` | Update listing | Yes | Farmer |
| DELETE | `/api/produce/:id` | Delete listing | Yes | Farmer |
| GET | `/api/produce/farmer/:id` | Get farmer's listings | No | Public |
| GET | `/api/produce/search` | Search produce | No | Public |

### Orders

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/orders` | List user's orders | Yes | Consumer/Buyer |
| GET | `/api/orders/:id` | Get order details | Yes | Consumer/Farmer/Buyer |
| POST | `/api/orders` | Create new order | Yes | Consumer |
| PUT | `/api/orders/:id/status` | Update order status | Yes | Farmer |
| PUT | `/api/orders/:id/cancel` | Cancel order | Yes | Consumer |

### Bulk Orders

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/bulk-orders` | List bulk orders | Yes | Buyer/Farmer |
| POST | `/api/bulk-orders` | Create bulk order | Yes | Buyer |
| PUT | `/api/bulk-orders/:id` | Update bulk order | Yes | Buyer/Farmer |
| POST | `/api/bulk-orders/:id/quote` | Request/provide quote | Yes | Buyer/Farmer |

### Cart

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/cart` | Get cart contents | Yes | Consumer |
| POST | `/api/cart` | Add item to cart | Yes | Consumer |
| PUT | `/api/cart/:id` | Update cart item quantity | Yes | Consumer |
| DELETE | `/api/cart/:id` | Remove item from cart | Yes | Consumer |
| DELETE | `/api/cart` | Clear entire cart | Yes | Consumer |

### Wishlist

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/wishlist` | Get wishlist | Yes | Consumer |
| POST | `/api/wishlist` | Add item to wishlist | Yes | Consumer |
| DELETE | `/api/wishlist/:id` | Remove from wishlist | Yes | Consumer |

### Grading

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/api/grading/analyze` | Upload image for AI grading | Yes | Farmer |
| GET | `/api/grading/:id` | Get grading report | Yes | Farmer |
| GET | `/api/grading/history` | Get grading history | Yes | Farmer |

### Reviews

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/reviews/produce/:id` | Get produce reviews | No | Public |
| POST | `/api/reviews` | Create review | Yes | Consumer |
| PUT | `/api/reviews/:id` | Update review | Yes | Consumer |
| DELETE | `/api/reviews/:id` | Delete review | Yes | Consumer |

### Notifications

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/notifications` | Get user notifications | Yes | Any |
| PUT | `/api/notifications/:id/read` | Mark as read | Yes | Any |
| PUT | `/api/notifications/read-all` | Mark all as read | Yes | Any |

### Logistics

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/logistics/:orderId` | Track shipment | Yes | Consumer/Farmer |
| PUT | `/api/logistics/:id` | Update tracking info | Yes | Farmer |

### Analytics

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/analytics/platform` | Platform-wide analytics | Yes | Admin |
| GET | `/api/analytics/farmer` | Farmer-specific analytics | Yes | Farmer |
| GET | `/api/analytics/buyer` | Buyer purchase analytics | Yes | Buyer |

---

## 👥 User Roles

### Consumer

- Browse and purchase produce from the marketplace
- Rate and review purchased products
- Manage shopping cart and wishlist
- Track order status and delivery
- Manage profile and delivery addresses

**Login:** Any registered email with consumer role

### Farmer

- Create and manage produce listings
- Use AI grading to certify produce quality
- Manage incoming orders and update statuses
- View analytics on sales and performance
- List produce on the bulk marketplace
- Track payments and earnings

**Login:** Farmer ID (format: `FMR-2026-XXXXX`) or registered email

### Bulk Buyer

- Access wholesale marketplace
- Place bulk orders and negotiate prices
- Establish contract orders with farmers
- Generate GST invoices
- View purchase analytics and spending reports

**Login:** Any registered email with bulk buyer role

### Admin

- Full platform management access
- Verify farmers and bulk buyers
- Moderate produce listings
- View comprehensive platform analytics
- Manage user accounts and resolve disputes
- Configure platform settings

**Login:** Admin credentials assigned by system

---

## 🤖 AI Grading Module

The AI Grading Module uses image analysis to automatically assess produce quality and assign grades.

### How It Works

1. **Image Upload** - Farmer uploads 1-5 photos of their produce
2. **Preprocessing** - Images are normalized for consistent analysis
3. **Feature Extraction** - AI analyzes color, size, texture, uniformity, and defect presence
4. **Grade Assignment** - Based on weighted feature scores, produce is assigned a grade

### Grade Criteria

| Grade | Quality Score | Description |
|-------|--------------|-------------|
| **Premium** | 90-100 | Exceptional quality, perfect appearance, no defects |
| **A** | 75-89 | High quality, minimal imperfections, excellent freshness |
| **B** | 60-74 | Good quality, acceptable imperfections, good freshness |
| **C** | Below 60 | Standard quality, visible imperfections, adequate freshness |

### AI Analysis Factors

- **Color Uniformity** (25%) - Consistency and richness of natural color
- **Size & Shape** (20%) - Uniformity and adherence to expected dimensions
- **Surface Texture** (20%) - Smoothness, absence of blemishes and marks
- **Freshness Indicators** (20%) - Crispness, moisture, and overall freshness signals
- **Defect Detection** (15%) - Presence of spots, bruises, cuts, or pest damage

### Grading Report Output

Each grading generates a detailed report including:
- Overall grade and quality score
- Breakdown of individual factor scores
- Specific observations and recommendations
- Comparison with category averages
- Suggestions for price positioning

---

## 📈 Smart Ranking Algorithm

FarmLink uses a smart ranking algorithm to present the most relevant and high-quality produce to consumers.

### Formula

```
Final Score = (Quality Score × 0.40) + (Distance Score × 0.40) + (Price Score × 0.20)
```

### Score Components

#### Quality Score (40%)
- Derived from AI grading results (Premium=100, A=85, B=70, C=55)
- Adjusted by user reviews and ratings
- Freshness factor based on harvest date

#### Distance Score (40%)
- Calculated using Haversine formula between user location and farm
- Closer farms receive higher scores
- Score decreases with distance: `score = max(0, 100 - (distance_km × 2))`

#### Price Score (20%)
- Compared against category average price
- Fair-priced produce (within ±10% of average) receives maximum score
- Overpriced produce is penalized: `score = max(0, 100 - ((price_ratio - 1) × 100))`
- Underpriced produce gets a moderate boost (may signal quality concerns)

### Additional Ranking Factors

- **Listing Freshness** - Newer listings get a slight boost
- **Farmer Rating** - Higher-rated farmers get priority
- **Organic Certification** - Organic produce receives a 5% bonus
- **Stock Availability** - In-stock items preferred over low-stock

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and import your project
3. Configure environment variables in the Vercel dashboard
4. Vercel auto-detects Next.js and configures the build
5. Deploy - your app is live!

**Note:** Set up PostgreSQL via Vercel Postgres, Neon, or Supabase for the database.

### Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add all required environment variables
5. Deploy

### Docker

**Using Docker Compose:**

```bash
# Start all services (app + PostgreSQL)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild after changes
docker-compose up -d --build
```

**Using Docker only:**

```bash
# Build the image
docker build -t farmlink .

# Run the container
docker run -p 3000:3000 --env-file .env.local farmlink
```

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm run start
```

---

## 🧪 Testing

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

### Test Categories

| Category | Location | Description |
|----------|----------|-------------|
| Unit Tests | `tests/unit/` | Individual function and component tests |
| Integration Tests | `tests/integration/` | API route and multi-component tests |
| Component Tests | `tests/integration/components/` | React component rendering and interaction tests |

---

## 🎮 Demo Credentials

| Role | Identifier | Password | Description |
|------|-----------|----------|-------------|
| Consumer | `user1@gmail.com` | `password123` | Standard consumer account |
| Farmer | `FMR-2026-10001` | `password123` | Verified farmer account |
| Bulk Buyer | `buyer1@gmail.com` | `password123` | Wholesale buyer account |
| Admin | `admin@farmlink.in` | `password123` | Platform administrator |

> **Note:** These are demo credentials for development purposes only. Change all passwords before deploying to production.

---

## 🤝 Contributing

We welcome contributions to FarmLink! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Code Standards

- Follow TypeScript strict mode
- Use ESLint and Prettier for code formatting
- Write tests for new features
- Update documentation as needed
- Follow existing code conventions and patterns

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 FarmLink Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<p align="center">Made with ❤️ for Indian Farmers | Smart India Hackathon 2026</p>
