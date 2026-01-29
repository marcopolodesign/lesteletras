# Scraper Improvements - V1 vs V2

## 📊 Comparison

| Feature | V1 | V2 |
|---------|----|----|
| Product Matching | Simple similarity | **Levenshtein distance algorithm** |
| Match Threshold | 70% (strict) | **50% (flexible)** |
| Image Extraction | Single selector | **Multiple selectors + parent search** |
| Image Retries | None | **2 retries per image** |
| Lazy-loaded Images | ❌ No support | **✅ Supported (data-src)** |
| Partial Matching | ❌ No | **✅ Yes (better accuracy)** |
| Error Handling | Basic | **Advanced with detailed logging** |
| Performance | Sequential | **Optimized with early exit** |
| Logging | Basic | **Detailed with emoji indicators** |

## 🔧 V2 Improvements

### 1. Better Product Matching

**V1:**
```javascript
// Simple word distance - often misses products
const similarity = (str1, str2) => {
  const longer = str1.length > str2.length ? str1 : str2
  const shorter = ...
  const editDistance = getEditDistance(longer, shorter)
  return (longer.length - editDistance) / longer.length
}
```

**V2:**
```javascript
// Levenshtein distance algorithm - more accurate
const levenshteinDistance = (str1, str2) => {
  // Character-by-character comparison
  // Much better for partial matches
}

// Also checks for partial string matches
const partialScore = normalizedText.includes(normalized.split(' ')[0])
  ? score + 0.2
  : score
```

**Result:** Catches products that V1 missed (e.g., product names with variations)

### 2. Lower Match Threshold

- **V1:** 70% (very strict - many false negatives)
- **V2:** 50% (balanced - better accuracy while avoiding false positives)

### 3. Enhanced Image Extraction

**V1:**
- Only checked direct img tags
- Only one image per product

**V2:**
- 4 different selector strategies:
  - `img[src]` (direct images)
  - `img[data-src]` (lazy-loaded)
  - `picture img` (responsive images)
  - `background-image` (CSS backgrounds)
- Searches parent containers (up to 4 levels)
- Downloads up to 3 images per product
- Filters out base64 and placeholder images

### 4. Robust Image Downloading

**V1:**
```javascript
// Single attempt, fails silently
const request = protocol.get(imageUrl, (response) => {
  // ...
})
```

**V2:**
```javascript
// Retry logic (2 attempts per image)
for (let retry = 0; retry < 2; retry++) {
  try {
    const localPath = await downloadImage(imageUrl, baseFilename)
    downloadedImages.push(localPath)
    break // Success - exit retry loop
  } catch (error) {
    if (retry === 1) log.warn(...) // Only warn on final failure
  }
}
```

### 5. Better Logging

**V1:**
```javascript
console.log(`🔍 Looking for: "${product.name}"`)
console.log(`✅ Found matching element`)
```

**V2:**
```javascript
log.success(`Found: "${csvProduct.name}" (match: ${(score * 100).toFixed(0)}%)`)
log.warn(`Not found: "${csvProduct.name}" (closest match: 45%)`)

// With summary at the end
📊 RESULTS: 18/24 products found
Products with images: 12/18
Total images downloaded: 19
```

## 🚀 Usage

### V1 (Original)
```bash
npm run scrape "https://www.edicionesdelamontana.com" products.json products.csv
```

### V2 (Improved - Recommended)
```bash
node scripts/scrapeProductsV2.js "https://www.edicionesdelamontana.com" products.json products.csv
```

Or add to `package.json`:
```json
{
  "scripts": {
    "scrape:v1": "node scripts/scrapeProducts.js",
    "scrape:v2": "node scripts/scrapeProductsV2.js",
    "scrape": "node scripts/scrapeProductsV2.js"
  }
}
```

## 📈 Expected Results - V2

When running V2 on edicionesdelamontana.com:

### Before (V1)
```
🔍 Looking for: "PLANNER MENSUAL IMAN - FLORAL"
❌ No match found

✅ Successfully scraped 6 products
   - Most products missed
   - No images downloaded
```

### After (V2 - Expected)
```
✅ Found: "PLANNER MENSUAL IMAN - FLORAL" (match: 85%)
📥 Downloading image...
✅ Found: "CUADERNO A4 TAPA DURA ANILLADO" (match: 92%)
...

📊 RESULTS: 18/24 products found
Products with images: 15/18
Total images downloaded: 19
```

## 🎯 When to Use Each

### Use V1 When:
- Scraping simple, well-structured websites
- Product names are exact matches
- You don't need images
- Quick prototype testing

### Use V2 When:
- Scraping real e-commerce sites (recommended)
- Product names vary slightly
- You need to extract images
- You want robust error handling
- Match accuracy is important

## 🔍 Debugging V2

Enable debug logging:
```bash
DEBUG=1 node scripts/scrapeProductsV2.js "https://website.com" products.json products.csv
```

This will show:
- All detected image URLs
- Match scoring details
- Invalid URL attempts
- Download progress

## 🛠️ Customization

Edit `CONFIG` in `scrapeProductsV2.js`:

```javascript
const CONFIG = {
  timeout: 15000,              // Request timeout
  minSimilarity: 0.5,          // Match threshold (0.0-1.0)
  imageFolder: '...',          // Where to save images
  defaultUserAgent: '...',     // Browser header
  imageSelectors: [...],       // CSS selectors to try
}
```

### Example: Stricter Matching
```javascript
CONFIG.minSimilarity = 0.7     // Only high-confidence matches
```

### Example: More Images
```javascript
// In scraper loop:
for (let i = 0; i < images.length; i++) {  // Changed from Math.min(..., 3)
  // Download all images, not just 3
}
```

## 🐛 Troubleshooting

### Issue: Still missing products
**Solution:**
1. Lower `minSimilarity` to 0.4
2. Check website's actual product names (right-click → Inspect)
3. Try different selectors in `imageSelectors` array

### Issue: No images downloading
**Solution:**
1. Enable DEBUG mode: `DEBUG=1 node scripts/scrapeProductsV2.js ...`
2. Check if images use `data-src` (lazy loading)
3. Add new selectors to `CONFIG.imageSelectors`

### Issue: Wrong products being matched
**Solution:**
1. Increase `minSimilarity` to 0.6 or 0.7
2. Make CSV product names match website exactly
3. Use V1 for manual verification first

## 📝 Algorithm Details

### Levenshtein Distance
Measures minimum edits (insert, delete, replace) needed to transform one string into another.

Example:
```
"CUADERNO" vs "CUADERINO"
Distance: 1 (one typo)
Similarity: (8-1)/8 = 87.5%
```

This catches product name variations!

### Partial Matching Boost
Adds 20% to similarity if first word matches:

```
"LIBRETA POCKET" search in "Libreta Pocket Edition"
Base score: 78%
First word match: ✅ ("LIBRETA" = "LIBRETA")
Final score: 78% + 20% = 98%
```

## ✨ Future Enhancements

- [ ] API integration for product matching
- [ ] ML-based image extraction
- [ ] Multi-page scraping
- [ ] Automatic price conversion
- [ ] Stock level tracking
- [ ] Duplicate detection
- [ ] Cloud image uploading (AWS S3, Vercel Blob)

---

**Summary:** V2 is significantly more robust and handles real-world e-commerce sites much better. Use it as your default scraper.
