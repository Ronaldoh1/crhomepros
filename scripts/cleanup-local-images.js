#!/usr/bin/env node
// ============================================
// 🧹 Post-Migration Cleanup
// ============================================
// Run AFTER upload-images.js succeeds and you've confirmed
// images load from Firebase in the browser.
//
// This script:
//   1. Verifies a sample Firebase URL actually works
//   2. Uncomments image dirs in .gitignore
//   3. Removes local image folders from the repo (git rm)
//   4. Keeps logo.png and og-image.jpg locally (needed for build)
//
// Usage:
//   node scripts/cleanup-local-images.js
//   node scripts/cleanup-local-images.js --dry-run   # preview only

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const DRY_RUN = process.argv.includes('--dry-run');
const PROJECT_ROOT = path.join(__dirname, '..');
const IMAGES_DIR = path.join(PROJECT_ROOT, 'public', 'images');
const GITIGNORE = path.join(PROJECT_ROOT, '.gitignore');

// Folders to remove from git (these are now on Firebase)
const FOLDERS_TO_REMOVE = ['2024-01', '2024-06', '2025-05'];

// Files to KEEP locally (needed at build time or for favicon etc.)
const KEEP_FILES = ['logo.png', 'og-image.jpg'];

function testFirebaseUrl() {
  return new Promise((resolve) => {
    const url = 'https://firebasestorage.googleapis.com/v0/b/crhomepros.firebasestorage.app/o/projects%2F2025-05%2Fkitchen-pg-county-01.png?alt=media';
    console.log('  🔍 Testing Firebase URL...');
    console.log(`     ${url}`);
    
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        console.log(`  ✅ Firebase responding (HTTP ${res.statusCode})\n`);
        resolve(true);
      } else {
        console.error(`  ❌ Firebase returned HTTP ${res.statusCode}`);
        console.error('     Make sure Storage is enabled and rules allow public reads.');
        resolve(false);
      }
      res.destroy();
    }).on('error', (err) => {
      console.error(`  ❌ Can't reach Firebase: ${err.message}`);
      resolve(false);
    });
  });
}

function updateGitignore() {
  if (!fs.existsSync(GITIGNORE)) {
    console.log('  ⚠️  No .gitignore found, skipping');
    return;
  }

  let content = fs.readFileSync(GITIGNORE, 'utf-8');
  
  // Uncomment the image directory lines
  const before = content;
  content = content.replace(/^# public\/images\/2024-01\/$/m, 'public/images/2024-01/');
  content = content.replace(/^# public\/images\/2024-06\/$/m, 'public/images/2024-06/');
  content = content.replace(/^# public\/images\/2025-05\/$/m, 'public/images/2025-05/');

  // If they weren't commented out, add them
  if (!content.includes('public/images/2024-01/')) {
    content += '\n# Firebase-hosted images (no longer tracked in git)\npublic/images/2024-01/\npublic/images/2024-06/\npublic/images/2025-05/\n';
  }

  if (content !== before) {
    if (!DRY_RUN) fs.writeFileSync(GITIGNORE, content);
    console.log('  ✅ Updated .gitignore to exclude image folders');
  } else {
    console.log('  ⏭️  .gitignore already excludes image folders');
  }
}

function removeImageFolders() {
  for (const folder of FOLDERS_TO_REMOVE) {
    const fullPath = path.join(IMAGES_DIR, folder);
    if (!fs.existsSync(fullPath)) {
      console.log(`  ⏭️  ${folder}/ — already removed`);
      continue;
    }

    const files = fs.readdirSync(fullPath);
    const sizeMB = files.reduce((sum, f) => {
      const stat = fs.statSync(path.join(fullPath, f));
      return sum + stat.size;
    }, 0) / 1024 / 1024;

    console.log(`  🗑️  ${folder}/ — ${files.length} files (${sizeMB.toFixed(1)} MB)`);
    
    if (!DRY_RUN) {
      // Try git rm first (removes from tracking + disk)
      try {
        execSync(`git rm -rf "public/images/${folder}"`, { cwd: PROJECT_ROOT, stdio: 'pipe' });
      } catch {
        // Not a git repo or not tracked — just delete
        fs.rmSync(fullPath, { recursive: true, force: true });
      }
    }
  }
}

function showSavings() {
  let totalSize = 0;
  let totalFiles = 0;
  for (const folder of FOLDERS_TO_REMOVE) {
    const fullPath = path.join(IMAGES_DIR, folder);
    if (!fs.existsSync(fullPath)) continue;
    const files = fs.readdirSync(fullPath);
    totalFiles += files.length;
    totalSize += files.reduce((sum, f) => sum + fs.statSync(path.join(fullPath, f)).size, 0);
  }
  return { totalFiles, totalMB: (totalSize / 1024 / 1024).toFixed(1) };
}

async function main() {
  console.log('');
  console.log('  🧹 Post-Migration Cleanup');
  console.log('  =========================');
  if (DRY_RUN) console.log('  📋 DRY RUN — no changes will be made\n');
  else console.log('');

  // Step 1: Verify Firebase is working
  const firebaseOk = await testFirebaseUrl();
  if (!firebaseOk) {
    console.error('  ⛔ Firebase verification failed. Fix that first, then re-run.');
    process.exit(1);
  }

  // Show what we're about to clean
  const { totalFiles, totalMB } = showSavings();
  console.log(`  📊 Cleaning up: ${totalFiles} files (${totalMB} MB)\n`);

  // Step 2: Update .gitignore
  updateGitignore();

  // Step 3: Remove image folders
  removeImageFolders();

  // Step 4: Verify kept files
  console.log('');
  for (const file of KEEP_FILES) {
    const exists = fs.existsSync(path.join(IMAGES_DIR, file));
    console.log(`  ${exists ? '✅' : '⚠️ '} ${file} — ${exists ? 'kept locally' : 'MISSING (may need to restore)'}`);
  }

  console.log('');
  if (DRY_RUN) {
    console.log('  📋 Dry run complete. Run without --dry-run to execute.');
  } else {
    console.log('  🎉 Cleanup complete!');
    console.log(`  💾 Repo is now ${totalMB} MB lighter`);
    console.log('');
    console.log('  Next: git add -A && git commit -m "Move images to Firebase Storage"');
  }
  console.log('');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
