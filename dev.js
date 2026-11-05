import { spawn } from 'child_process';
import path from 'path';

console.log('🚀 Starting EcoTex Inc Full-Stack Platform...');
console.log('📦 Backend API: http://localhost:3001');
console.log('💻 Frontend UI:  http://localhost:3000');
console.log('🛡️ Admin Studio: http://localhost:3000/admin\n');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

const backend = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.resolve('./backend'),
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, PORT: '3001', NODE_ENV: 'development', DEV_MODE: 'true' }
});

const frontend = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.resolve('./frontend'),
  stdio: 'inherit',
  shell: true
});

function handleExit(code) {
  backend.kill();
  frontend.kill();
  process.exit(code || 0);
}

process.on('SIGINT', () => handleExit(0));
process.on('SIGTERM', () => handleExit(0));
process.on('exit', () => handleExit(0));
