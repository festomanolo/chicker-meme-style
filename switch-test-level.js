#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const TEST_LEVELS = {
  'basic': 'TEST_LEVELS.BASIC',
  'storage': 'TEST_LEVELS.ASYNC_STORAGE', 
  'navigation': 'TEST_LEVELS.NAVIGATION',
  'full': 'TEST_LEVELS.FULL'
};

const level = process.argv[2];

if (!level || !TEST_LEVELS[level]) {
  console.log('Usage: node switch-test-level.js <level>');
  console.log('Available levels:');
  Object.keys(TEST_LEVELS).forEach(key => {
    console.log(`  ${key} - ${TEST_LEVELS[key]}`);
  });
  process.exit(1);
}

const appTsxPath = path.join(__dirname, 'App.tsx');
let content = fs.readFileSync(appTsxPath, 'utf8');

// Replace the test level
const regex = /const \[currentTestLevel\] = useState\(TEST_LEVELS\.\w+\);/;
const replacement = `const [currentTestLevel] = useState(${TEST_LEVELS[level]});`;

content = content.replace(regex, replacement);

fs.writeFileSync(appTsxPath, content);

console.log(`✅ Switched to test level: ${level}`);
console.log(`📱 Now run: cd android && ./gradlew assembleDebug`);
console.log(`📦 APK will be at: android/app/build/outputs/apk/debug/app-debug.apk`);