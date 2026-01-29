# Product Scraper Strategy Guide

## 🎯 Problem Analysis

**Current Situation:**
- Website uses lazy-loaded images (`data-src`)
- Images load via JavaScript
- Basic HTTP scraping (V1, V2) can't trigger lazy-loading
- Result: 20/24 products matched, **0/20 images** ❌

## 🔍 What We Found

The website structure:
```html
<!-- Lazy-loaded image on Mitienda Nube platform -->
<img class="lazyload"
     src="//acdn-us.mitiendanube.com/assets/themes/amazonas/static/images/empty-placeholder.png"
     data-src="//cdn.linkedstore.com/assets/.../actual-image.webp"
     alt="Product Name" />
```

**The Issue:**
- `src` = placeholder image (the one being scraped)
- `data-src` = actual image (loaded by JavaScript when visible)
- Without JavaScript, we only get placeholders

## 📋 Three Strategies

### Strategy 1: Manual Image Collection (Recommended for MVP)
**Effort:** 30-60 minutes | **Cost:** $0 | **Speed:** Manual
- Download images directly from website
- Organize by product ID
- Place in `public/products/`
- Update `products.json` with image paths

**Best for:** Quick launch, quality control

### Strategy 2: API-Based Scraping (Best Long-term)
**Effort:** 2-4 hours | **Cost:** $0 | **Speed:** Automated
- Use Mitienda Nube API (if available)
- Or contact website for bulk export
- Ideal for ongoing updates

**Best for:** Automated product sync, real-time inventory

### Strategy 3: Browser-Based Scraping (Most Reliable)
**Effort:** 1-2 hours | **Cost:** $0 (CPU intensive) | **Speed:** Slower
- Use Puppeteer/Playwright
- Renders JavaScript, loads lazy images
- Extracts actual image URLs
- Then downloads them

**Best for:** Full automation, complex websites

---

## 🔧 Implementation Options

### Option 1: Use Headless Browser (V3 - Browser-based)
```bash
npm install puppeteer
node scripts/scrapeProductsV3.js "https://www.edicionesdelamontana.com" products.json products.csv
```

**Pros:**
- ✅ Gets all lazy-loaded images
- ✅ Handles JavaScript-heavy sites
- ✅ Most reliable for real e-commerce

**Cons:**
- ⚠️  Slower (2-5 min for 24 products)
- ⚠️  More CPU usage
- ⚠️  Requires Puppeteer package

---

### Option 2: Direct Image URLs from CDN
```bash
# Extract image URLs from website HTML
# Then batch download using wget/curl
```

**Example:**
```bash
curl -s "https://www.edicionesdelamontana.com" | \
  grep -oP 'cdn\.linkedstore\.com[^"]*' | \
  while read url; do
    wget "https:$url" -P public/products/
  done
```

---

### Option 3: Mitienda Nube API
If the website exposes their product data via API:

```bash
# Pseudo-code
curl "https://mitiendanube.com/api/v1/products" \
  -H "Authorization: Bearer API_KEY"
```

**Check:**
```bash
curl -s "https://www.edicionesdelamontana.com/api/products" 2>&1 | head -20
```

---

## 🎯 Recommendation for Leste

### Phase 1: MVP (Do This Now)
**Strategy:** Manual collection + V2 scraper

```bash
# 1. Run V2 scraper to get product data
node scripts/scrapeProductsV2.js \
  "https://www.edicionesdelamontana.com" \
  products.json products.csv

# 2. Get product IDs from output
# 3. Visit website, save images manually
# 4. Organize: public/products/{product-id}-1.jpg
# 5. Update image paths in products.json
```

**Timeline:** 1-2 hours
**Cost:** Free
**Result:** Complete, launch-ready catalog

### Phase 2: Automation (Do This Later)
**Strategy:** Browser-based scraper (V3)

```bash
# Install Puppeteer
npm install --save-dev puppeteer

# Run V3 scraper
node scripts/scrapeProductsV3.js \
  "https://www.edicionesdelamontana.com" \
  products.json products.csv
```

**Timeline:** 1-2 hours setup, then automated forever
**Cost:** Minimal (local execution)
**Result:** Fully automated product updates

---

## 🚀 Quick Win: Get Images Now

### 1. Get Product Names
Already done! ✅ See `products.json`

### 2. Visit Website & Save Images
```
1. Go to https://www.edicionesdelamontana.com
2. Find each product
3. Right-click product image → "Save image as"
4. Save to: public/products/{product-id}-1.jpg
```

Example:
```
Product: "PLANNER MENSUAL IMAN - FLORAL"
ID: "planner-mensual-iman-floral"
Save as: public/products/planner-mensual-iman-floral-1.jpg
```

### 3. Update products.json
```json
{
  "id": "planner-mensual-iman-floral",
  "images": ["/products/planner-mensual-iman-floral-1.jpg"],
  ...
}
```

### 4. Reload website
✅ Images appear!

**Total time:** 30-60 minutes for 20 products

---

## 📊 Scraper Comparison

| Feature | V1 | V2 | V3 |
|---------|----|----|-----|
| Product Matching | ⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| Image Extraction | ⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| Speed | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| Complexity | ⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| Cost | $0 | $0 | $0 |
| Best For | Simple sites | Most sites | Complex sites |

---

## 🛠️ Building V3 (Browser-based)

Here's the structure we'd add:

```javascript
// scrapeProductsV3.js
import puppeteer from 'puppeteer'

const scrapeWithBrowser = async (url) => {
  const browser = await puppeteer.launch({
    headless: true,
  })

  const page = await browser.newPage()

  // Wait for lazy images to load
  await page.goto(url, { waitUntil: 'networkidle2' })

  // Now extract all images with actual data-src loaded
  const images = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img'))
      .map(img => img.src || img.dataset.src)
  })

  await browser.close()
  return images
}
```

---

## 📝 Decision Tree

```
Need product images?
├─ Yes, ASAP (launch in days)
│  └─ Manual collection (Option 1)
│     └─ Save 20 images manually
│     └─ Done in 1-2 hours
│
├─ Yes, but can wait (launch in 1-2 weeks)
│  └─ Build V3 browser scraper
│     └─ Fully automated
│     └─ Reusable for future products
│
└─ Maybe later (focus on other features)
   └─ Use V2 data only for now
   └─ Add images later
```

---

## 🎯 Current Recommendation

**FOR LESTE MVP:**
1. ✅ Use V2 scraper (20/24 products matched) ✓ DONE
2. ⏳ Manually download and organize images (1-2 hours)
3. ⏳ Update image paths in `products.json`
4. ✅ Launch with complete catalog
5. 🚀 Later: Build V3 for automation

**Result:** Launch-ready website in next 2-3 hours

---

## 📞 Need Help?

### Manual Image Collection
```bash
# Quick reference for product IDs
cat public/products.json | jq '.[] | .id' | head -20
```

### Batch Image Download Helper
```bash
# You could also use this helper script
# (we can create it if needed)
```

### Browser Scraper (V3)
```bash
# Ready to build when you need it
# Just say "Build V3 scraper"
```

---

## ✅ Next Steps

### Right Now:
1. Decide: Manual images or wait for V3?
2. If manual: Start downloading products
3. If V3: I'll build it (1-2 hours)

### Timeline Options:

**Option A (Fast - MVP):**
- Now: Manual images (1-2h)
- Today: Launch website
- Later: V3 scraper for automation

**Option B (Complete - Production):**
- Now: Build V3 scraper (1-2h)
- Today: Full automation
- Reusable for all future products

Which would you prefer?

---

**Current Status:**
- ✅ Products matched: 20/24 (83%)
- ⏳ Images: 0/20 (need JavaScript rendering)
- 📊 Data quality: Complete (names, prices, stock)
- 🚀 Website: Ready to launch (with or without images)
