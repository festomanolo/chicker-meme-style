const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Icon sizes for different platforms
const iconSizes = {
  ios: [20, 29, 40, 58, 60, 76, 80, 87, 120, 152, 167, 180, 1024],
  android: [36, 48, 72, 96, 144, 192],
  web: [16, 32, 48, 64, 128, 256, 512],
};

// Splash screen sizes
const splashSizes = {
  ios: [
    { width: 320, height: 568 }, // iPhone SE
    { width: 375, height: 667 }, // iPhone 6/7/8
    { width: 414, height: 736 }, // iPhone 6/7/8 Plus
    { width: 375, height: 812 }, // iPhone X/XS
    { width: 414, height: 896 }, // iPhone XR/XS Max
    { width: 768, height: 1024 }, // iPad
    { width: 834, height: 1112 }, // iPad Pro 10.5"
    { width: 834, height: 1194 }, // iPad Pro 11"
    { width: 1024, height: 1366 }, // iPad Pro 12.9"
  ],
  android: [
    { width: 320, height: 480 }, // Small
    { width: 480, height: 800 }, // Medium
    { width: 720, height: 1280 }, // Large
    { width: 1080, height: 1920 }, // Extra Large
  ],
};

async function generateIcons() {
  console.log('🚀 Generating app icons...');
  
  const sourcePath = path.join(__dirname, '../src/assets/chickerlogo.png');
  const outputDir = path.join(__dirname, '../assets');
  
  // Create output directories
  const iconDir = path.join(outputDir, 'icons');
  const splashDir = path.join(outputDir, 'splash');
  
  if (!fs.existsSync(iconDir)) {
    fs.mkdirSync(iconDir, { recursive: true });
  }
  if (!fs.existsSync(splashDir)) {
    fs.mkdirSync(splashDir, { recursive: true });
  }

  try {
    // Generate iOS icons
    console.log('📱 Generating iOS icons...');
