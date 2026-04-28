#!/usr/bin/env node

import { execSync } from 'child_process';
import { copyFileSync, existsSync, mkdirSync, rmSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

console.log('Quick build for deployment...');

try {
  // Ensure dist directory exists
  if (!existsSync('dist')) {
    mkdirSync('dist', { recursive: true });
  }

  // Copy index.html to dist root (required for static deployment)
  console.log('1. Copying index.html to deployment directory...');
  copyFileSync('client/index.html', 'dist/index.html');
  
  // Build backend server
  console.log('2. Building server...');
  execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --minify', { stdio: 'inherit' });

  // Create a simple assets directory structure
  console.log('3. Creating assets structure...');
  if (!existsSync('dist/assets')) {
    mkdirSync('dist/assets', { recursive: true });
  }

  console.log('Quick build completed successfully!');
  console.log('Files in dist:', readdirSync('dist'));

} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}