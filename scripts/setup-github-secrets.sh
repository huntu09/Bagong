#!/bin/bash

echo "🔧 Setting up GitHub Secrets for CI/CD"
echo "======================================"

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI not found. Please install: https://cli.github.com/"
    exit 1
fi

# Check if logged in
if ! gh auth status &> /dev/null; then
    echo "❌ Please login to GitHub CLI first: gh auth login"
    exit 1
fi

echo "📝 Please provide the following information:"

# Get repository info
read -p "Repository (owner/repo): " REPO

# Get keystore info
read -p "Path to your keystore file: " KEYSTORE_PATH
read -s -p "Keystore password: " KEYSTORE_PASSWORD
echo
read -s -p "Key password: " KEY_PASSWORD
echo
read -p "Key alias: " KEY_ALIAS

# Get API keys
read -s -p "OpenAI API Key: " OPENAI_API_KEY
echo

# Optional: Google Play Service Account
read -p "Google Play Service Account JSON path (optional): " PLAY_SERVICE_ACCOUNT_PATH

echo "🔄 Setting up secrets..."

# Convert keystore to base64
KEYSTORE_BASE64=$(base64 -i "$KEYSTORE_PATH")

# Set secrets
gh secret set KEYSTORE_BASE64 --body "$KEYSTORE_BASE64" --repo "$REPO"
gh secret set KEYSTORE_PASSWORD --body "$KEYSTORE_PASSWORD" --repo "$REPO"
gh secret set KEY_PASSWORD --body "$KEY_PASSWORD" --repo "$REPO"
gh secret set KEY_ALIAS --body "$KEY_ALIAS" --repo "$REPO"
gh secret set OPENAI_API_KEY --body "$OPENAI_API_KEY" --repo "$REPO"

if [ -n "$PLAY_SERVICE_ACCOUNT_PATH" ]; then
    PLAY_SERVICE_ACCOUNT=$(cat "$PLAY_SERVICE_ACCOUNT_PATH")
    gh secret set GOOGLE_PLAY_SERVICE_ACCOUNT --body "$PLAY_SERVICE_ACCOUNT" --repo "$REPO"
fi

echo "✅ All secrets have been set successfully!"
echo "🚀 Your CI/CD pipeline is ready to use!"
