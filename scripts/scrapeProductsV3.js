#!/usr/bin/env node

/**
 * LESTE PRODUCT SCRAPER v3.0 - URL-BASED
 *
 * Scrapes product details from direct product URLs
 * - Extracts product images from individual product pages
 * - Downloads images with retry logic
 * - Handles search result pages with multiple products
 * - Perfect for websites with known product URLs
 *
 * Usage:
 *   npm run scrape:v3 products-urls.json
 *   node scripts/scrapeProductsV3.js products-urls.json
 */

import axios from 'axios'
import * as cheerio from 'cheerio'
import fs from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ============================================================================
// CONFIG
// ============================================================================

const CONFIG = {
  timeout: 15000,
  imageFolder: path.join(__dirname, '../public/products'),
  defaultUserAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  imageSelectors: [
    'img[src]:not([src*="base64"]):not([src*="placeholder"]):not([src*="empty"])',
    'img[data-src]:not([data-src*="base64"])',
    'picture img',
    '[style*="background-image"]',
    '.product-image img',
    '[class*="product"] img',
    '[class*="imagen"] img',
  ],
  maxImagesPerProduct: 3,
}

// ============================================================================
// UTILITIES
// ============================================================================

const log = {
  info: (msg) => console.log(`ℹ️  ${msg}`),
  success: (msg) => console.log(`✅ ${msg}`),
  warn: (msg) => console.log(`⚠️  ${msg}`),
  error: (msg) => console.log(`❌ ${msg}`),
  debug: (msg) => process.env.DEBUG && console.log(`🔧 ${msg}`),
}

const ensureProductsDir = () => {
  if (!fs.existsSync(CONFIG.imageFolder)) {
    fs.mkdirSync(CONFIG.imageFolder, { recursive: true })
  }
}

const sanitizeFilename = (str) => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

const downloadImage = async (imageUrl, filename) => {
  return new Promise((resolve, reject) => {
    if (!imageUrl || typeof imageUrl !== 'string') {
      reject(new Error('Invalid URL'))
      return
    }

    // Skip data URLs and invalid URLs
    if (imageUrl.startsWith('data:') || imageUrl.includes('base64')) {
      reject(new Error('Data URL'))
      return
    }

    // Convert protocol-relative URLs
    let url = imageUrl
    if (url.startsWith('//')) {
      url = 'https:' + url
    }

    if (!url.startsWith('http')) {
      reject(new Error('Invalid URL format'))
      return
    }

    ensureProductsDir()
    const filepath = path.join(CONFIG.imageFolder, filename)

    // Check if file already exists
    if (fs.existsSync(filepath)) {
      resolve(`/products/${filename}`)
      return
    }

    const file = fs.createWriteStream(filepath)
    const protocol = url.startsWith('https') ? https : http

    const request = protocol.get(
      url,
      {
        timeout: CONFIG.timeout,
        headers: { 'User-Agent': CONFIG.defaultUserAgent },
      },
      (response) => {
        if (response.statusCode === 200) {
          response.pipe(file)
          file.on('finish', () => {
            file.close()
            resolve(`/products/${filename}`)
          })
        } else {
          file.close()
          fs.unlink(filepath, () => {})
          reject(new Error(`HTTP ${response.statusCode}`))
        }
      }
    )

    request.on('error', (err) => {
      file.close()
      fs.unlink(filepath, () => {})
      reject(err)
    })

    file.on('error', (err) => {
      fs.unlink(filepath, () => {})
      reject(err)
    })

    setTimeout(() => {
      request.destroy()
      reject(new Error('Timeout'))
    }, CONFIG.timeout)
  })
}

// ============================================================================
// IMAGE EXTRACTION
// ============================================================================

const extractImagesFromPage = (html, baseUrl) => {
  const $ = cheerio.load(html)
  const imageUrls = new Set()

  for (const selector of CONFIG.imageSelectors) {
    $(selector).each((_, img) => {
      const $img = $(img)
      let src = $img.attr('src') || $img.attr('data-src') || $img.attr('data-lazy-src')

      if (!src) {
        const style = $img.attr('style')
        const match = style?.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/)
        if (match) src = match[1]
      }

      if (src && !src.includes('placeholder') && !src.includes('empty')) {
        try {
          const absoluteUrl = src.startsWith('http')
            ? src
            : src.startsWith('//')
            ? 'https:' + src
            : new URL(src, baseUrl).toString()

          if (!absoluteUrl.includes('base64')) {
            imageUrls.add(absoluteUrl)
          }
        } catch (e) {
          log.debug(`Invalid URL: ${src}`)
        }
      }
    })
  }

  return Array.from(imageUrls)
}

const extractProductName = (html) => {
  const $ = cheerio.load(html)

  // Try different selectors for product name
  const selectors = [
    'h1.product-name',
    'h1[data-product-name]',
    '.product-title h1',
    '[class*="producto"] h1',
    'h1',
  ]

  for (const selector of selectors) {
    const name = $(selector).first().text().trim()
    if (name && name.length > 3) {
      return name
    }
  }

  return null
}

const extractProductDescription = (html) => {
  const $ = cheerio.load(html)

  // Try different selectors for description
  const selectors = [
    '.product-description',
    '[data-product-description]',
    '.description',
    '[class*="descripcion"]',
    'p.product-description',
  ]

  for (const selector of selectors) {
    const desc = $(selector).first().text().trim()
    if (desc && desc.length > 10) {
      return desc.substring(0, 300)
    }
  }

  // Fallback: get text from main content area
  const text = $('main, article, [role="main"]').first().text().trim()
  if (text) {
    return text.substring(0, 300)
  }

  return ''
}

// ============================================================================
// SCRAPER
// ============================================================================

const scrapeProductUrl = async (productName, productUrl) => {
  try {
    log.info(`Scraping: "${productName}" from ${productUrl}`)

    const response = await axios.get(productUrl, {
      timeout: CONFIG.timeout,
      headers: { 'User-Agent': CONFIG.defaultUserAgent },
      maxRedirects: 5,
    })

    // Extract product name and images
    const detectedName = extractProductName(response.data) || productName
    const images = extractImagesFromPage(response.data, productUrl)
    const description = extractProductDescription(response.data)

    log.success(`Found: "${detectedName}"`)
    if (images.length > 0) {
      log.info(`  📸 Found ${images.length} images`)
    }

    // Download images
    const downloadedImages = []
    for (let i = 0; i < Math.min(images.length, CONFIG.maxImagesPerProduct); i++) {
      const imageUrl = images[i]
      const imageId = sanitizeFilename(productName)
      const baseFilename = `${imageId}-${i + 1}.jpg`

      for (let retry = 0; retry < 2; retry++) {
        try {
          const localPath = await downloadImage(imageUrl, baseFilename)
          downloadedImages.push(localPath)
          log.debug(`Downloaded: ${baseFilename}`)
          break
        } catch (error) {
          if (retry === 1) {
            log.warn(`  Could not download image ${i + 1}`)
          }
        }
      }
    }

    return {
      id: sanitizeFilename(productName),
      name: detectedName,
      originalUrl: productUrl,
      images: downloadedImages,
      description: description || detectedName,
      imagesFound: images.length,
      imagesDownloaded: downloadedImages.length,
    }
  } catch (error) {
    log.error(`Failed to scrape "${productName}": ${error.message}`)
    return {
      id: sanitizeFilename(productName),
      name: productName,
      originalUrl: productUrl,
      images: [],
      description: '',
      imagesFound: 0,
      imagesDownloaded: 0,
      error: error.message,
    }
  }
}

const scrapeSearchResultsUrl = async (productName, searchUrl) => {
  try {
    log.info(`Scraping search results: "${productName}" from ${searchUrl}`)

    const response = await axios.get(searchUrl, {
      timeout: CONFIG.timeout,
      headers: { 'User-Agent': CONFIG.defaultUserAgent },
      maxRedirects: 5,
    })

    const $ = cheerio.load(response.data)

    // Find product links in search results
    const products = []
    const productSelectors = [
      'a[href*="/productos/"]',
      '.product-link',
      '[class*="product-item"] a',
      'a[class*="product"]',
    ]

    for (const selector of productSelectors) {
      $(selector).each((_, link) => {
        const href = $(link).attr('href')
        const text = $(link).text().trim()

        if (href && text && !products.find((p) => p.url === href)) {
          products.push({
            url: href.startsWith('http') ? href : new URL(href, searchUrl).toString(),
            name: text,
          })
        }
      })

      if (products.length > 0) break
    }

    log.success(`Found ${products.length} products in search results`)

    // Scrape each product
    const results = []
    for (const product of products.slice(0, 5)) {
      const result = await scrapeProductUrl(product.name, product.url)
      results.push(result)
    }

    return results
  } catch (error) {
    log.error(`Failed to scrape search results: ${error.message}`)
    return []
  }
}

// ============================================================================
// MAIN
// ============================================================================

const loadProductUrlsConfig = (configPath) => {
  if (!fs.existsSync(configPath)) {
    log.error(`Config file not found: ${configPath}`)
    return []
  }

  try {
    const content = fs.readFileSync(configPath, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    log.error(`Failed to parse config: ${error.message}`)
    return []
  }
}

const main = async () => {
  const args = process.argv.slice(2)

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(`
╔════════════════════════════════════════════════════════════════════════════╗
║              LESTE PRODUCT SCRAPER v3.0 - URL-BASED (IMPROVED)            ║
╚════════════════════════════════════════════════════════════════════════════╝

USAGE
  npm run scrape:v3 products-config.json [output-file]
  node scripts/scrapeProductsV3.js products-config.json [output-file]

REQUIRED
  products-config.json  Configuration file with product URLs (see format below)

OPTIONAL
  [output-file]        Output JSON file (default: products.json)

CONFIGURATION FILE FORMAT
  [
    {
      "name": "PLANNER MENSUAL IMAN - FLORAL",
      "url": "https://www.edicionesdelamontana.com/productos/...",
      "type": "product"
    },
    {
      "name": "LIBRETA PARQUES NACIONALES",
      "url": "https://www.edicionesdelamontana.com/search/?q=...",
      "type": "search"
    }
  ]

TYPES
  product  - Direct product page (single product)
  search   - Search results page (multiple products)

EXAMPLE CONFIG FILE
  [
    {
      "name": "NAIPES",
      "url": "https://www.edicionesdelamontana.com/productos/naipes-estilo-espanol/",
      "type": "product"
    },
    {
      "name": "LIBRETA PARQUES NACIONALES",
      "url": "https://www.edicionesdelamontana.com/search/?q=LIBRETA%2BPARQUES%2BNACIONALES&mpage=2",
      "type": "search"
    }
  ]

FEATURES
  ✅ Scrapes direct product pages
  ✅ Handles search result pages (multiple products)
  ✅ Downloads product images with retries
  ✅ Extracts product names and descriptions
  ✅ Handles protocol-relative URLs (//cdn.example.com)
  ✅ Skips placeholder/empty images
  ✅ Caches downloaded images

OUTPUT
  products.json   - Updated product catalog with images
  /public/products/ - Downloaded product images

═══════════════════════════════════════════════════════════════════════════════
    `)
    process.exit(0)
  }

  const configFile = args[0]
  const outputFile = args[1] || 'products.json'

  try {
    console.log('\n🚀 LESTE PRODUCT SCRAPER v3.0 - URL-BASED\n')

    // Load configuration
    const productUrls = loadProductUrlsConfig(configFile)
    if (productUrls.length === 0) {
      log.error('No products to scrape')
      process.exit(1)
    }

    log.success(`Loaded ${productUrls.length} products from config`)

    // Ensure directories exist
    ensureProductsDir()

    // Scrape all products
    const allProducts = []
    for (const item of productUrls) {
      if (item.type === 'search') {
        const results = await scrapeSearchResultsUrl(item.name, item.url)
        allProducts.push(...results)
      } else {
        const result = await scrapeProductUrl(item.name, item.url)
        allProducts.push(result)
      }
    }

    // Filter out errors and prepare final output
    const successfulProducts = allProducts.filter((p) => !p.error)

    // Save results
    const outputPath = path.join(__dirname, '../public', outputFile)
    fs.writeFileSync(outputPath, JSON.stringify(successfulProducts, null, 2))

    console.log(`\n✅ SUCCESS!`)
    console.log(`📦 Scraped ${successfulProducts.length}/${allProducts.length} products`)
    console.log(`💾 Saved to: ${outputPath}`)
    console.log(`🖼️  Images in: ${CONFIG.imageFolder}\n`)

    // Summary
    const withImages = successfulProducts.filter((p) => p.images.length > 0).length
    const totalImages = successfulProducts.reduce((sum, p) => sum + p.images.length, 0)
    console.log(`📊 SUMMARY`)
    console.log(`   Products with images: ${withImages}/${successfulProducts.length}`)
    console.log(`   Total images downloaded: ${totalImages}`)
    console.log(`   Images found: ${allProducts.reduce((sum, p) => sum + p.imagesFound, 0)}\n`)
  } catch (error) {
    console.error(`\n❌ ERROR: ${error.message}`)
    process.exit(1)
  }
}

main()
