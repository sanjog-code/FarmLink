# Database Schema

FarmLink uses **PostgreSQL** with **Prisma ORM** for type-safe database operations.

---

## Setup

```bash
# Install dependencies
npm install

# Create and run migrations
npm run prisma:migrate

# Push schema to database without migrations (dev only)
npm run prisma:push

# Open Prisma Studio GUI
npm run prisma:studio

# Seed database with sample data
npm run seed
```

---

## Models

### User

Base model for all users with authentication and role management.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| email | String | Unique email address |
| password | String | bcrypt hashed password |
| name | String | Full name |
| phone | String? | Phone number |
| role | Enum | CONSUMER, FARMER, BULK_BUYER, ADMIN |
| avatar | String? | Profile image URL |
| isVerified | Boolean | Account verification status |
| createdAt | DateTime | Account creation timestamp |
| updatedAt | DateTime | Last update timestamp |

**Relations:** Consumer, Farmer, BulkBuyer, Admin (one-to-one based on role)

---

### Consumer

Profile for consumer users with delivery addresses and preferences.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| userId | UUID | Foreign key to User |
| addresses | JSON | Saved delivery addresses |
| preferences | JSON | Shopping preferences |

**Relations:** User (one), Orders (many), Cart (many), Wishlist (many), Reviews (many)

---

### Farmer

Profile for farmer users with farm details and location data.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| userId | UUID | Foreign key to User |
| farmerId | String | Unique farmer ID (FMR-2026-XXXXX) |
| farmName | String | Farm or business name |
| description | String? | Farm description |
| latitude | Float | Farm latitude coordinate |
| longitude | Float | Farm longitude coordinate |
| address | String | Farm address |
| city | String | City |
| state | String | State |
| pincode | String | Postal code |
| isVerified | Boolean | Verification status |
| certifications | String[] | Organic/trade certifications |
| createdAt | DateTime | Registration timestamp |

**Relations:** User (one), Produce (many), Orders (many), BulkOrders (many)

---

### BulkBuyer

Profile for wholesale buyer users with business details.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| userId | UUID | Foreign key to User |
| companyName | String | Business name |
| gstNumber | String | GST identification number |
| businessType | String | Type of business |
| address | String | Business address |
| city | String | City |
| state | String | State |
| isGstVerified | Boolean | GST verification status |
| createdAt | DateTime | Registration timestamp |

**Relations:** User (one), BulkOrders (many), Orders (many)

---

### Admin

Profile for admin users with permission levels.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| userId | UUID | Foreign key to User |
| permissions | String[] | Assigned permissions |
| activityLog | JSON | Admin action history |

**Relations:** User (one)

---

### Produce

Agricultural produce listings with grading, pricing, and location data.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| name | String | Produce name |
| description | String | Detailed description |
| category | Enum | VEGETABLES, FRUITS, GRAINS, DAIRY, SPICES, OTHERS |
| subcategory | String? | Specific variety |
| grade | Enum | A, B, C, PREMIUM |
| price | Decimal | Price per unit |
| unit | String | kg, quintal, dozen, piece, litre |
| minQuantity | Int | Minimum order quantity |
| stock | Int | Available stock |
| images | String[] | Cloudinary image URLs |
| isOrganic | Boolean | Organic certification |
| farmerId | UUID | Foreign key to Farmer |
| latitude | Float | Farm latitude |
| longitude | Float | Farm longitude |
| harvestDate | DateTime | Date of harvest |
| expiryDate | DateTime? | Expiry/best-before date |
| isActive | Boolean | Listing active status |
| averageRating | Float | Average user rating |
| totalSold | Int | Total units sold |
| createdAt | DateTime | Listing creation timestamp |
| updatedAt | DateTime | Last update timestamp |

**Relations:** Farmer (one), OrderItems (many), Reviews (many), GradingReports (many), Cart (many), Wishlist (many)

---

### Orders

Customer orders containing multiple produce items.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| orderNumber | String | Human-readable order ID |
| buyerId | UUID | Foreign key to User |
| status | Enum | PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED |
| totalAmount | Decimal | Total order amount |
| shippingAddress | JSON | Delivery address |
| notes | String? | Order notes |
| estimatedDelivery | DateTime? | Expected delivery date |
| createdAt | DateTime | Order placement timestamp |
| updatedAt | DateTime | Last status update |

**Relations:** User (one), OrderItems (many), Logistics (one), Transactions (one)

---

### OrderItems

Individual items within an order.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| orderId | UUID | Foreign key to Orders |
| produceId | UUID | Foreign key to Produce |
| quantity | Int | Ordered quantity |
| unitPrice | Decimal | Price per unit at time of order |
| subtotal | Decimal | quantity × unitPrice |

**Relations:** Orders (one), Produce (one)

---

### BulkOrders

Wholesale orders between bulk buyers and farmers.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| orderNumber | String | Human-readable bulk order ID |
| buyerId | UUID | Foreign key to BulkBuyer |
| farmerId | UUID | Foreign key to Farmer |
| produceId | UUID | Foreign key to Produce |
| quantity | Int | Bulk quantity |
| agreedPrice | Decimal? | Negotiated price per unit |
| status | Enum | QUOTE_REQUESTED, QUOTED, ACCEPTED, REJECTED, FULFILLED, CANCELLED |
| startDate | DateTime | Contract start date |
| endDate | DateTime? | Contract end date |
| terms | String? | Special terms and conditions |
| createdAt | DateTime | Order creation timestamp |
| updatedAt | DateTime | Last update timestamp |

**Relations:** BulkBuyer (one), Farmer (one), Produce (one), Logistics (one), Transactions (one)

---

### Logistics

Shipment tracking for orders.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| orderId | UUID | Foreign key to Orders |
| status | Enum | PICKUP_SCHEDULED, IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED, EXCEPTION |
| trackingId | String? | Third-party tracking number |
| provider | String? | Logistics provider name |
| estimatedDelivery | DateTime? | Estimated delivery date/time |
| currentLatitude | Float? | Current shipment latitude |
| currentLongitude | Float? | Current shipment longitude |
| updates | JSON[] | Status update history |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

**Relations:** Orders (one)

---

### Transactions

Payment records for all financial transactions.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| orderId | UUID | Foreign key to Orders |
| amount | Decimal | Transaction amount |
| status | Enum | PENDING, COMPLETED, FAILED, REFUNDED |
| method | String | Payment method (UPI, Net Banking, COD, etc.) |
| reference | String? | Payment gateway reference ID |
| gstAmount | Decimal | GST amount |
| createdAt | DateTime | Transaction timestamp |

**Relations:** Orders (one)

---

### GradingReports

AI-generated quality grading reports for produce.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| produceId | UUID | Foreign key to Produce |
| farmerId | UUID | Foreign key to Farmer |
| overallGrade | Enum | A, B, C, PREMIUM |
| qualityScore | Int | 0-100 quality score |
| colorScore | Int | Color uniformity score |
| sizeScore | Int | Size and shape score |
| textureScore | Int | Surface texture score |
| freshnessScore | Int | Freshness indicators score |
| defectScore | Int | Defect detection score |
| images | String[] | Grading image URLs |
| observations | String | AI-generated observations |
| recommendations | String | Pricing and handling recommendations |
| createdAt | DateTime | Grading timestamp |

**Relations:** Produce (one), Farmer (one)

---

### Notifications

User notifications for orders, updates, and system messages.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| userId | UUID | Foreign key to User |
| type | Enum | ORDER_UPDATE, PAYMENT, PROMOTION, SYSTEM, VERIFICATION |
| title | String | Notification title |
| message | String | Notification body |
| isRead | Boolean | Read status |
| link | String? | Associated URL |
| createdAt | DateTime | Creation timestamp |

**Relations:** User (one)

---

### Reviews

Product reviews and ratings from consumers.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| produceId | UUID | Foreign key to Produce |
| userId | UUID | Foreign key to Consumer |
| rating | Int | Rating 1-5 |
| comment | String? | Review text |
| farmerResponse | String? | Farmer's response |
| createdAt | DateTime | Review timestamp |

**Relations:** Produce (one), Consumer (one)

---

### Cart

Shopping cart items for consumers.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| userId | UUID | Foreign key to Consumer |
| produceId | UUID | Foreign key to Produce |
| quantity | Int | Desired quantity |
| createdAt | DateTime | Added timestamp |

**Relations:** Consumer (one), Produce (one)

---

### Wishlist

Saved products for later purchase.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| userId | UUID | Foreign key to Consumer |
| produceId | UUID | Foreign key to Produce |
| createdAt | DateTime | Added timestamp |

**Relations:** Consumer (one), Produce (one)

---

## Relationships Diagram

```
User ─────────┬── Consumer ──┬── Orders ──── OrderItems ──── Produce
              │              │                │
              │              │                ├── Logistics
              │              │                │
              │              │                ├── Transactions
              │              │
              │              ├── Cart ──────── Produce
              │              ├── Wishlist ──── Produce
              │              └── Reviews ───── Produce
              │
              ├── Farmer ──── Produce ──────── GradingReports
              │              │
              │              ├── BulkOrders
              │              └── Orders (as fulfiller)
              │
              ├── BulkBuyer ── BulkOrders
              │
              └── Admin
```

---

## Seed Data

The seed script populates the database with sample data for development:

- 4 demo users (Consumer, Farmer, Bulk Buyer, Admin)
- 20+ produce listings across all categories
- Sample orders and transactions
- Grading reports
- Reviews and ratings

Run `npm run seed` to populate the database.
