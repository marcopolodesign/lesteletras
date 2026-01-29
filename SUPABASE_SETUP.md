# Supabase Integration Guide

This document explains how to set up Supabase for the Leste website and migrate from static JSON to a database-backed product catalog.

## 📋 Overview

Currently, products are stored in `public/products.json`. Supabase integration will enable:
- Dynamic product management
- Real-time inventory tracking
- Future shopping cart and order management
- Admin dashboard capabilities
- Scalable image hosting

## 🚀 Getting Started with Supabase

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details:
   - **Name:** leste-website
   - **Database Password:** (generate secure password - save it!)
   - **Region:** Choose closest to your users
5. Click "Create new project" (this takes 2-3 minutes)

### Step 2: Get API Credentials

Once your project is created:

1. Go to **Settings → API**
2. Copy these values:
   - **Project URL:** `https://[project-id].supabase.co`
   - **Anon Key:** `eyJhbGc...` (public, safe for frontend)
   - **Service Key:** `eyJhbGc...` (secret, for backend only)

3. Create `.env` file in project root:

```env
VITE_SUPABASE_URL=https://[project-id].supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**Note:** Only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are exposed to frontend.

## 📊 Database Schema

### Products Table

Create a table in Supabase with this structure:

```sql
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  series TEXT,
  description TEXT,
  price TEXT,
  stock INTEGER DEFAULT 0,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_products_published ON products(published);
CREATE INDEX idx_products_created_at ON products(created_at);
```

### How to Create the Table

**Option A: Via SQL Editor (Recommended)**

1. In Supabase Dashboard, go to **SQL Editor**
2. Click "New Query"
3. Paste the SQL above
4. Click "Run"

**Option B: Via Supabase UI**

1. Go to **Table Editor**
2. Click "Create a new table"
3. Name it `products`
4. Add columns:
   - `id` (Text, Primary Key)
   - `name` (Text)
   - `series` (Text)
   - `description` (Text)
   - `price` (Text)
   - `stock` (Int8)
   - `images` (Text Array)
   - `details` (JSON)
   - `published` (Boolean)
5. Click "Save"

## 📤 Migrating Data

### Option 1: From products.json (Recommended)

Create a migration script:

```bash
# scripts/migrateToSupabase.js
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

const products = JSON.parse(fs.readFileSync('public/products.json', 'utf-8'))

async function migrate() {
  for (const product of products) {
    const { error } = await supabase
      .from('products')
      .insert([
        {
          id: product.id,
          name: product.name,
          series: product.series,
          description: product.description,
          price: product.price,
          stock: product.stock,
          images: product.images || [],
          details: product.details || {},
        },
      ])

    if (error) console.error(`Error inserting ${product.name}:`, error)
    else console.log(`✓ Inserted ${product.name}`)
  }
}

migrate()
```

Run with:
```bash
node scripts/migrateToSupabase.js
```

### Option 2: Manual Upload

1. Go to **Table Editor** in Supabase
2. Click "Insert" on products table
3. Paste product data
4. Or use CSV import for bulk upload

## 🔐 Row Level Security (RLS)

Set up basic permissions:

1. Go to **Table Editor → products**
2. Click **RLS** button
3. Enable RLS
4. Add policy: Allow SELECT for all (unauthenticated read)

```sql
CREATE POLICY "Allow public read"
ON products FOR SELECT
USING (published = true);
```

## 📝 Update Products Component

Modify `src/pages/Products.jsx` to fetch from Supabase:

```jsx
import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Container } from '../components/ui'
import { ProductCard } from '../components/ProductCard'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false })

        if (error) throw error
        setProducts(data || [])
      } catch (error) {
        console.error('Error loading products:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  return (
    <div>
      {/* ... rest of component ... */}
    </div>
  )
}
```

## 🖼️ Image Management

### Option 1: Use Supabase Storage

1. Go to **Storage** in Supabase
2. Create bucket named `products`
3. Upload product images
4. Get public URL: `https://[project-id].supabase.co/storage/v1/object/public/products/image.jpg`

### Option 2: Keep images in public folder

- Continue using relative paths: `/products/image.jpg`
- Manually manage `/public/products/` folder
- Simpler for small catalogs

### Option 3: Hybrid

- Store small/backup images in Supabase Storage
- Use public folder for frequently accessed images

## 🛡️ Security Considerations

### Public Data (Safe)
- Product names, descriptions, prices
- Product images
- Stock availability

### Protected Data (Use RLS)
- Admin information
- Order details
- Customer information

### API Keys
- **Anon Key:** Public, use in frontend (limited to RLS policies)
- **Service Key:** Secret, use in backend only (full access)
- Never commit keys to git - use `.env` files

## 📊 Admin Dashboard (Future)

Future capabilities once integrated:

1. Add/edit/delete products
2. Update stock levels
3. View analytics
4. Manage orders
5. Customer management

## 🔄 Keeping JSON Backup

To maintain the JSON file as backup:

```bash
# scripts/backupProductsJSON.js
# Auto-exports Supabase products to JSON weekly
```

## 🚀 Deployment with Supabase

### Environment Variables on Vercel

1. Go to Vercel Project Settings
2. Environment Variables
3. Add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

4. Redeploy

## 🐛 Troubleshooting

### "Cannot find module @supabase/supabase-js"

Install the dependency:
```bash
npm install @supabase/supabase-js
```

### Products not loading

1. Check Supabase RLS policy
2. Verify `published = true` in database
3. Check browser console for errors
4. Verify API credentials in `.env`

### Images not showing

1. Check image URLs in database
2. Verify images are accessible/public
3. Test image URL in browser directly

### RLS blocking reads

1. Add SELECT policy for unauthenticated users
2. Or temporarily disable RLS for development
3. Enable RLS before production

## ✅ Verification Checklist

- [ ] Supabase project created
- [ ] API credentials obtained
- [ ] `.env` file created with credentials
- [ ] Products table created in Supabase
- [ ] Data migrated to Supabase
- [ ] RLS policies configured
- [ ] Products loading from Supabase in dev
- [ ] Environment variables set in Vercel
- [ ] Production deployment tested

## 📞 Support

For Supabase issues:
- Check [Supabase Docs](https://supabase.com/docs)
- Visit [Supabase Support](https://supabase.com/support)
- Check browser console errors

## 🎉 You're Done!

Your Leste website is now powered by Supabase. You can:
- ✅ Dynamically manage products
- ✅ Update inventory in real-time
- ✅ Scale to thousands of products
- ✅ Build admin functionality
- ✅ Track analytics and orders

Next steps:
1. Build admin dashboard
2. Add shopping cart functionality
3. Set up payment processing
4. Implement user accounts
