import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Building Pollyfort for production...');

// Function to copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  // Clean previous build
  if (fs.existsSync('dist')) {
    console.log('🧹 Cleaning previous build...');
    fs.rmSync('dist', { recursive: true, force: true });
  }

  // Build frontend
  console.log('🔨 Building frontend...');
  execSync('npx vite build --outDir dist/public', { stdio: 'inherit' });

  // Build backend
  console.log('🔧 Building backend...');
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });

  // Copy package.json for production
  console.log('📦 Creating production package.json...');
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  const prodPackageJson = {
    name: packageJson.name,
    version: packageJson.version,
    type: "module",
    main: "index.js",
    scripts: {
      start: "node index.js"
    },
    dependencies: {
      // Only runtime dependencies needed for production
      "express": packageJson.dependencies["express"],
      "bcrypt": packageJson.dependencies["bcrypt"],
      "drizzle-orm": packageJson.dependencies["drizzle-orm"],
      "pg": packageJson.dependencies["pg"],
      "connect-pg-simple": packageJson.dependencies["connect-pg-simple"],
      "express-session": packageJson.dependencies["express-session"]
    }
  };

  fs.writeFileSync('dist/package.json', JSON.stringify(prodPackageJson, null, 2));

  // Copy root index.html as fallback
  if (fs.existsSync('index.html')) {
    console.log('📄 Copying fallback index.html...');
    fs.copyFileSync('index.html', 'dist/index.html');
  }

  // Copy assets if they exist
  if (fs.existsSync('assets')) {
    console.log('🖼️ Copying assets...');
    copyDir('assets', 'dist/assets');
  }

  console.log('✅ Build completed successfully!');
  console.log('📁 Build output: dist/');
  console.log('🌐 Frontend: dist/public/');
  console.log('⚙️ Backend: dist/index.js');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}