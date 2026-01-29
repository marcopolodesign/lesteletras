#!/usr/bin/env node

/**
 * LESTE PRODUCT SCRAPER v2.0 - IMPROVED
 *
 * Intelligent web scraper for product catalogs with:
 * - Better product matching (partial string matching, synonym support)
 * - Flexible image extraction (multiple selectors)
 * - CSV data enrichment
 * - Batch processing with retries
 * - Detailed logging and error handling
 *
 * Usage:
 *   npm run scrape "https://website.com" products.json products.csv
 *   node scripts/scrapeProductsV2.js "https://website.com" [output] [csv]
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
    'img[src]:not([src*="base64"]):not([src*="placeholder"])',
    'img[data-src]:not([data-src*="base64"])',
    'picture img',
    '[style*="background-image"]',
  ],
  minSimilarity: 0.5, // Lowered from 0.7 for better matching
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

const normalizeText = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s\-áéíóúñ]/g, '')
}

const levenshteinDistance = (str1, str2) => {
  const track = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(0))

  for (let i = 0; i <= str1.length; i++) track[0][i] = i
  for (let j = 0; j <= str2.length; j++) track[j][0] = j

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
      track[j][i] = Math.min(
        track[j][i - 1] + 1,
        track[j - 1][i] + 1,
        track[j - 1][i - 1] + indicator
      )
    }
  }

  return track[str2.length][str1.length]
}

const calculateSimilarity = (str1, str2) => {
  const longer = str1.length > str2.length ? str1 : str2
  const shorter = str1.length > str2.length ? str2 : str1

  if (longer.length === 0) return 1.0

  const editDistance = levenshteinDistance(longer, shorter)
  return (longer.length - editDistance) / longer.length
}

// ============================================================================
// CSV PARSING
// ============================================================================

const parseCSV = (csvPath) => {
  if (!fs.existsSync(csvPath)) {
    log.warn(`CSV file not found: ${csvPath}`)
    return []
  }

  try {
    const content = fs.readFileSync(csvPath, 'utf-8')
    const lines = content.split('\n').filter((line) => line.trim())

    const products = []
    let headerSkipped = false

    for (const line of lines) {
      const parts = line.split(',').map((p) => p.trim())

      // Skip header row
      if (!headerSkipped && (parts[1]?.toUpperCase() === 'ARTICULO' || parts[1] === '')) {
        headerSkipped = true
        continue
      }

      if (parts.length >= 2 && parts[1]) {
        const name = parts[1].trim()
        const stock = parseInt(parts[2] || '0')
        const price = parts[3] ? parts[3].replace(/"/g, '').trim() : ''

        if (name && name.length > 2) {
          products.push({
            name,
            stock: isNaN(stock) ? 0 : stock,
            price,
            csvIndex: products.length,
          })
        }
      }
    }

    log.success(`Parsed ${products.length} products from CSV`)
    return products
  } catch (error) {
    log.error(`Failed to parse CSV: ${error.message}`)
    return []
  }
}

// ============================================================================
// IMAGE DOWNLOADING
// ============================================================================

const downloadImage = async (imageUrl, filename, maxRetries = 2) => {
  return new Promise((resolve, reject) => {
    if (!imageUrl) {
      reject(new Error('No URL provided'))
      return
    }

    // Skip data URLs and invalid URLs
    if (imageUrl.startsWith('data:') || imageUrl.includes('base64')) {
      reject(new Error('Data URL or base64 image'))
      return
    }

    if (!imageUrl.startsWith('http')) {
      reject(new Error('Invalid URL'))
      return
    }

    ensureProductsDir()
    const filepath = path.join(CONFIG.imageFolder, filename)

    const file = fs.createWriteStream(filepath)
    const protocol = imageUrl.startsWith('https') ? https : http

    const request = protocol.get(
      imageUrl,
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
      reject(new Error('Download timeout'))
    }, CONFIG.timeout)
  })
}

// ============================================================================
// IMAGE EXTRACTION
// ============================================================================

const extractImageUrls = (htmlElement, $, baseUrl) => {
  const imageUrls = new Set()

  if (!htmlElement) return Array.from(imageUrls)

  const $element = $(htmlElement)

  // Try different image selectors
  for (const selector of CONFIG.imageSelectors) {
    $element.find(selector).each((_, img) => {
      const $img = $(img)
      let src = $img.attr('src') || $img.attr('data-src') || $img.attr('data-lazy-src')

      if (!src) {
        const style = $img.attr('style')
        const match = style?.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/)
        if (match) src = match[1]
      }

      if (src && !src.startsWith('data:')) {
        // Convert relative URLs to absolute
        try {
          const absoluteUrl = src.startsWith('http')
            ? src
            : new URL(src, baseUrl).toString()
          imageUrls.add(absoluteUrl)
        } catch (e) {
          log.debug(`Invalid URL: ${src}`)
        }
      }
    })
  }

  return Array.from(imageUrls)
}

// ============================================================================
// PRODUCT MATCHING
// ============================================================================

const findProductElement = (productName, $, threshold = CONFIG.minSimilarity) => {
  const normalized = normalizeText(productName)
  let bestMatch = null
  let bestScore = 0

  // Search through all text nodes
  $('body *').each((_, element) => {
    const $el = $(element)
    const text = $el.text()

    // Skip elements with too much text (likely containers)
    if (text.length > 500 || text.length < 5) return

    const normalizedText = normalizeText(text)
    const score = calculateSimilarity(normalized, normalizedText)

    // Also check for partial matches (better for product names)
    const partialScore = normalizedText.includes(normalized.split(' ')[0])
      ? score + 0.2
      : score

    if (partialScore > bestScore && partialScore > threshold) {
      bestScore = partialScore
      bestMatch = element
    }
  })

  return { element: bestMatch, score: bestScore }
}

// ============================================================================
// MAIN SCRAPER
// ============================================================================

const scrapeWebsite = async (url, csvPath) => {
  try {
    log.info(`Fetching ${url}...`)
    const response = await axios.get(url, {
      timeout: CONFIG.timeout,
      headers: { 'User-Agent': CONFIG.defaultUserAgent },
      maxRedirects: 5,
    })

    const $ = cheerio.load(response.data)
    const csvProducts = parseCSV(csvPath)

    log.info(`Searching for ${csvProducts.length} products on website...`)

    const scrapedProducts = []
    let successCount = 0

    for (const csvProduct of csvProducts) {
      const { element, score } = findProductElement(csvProduct.name, $)

      if (element && score >= CONFIG.minSimilarity) {
        log.success(
          `Found: "${csvProduct.name}" (match: ${(score * 100).toFixed(0)}%)`
        )

        // Extract images from element and parents
        let images = extractImageUrls(element, $, url)
        if (images.length === 0) {
          // Try parent containers
          let parent = element
          for (let i = 0; i < 4 && images.length === 0; i++) {
            parent = $(parent).parent()[0]
            if (parent) {
              images = extractImageUrls(parent, $, url)
            }
          }
        }

        // Download images with retry
        const downloadedImages = []
        for (let i = 0; i < Math.min(images.length, 3); i++) {
          // Max 3 images per product
          const imageUrl = images[i]
          const baseFilename = `${sanitizeFilename(csvProduct.name)}-${i + 1}.jpg`

          for (let retry = 0; retry < 2; retry++) {
            try {
              const localPath = await downloadImage(imageUrl, baseFilename)
              downloadedImages.push(localPath)
              log.debug(`Downloaded: ${baseFilename}`)
              break
            } catch (error) {
              if (retry === 1) {
                log.warn(`Could not download image: ${imageUrl.substring(0, 50)}...`)
              }
            }
          }
        }

        // Extract description (text near the product)
        const $element = $(element)
        const description = $element
          .text()
          .substring(0, 200)
          .trim()

        scrapedProducts.push({
          id: sanitizeFilename(csvProduct.name),
          name: csvProduct.name,
          series: 'Ediciones de la Montaña',
          price: csvProduct.price,
          stock: csvProduct.stock,
          images: downloadedImages,
          description: description || csvProduct.name,
          websiteMatchScore: (score * 100).toFixed(0),
        })

        successCount++
      } else {
        log.warn(
          `Not found: "${csvProduct.name}" ${
            score > 0 ? `(closest match: ${(score * 100).toFixed(0)}%)` : ''
          }`
        )
      }
    }

    log.info(`\n📊 RESULTS: ${successCount}/${csvProducts.length} products found`)

    return scrapedProducts
  } catch (error) {
    log.error(`Scraping failed: ${error.message}`)
    throw error
  }
}

// ============================================================================
// MAIN
// ============================================================================

const main = async () => {
  const args = process.argv.slice(2)

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(`
╔════════════════════════════════════════════════════════════════════════════╗
║                  LESTE PRODUCT SCRAPER v2.0 - IMPROVED                     ║
╚════════════════════════════════════════════════════════════════════════════╝

USAGE
  npm run scrape <url> [output] [csv-file]
  node scripts/scrapeProductsV2.js <url> [output] [csv-file]

REQUIRED
  <url>           Website to scrape (e.g., https://www.example.com)

OPTIONAL
  [output]        Output JSON filename (default: products.json)
  [csv-file]      CSV file with products (default: products.csv)

EXAMPLES
  npm run scrape "https://www.edicionesdelamontana.com"
  npm run scrape "https://example.com" products.json ~/products.csv
  node scripts/scrapeProductsV2.js "https://example.com"

CSV FORMAT (required)
  ,ARTICULO,STOCK,PRECIO
  ,Product Name,10,$20.00
  ,Another Product,5,$15.00

FEATURES
  ✅ Intelligent product matching (Levenshtein distance algorithm)
  ✅ Flexible image extraction (multiple selectors)
  ✅ Batch image downloading with retries
  ✅ Detailed logging and error handling
  ✅ Partial string matching for better accuracy
  ✅ Handles lazy-loaded images and data URLs

OUTPUT
  products.json   - Updated product catalog
  /public/products/ - Downloaded images

ENVIRONMENT VARIABLES
  DEBUG=1         Enable debug logging

═══════════════════════════════════════════════════════════════════════════════
    `)
    process.exit(0)
  }

  const url = args[0]
  const outputFile = args[1] || 'products.json'
  const csvFile = args[2] || 'products.csv'

  try {
    console.log('\n🚀 LESTE PRODUCT SCRAPER v2.0\n')

    // Ensure directories exist
    ensureProductsDir()

    // Run scraper
    const products = await scrapeWebsite(url, csvFile)

    // Save results
    const outputPath = path.join(__dirname, '../public', outputFile)
    fs.writeFileSync(outputPath, JSON.stringify(products, null, 2))

    console.log(`\n✅ SUCCESS!`)
    console.log(`📦 Scraped ${products.length} products`)
    console.log(`💾 Saved to: ${outputPath}`)
    console.log(`🖼️  Images in: ${CONFIG.imageFolder}\n`)

    // Summary
    const withImages = products.filter((p) => p.images.length > 0).length
    const totalImages = products.reduce((sum, p) => sum + p.images.length, 0)
    console.log(`📊 SUMMARY`)
    console.log(`   Products with images: ${withImages}/${products.length}`)
    console.log(`   Total images downloaded: ${totalImages}`)
  } catch (error) {
    console.error(`\n❌ ERROR: ${error.message}`)
    process.exit(1)
  }
}

main()
