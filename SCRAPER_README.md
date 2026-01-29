# Product Scraper Guide

This document explains how to use the product scraping script to fetch product data from websites and generate a JSON catalog.

## Overview

The scraper:
1. Takes a CSV file with product names, stock, and prices
2. Visits a website URL
3. Searches for matching products on the page
4. Downloads product images
5. Generates a `products.json` file ready for the website

## Setup

First, ensure dependencies are installed:

```bash
npm install
```

## Usage

### Basic Scraping

```bash
npm run scrape "https://www.edicionesdelamontana.com" products.json ~/Downloads/ventas\ almendro\ -\ stock\ ediciones\ de\ la\ motaña.csv
```

### Command Format

```bash
npm run scrape "<website-url>" [output-file] [csv-file]
```

### Parameters

- **`<website-url>`** (required): The website to scrape
  - Example: `"https://www.edicionesdelamontana.com"`

- **`[output-file]`** (optional): Output JSON filename
  - Default: `products.json`
  - Output location: `public/products.json`

- **`[csv-file]`** (optional): Path to CSV file with product list
  - Default: `products.csv` in project root
  - Example: `~/Downloads/products.csv`

## CSV Format

Your CSV file should have this structure:

```csv
,ARTICULO,STOCK,PRECIO
,PLANNER MENSUAL IMAN - FLORAL,0," $24.875,00"
,CUADERNO A4 TAPA DURA ANILLADO,1," $40.000,00"
,NOTE PAD CON IMAN,1," $9.875,00"
```

**Columns:**
- Column 1: Empty (ignore)
- Column 2: Product name (ARTICULO)
- Column 3: Stock quantity (STOCK)
- Column 4: Price (PRECIO)

## Examples

### Example 1: Using Ediciones de la Montaña Website

```bash
npm run scrape "https://www.edicionesdelamontana.com" products.json ~/Downloads/ventas\ almendro\ -\ stock\ ediciones\ de\ la\ motaña.csv
```

This will:
- Visit the website
- Match products from the CSV
- Download images for each product
- Save to `public/products.json`

### Example 2: Custom Output File

```bash
npm run scrape "https://example.com/store" custom-products.json ~/my-products.csv
```

### Example 3: Using Default CSV

If you name your CSV file `products.csv` and place it in the project root:

```bash
npm run scrape "https://example.com/store"
```

## Output

After running the scraper, you'll get:

1. **`public/products.json`** - Product catalog with:
   - Product names
   - Descriptions
   - Prices and stock
   - Image paths
   - Product IDs

2. **`public/products/`** - Downloaded product images
   - Named as `{product-id}-1.jpg`, `{product-id}-2.jpg`, etc.

## Example Output

```json
[
  {
    "id": "planner-mensual-iman-floral",
    "name": "PLANNER MENSUAL IMAN - FLORAL",
    "series": "Ediciones de la Montaña",
    "price": " $24.875,00",
    "stock": 0,
    "images": ["/products/planner-mensual-iman-floral-1.jpg"],
    "description": "Monthly planner with magnetic backing..."
  }
]
```

## How It Works

### Product Matching

The scraper uses a text similarity algorithm to match products from your CSV with content on the website:

1. Normalizes product names (lowercase, removes special characters)
2. Searches through all page elements
3. Calculates similarity score
4. Returns best match (requires >70% similarity)

### Image Detection

For each matched product:
1. Looks for `<img>` tags within the element
2. If not found, searches parent containers (up to 3 levels)
3. Downloads image and saves to `public/products/`
4. Stores relative path in product JSON

### Description Extraction

- Extracts up to 200 characters of surrounding text
- Useful for quick product descriptions
- Can be edited in `public/products.json` manually

## Troubleshooting

### "No match found" for products

- Website might have different product naming
- Try checking the website structure
- Adjust CSV names to match website text more closely
- Increase similarity threshold (in `scripts/scrapeProducts.js`)

### Images not downloading

- Check if images are absolute URLs or relative
- Verify CORS settings on the website
- Some sites may block automated image downloads
- Download images manually and add to `public/products/`

### CSV parsing errors

- Ensure CSV encoding is UTF-8
- Check that column order matches: empty, ARTICULO, STOCK, PRECIO
- Verify no extra spaces around commas

## Manual Adjustments

After scraping, you can manually edit `public/products.json` to:

- Add/edit descriptions
- Fix incorrect product names
- Remove duplicate entries
- Add additional fields (category, tags, etc.)

## Future Enhancements

The scraper is designed to be flexible:

- Easily add new product sources by changing the URL
- Extend matching algorithm for better accuracy
- Add support for multi-page scraping
- Integrate with Supabase to auto-sync products

## Support

If you encounter issues:

1. Check the console output for specific errors
2. Verify CSV file format
3. Ensure website is accessible
4. Check that images can be downloaded independently
