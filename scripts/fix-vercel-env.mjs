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

// Web app config straight from Firebase (Vercel hides "Sensitive" values on pull)
function firebaseJson(args) {
  const r = spawnSync('npx', ['--yes', 'firebase-tools', ...args, '--project', PROJECT, '--json'], { encoding: 'utf8' })
  try { return JSON.parse(r.stdout) } catch { return null }
}
let web = {}
const apps = firebaseJson(['apps:list', 'WEB'])?.result || []
if (apps.length === 0) {
  console.error('No web app found in Firebase. In Firebase → Project settings → General → Your apps, click Add app → Web (name it "website"), then rerun.')
  process.exit(1)
}
const cfg = firebaseJson(['apps:sdkconfig', 'WEB', apps[0].appId])?.result
web = cfg?.sdkConfig || {}
if (!web.apiKey && cfg?.fileContents) {
  for (const k of ['apiKey', 'appId', 'messagingSenderId']) {
    const m = cfg.fileContents.match(new RegExp(`"?${k}"?\\s*:\\s*"([^"]+)"`))
    if (m) web[k] = m[1]
  }
}
console.log(`Using Firebase web app: ${apps[0].displayName || apps[0].appId}`)

const clean = (v) => (v || '').replace(/^"|"$/g, '').replace(/\\n/g, '').replace(/"/g, '').trim()

// 2. Desired values
const want = {
  NEXT_PUBLIC_FIREBASE_API_KEY: web.apiKey || clean(current.NEXT_PUBLIC_FIREBASE_API_KEY),
  NEXT_PUBLIC_FIREBASE_APP_ID: web.appId || clean(current.NEXT_PUBLIC_FIREBASE_APP_ID),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: web.messagingSenderId || clean(current.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: PROJECT,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: `${PROJECT}.firebaseapp.com`,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: `${PROJECT}.firebasestorage.app`,
  FIREBASE_ADMIN_PROJECT_ID: PROJECT,
  FIREBASE_ADMIN_CLIENT_EMAIL: sa.client_email,
  FIREBASE_ADMIN_PRIVATE_KEY: sa.private_key,
}
for (const [k, v] of Object.entries(want)) {
  if (!v) {
    console.error(`${k} could not be read from Firebase or Vercel. Make sure "npx firebase-tools login:list" shows crhomepros@gmail.com, then rerun.`)
    process.exit(1)
  }
}

// 3. Set each one. --force overwrites in place (nothing is removed first),
// the value goes in through stdin so no trailing newline is ever sent.
let failed = 0
for (const [name, value] of Object.entries(want)) {
  const type = name.startsWith('NEXT_PUBLIC_') ? 'config' : 'secret'
  const base = ['env', 'add', name, '--environment', TARGET, '--type', type, '--force', '--yes']
  let add = spawnSync('vercel', base, { input: value, encoding: 'utf8' })
  if (add.status !== 0) {
    // Fallback: pass the value as an option instead of stdin
    add = spawnSync('vercel', [...base, `--value=${value}`], { encoding: 'utf8' })
  }
  if (add.status !== 0) {
    failed++
    console.error(`✗ ${name}: ${(add.stderr || add.stdout || '').trim().split('\n').slice(-3).join(' | ')}`)
  } else {
    console.log(`✓ ${name}`)
  }
}
if (failed) {
  console.error(`\n${failed} setting(s) failed. Paste this output to Claude.`)
  process.exit(1)
}
console.log('\nDone. Now run: vercel --prod   and open https://www.crhomepros.com/api/test-config')
