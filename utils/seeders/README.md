# Database Seeder & Reset System

This system provides a set of scripts to populate your MongoDB database with realistic dummy data for development and testing.

## Prerequisites

- Node.js installed
- MongoDB running (Local or Atlas)
- `.env` file configured with `DB_URI`

## Scripts

### 1. Reset Database

Clears **ALL** collections in the database. Use with caution!

```bash
npm run seed:reset
```

### 2. Seed Database

Populates the database with users, categories, products, orders, etc.
**Note:** This script is additive. It does not clear the database first.

```bash
npm run seed
```

### 3. Reset & Seed (Recommended for Dev)

Clears the database and then seeds it with fresh data.

```bash
npm run seed:all
```

## Generated Data Highlights

- **Admin User**: `admin@example.com` / `password123`
- **Normal Users**: `user0@example.com` ... `user4@example.com` / `password123`
- **Products**: 20 random products with images, prices, and relationships.
- **Categories**: 5 categories with subcategories.
- **Brands**: 5 brands.
- **Orders**: Random orders (pending, paid, delivered).
- **Reviews**: Random reviews for products.
- **Coupons**: Random coupons.

## Customization

You can adjust the number of generated items in `utils/seeders/seed.js`.
