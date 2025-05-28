#!/usr/bin/env node

// Simple test to verify the library exports work correctly
// and that the "use client" directive is present

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing animation library build for Next.js compatibility...\n');

// Test 1: Check if built files exist
const distFiles = ['dist/index.js', 'dist/index.mjs', 'dist/index.d.ts'];
let allFilesExist = true;

distFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n❌ Build failed - missing files');
  process.exit(1);
}

// Test 2: Check "use client" directive in runtime JS files (should have it)
const runtimeFiles = ['dist/index.js', 'dist/index.mjs'];
let allRuntimeFilesHaveUseClient = true;

runtimeFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.startsWith('"use client";')) {
      console.log(`✅ ${file} has correct "use client" directive at top`);
    } else {
      console.log(`❌ ${file} missing or incorrect "use client" directive`);
      console.log(`   First line: ${content.split('\n')[0]}`);
      allRuntimeFilesHaveUseClient = false;
    }
  }
});

// Test 3: Check TypeScript declaration files (should NOT have "use client")
const typeFiles = ['dist/index.d.ts', 'dist/index.d.mts'];
let allTypeFilesCorrect = true;

typeFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    if (!content.startsWith('"use client";')) {
      console.log(`✅ ${file} correctly does not have "use client" directive (type files don't need it)`);
    } else {
      console.log(`❌ ${file} incorrectly has "use client" directive (type files should not have it)`);
      allTypeFilesCorrect = false;
    }
  }
});

// Test 4: Try importing the library (basic smoke test)
try {
  const lib = require('./dist/index.js');
  
  if (lib.Animate && lib.useAnimation && lib.AnimateWrapper) {
    console.log('✅ Library exports are available (Animate, useAnimation, AnimateWrapper)');
  } else {
    console.log('❌ Missing expected exports');
    console.log('   Available exports:', Object.keys(lib));
    allRuntimeFilesHaveUseClient = false;
  }
} catch (error) {
  console.log('❌ Error importing library:', error.message);
  allRuntimeFilesHaveUseClient = false;
}

console.log('\n' + '='.repeat(60));

if (allFilesExist && allRuntimeFilesHaveUseClient && allTypeFilesCorrect) {
  console.log('🎉 All tests passed! Library is ready for Next.js usage.');
  console.log('\nUsage in Next.js:');
  console.log('1. Import the component: import { Animate } from "animation-library-test-abdullah-altun"');
  console.log('2. Import styles globally: @import "animation-library-test-abdullah-altun/dist/styles.css"');
  console.log('3. Use in client components: <Animate type="fade">Content</Animate>');
  console.log('\nThe library is now properly configured as a client component!');
} else {
  console.log('❌ Some tests failed. Please check the build configuration.');
  process.exit(1);
}
