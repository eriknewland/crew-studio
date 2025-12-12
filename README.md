# Product Catalog Application

A full-stack product catalog application built with Next.js, Node.js/Express, and MongoDB.

## Tech Stack

- **Frontend**: Next.js 14 (TypeScript), SASS, Redux Toolkit Query, Formik
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB
- **Containerization**: Docker & Docker Compose

## Features

### Product Listing Page (/)
- Grid layout with product cards (image, title, price)
- "Add Product" button with dialog form
- Search bar (searches product titles)
- Category filter (checkboxes)
- Price range filter (min/max inputs)
- Sort by price (High to Low, Low to High)

### Product Detail Page (/products/[slug])
- Full product details (image, title, description, category, price, availability)
- Related products (3-4 items from same category)
- Edit and delete product functionality

## Project Structure

```
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   ├── index.ts        # Entry point
│   │   └── seed.ts         # Database seeder
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                # Next.js application
│   ├── src/
│   │   ├── app/            # Next.js App Router pages
│   │   ├── components/     # React components
│   │   ├── store/          # Redux store & RTK Query
│   │   ├── styles/         # Global SASS styles
│   │   └── types/          # TypeScript types
│   ├── Dockerfile
│   └── package.json
│
└── docker-compose.yml       # Docker orchestration
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- Docker & Docker Compose (for containerized setup)
- MongoDB (for local development without Docker)

### Option 1: Docker Setup (Recommended)

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd crew-studio-assignment
   ```

2. Start all services:
   ```bash
   docker-compose up --build
   ```

3. Seed the database (in a new terminal):
   ```bash
   docker-compose exec backend npm run seed
   ```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

### Option 2: Local Development

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd crew-studio-assignment
   ```

2. Start MongoDB (make sure MongoDB is running on `localhost:27017`)

3. Setup and start the backend:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   npm run seed  # Seed the database
   npm run dev   # Start development server
   ```

4. Setup and start the frontend (in a new terminal):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

## API Endpoints

| Method | Endpoint                    | Description                  |
|--------|----------------------------|------------------------------|
| GET    | /api/products              | Get all products (with filters) |
| GET    | /api/products/:slug        | Get product by slug          |
| GET    | /api/products/:slug/related | Get related products         |
| POST   | /api/products              | Create new product           |
| PUT    | /api/products/:slug        | Update product               |
| DELETE | /api/products/:slug        | Delete product               |
| POST   | /api/products/generate-slug | Generate slug from title     |

### Query Parameters for GET /api/products

| Parameter  | Type   | Description                           |
|------------|--------|---------------------------------------|
| search     | string | Search products by title              |
| categories | string | Comma-separated category names        |
| minPrice   | number | Minimum price filter                  |
| maxPrice   | number | Maximum price filter                  |
| sort       | string | `price_asc` or `price_desc`          |
| page       | number | Page number (default: 1)              |
| limit      | number | Items per page (default: 12)          |

## Database Schema

### Product
```typescript
{
  title: string;        // Required, max 200 chars
  description: string;  // Required
  image: string;        // Required, URL
  category: string;     // Required, enum: Clothing, Shoes, Accessories, Electronics
  price: number;        // Required, min 0
  availability: boolean; // Required
  slug: string;         // Auto-generated from title
  createdAt: Date;
  updatedAt: Date;
}
```

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/product-catalog
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Development Notes

- The slug is auto-generated from the product title using the `slugify` library
- Duplicate slugs are handled by appending a counter (e.g., `product-name-1`)
- Redux Toolkit Query handles caching and automatic refetching
- Formik with Yup validation is used for all forms
- SASS variables are centralized in `variables.scss`
