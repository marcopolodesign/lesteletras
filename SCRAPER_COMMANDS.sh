#!/bin/bash
# LESTE PRODUCT SCRAPER - QUICK COMMAND REFERENCE
# Run these commands from /Users/mataldao/Local/Leste/

# ============================================================================
# V1 SCRAPER (Basic - 25% accuracy, no images)
# ============================================================================
# node scripts/scrapeProducts.js "https://www.edicionesdelamontana.com" products.json products.csv

# ============================================================================
# V2 SCRAPER (Improved - 83% accuracy, no images due to lazy-loading)
# ============================================================================
# node scripts/scrapeProductsV2.js "https://www.edicionesdelamontana.com" products.json products.csv

# ============================================================================
# V3 SCRAPER (URL-Based - 100% accuracy, 39 images downloaded) ⭐ RECOMMENDED
# ============================================================================

# Run V3 with default output
node scripts/scrapeProductsV3.js products-urls.json

# Run V3 with custom output file
node scripts/scrapeProductsV3.js products-urls.json my-products.json

# Run V3 with debug logging
DEBUG=1 node scripts/scrapeProductsV3.js products-urls.json

# ============================================================================
# USE V3 OUTPUT
# ============================================================================

# Copy V3 output to main products file
cp public/products-from-urls.json public/products.json

# ============================================================================
# WEBSITE COMMANDS
# ============================================================================

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# ============================================================================
# MANAGING PRODUCTS
# ============================================================================

# To add more products:
# 1. Edit products-urls.json and add new product entries
# 2. Run V3 scraper again
# 3. Copy output to products.json

# Edit products-urls.json (add more products here)
# nano products-urls.json

# Then run:
# node scripts/scrapeProductsV3.js products-urls.json

# ============================================================================
# FILE LOCATIONS
# ============================================================================

# V3 Configuration: products-urls.json
# V3 Output: public/products-from-urls.json
# Images: public/products/ (39 images)
# Main products file: public/products.json

# ============================================================================
# DOCUMENTATION
# ============================================================================

# Quick start: QUICKSTART.md
# Full docs: README.md
# Scraper v3: V3_SCRAPER_SUCCESS.md
# All scrapers: SCRAPER_FINAL_SUMMARY.txt

