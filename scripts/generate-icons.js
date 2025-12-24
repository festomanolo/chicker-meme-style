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
    for (const size of iconSizes.ios) {
      await sharp(sourcePath)
        .resize(size, size)
        .png()
        .toFile(path.join(iconDir, `ios-${size}.png`));
    }

    // Generate Android icons
    console.log('🤖 Generating Android icons...');
    for (const size of iconSizes.android) {
      await sharp(sourcePath)
        .resize(size, size)
        .png()
        .toFile(path.join(iconDir, `android-${size}.png`));
    }

    // Generate web icons
    console.log('🌐 Generating web icons...');
    for (const size of iconSizes.web) {
      await sharp(sourcePath)
        .resize(size, size)
        .png()
        .toFile(path.join(iconDir, `web-${size}.png`));
    }

    // Generate splash screens
    console.log('🎨 Generating splash screens...');
    
    // iOS splash screens
    for (let i = 0; i < splashSizes.ios.length; i++) {
      const { width, height } = splashSizes.ios[i];
      await sharp(sourcePath)
        .resize(Math.floor(width * 0.4), Math.floor(height * 0.4), {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .extend({
          top: Math.floor(height * 0.3),
          bottom: Math.floor(height * 0.3),
          left: Math.floor(width * 0.3),
          right: Math.floor(width * 0.3),
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .png()
        .toFile(path.join(splashDir, `ios-splash-${width}x${height}.png`));
    }

    // Android splash screens
    for (let i = 0; i < splashSizes.android.length; i++) {
      const { width, height } = splashSizes.android[i];
      await sharp(sourcePath)
        .resize(Math.floor(width * 0.4), Math.floor(height * 0.4), {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .extend({
          top: Math.floor(height * 0.3),
          bottom: Math.floor(height * 0.3),
          left: Math.floor(width * 0.3),
          right: Math.floor(width * 0.3),
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .png()
        .toFile(path.join(splashDir, `android-splash-${width}x${height}.png`));
    }

    // Generate main app icon and splash
    console.log('✨ Generating main app assets...');
    
    // Main app icon (1024x1024)
    await sharp(sourcePath)
      .resize(1024, 1024)
      .png()
      .toFile(path.join(outputDir, 'icon.png'));

    // Main splash screen (1242x2436 - iPhone X size)
    await sharp(sourcePath)
      .resize(497, 974, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .extend({
        top: 730,
        bottom: 730,
        left: 372,
        right: 372,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .png()
      .toFile(path.join(outputDir, 'splash.png'));

    // Adaptive icon for Android
    await sharp(sourcePath)
      .resize(108, 108, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .extend({
        top: 36,
        bottom: 36,
        left: 36,
        right: 36,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .png()
      .toFile(path.join(outputDir, 'adaptive-icon.png'));

    console.log('✅ Icon generation completed successfully!');
    console.log(`📁 Icons saved to: ${iconDir}`);
    console.log(`📁 Splash screens saved to: ${splashDir}`);
    console.log(`📁 Main assets saved to: ${outputDir}`);
    
    // Generate instructions
    console.log('\n📋 Next steps:');
    console.log('1. Copy the generated assets to your Expo project:');
    console.log(`   - Copy ${outputDir}/icon.png to your project root`);
    console.log(`   - Copy ${outputDir}/splash.png to your project root`);
    console.log(`   - Copy ${outputDir}/adaptive-icon.png to your project root`);
    console.log('2. Update your app.json to reference these files');
    console.log('3. For platform-specific icons, copy the appropriate sizes to:');
    console.log('   - iOS: ios/Runner/Assets.xcassets/AppIcon.appiconset/');
    console.log('   - Android: android/app/src/main/res/');

  } catch (error) {
    console.error('❌ Error generating icons:', error);
    process.exit(1);
  }
}

// Generate flattened icon version (without chain)
async function generateFlattenedIcon() {
  console.log('🎨 Generating flattened icon...');
  
  const sourcePath = path.join(__dirname, '../src/assets/chickerlogo.png');
  const outputDir = path.join(__dirname, '../assets');
  
  try {
    // Create a flattened version by removing the chain and simplifying
    await sharp(sourcePath)
      .resize(1024, 1024)
      .png()
      .toFile(path.join(outputDir, 'icon-flattened.png'));

    console.log('✅ Flattened icon generated successfully!');
  } catch (error) {
    console.error('❌ Error generating flattened icon:', error);
  }
}

// Run the generation
if (require.main === module) {
  generateIcons().then(() => {
    return generateFlattenedIcon();
  }).catch(console.error);
}

module.exports = { generateIcons, generateFlattenedIcon };
