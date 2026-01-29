import axios from 'axios'
import * as cheerio from 'cheerio'
import fs from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Scrapes products from a website and matches them with provided product names
 * Downloads images and generates a JSON product file
 *
 * Usage:
 * node scripts/scrapeProducts.js <url> <output-file> [csv-file]
 *
 * Examples:
 * node scripts/scrapeProducts.js "https://www.example.com" products.json
 * node scripts/scrapeProducts.js "https://www.edicionesdelamontana.com" products.json products.csv
 */

const downloadImage = async (imageUrl, filename) => {
  return new Promise((resolve, reject) => {
    if (!imageUrl || !imageUrl.startsWith('http')) {
      reject(new Error(`Invalid image URL: ${imageUrl}`))
      return
    }

    const productsDir = path.join(__dirname, '../public/products')
    if (!fs.existsSync(productsDir)) {
      fs.mkdirSync(productsDir, { recursive: true })
    }

    const filepath = path.join(productsDir, filename)
    const file = fs.createWriteStream(filepath)

    const protocol = imageUrl.startsWith('https') ? https : http
    const request = protocol.get(imageUrl, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file)
        file.on('finish', () => {
          file.close()
          resolve(`/products/${filename}`)
        })
      } else {
        file.close()
        fs.unlink(filepath, () => {})
        reject(new Error(`Failed to download image: ${response.statusCode}`))
      }
    })

    request.on('error', (err) => {
      file.close()
      fs.unlink(filepath, () => {})
      reject(err)
    })

    file.on('error', (err) => {
      fs.unlink(filepath, () => {})
      reject(err)
    })
  })
}

const parseCSV = (csvPath) => {
  if (!fs.existsSync(csvPath)) {
    console.warn(`CSV file not found: ${csvPath}`)
    return []
  }

  const content = fs.readFileSync(csvPath, 'utf-8')
  const lines = content.split('\n').filter((line) => line.trim())

  const products = []
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',')
    if (parts.length >= 2) {
      const name = parts[1]?.trim()
      const stock = parseInt(parts[2]?.trim() || '0')
      const price = parts[3]?.trim()

      if (name) {
        products.push({
          name: name.trim(),
          stock: isNaN(stock) ? 0 : stock,
          price: price ? price.replace(/"/g, '') : '',
        })
      }
    }
  }

  return products
}

const normalizeText = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s]/g, '')
}

const findProductOnPage = (productName, $) => {
  const normalized = normalizeText(productName)
  let bestMatch = null
  let bestScore = 0

  $('*').each((_, el) => {
    const text = $(el).text()
    if (text.length < 200) {
      const normalizedText = normalizeText(text)
      const score = similarity(normalized, normalizedText)
      if (score > bestScore && score > 0.7) {
        bestScore = score
        bestMatch = el
      }
    }
  })

  return bestMatch
}

const similarity = (str1, str2) => {
  const longer = str1.length > str2.length ? str1 : str2
  const shorter = str1.length > str2.length ? str2 : str1

  if (longer.length === 0) return 1.0
  const editDistance = getEditDistance(longer, shorter)
  return (longer.length - editDistance) / longer.length
}

const getEditDistance = (s1, s2) => {
  const costs = []
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j
      } else if (j > 0) {
        let newValue = costs[j - 1]
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1
        }
        costs[j - 1] = lastValue
        lastValue = newValue
      }
    }
    if (i > 0) costs[s2.length] = lastValue
  }
  return costs[s2.length]
}

const scrapeProducts = async (url, csvPath = null) => {
  try {
    console.log(`🔄 Fetching content from ${url}...`)
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })

    const $ = cheerio.load(response.data, {
      decodeEntities: false,
    })
    const csvProducts = csvPath ? parseCSV(csvPath) : []

    console.log(`📦 Found ${csvProducts.length} products in CSV`)

    const scrapedProducts = []

    for (const product of csvProducts) {
      console.log(`\n🔍 Looking for: "${product.name}"`)

      const productElement = findProductOnPage(product.name, $)

      if (productElement) {
        console.log(`✅ Found matching element`)

        // Try to find image
        let imageUrl = null
        const $elem = $(productElement)
        const $img = $elem.find('img').first()
        if ($img.length > 0) {
          imageUrl = $img.attr('src') || $img.attr('data-src')
        }

        // Try parent containers if no image found
        if (!imageUrl) {
          let parent = productElement
          for (let i = 0; i < 3; i++) {
            parent = $(parent).parent()[0]
            if (!parent) break
            const $parentImg = $(parent).find('img').first()
            if ($parentImg.length > 0) {
              imageUrl = $parentImg.attr('src') || $parentImg.attr('data-src')
              if (imageUrl) break
            }
          }
        }

        // Get description
        const description = $($elem).text().substring(0, 200).trim()

        const productData = {
          id: product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
          name: product.name,
          series: 'Ediciones de la Montaña',
          price: product.price,
          stock: product.stock,
          images: [],
          description: description,
        }

        // Download image if found
        if (imageUrl) {
          try {
            const absoluteUrl = imageUrl.startsWith('http')
              ? imageUrl
              : new URL(imageUrl, url).toString()

            const filename = `${productData.id}-1.jpg`
            console.log(`  📥 Downloading image...`)
            const localPath = await downloadImage(absoluteUrl, filename)
            productData.images.push(localPath)
            console.log(`  ✅ Image saved`)
          } catch (imgError) {
            console.log(`  ⚠️  Could not download image: ${imgError.message}`)
          }
        }

        scrapedProducts.push(productData)
      } else {
        console.log(`❌ No match found`)
      }
    }

    return scrapedProducts
  } catch (error) {
    console.error('❌ Error scraping products:', error.message)
    throw error
  }
}

const main = async () => {
  const args = process.argv.slice(2)

  if (args.length < 1) {
    console.log(`
📚 Product Scraper

Usage:
  node scripts/scrapeProducts.js <url> [output-file] [csv-file]

Examples:
  node scripts/scrapeProducts.js "https://www.edicionesdelamontana.com" products.json ~/Downloads/products.csv
  node scripts/scrapeProducts.js "https://www.example.com" products.json

Options:
  <url>             Website URL to scrape (required)
  [output-file]     Output JSON file (default: products.json)
  [csv-file]        CSV file with product names (default: reads from products.csv)

CSV Format:
  ,ARTICULO,STOCK,PRECIO
  ,Product Name 1,10,$20.00
  ,Product Name 2,5,$15.00
    `)
    process.exit(0)
  }

  const url = args[0]
  const outputFile = args[1] || 'products.json'
  const csvFile = args[2] || 'products.csv'

  try {
    console.log('\n🚀 Starting product scraper...\n')
    const products = await scrapeProducts(url, csvFile)

    const outputPath = path.join(__dirname, '../public', outputFile)
    fs.writeFileSync(outputPath, JSON.stringify(products, null, 2))

    console.log(`\n✅ Successfully scraped ${products.length} products`)
    console.log(`💾 Saved to: ${outputPath}`)
  } catch (error) {
    console.error('\n❌ Fatal error:', error.message)
    process.exit(1)
  }
}

main()
