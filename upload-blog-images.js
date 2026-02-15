#!/usr/bin/env node

/**
 * Upload Blog Images to Firebase Storage
 * Uses existing Firebase configuration
 */

const { adminStorage } = require('./lib/firebase-admin');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, 'public/images/blog');
const BLOG_POSTS_FILE = path.join(__dirname, 'lib/blog-posts.ts');

const images = [
  'living-room.png',
  'hvac-unit.png',
  'team-working.png',
  'home-exterior.png',
  'mold-damage.png',
  'basement.png',
  'deck.png',
  'consultation.png',
  'concrete-work.png',
  'painting.png',
];

async function uploadBlogImages() {
  console.log('🔥 Uploading blog images to Firebase Storage...\n');

  const bucket = adminStorage.bucket();
  const urlMappings = {};

  for (const filename of images) {
    const localPath = path.join(IMAGES_DIR, filename);
    
    if (!fs.existsSync(localPath)) {
      console.log(`⚠️  Skipping ${filename} (not found)`);
      continue;
    }

    console.log(`📤 Uploading ${filename}...`);

    const destination = `blog/${filename}`;
    
    // Upload file
    await bucket.upload(localPath, {
      destination,
      metadata: {
        contentType: 'image/png',
        cacheControl: 'public, max-age=31536000',
      },
    });

    // Make public
    await bucket.file(destination).makePublic();

    // Get public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destination}`;
    urlMappings[`/images/blog/${filename}`] = publicUrl;

    console.log(`   ✅ ${publicUrl}\n`);
  }

  // Update blog-posts.ts
  console.log('📝 Updating blog-posts.ts with Firebase URLs...\n');
  
  let content = fs.readFileSync(BLOG_POSTS_FILE, 'utf8');

  for (const [localPath, firebaseUrl] of Object.entries(urlMappings)) {
    content = content.replace(new RegExp(localPath, 'g'), firebaseUrl);
  }

  fs.writeFileSync(BLOG_POSTS_FILE, content);

  console.log('✅ SUCCESS! All blog images uploaded to Firebase!\n');
  console.log(`📊 Uploaded ${Object.keys(urlMappings).length} images\n`);
  console.log('🚀 Next steps:');
  console.log('   1. Test: npm run dev');
  console.log('   2. Deploy: git add . && git commit && git push');
  console.log('   3. Optional: rm -rf public/images/blog/\n');
}

uploadBlogImages().catch(console.error);
