#!/usr/bin/env node

// Test script to verify both server-safe and client entry points

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing animation library build for Next.js compatibility...\n');

// Check if build files exist
const requiredFiles = [
  'dist/index.js',
  'dist/index.mjs', 
  'dist/index.d.ts',
  'dist/client.js',
  'dist/client.mjs',
  'dist/client.d.ts'
];

const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
if (missingFiles.length > 0) {
  console.error('❌ Missing build files:', missingFiles);
  process.exit(1);
}

requiredFiles.forEach(file => {
  console.log(`✅ ${file} exists`);
});

// Check main index files (should NOT have "use client")
const mainFiles = ['dist/index.js', 'dist/index.mjs'];
mainFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('"use client"') || content.includes("'use client'")) {
    console.error(`❌ ${file} should NOT have "use client" directive for server compatibility`);
    process.exit(1);
  } else {
    console.log(`✅ ${file} is server-safe (no "use client" directive)`);
  }
});

// Check client files (should have "use client")
const clientFiles = ['dist/client.js', 'dist/client.mjs'];
clientFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  if (lines[0].trim() === '"use client";') {
    console.log(`✅ ${file} has correct "use client" directive at top`);
  } else {
    console.error(`❌ ${file} should have "use client" as the first line`);
    process.exit(1);
  }
});

// Check TypeScript declaration files (should NOT have "use client")
const typeFiles = ['dist/index.d.ts', 'dist/index.d.mts', 'dist/client.d.ts', 'dist/client.d.mts'];
typeFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('"use client"') || content.includes("'use client'")) {
      console.error(`❌ ${file} should not have "use client" directive (type files don't need it)`);
      process.exit(1);
    } else {
      console.log(`✅ ${file} correctly does not have "use client" directive (type files don't need it)`);
    }
  }
});

// Test that library exports are available from both entry points
try {
  const mainExports = require('./dist/index.js');
  const clientExports = require('./dist/client.js');
  
  const expectedExports = ['Animate', 'useAnimation', 'AnimateWrapper'];
  
  // Check main exports
  for (const exportName of expectedExports) {
    if (!mainExports[exportName]) {
      console.error(`❌ Main export missing: ${exportName}`);
      process.exit(1);
    }
  }
  
  // Check client exports
  for (const exportName of expectedExports) {
    if (!clientExports[exportName]) {
      console.error(`❌ Client export missing: ${exportName}`);
      process.exit(1);
    }
  }
  
  console.log(`✅ All exports are available from both entry points (${expectedExports.join(', ')})`);
  
} catch (error) {
  console.error('❌ Failed to require library:', error.message);
  process.exit(1);
}

console.log('\n============================================================');
console.log('🎉 All tests passed! Library is ready for Next.js usage.');
console.log('\nUsage in Next.js:');
console.log('1. Server components: import { Animate } from "animation-library-test-abdullah-altun"');
console.log('2. Client components: import { Animate } from "animation-library-test-abdullah-altun/client"');
console.log('3. Import styles globally: @import "animation-library-test-abdullah-altun/dist/styles.css"');
console.log('4. Use in components: <Animate type="fade">Content</Animate>');
console.log('\nThe library now supports both server and client components!');
