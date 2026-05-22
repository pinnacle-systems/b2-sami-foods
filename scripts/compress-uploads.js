/**
 * One-time migration: compress all existing raw JPEG/PNG uploads to WebP
 * and update the database records to point at the new filenames.
 *
 * Run once from the project root:
 *   node scripts/compress-uploads.js
 */

import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

const UPLOADS_DIR = './uploads'

function webpName(filename) {
  return filename.replace(/\.(jpe?g|png|gif)$/i, '.webp')
}

async function compressFile(srcPath, destPath) {
  const before = fs.statSync(srcPath).size
  await sharp(srcPath)
    .resize({ width: 800, height: 800, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(destPath)
  const after = fs.statSync(destPath).size
  const saved = (((before - after) / before) * 100).toFixed(1)
  console.log(`  ✔ ${path.basename(srcPath)} → ${path.basename(destPath)}  (${(before/1024/1024).toFixed(1)}MB → ${(after/1024).toFixed(0)}KB, -${saved}%)`)
  return { before, after }
}

async function main() {
  const files = fs.readdirSync(UPLOADS_DIR).filter(f => /\.(jpe?g|png|gif)$/i.test(f))

  if (files.length === 0) {
    console.log('No uncompressed images found — already done.')
    return
  }

  console.log(`\nFound ${files.length} images to compress...\n`)

  let totalBefore = 0
  let totalAfter  = 0

  for (const filename of files) {
    const srcPath  = path.join(UPLOADS_DIR, filename)
    const newName  = webpName(filename)
    const destPath = path.join(UPLOADS_DIR, newName)

    const { before, after } = await compressFile(srcPath, destPath)
    totalBefore += before
    totalAfter  += after

    const oldDbPath = `api/uploads/${filename}`
    const newDbPath = `api/uploads/${newName}`

    // Update ProductMaster
    const updatedProducts = await prisma.productMaster.updateMany({
      where:  { productImage: oldDbPath },
      data:   { productImage: newDbPath },
    })

    // Update ProductCategory
    const updatedCategories = await prisma.productCategory.updateMany({
      where:  { productCategoryImage: oldDbPath },
      data:   { productCategoryImage: newDbPath },
    })

    if (updatedProducts.count + updatedCategories.count > 0) {
      console.log(`     DB updated: ${updatedProducts.count} product(s), ${updatedCategories.count} category(ies)`)
    }

    // Remove the original after successful conversion
    fs.unlinkSync(srcPath)
  }

  const savedMB = ((totalBefore - totalAfter) / 1024 / 1024).toFixed(1)
  console.log(`\nDone! Saved ${savedMB} MB total (${(totalBefore/1024/1024).toFixed(1)} MB → ${(totalAfter/1024/1024).toFixed(1)} MB)\n`)

  await prisma.$disconnect()
}

main().catch(async (err) => {
  console.error(err)
  await prisma.$disconnect()
  process.exit(1)
})
