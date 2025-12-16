#!/bin/bash

echo "🚀 Starting production build..."

# Step 1: Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next
rm -rf out

# Step 2: Build Next.js
echo "🔨 Building Next.js application..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed!"
  exit 1
fi

# Step 3: Obfuscate JavaScript (optional)
if [ "$ENABLE_OBFUSCATION" = "true" ]; then
  echo "🔒 Obfuscating JavaScript code..."
  node scripts/obfuscate.js
  
  if [ $? -ne 0 ]; then
    echo "⚠️  Obfuscation failed, but build continues..."
  else
    echo "✅ Obfuscation complete!"
  fi
else
  echo "⏭️  Skipping obfuscation (set ENABLE_OBFUSCATION=true to enable)"
fi

# Step 4: Analyze bundle (optional)
if [ "$ANALYZE" = "true" ]; then
  echo "📊 Analyzing bundle size..."
  npm run analyze
fi

echo "✅ Production build complete!"
echo "📦 Build artifacts are in .next directory"
echo "🚀 Ready to deploy!"