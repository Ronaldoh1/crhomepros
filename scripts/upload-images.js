#!/usr/bin/env node
// ============================================
// 🔥 Upload All Images to Firebase Storage
// ============================================
// Run from project root:
//   node scripts/upload-images.js
//
// Prerequisites:
//   1. npm install firebase-admin (already in package.json)
//   2. Place your service account JSON at: scripts/firebase-service-account.json
//      (Get from: Firebase Console → Project Settings → Service Accounts → Generate New Private Key)
//   3. Make sure Firebase Storage is enabled in the console
//
// After running:
//   - All images from /public/images/ are now on Firebase CDN
//   - The site auto-resolves to Firebase URLs when NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is set
//   - You can uncomment the image dirs in .gitignore to stop tracking them in git

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// ===== CONFIG =====
const SERVICE_ACCOUNT_PATH = path.join(__dirname, 'firebase-service-account.json');
const STORAGE_BUCKET = 'crhomepros.firebasestorage.app';
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];

// ===== CHECK SERVICE ACCOUNT =====
if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
  console.error('❌ Service account not found at:', SERVICE_ACCOUNT_PATH);
  console.error('');
  console.error('   Download it from Firebase Console:');
  console.error('   → Project Settings → Service Accounts → Generate New Private Key');
  console.error('   → Save as: scripts/firebase-service-account.json');
  process.exit(1);
}

// ===== INIT FIREBASE =====
const serviceAccount = require(SERVICE_ACCOUNT_PATH);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: STORAGE_BUCKET
});
const bucket = admin.storage().bucket();

// ===== HELPERS =====
function getAllImages(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...getAllImages(full));
    else if (ALLOWED_EXTENSIONS.includes(path.extname(entry.name).toLowerCase())) results.push(full);
  }
  return results;
}

function getContentType(file) {
  const ext = path.extname(file).toLowerCase();
  return { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif', '.svg': 'image/svg+xml' }[ext] || 'application/octet-stream';
}

// ===== MAIN =====
async function main() {
  console.log('');
  console.log('  🔥 Firebase Storage — Image Upload');
  console.log('  ===================================');
  console.log(`  Bucket: ${STORAGE_BUCKET}`);
  console.log(`  Source: ${IMAGES_DIR}`);
  console.log('');

  // Gather all image files
  const allFiles = [];

  // Project images (subdirectories)
  for (const subdir of fs.readdirSync(IMAGES_DIR, { withFileTypes: true })) {
    if (subdir.isDirectory()) {
      const images = getAllImages(path.join(IMAGES_DIR, subdir.name));
      for (const img of images) {
        allFiles.push({
          local: img,
          remote: `projects/${path.relative(IMAGES_DIR, img)}`,
          size: fs.statSync(img).size,
        });
      }
    }
  }

  // Site assets (logo, og-image at root of images/)
  for (const file of ['logo.png', 'og-image.jpg']) {
    const local = path.join(IMAGES_DIR, file);
    if (fs.existsSync(local)) {
      allFiles.push({
        local,
        remote: `site/${file}`,
        size: fs.statSync(local).size,
      });
    }
  }

  const totalMB = (allFiles.reduce((s, f) => s + f.size, 0) / 1024 / 1024).toFixed(1);
  console.log(`  📁 ${allFiles.length} files found (${totalMB} MB)\n`);

  let uploaded = 0, skipped = 0, errors = 0;

  for (const file of allFiles) {
    try {
      // Check if already uploaded
      const dest = bucket.file(file.remote);
      const [exists] = await dest.exists();
      if (exists) {
        console.log(`  ⏭️  ${file.remote} (already uploaded)`);
        skipped++;
        continue;
      }

      // Upload with cache headers
      await bucket.upload(file.local, {
        destination: file.remote,
        metadata: {
          contentType: getContentType(file.local),
          cacheControl: 'public, max-age=31536000', // 1 year CDN cache
        },
      });

      // Make publicly readable
      await dest.makePublic();

      const kb = (file.size / 1024).toFixed(0);
      console.log(`  ✅ ${file.remote} (${kb} KB)`);
      uploaded++;
    } catch (err) {
      console.error(`  ❌ ${file.remote}: ${err.message}`);
      errors++;
    }
  }

  console.log('');
  console.log('  ===================================');
  console.log(`  ✅ Uploaded: ${uploaded}`);
  console.log(`  ⏭️  Skipped: ${skipped} (already existed)`);
  if (errors) console.log(`  ❌ Errors:   ${errors}`);
  console.log(`  📊 Total:    ${allFiles.length}`);

  if (uploaded > 0 || skipped > 0) {
    const sample = allFiles[0];
    console.log('');
    console.log('  🎉 Done! Test a URL in your browser:');
    console.log(`  https://${STORAGE_BUCKET}/o/${encodeURIComponent(sample.remote)}?alt=media`);
    console.log('');
    console.log('  Next steps:');
    console.log('  1. Make sure .env.local has: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=crhomepros.firebasestorage.app');
    console.log('  2. Run `npm run dev` and check that images load from Firebase');
    console.log('  3. Uncomment image dirs in .gitignore to stop tracking in git');
    console.log('');
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
