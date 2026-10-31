#!/usr/bin/env node
/**
 * 🔁 Sync real photos into the site
 * ==================================
 * Reads scripts/image-manifest.json. For every slot that has a "file":
 *   1. uploads public/images/<file> to Firebase Storage (same folder rules as lib/resolve-images.ts)
 *   2. replaces the temporary photo everywhere it appears in app/, components/ and lib/
 *
 * Usage:
 *   node scripts/sync-images.mjs            dry run: prints the plan, changes nothing
 *   node scripts/sync-images.mjs --apply    uploads + rewrites the code
 *   node scripts/sync-images.mjs --apply --skip-upload   rewrite code only
 *
 * Needs scripts/firebase-service-account.json (gitignored; never commit it).
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'fs'
import { join, dirname, extname, relative } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const APPLY = process.argv.includes('--apply')
const SKIP_UPLOAD = process.argv.includes('--skip-upload')
const BUCKET = 'crhomepros.firebasestorage.app'
const SCAN_DIRS = ['app', 'components', 'lib']
// Data files whose consumers already call resolveImageUrl(): write a plain local path there.
const DATA_FILES = new Set(['lib/blog-posts.ts', 'lib/gallery-data.ts'])

// Same mapping as lib/resolve-images.ts → toStoragePath()
function toStoragePath(localPath) {
  const rel = localPath.replace(/^\/images\//, '')
  if (rel.startsWith('blog/')) return rel
  if (rel.startsWith('team-')) return `team/${rel}`
  if (rel === 'logo.png' || rel === 'og-image.jpg') return `site/${rel}`
  return `projects/${rel}`
}

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/\.(tsx?|jsx?)$/.test(name)) out.push(p)
  }
  return out
}

const escapeRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

function ensureImport(src) {
  if (/import\s*\{[^}]*\bresolveImageUrl\b[^}]*\}\s*from/.test(src)) return src
  const line = `import { resolveImageUrl } from '@/lib/resolve-images'\n`
  const m = [...src.matchAll(/^import .*$/gm)].pop()
  if (!m) return line + src
  const at = m.index + m[0].length + 1
  return src.slice(0, at) + line + src.slice(at)
}

const manifest = JSON.parse(readFileSync(join(__dirname, 'image-manifest.json'), 'utf8'))
const ready = manifest.slots.filter(s => s.file)
const pending = manifest.slots.filter(s => !s.file)

console.log(`\n${APPLY ? '🚀 APPLY' : '👀 DRY RUN'}: ${ready.length} slots filled, ${pending.length} still on temporary photos\n`)

// ── 1. Check files ──
let missing = 0
for (const s of ready) {
  s.localPath = `/images/${s.file}`
  s.diskPath = join(ROOT, 'public', 'images', s.file)
  s.storagePath = toStoragePath(s.localPath)
  if (!existsSync(s.diskPath)) { console.error(`❌ ${s.id}: missing public/images/${s.file}`); missing++ }
}
if (missing) process.exit(1)

// ── 2. Upload ──
if (!SKIP_UPLOAD) {
  let bucket = null
  if (APPLY) {
    const sa = join(__dirname, 'firebase-service-account.json')
    if (!existsSync(sa)) {
      console.error('❌ Missing scripts/firebase-service-account.json (Firebase Console → Project Settings → Service Accounts)')
      process.exit(1)
    }
    const { initializeApp, cert } = await import('firebase-admin/app')
    const { getStorage } = await import('firebase-admin/storage')
    initializeApp({ credential: cert(JSON.parse(readFileSync(sa, 'utf8'))), storageBucket: BUCKET })
    bucket = getStorage().bucket()
  }
  console.log('☁️  Upload')
  for (const s of ready) {
    if (!bucket) { console.log(`   would upload  ${s.file}  →  ${s.storagePath}`); continue }
    const [exists] = await bucket.file(s.storagePath).exists()
    if (exists) { console.log(`   ✓ exists      ${s.storagePath}`); continue }
    const ext = extname(s.file).toLowerCase()
    const contentType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg'
    await bucket.upload(s.diskPath, {
      destination: s.storagePath,
      metadata: { contentType, cacheControl: 'public, max-age=31536000, immutable' },
    })
    await bucket.file(s.storagePath).makePublic()
    console.log(`   ↑ uploaded    ${s.storagePath}`)
  }
}

// ── 3. Replace temporary photos in code ──
console.log('\n✏️  Code')
const files = SCAN_DIRS.flatMap(d => (existsSync(join(ROOT, d)) ? walk(join(ROOT, d)) : []))
let changed = 0
for (const f of files) {
  const rel = relative(ROOT, f)
  let src = readFileSync(f, 'utf8')
  const before = src
  let needsImport = false
  for (const s of ready) {
    if (s.placeholder.startsWith('http')) {
      // Whole quoted literal, including any ?w=…&q=… query string
      const re = new RegExp(`(['"\`])${escapeRe(s.placeholder)}[^'"\`]*\\1`, 'g')
      const hits = src.match(re)
      if (!hits) continue
      const replacement = DATA_FILES.has(rel) ? `'${s.localPath}'` : `resolveImageUrl('${s.localPath}')`
      if (!DATA_FILES.has(rel)) needsImport = true
      src = src.replace(re, replacement)
      console.log(`   ${rel}: ${s.id} ×${hits.length} → ${s.localPath}`)
    } else {
      const re = new RegExp(`(['"\`])${escapeRe(s.placeholder)}\\1`, 'g')
      const hits = src.match(re)
      if (!hits) continue
      src = src.replace(re, `$1${s.localPath}$1`)
      console.log(`   ${rel}: ${s.id} ×${hits.length} → ${s.localPath}`)
    }
  }
  if (needsImport) src = ensureImport(src)
  if (src !== before) {
    changed++
    if (APPLY) writeFileSync(f, src)
  }
}
console.log(`\n${APPLY ? '✅ Updated' : 'Would update'} ${changed} file(s).`)

if (pending.length) {
  console.log('\n⏳ Still on temporary photos:')
  for (const s of pending) console.log(`   ${s.id.padEnd(30)} needs: ${s.needs}`)
}
if (APPLY) console.log('\nNext: npm run build, check the pages, then commit and deploy.')
console.log('')
