#!/bin/bash

echo "🔧 Setting up Gradle Wrapper..."

# Navigate to android directory
cd android

# Remove existing wrapper files if any
rm -rf gradle/wrapper/
rm -f gradlew gradlew.bat

# Generate gradle wrapper with specific version
gradle wrapper --gradle-version=8.6 --distribution-type=all

# Make gradlew executable
chmod +x gradlew

echo "✅ Gradle Wrapper setup complete!"
echo "Files created:"
echo "- gradlew"
echo "- gradlew.bat" 
echo "- gradle/wrapper/gradle-wrapper.jar"
echo "- gradle/wrapper/gradle-wrapper.properties"
