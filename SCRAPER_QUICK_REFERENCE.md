# Scraper Quick Reference

## What You Have

### V1 Scraper (Original)
```bash
node scripts/scrapeProducts.js "https://www.edicionesdelamontana.com" products.json products.csv
```
- **Accuracy:** 25% (6/24 products)
- **Best for:** Simple, structured websites
- **Use when:** Quick testing needed

### V2 Scraper (Improved) ⭐ RECOMMENDED
```bash
node scripts/scrapeProductsV2.js "https://www.edicionesdelamontana.com" products.json products.csv
```
- **Accuracy:** 83% (20/24 products)
- **Best for:** Most e-commerce sites
- **Features:** Levenshtein algorithm, retry logic, multiple image selectors
- **Use this one:** For production scraping

## The Problem: Images

Website uses **lazy-loaded images** (data-src attribute)
- These require JavaScript to load
- Basic HTTP scraping can't trigger JavaScript
- Result: 0/20 images downloaded

## Solutions

### Solution 1: Manual Collection ⚡ FASTEST
Time: 1-2 hours
Steps:
1. Visit https://www.edicionesdelamontana.com
2. For each product, save the image
3. Place in `public/products/{product-id}-1.jpg`
4. Update `public/products.json` with image paths

### Solution 2: V3 Browser Scraper 🤖 BEST
Time: 1-2 hours to build, then automated
- Uses Puppeteer/Playwright
- Renders JavaScript, loads lazy images
- Fully automated
- Reusable for all future products

**Ask me to build V3 when ready:**
```
"Build the V3 browser-based scraper"
```

## Current Status

✅ **20/24 Products matched**
- Names: 100%
- Prices: 100%
- Stock: 100%
- Descriptions: 100%
❌ **0/20 Images downloaded**
- Need lazy-loading solution

## Products Missing

These 4 weren't found on website:
1. NOTE PAD CON IMAN
2. MEMOTEST
3. PACK 2 LIBRETAS GRANDES 20X25
4. ARTICULO (header row - ignore)

Can be added manually if needed.

## Files

- `public/products.json` - 20 products with all data (no images yet)
- `public/products/` - Empty, ready for images
- `scripts/scrapeProducts.js` - V1 (basic)
- `scripts/scrapeProductsV2.js` - V2 (improved)
- `SCRAPER_README.md` - Full documentation
- `SCRAPER_IMPROVEMENTS.md` - V1 vs V2 comparison
- `SCRAPER_STRATEGY.md` - Image extraction strategies
- `SCRAPER_STATUS.txt` - Detailed status report

## Next Step?

**Option A:** Manually download images (fastest for MVP)
```
1. Go to website
2. Save each product image
3. Update JSON with image paths
4. Test and launch
```

**Option B:** Build V3 browser scraper (best long-term)
```bash
# Just ask: "Build V3 scraper"
# Then:
node scripts/scrapeProductsV3.js "..." products.json products.csv
# Downloads everything automatically
```

Which would you like?
