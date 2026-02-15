#!/usr/bin/env node
// Upload blog images to Firebase Storage
// Uses firebase-service-account.json (same as project images)

import { initializeApp, cert } from 'firebase-admin/app'
import { getStorage } from 'firebase-admin/storage'
import { readFileSync, existsSync, readdirSync } from 'fs'
import { join, basename } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const SA_PATH = join(__dirname, 'firebase-service-account.json')
const BLOG_DIR = join(__dirname, '..', 'public', 'images', 'blog')
const BUCKET_NAME = 'crhomepros-a3c2a.firebasestorage.app'

if (!existsSync(SA_PATH)) {
  console.error('❌ Missing scripts/firebase-service-account.json')
  console.error('Download from: https://console.firebase.google.com/project/crhomepros-a3c2a/settings/serviceaccounts/adminsdk')
  process.exit(1)
}

if (!existsSync(BLOG_DIR)) {
  console.error(`❌ Blog images directory not found: ${BLOG_DIR}`)
  process.exit(1)
}

const serviceAccount = JSON.parse(readFileSync(SA_PATH, 'utf-8'))

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: BUCKET_NAME,
})

const bucket = getStorage().bucket()

const images = readdirSync(BLOG_DIR).filter(f =>
  /\.(png|jpg|jpeg|webp|gif)$/i.test(f)
)

console.log(`📸 Found ${images.length} blog images to upload`)
console.log(`📦 Uploading to: gs://${BUCKET_NAME}/blog/\n`)

let uploaded = 0
let failed = 0

for (const img of images) {
  const localPath = join(BLOG_DIR, img)
  const remotePath = `blog/${img}`

  try {
    await bucket.upload(localPath, {
      destination: remotePath,
      metadata: {
        contentType: img.endsWith('.png') ? 'image/png' : 'image/jpeg',
        cacheControl: 'public, max-age=31536000',
      },
    })

    // Make public
    await bucket.file(remotePath).makePublic()

    const url = `https://firebasestorage.googleapis.com/v0/b/${BUCKET_NAME}/o/${encodeURIComponent(remotePath)}?alt=media`
    console.log(`  ✅ ${img} → ${url}`)
    uploaded++
  } catch (err) {
    console.error(`  ❌ ${img}: ${err.message}`)
    failed++
  }
}

console.log(`\n📊 Results: ${uploaded} uploaded, ${failed} failed`)
if (uploaded > 0) {
  console.log('\n🎯 Next steps:')
  console.log('  1. Update lib/blog-posts.ts with Firebase URLs')
  console.log('  2. rm -rf .next && npm run dev')
  console.log('  3. git add . && git commit -m "Blog images on Firebase" && git push && vercel --prod')
}
