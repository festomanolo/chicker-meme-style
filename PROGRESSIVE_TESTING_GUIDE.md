# 🔧 Progressive APK Crash Testing Guide

## 🎯 Strategy
We're testing each component layer by layer to identify exactly where the crash occurs.

## 📋 Test Levels

### Level 1: Basic React Native ✅
**Current Status**: ACTIVE
**What it tests**: 
- Basic React Native components (View, Text, TouchableOpacity)
- State management (useState)
- Event handling
- Alerts

**How to test**:
1. Install the APK
2. Should see orange screen with "🐔 Chicker Debug"
3. Tap "Test React Native" button
4. Should show alert "React Native is working correctly!"

**If this fails**: Fundamental React Native setup issue

---

### Level 2: AsyncStorage Test
**What it tests**:
- AsyncStorage read/write operations
- Error handling
- Multi-operations

**To activate**: Change in App.tsx:
```typescript
const [currentTestLevel] = useState(TEST_LEVELS.ASYNC_STORAGE);
```

**Expected behavior**:
- Green screen with "🗄️ AsyncStorage Test"
- Shows "✅ AsyncStorage Working" if successful
- Two test buttons for basic and advanced tests

**If this fails**: AsyncStorage configuration issue

---

### Level 3: Navigation Test
**What it tests**:
- React Navigation setup
- Screen transitions
- Navigation state management

**To activate**: Change in App.tsx:
```typescript
const [currentTestLevel] = useState(TEST_LEVELS.NAVIGATION);
```

**Expected behavior**:
- Blue screen with "🧭 Navigation Test"
- "Go to Details" button navigates to purple screen
- "Go Back" button returns to home

**If this fails**: React Navigation configuration issue

---

### Level 4: Full App
**What it tests**:
- Complete app with all features
- Database initialization
- Authentication flow
- Complex navigation

## 🚀 Testing Process

### Step 1: Test Basic Level (Current)
```bash
cd android
./gradlew assembleDebug
```

Install APK: `android/app/build/outputs/apk/debug/app-debug.apk`

**Result Options**:
- ✅ **Works**: React Native setup is correct, proceed to Level 2
- ❌ **Crashes**: Fundamental issue, check Android logs

### Step 2: If Basic Works, Test AsyncStorage
1. Change `currentTestLevel` to `TEST_LEVELS.ASYNC_STORAGE`
2. Rebuild APK
3. Test AsyncStorage functionality

### Step 3: If AsyncStorage Works, Test Navigation
1. Change `currentTestLevel` to `TEST_LEVELS.NAVIGATION`
2. Rebuild APK
3. Test navigation between screens

### Step 4: If Navigation Works, Test Full App
1. Change `currentTestLevel` to `TEST_LEVELS.FULL`
2. Implement full app logic
3. Test complete functionality

## 🔍 Debugging Commands

### Get crash logs:
```bash
adb logcat | grep -E "(ReactNative|Chicker|FATAL|AndroidRuntime)"
```

### Clear app data:
```bash
adb shell pm clear com.chickermemestyle
```

### Check app installation:
```bash
adb shell pm list packages | grep chicker
```

## 📊 Expected Results

| Test Level | Screen Color | Main Text | Success Indicator |
|------------|--------------|-----------|-------------------|
| Basic | Orange | "🐔 Chicker Debug" | Alert shows |
| AsyncStorage | Green | "🗄️ AsyncStorage Test" | "✅ AsyncStorage Working" |
| Navigation | Blue/Purple | "🧭 Navigation Test" | Can navigate between screens |
| Full App | Theme colors | Full app UI | Complete functionality |

## 🛠️ Quick Fixes

### If Basic Test Fails:
- Check Android manifest
- Verify React Native installation
- Check for missing dependencies

### If AsyncStorage Test Fails:
- Verify @react-native-async-storage/async-storage installation
- Check Android permissions
- Try alternative storage solution

### If Navigation Test Fails:
- Check React Navigation dependencies
- Verify navigation configuration
- Test with simpler navigation setup

### If Full App Fails:
- Gradually add features back
- Test each component individually
- Check for circular dependencies

## 📝 Current Status
- ✅ Basic test APK built successfully
- 🔄 Ready for Level 1 testing
- ⏳ Waiting for test results to proceed

## 🎯 Next Steps
1. Test the current basic APK
2. Report results (works/crashes)
3. Progress to next level based on results
4. Identify and fix the specific crash cause