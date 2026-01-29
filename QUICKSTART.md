# Leste Website - Quick Start Guide

## 🚀 Get Running in 30 Seconds

```bash
cd /Users/mataldao/Local/Leste
npm run dev
```

Open: **http://localhost:5173**

---

## 📁 Project Location

```
/Users/mataldao/Local/Leste/
```

---

## 🎯 Key Files

| File | Purpose |
|------|---------|
| `public/products.json` | All 24 products (edit this!) |
| `src/pages/Home.jsx` | Landing page |
| `src/pages/Products.jsx` | Product grid |
| `src/components/ProductSidecart.jsx` | Product detail panel |
| `tailwind.config.js` | Brand colors & fonts |
| `.env` | Supabase credentials (optional) |

---

## 🔧 Common Tasks

### Add Product Images

1. Save images to: `public/products/{product-id}-1.jpg`
2. Update `public/products.json` with image path
3. Reload website

Example:
```json
{
  "id": "libreta-pocket",
  "images": [
    "/products/libreta-pocket-1.jpg",
    "/products/libreta-pocket-2.jpg"
  ]
}
```

### Change Brand Colors

Edit `tailwind.config.js`:
```javascript
colors: {
  leste: {
    700: '#YourColor',  // Main color
    900: '#YourDark',   // Dark color
  }
}
```

### Edit Product Info

Open `public/products.json` and modify:
- `name`: Product title
- `price`: Price string
- `stock`: Number available
- `description`: Product description
- `images`: Array of image URLs

### Update Home Page

Edit `src/pages/Home.jsx`:
- Change heading text
- Update feature descriptions
- Modify CTA buttons

### Run Web Scraper

```bash
npm run scrape "https://www.example.com" products.json products.csv
```

Requires CSV file with columns: empty, ARTICULO, STOCK, PRECIO

---

## 📦 Commands

```bash
npm run dev       # Development (hot reload)
npm run build     # Create production build
npm run preview   # Test production locally
npm run lint      # Check code
npm run scrape    # Web scraper tool
```

---

## 🔗 Pages

- **/** - Home page
- **/products** - Product catalog (23 items)
- **/about** - About brand
- **/events** - News & events
- **/contact** - Contact form

---

## 🎨 Responsive Design

Website works on:
- ✅ Mobile (320px+)
- ✅ Tablet (768px+)
- ✅ Desktop (1024px+)
- ✅ Wide screens (1536px+)

---

## 📊 Product Catalog

**Currently has 24 products:**
- 12 notebooks (cuadernos)
- 4 planners (agendas)
- 2 puzzles (rompecabezas)
- 2 games (juegos)
- 4 accessories & bundles

All products indexed and ready for images.

---

## 🚀 Deploy to Vercel

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import GitHub repository
4. Deploy (automatic on every push)

---

## 🆘 Troubleshooting

### Products not showing?
```bash
# Check products.json syntax
cat public/products.json
```

### Styles not right?
- Clear cache: Cmd+Shift+Delete
- Reload: Cmd+Shift+R

### Build fails?
```bash
npm install
npm run build
```

### Need Supabase?
See: **SUPABASE_SETUP.md**

---

## 📚 Full Docs

- `README.md` - Complete guide
- `SCRAPER_README.md` - Scraper tutorial
- `SUPABASE_SETUP.md` - Database setup
- `SETUP_AND_HANDOVER.md` - Detailed handover

---

## ⚡ Tech Stack

- **React 19** - UI framework
- **Vite 7** - Build tool (fast!)
- **Tailwind CSS 4** - Styling
- **GSAP 3** - Animations
- **React Router 7** - Navigation

---

## 🎯 Next Steps

1. ✅ Run locally: `npm run dev`
2. ⏳ Add product images
3. ⏳ Customize brand colors
4. ⏳ Deploy to Vercel
5. ⏳ Set up Supabase (optional)
6. ⏳ Add shopping cart (future)

---

**Happy selling!** 🚀

For detailed help, see full documentation in project folder.
