#!/usr/bin/env node
// ============================================
// Migrate Local Images to Firebase Storage
// ============================================
// 
// Run this ONCE to upload all images from /public/images/ to Firebase Storage.
// After migration, images are served from Firebase CDN instead of the repo.
//
// Prerequisites:
//   1. Firebase project created
//   2. .env.local populated with Firebase credentials
//   3. Firebase Storage rules set to allow reads:
//      rules_version = '2';
//      service firebase.storage {
//        match /b/{bucket}/o {
//          match /{allPaths=**} {
//            allow read: if true;
//            allow write: if request.auth != null;
//          }
//        }
//      }
//
// Usage:
//   npx tsx scripts/upload-images.ts
//   npx tsx scripts/upload-images.ts --dry-run    # preview without uploading
//

const { initializeApp, cert } = require('firebase-admin/app')
const { getStorage } = require('firebase-admin/storage')
const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')

// Load environment variables
dotenv.config({ path: '.env.local' })

const DRY_RUN = process.argv.includes('--dry-run')
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images')
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']

// Image directories to upload
const IMAGE_FOLDERS = ['2024-01', '2024-06', '2025-05']

// Firebase Admin init
function initFirebase() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n')
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET

  if (!projectId || !storageBucket) {
    console.error('❌ Missing Firebase credentials in .env.local')
    console.error('   Required: FIREBASE_ADMIN_PROJECT_ID, NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET')
    console.error('   Optional: FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY')
    process.exit(1)
  }

  try {
    const app = initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
      storageBucket,
    })
    return getStorage(app).bucket()
  } catch (err) {
    console.error('❌ Failed to initialize Firebase:', err.message)
    process.exit(1)
  }
}

// Get all image files recursively
function getImageFiles(dir) {
  const files = []
  if (!fs.existsSync(dir)) return files

  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...getImageFiles(fullPath))
    } else if (ALLOWED_EXTENSIONS.includes(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath)
    }
  }
  return files
}

// Determine content type from extension
function getContentType(filename) {
  const ext = path.extname(filename).toLowerCase()
  const types = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
  }
  return types[ext] || 'application/octet-stream'
}

async function main() {
  console.log('🔥 Firebase Storage Image Migration')
  console.log('===================================')
  if (DRY_RUN) console.log('📋 DRY RUN — no files will be uploaded\n')

  // Collect all images
  const allFiles = []
  for (const folder of IMAGE_FOLDERS) {
    const dir = path.join(IMAGES_DIR, folder)
    const files = getImageFiles(dir)
    allFiles.push(...files.map(f => ({
      localPath: f,
      storagePath: `projects/${path.relative(IMAGES_DIR, f)}`,
      size: fs.statSync(f).size,
    })))
  }

  // Also upload site assets
  const siteAssets = ['logo.png', 'og-image.jpg'].filter(f =>
    fs.existsSync(path.join(IMAGES_DIR, f))
  )
  for (const asset of siteAssets) {
    const localPath = path.join(IMAGES_DIR, asset)
    allFiles.push({
      localPath,
      storagePath: `site/${asset}`,
      size: fs.statSync(localPath).size,
    })
  }

  // Also upload recommendation PDFs
  const docsDir = path.join(__dirname, '..', 'public', 'docs')
  if (fs.existsSync(docsDir)) {
    const docs = fs.readdirSync(docsDir).filter(f => f.endsWith('.pdf'))
    for (const doc of docs) {
      const localPath = path.join(docsDir, doc)
      allFiles.push({
        localPath,
        storagePath: `docs/${doc}`,
        size: fs.statSync(localPath).size,
      })
    }
  }

  const totalSize = allFiles.reduce((sum, f) => sum + f.size, 0)
  console.log(`📁 Found ${allFiles.length} files (${(totalSize / 1024 / 1024).toFixed(1)} MB)\n`)

  if (DRY_RUN) {
    console.log('Files to upload:')
    allFiles.forEach(f => {
      console.log(`  ${f.storagePath} (${(f.size / 1024).toFixed(0)} KB)`)
    })
    console.log(`\n✅ Dry run complete. Run without --dry-run to upload.`)
    return
  }

  // Initialize Firebase and upload
  const bucket = initFirebase()
  let uploaded = 0
  let skipped = 0
  let errors = 0

  for (const file of allFiles) {
    try {
      const destFile = bucket.file(file.storagePath)
      
      // Check if already exists
      const [exists] = await destFile.exists()
      if (exists) {
        console.log(`  ⏭️  ${file.storagePath} (already exists)`)
        skipped++
        continue
      }

      // Upload
      await bucket.upload(file.localPath, {
        destination: file.storagePath,
        metadata: {
          contentType: getContentType(file.localPath),
          cacheControl: 'public, max-age=31536000', // 1 year cache
        },
      })

      // Make public
      await destFile.makePublic()

      console.log(`  ✅ ${file.storagePath} (${(file.size / 1024).toFixed(0)} KB)`)
      uploaded++
    } catch (err) {
      console.error(`  ❌ ${file.storagePath}: ${err.message}`)
      errors++
    }
  }

  console.log('\n===================================')
  console.log(`✅ Uploaded: ${uploaded}`)
  console.log(`⏭️  Skipped: ${skipped}`)
  console.log(`❌ Errors: ${errors}`)
  console.log(`📊 Total: ${allFiles.length}`)
  
  if (uploaded > 0) {
    console.log('\n🎉 Migration complete!')
    console.log('Next steps:')
    console.log('  1. Set NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET in your .env.local')
    console.log('  2. Deploy — images will now load from Firebase Storage')
    console.log('  3. Once verified, you can remove /public/images/ folders from the repo')
    console.log('  4. Add /public/images/2024-* and /public/images/2025-* to .gitignore')
  }
}

main().catch(console.error)
