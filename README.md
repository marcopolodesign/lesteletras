# Leste - Premium Product Showcase Website

A modern, minimalist e-commerce product showcase website built with React, Vite, Tailwind CSS, and designed for seamless product management and display.

## 🎨 Design Philosophy

Inspired by **Papier.com**, Leste features:
- Elegant typography and generous whitespace
- Minimal color palette (neutrals + subtle accent)
- High-quality product imagery
- Smooth, subtle animations powered by GSAP
- Premium, premium aesthetic throughout

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ (recommend 18+)
- npm or yarn

### Installation

```bash
cd /Users/mataldao/Local/Leste
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. The site will hot-reload on changes.

### Production Build

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
Leste/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx           # Navigation header
│   │   │   ├── Footer.jsx           # Footer with links
│   │   │   └── index.js
│   │   ├── sections/                # Page sections (expandable)
│   │   ├── ProductCard.jsx          # Individual product card
│   │   ├── ProductSidecart.jsx      # Right-slide product detail panel
│   │   └── ui/
│   │       ├── Button.jsx           # Reusable button component
│   │       ├── Container.jsx        # Max-width container
│   │       └── index.js
│   ├── context/
│   │   └── ProductContext.jsx       # Global product state (sidecart)
│   ├── pages/
│   │   ├── Home.jsx                 # Landing page
│   │   ├── Products.jsx             # Product grid
│   │   ├── About.jsx                # About page
│   │   ├── Events.jsx               # Events & news
│   │   └── Contact.jsx              # Contact form
│   ├── styles/
│   │   └── index.css                # Global styles + Tailwind
│   ├── App.jsx                      # Main app with routing
│   └── main.jsx                     # Entry point
├── public/
│   ├── products.json                # Product catalog
│   ├── products/                    # Product images (auto-generated)
│   └── hero/                        # Hero section images
├── scripts/
│   └── scrapeProducts.js            # Web scraping utility
├── vite.config.js                   # Vite configuration
├── tailwind.config.js               # Tailwind theme
├── vercel.json                      # Vercel deployment config
├── package.json
├── index.html
└── README.md
```

## 🛍️ Pages

### Home
Landing page with hero section, features overview, and CTA to browse products.

### Products
Grid-based product catalog with:
- Responsive grid layout (1, 2, or 3 columns)
- Product cards with images, names, prices, and stock status
- Click to open product details in slide-out sidecart

### Product Sidecart
Right-slide panel showing:
- Large product image with navigation (if multiple images)
- Product name, series, and price
- Description and details
- Stock availability
- Add to cart & Continue shopping buttons
- Smooth GSAP animations

### About
Brand story, mission, and values.

### Events
News, events, and product launches calendar.

### Contact
Contact form and business information.

## 📦 Product Management

### Product Data Structure

Products are stored in `public/products.json`:

```json
[
  {
    "id": "unique-product-id",
    "name": "Product Name",
    "series": "Product Series/Category",
    "price": "$XX.XX",
    "stock": 10,
    "images": ["/products/image-1.jpg", "/products/image-2.jpg"],
    "description": "Product description",
    "details": {
      "Material": "Value",
      "Dimensions": "Value"
    }
  }
]
```

### Adding Products Manually

Edit `public/products.json` and reload the page.

### Web Scraping

Use the built-in scraper to automatically fetch products from websites:

```bash
npm run scrape "https://www.edicionesdelamontana.com" products.json ~/Downloads/products.csv
```

See [SCRAPER_README.md](SCRAPER_README.md) for detailed instructions.

## 🎨 Styling & Customization

### Tailwind Theme

Customized colors, fonts, and spacing in `tailwind.config.js`:

**Colors:**
- `leste-*`: Brand color palette (50-900)
- `neutral-*`: Neutral grays for content

**Typography:**
- `font-serif`: Crimson Text (headings)
- `font-sans`: Inter (body text)

### Modifying the Theme

Edit `tailwind.config.js` to change:
- Brand colors
- Fonts
- Spacing scale
- Custom animations

## 🔧 Components

### Button Component
```jsx
<Button variant="primary" size="md">Click Me</Button>
```

Variants: `primary`, `secondary`, `ghost`, `outline`
Sizes: `sm`, `md`, `lg`

### Container Component
```jsx
<Container size="lg">Content here</Container>
```

Sizes: `sm`, `md`, `lg`, `xl`, `full`

### Product Context
```jsx
import { useProduct } from './context/ProductContext'

const MyComponent = () => {
  const { selectedProduct, isSidecartOpen, openSidecart, closeSidecart } = useProduct()
}
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables (if using Supabase)
4. Deploy automatically on push

Configuration is in `vercel.json`.

### Environment Variables

Create `.env` for development, `.env.production` for production:

```env
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

## 📊 Supabase Integration (Future)

Currently, products are loaded from static JSON. To integrate Supabase:

1. Create Supabase project
2. Create `products` table with schema matching `products.json`
3. Create `.env` file with credentials
4. Update `Products.jsx` to fetch from Supabase instead of JSON

See [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for detailed instructions.

## 🎬 GSAP Animations

The project uses GSAP for smooth animations:

- **ProductSidecart**: Slide-in/out animations
- **ProductCard**: Hover effects (image zoom)
- Extensible for future scroll animations

## 📱 Responsive Design

Fully responsive across:
- Mobile (375px+)
- Tablet (768px+)
- Desktop (1024px+)
- Large screens (1536px+)

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Focus states for all interactive elements

## 🔒 Security

- No sensitive data in client-side code
- Environment variables for credentials
- XSS protection via React
- CSRF protection via Vercel

## 📈 Performance

- Vite for fast HMR development
- Optimized production build (~100KB gzipped)
- CSS tree-shaking via Tailwind
- Image optimization ready (add next/image or similar)

## 📝 Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run scrape       # Run product scraper
npm run lint         # Run ESLint
```

## 🐛 Troubleshooting

### Build fails
- Clear `dist/` and `node_modules/`
- Run `npm install` again
- Check Node.js version (16+)

### Styles not applying
- Ensure Tailwind classes are in template files
- Clear browser cache
- Check `tailwind.config.js` content path

### Products not showing
- Verify `public/products.json` exists and is valid JSON
- Check browser console for errors
- Ensure product URLs are correct

## 📚 Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [GSAP Documentation](https://gsap.com/)

## 📞 Support

For setup help or questions, check:
1. Console errors (F12 Dev Tools)
2. `SCRAPER_README.md` for product scraping
3. `SUPABASE_SETUP.md` for database integration

## 📄 License

Created for Leste. All rights reserved.

---

**Version:** 1.0.0
**Last Updated:** 2025-01-29
**Built with:** React 19, Vite 7, Tailwind CSS 4, GSAP 3
