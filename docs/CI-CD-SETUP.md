# 🚀 CI/CD Setup Guide

## Quick Setup

### 1. Generate Keystore
\`\`\`bash
keytool -genkeypair -v -storetype PKCS12 -keystore upload-keystore.keystore -alias aiwriterpro -keyalg RSA -keysize 2048 -validity 10000
\`\`\`

### 2. Setup GitHub Secrets
\`\`\`bash
npm run ci:setup
\`\`\`

### 3. Push to GitHub
\`\`\`bash
git add .
git commit -m "Add CI/CD pipeline"
git push origin main
\`\`\`

## Manual Secret Setup

Go to GitHub Repository → Settings → Secrets and variables → Actions

Add these secrets:
- `KEYSTORE_BASE64`: Base64 encoded keystore file
- `KEYSTORE_PASSWORD`: Keystore password
- `KEY_PASSWORD`: Key password  
- `KEY_ALIAS`: Key alias (e.g., aiwriterpro)
- `OPENAI_API_KEY`: Your OpenAI API key
- `GOOGLE_PLAY_SERVICE_ACCOUNT`: Google Play service account JSON (optional)

## Workflow Triggers

- **Push to main/develop**: Build APK + AAB
- **Create tag (v*)**: Build + Create GitHub Release
- **Pull Request**: Quality checks (lint, test, type-check)
- **Tag push**: Deploy to Play Store (if configured)

## Build Artifacts

After successful build, download:
- APK: `app-release-apk`
- AAB: `app-release-aab`

## Play Store Deployment

1. Create Google Play service account
2. Download JSON key file
3. Add as `GOOGLE_PLAY_SERVICE_ACCOUNT` secret
4. Push tag: `git tag v1.0.0 && git push origin v1.0.0`
