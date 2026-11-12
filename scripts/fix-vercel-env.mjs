#!/usr/bin/env node
// Fix the Firebase settings in Vercel (production) in one go.
//
//   node scripts/fix-vercel-env.mjs ~/Downloads/<service-account>.json
//
// - Cleans the stray "\n"/quotes from the existing NEXT_PUBLIC_FIREBASE_* values
// - Points project, auth domain and storage bucket at crhomepros-9309c
// - Sets FIREBASE_ADMIN_PROJECT_ID / CLIENT_EMAIL / PRIVATE_KEY from the key file
// Values are sent straight to Vercel and never printed.
// Requires the Vercel CLI, logged in and linked to this project (run `vercel link` once if asked).

import { readFileSync, unlinkSync, existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const PROJECT = 'crhomepros-9309c'
const TARGET = 'production'

const keyPath = process.argv[2]
if (!keyPath || !existsSync(keyPath)) {
  console.error('Usage: node scripts/fix-vercel-env.mjs /path/to/service-account.json')
  process.exit(1)
}
const sa = JSON.parse(readFileSync(resolve(keyPath), 'utf8'))
if (sa.project_id !== PROJECT || !sa.client_email || !sa.private_key) {
  console.error(`That key file is for "${sa.project_id}", expected "${PROJECT}".`)
  process.exit(1)
}

// 1. Read current production values
const tmp = join(tmpdir(), `vercel-env-${Date.now()}.env`)
const pull = spawnSync('vercel', ['env', 'pull', tmp, `--environment=${TARGET}`, '--yes'], { stdio: 'inherit' })
if (pull.status !== 0) process.exit(pull.status || 1)
const current = {}
for (const line of readFileSync(tmp, 'utf8').split('\n')) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
  if (m) current[m[1]] = m[2]
}
unlinkSync(tmp)

const clean = (v) => (v || '').replace(/^"|"$/g, '').replace(/\\n/g, '').replace(/"/g, '').trim()

// 2. Desired values
const want = {
  NEXT_PUBLIC_FIREBASE_API_KEY: clean(current.NEXT_PUBLIC_FIREBASE_API_KEY),
  NEXT_PUBLIC_FIREBASE_APP_ID: clean(current.NEXT_PUBLIC_FIREBASE_APP_ID),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: clean(current.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: PROJECT,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: `${PROJECT}.firebaseapp.com`,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: `${PROJECT}.firebasestorage.app`,
  FIREBASE_ADMIN_PROJECT_ID: PROJECT,
  FIREBASE_ADMIN_CLIENT_EMAIL: sa.client_email,
  FIREBASE_ADMIN_PRIVATE_KEY: sa.private_key,
}
for (const [k, v] of Object.entries(want)) {
  if (!v) {
    console.error(`${k} is empty in Vercel. Copy it from Firebase → Project settings → Your apps → Config and add it in the Vercel dashboard, then rerun.`)
    process.exit(1)
  }
}

// 3. Replace each one (no trailing newline is ever sent)
for (const [name, value] of Object.entries(want)) {
  spawnSync('vercel', ['env', 'rm', name, TARGET, '--yes'], { stdio: 'ignore' })
  const add = spawnSync('vercel', ['env', 'add', name, TARGET], { input: value, stdio: ['pipe', 'ignore', 'pipe'] })
  if (add.status !== 0) {
    console.error(`✗ ${name}: ${add.stderr?.toString().trim()}`)
    process.exit(1)
  }
  console.log(`✓ ${name}`)
}
console.log('\nDone. Now run: vercel --prod   and open https://www.crhomepros.com/api/test-config')
console.log('Then delete the key file from your Downloads folder.')
