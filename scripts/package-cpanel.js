import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'cpanel_dist');
const zipFile = path.join(rootDir, 'ecotex-cpanel-production.zip');

console.log('🚀 Starting Ecotex Inc. cPanel Production Package Generation...');

// 1. Build frontend
console.log('📦 Step 1: Building production frontend with Vite...');
execSync('npm run build --prefix frontend', { stdio: 'inherit', cwd: rootDir });

// 2. Clean and create outDir
console.log('🧹 Step 2: Preparing distribution directory...');
if (fs.existsSync(outDir)) {
  fs.rmSync(outDir, { recursive: true, force: true });
}
fs.mkdirSync(outDir, { recursive: true });

// Helper to copy recursively
function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 3. Copy frontend dist to outDir/dist AND outDir/public
console.log('📂 Step 3: Copying frontend dist & public assets...');
const frontendDist = path.join(rootDir, 'frontend', 'dist');
copyDirSync(frontendDist, path.join(outDir, 'dist'));
copyDirSync(frontendDist, path.join(outDir, 'public'));

// 4. Copy backend src
console.log('📂 Step 4: Copying backend server source...');
copyDirSync(path.join(rootDir, 'backend', 'src'), path.join(outDir, 'src'));

// 5. Copy backend root files
console.log('📂 Step 5: Copying core backend files & database...');
fs.copyFileSync(path.join(rootDir, 'backend', 'index.js'), path.join(outDir, 'index.js'));
fs.copyFileSync(path.join(rootDir, 'backend', 'db.json'), path.join(outDir, 'db.json'));
if (fs.existsSync(path.join(rootDir, 'backend', 'db.backup.json'))) {
  fs.copyFileSync(path.join(rootDir, 'backend', 'db.backup.json'), path.join(outDir, 'db.backup.json'));
}

// 6. Ensure uploads folder exists
const uploadsDir = path.join(outDir, 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });
if (fs.existsSync(path.join(rootDir, 'backend', 'uploads'))) {
  copyDirSync(path.join(rootDir, 'backend', 'uploads'), uploadsDir);
}
fs.writeFileSync(path.join(uploadsDir, '.gitkeep'), '');

// 7. Create server.cjs (CommonJS Phusion Passenger wrapper)
const serverCjsContent = `// Phusion Passenger CommonJS compatibility wrapper
(async () => {
  try {
    await import('./index.js');
  } catch (err) {
    console.error('Fatal Passenger startup error:', err);
    process.exit(1);
  }
})();
`;
fs.writeFileSync(path.join(outDir, 'server.cjs'), serverCjsContent, 'utf8');

// 8. Create app.js (Alias startup file)
const appJsContent = `import './index.js';
`;
fs.writeFileSync(path.join(outDir, 'app.js'), appJsContent, 'utf8');

// 9. Create production package.json
const packageJsonContent = {
  name: "ecotex-inc-production",
  version: "1.0.0",
  description: "Ecotex Inc - Production Unified Full-Stack Application for cPanel",
  type: "module",
  main: "index.js",
  scripts: {
    start: "node index.js",
    "passenger-start": "node server.cjs"
  },
  dependencies: {
    bcryptjs: "^3.0.3",
    cors: "^2.8.6",
    dotenv: "^18.0.5",
    express: "^4.21.2",
    "express-rate-limit": "^8.7.0",
    helmet: "^8.3.0",
    jsonwebtoken: "^9.0.3",
    morgan: "^1.12.1",
    multer: "^2.4.0",
    mysql2: "^3.24.6",
    pg: "^8.23.1"
  }
};
fs.writeFileSync(path.join(outDir, 'package.json'), JSON.stringify(packageJsonContent, null, 2), 'utf8');

// 10. Copy backend node_modules
console.log('📦 Step 6: Copying pre-installed node_modules (No terminal needed on cPanel)...');
const backendNodeModules = path.join(rootDir, 'backend', 'node_modules');
if (fs.existsSync(backendNodeModules)) {
  copyDirSync(backendNodeModules, path.join(outDir, 'node_modules'));
}

// 11. Create production .env
const envContent = `# ========================================================
# Ecotex Inc. - cPanel Production Environment Variables
# Domain: ecotexinc.com
# ========================================================

NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Security Secrets
JWT_SECRET=ecotex_prod_jwt_super_secret_key_2026_secured
JWT_EXPIRES_IN=7d

# CORS & Domain
CORS_ORIGIN=*
VITE_API_URL=/admin/api

# Performance & Uploads
RATE_LIMIT_MAX_REQUESTS=2500
AUTH_RATE_LIMIT_MAX_REQUESTS=50
MAX_UPLOAD_SIZE_MB=50

# Optional cPanel MySQL Configuration
# Uncomment and fill if you create a MySQL Database in cPanel:
# DB_HOST=localhost
# DB_PORT=3306
# DB_USER=your_cpanel_db_user
# DB_PASSWORD=your_cpanel_db_password
# DB_NAME=your_cpanel_db_name
`;
fs.writeFileSync(path.join(outDir, '.env'), envContent, 'utf8');

// 12. Create production .htaccess
const htaccessContent = `# ========================================================
# Ecotex Inc. - cPanel Unified Production Configuration
# Domain: ecotexinc.com
# ========================================================

# 1. Enable Rewrite Engine & Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# 2. Security HTTP Headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
</IfModule>

# 3. MIME Types for Modern Web Assets
<IfModule mod_mime.c>
    AddType application/javascript js mjs
    AddType text/css css
    AddType image/svg+xml svg svgz
    AddType image/webp webp
    AddType application/json json
</IfModule>

# 4. Gzip & Compression for Performance
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css application/javascript application/json image/svg+xml
</IfModule>

# 5. Allow up to 50MB request payloads
LimitRequestBody 52428800

# 6. Phusion Passenger Configuration (CloudLinux "Setup Node.js App")
<IfModule mod_passenger.c>
    PassengerAppType node
    PassengerStartupFile index.js
    PassengerAppRoot "."
</IfModule>
`;
fs.writeFileSync(path.join(outDir, '.htaccess'), htaccessContent, 'utf8');

// 13. Create detailed instructions file
const instructionsUrdu = `====================================================================
ECOTEX INC. - cPanel Deployment Instructions (Urdu & English)
Domain: ecotexinc.com
====================================================================

Bhai, yeh package poori tarah se ready hai. Is package mein:
1. Frontend build (Vite dist) included hai.
2. Backend API server (Express) included hai.
3. Node Modules pehle se installed hain (Aapko terminal ya npm install chalane ki koi zaroorat nahi hai).
4. Database (db.json) sabhi updated settings aur products ke sath included hai.
5. .htaccess aur startup files (index.js, server.cjs, app.js) configured hain.

--------------------------------------------------------------------
STEP-BY-STEP cPanel UPLOAD GUIDE (Baghair Terminal Ke)
--------------------------------------------------------------------

STEP 1: cPanel Login Karein
1. Apne cPanel mein login karein.
2. "Software" section mein check karein "Setup Node.js App" icon hoga.

STEP 2: "Setup Node.js App" Create Karein
1. "Setup Node.js App" par click karein.
2. "Create Application" button dabayein.
3. Form mein yeh settings select karein:
   - Node.js Version: 18.x ya 20.x (jo bhi latest available ho).
   - Application Mode: Production.
   - Application Root: ecotex (ya public_html).
   - Application URL: ecotexinc.com
   - Application Startup File: index.js (agar error aaye toh server.cjs bhi select kar sakte hain).
4. "Create" button par click karein.

STEP 3: Files Upload Karein (cPanel File Manager Se)
1. cPanel ke main menu se "File Manager" open karein.
2. Jo application folder aapne banaya hai (e.g. "ecotex" ya "public_html") us folder ke andar jayein.
3. Upar "Upload" button par click karein.
4. "ecotex-cpanel-production.zip" file ko drag karke upload karein.
5. Upload complete hone ke baad wapas File Manager mein aayein.
6. "ecotex-cpanel-production.zip" par right-click karein aur "Extract" (Extract Here) par click karein.

STEP 4: App Start / Restart Karein
1. Wapas "Setup Node.js App" page par jayein.
2. Apni application ke samne "Restart" (ya "Run JS Script") button par click karein.

STEP 5: Check Karein
1. Apne browser mein open karein:
   - https://ecotexinc.com
     -> Yahan aapka main frontend website (Storefront) khulega.
   - https://ecotexinc.com/admin
     -> Yahan aapka Admin Login page aur CMS Dashboard khulega!

Mubarak ho! Single domain par frontend aur /admin dono live chalenge.
`;
fs.writeFileSync(path.join(outDir, 'CPANEL_INSTRUCTIONS.txt'), instructionsUrdu, 'utf8');

// 14. Create ZIP archive
console.log('🗜️ Step 7: Creating ecotex-cpanel-production.zip file...');
if (fs.existsSync(zipFile)) {
  fs.rmSync(zipFile, { force: true });
}

try {
  // Use .NET ZipFile to avoid Write-Progress console errors
  execSync(`powershell -Command "$ProgressPreference = 'SilentlyContinue'; Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::CreateFromDirectory('${outDir}', '${zipFile}')"`, {
    stdio: 'inherit',
    cwd: rootDir
  });
  const stats = fs.statSync(zipFile);
  console.log(`✅ SUCCESS! ecotex-cpanel-production.zip created (${(stats.size / (1024 * 1024)).toFixed(2)} MB)`);
} catch (zipErr) {
  console.error('Error creating zip via PowerShell:', zipErr);
}

console.log('🎉 Ecotex cPanel Production build completed successfully!');
