# 🔥 Firebase Setup — 3 Steps

## Step 1: Place service account key
Put Carlos's Firebase service account JSON at:
```
scripts/firebase-service-account.json
```
(You already have this file — it's the one that starts with `crhomepros-firebase-adminsdk...`)

## Step 2: Set Storage rules
Go to Firebase Console → Storage → Rules tab → paste this and publish:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Step 3: Run the upload
```bash
npm install
node scripts/upload-images.js
```

That's it. All 29 images upload to Firebase CDN with 1-year cache headers.

## Verify
Open any URL it prints and confirm the image loads in your browser:
```
https://crhomepros.firebasestorage.app/o/projects%2F2025-05%2Fkitchen-pg-county-01.png?alt=media
```

## After migration
1. `.env.local` already has `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=crhomepros.firebasestorage.app`
2. The site auto-resolves all image paths to Firebase CDN URLs
3. Uncomment the image directories in `.gitignore` to drop them from git
