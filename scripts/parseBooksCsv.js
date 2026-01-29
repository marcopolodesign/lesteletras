/**
 * Parse books CSV and output public/books.json
 * CSV columns: CODIGO, PROVEEDOR (editorial), TIPOLOGIA, NOMBRE (book name), VARIANTE (author), ...
 *
 * Usage: node scripts/parseBooksCsv.js [path-to-csv]
 * Default: reads from project root if no path given (copy CSV there as books.csv)
 * Or: node scripts/parseBooksCsv.js "/Users/you/Downloads/Hoja de cálculo sin título - Hoja 1.csv"
 */

import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const csvPath = process.argv[2] || path.join(__dirname, '..', 'public', 'books.csv')
const outPath = path.join(__dirname, '..', 'public', 'books.json')

const books = []

const parser = parse({
  columns: true,
  relax_column_count: true,
  relax_quotes: true,
  trim: true,
  skip_empty_lines: true,
  bom: true,
})

parser.on('readable', function () {
  let row
  while ((row = parser.read()) !== null) {
    const editorial = (row.PROVEEDOR || row['PROVEEDOR'] || '').trim()
    const name = (row.NOMBRE || row['NOMBRE'] || '').trim().replace(/\s+/g, ' ')
    const author = (row.VARIANTE || row['VARIANTE'] || '').trim().replace(/\s+/g, ' ')
    if (!name) continue
    books.push({ editorial, name, author })
  }
})

parser.on('error', (err) => {
  console.error('Parse error:', err.message)
  process.exit(1)
})

parser.on('end', () => {
  const unique = books.filter((b, i) => {
    const key = `${b.name}|${b.author}`
    return books.findIndex((x) => `${x.name}|${x.author}` === key) === i
  })
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, JSON.stringify(unique, null, 2), 'utf8')
  console.log(`Wrote ${unique.length} books to ${outPath}`)
})

if (!fs.existsSync(csvPath)) {
  console.error('CSV not found:', csvPath)
  console.error('Usage: node scripts/parseBooksCsv.js [path-to-csv]')
  process.exit(1)
}

fs.createReadStream(csvPath, { encoding: 'utf8' })
  .pipe(parser)
  .on('error', (err) => {
    console.error('Read error:', err.message)
    process.exit(1)
  })
