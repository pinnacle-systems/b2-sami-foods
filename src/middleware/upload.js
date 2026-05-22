import multer from 'multer'
import sharp from 'sharp'
import path from 'path'
import fs from 'fs'

const uploadDir = './uploads'
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const fileFilter = (_req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only jpeg, png, gif, or webp images are allowed!'), false)
  }
}

// Memory storage so Sharp can process the buffer before writing to disk
const multerUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB raw upload cap
  fileFilter,
})

async function compressToWebP(file) {
  const filename = `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`
  const outputPath = path.join(uploadDir, filename)
  await sharp(file.buffer)
    .resize({ width: 800, height: 800, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(outputPath)
  // Keep req.file.filename consistent so controllers need no changes
  file.filename = filename
  file.path = outputPath
}

function runMulter(handler, req, res) {
  return new Promise((resolve, reject) => {
    handler(req, res, (err) => (err ? reject(err) : resolve()))
  })
}

export const upload = {
  single: (fieldName) => async (req, res, next) => {
    try {
      await runMulter(multerUpload.single(fieldName), req, res)
      if (req.file) await compressToWebP(req.file)
      next()
    } catch (err) {
      next(err)
    }
  },

  fields: (fieldConfigs) => async (req, res, next) => {
    try {
      await runMulter(multerUpload.fields(fieldConfigs), req, res)
      if (req.files) {
        const allFiles = Object.values(req.files).flat()
        await Promise.all(allFiles.map(compressToWebP))
      }
      next()
    } catch (err) {
      next(err)
    }
  },

  array: (fieldName, maxCount) => async (req, res, next) => {
    try {
      await runMulter(multerUpload.array(fieldName, maxCount), req, res)
      if (req.files?.length) {
        await Promise.all(req.files.map(compressToWebP))
      }
      next()
    } catch (err) {
      next(err)
    }
  },
}
