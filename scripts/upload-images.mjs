#!/usr/bin/env node
/**
 * Upload project images to Firebase Storage
 * 
 * Usage:
 *   node scripts/upload-images.mjs
 * 
 * Prerequisites:
 *   1. npm install
 *   2. Place firebase-service-account.json in scripts/ directory
 *      (download from Firebase Console → Project Settings → Service Accounts)
 */
import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SA_PATH = join(__dirname, 'firebase-service-account.json');

if (!existsSync(SA_PATH)) {
  console.error('❌ Missing scripts/firebase-service-account.json');
  console.error('   Download from Firebase Console → Project Settings → Service Accounts → Generate New Private Key');
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(SA_PATH, 'utf8'));

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'crhomepros.firebasestorage.app',
});

const bucket = getStorage().bucket();

async function uploadDir(localDir, storagePrefix) {
  if (!existsSync(localDir)) {
    console.log(`⚠ Directory not found: ${localDir}`);
    return;
  }
  
  const files = readdirSync(localDir).filter(f => /\.(png|jpg|jpeg|webp|gif)$/i.test(f));
  console.log(`\n📁 ${storagePrefix} — ${files.length} images`);

  for (const file of files) {
    const localPath = join(localDir, file);
    const storagePath = `${storagePrefix}/${file}`;
    
    const [exists] = await bucket.file(storagePath).exists();
    if (exists) {
      console.log(`  ✓ ${file} (exists)`);
      continue;
    }

    const ext = extname(file).toLowerCase();
    const contentType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
    
    await bucket.upload(localPath, {
      destination: storagePath,
      metadata: { contentType, cacheControl: 'public, max-age=31536000, immutable' },
    });
    await bucket.file(storagePath).makePublic();
    console.log(`  ↑ ${file}`);
  }
}

async function main() {
  const base = join(__dirname, '..', 'public', 'images');
  
  for (const sub of ['2024-01', '2024-06', '2025-05']) {
    await uploadDir(join(base, sub), `projects/${sub}`);
  }
  
  // Also upload team images
  await uploadDir(join(base), 'team');

  console.log('\n✅ All images uploaded to Firebase CDN.');
  console.log('💡 You can now safely set NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET in .env.local');
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
