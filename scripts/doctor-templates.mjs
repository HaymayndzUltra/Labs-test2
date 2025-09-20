#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const roots = [
  'template-packs/frontend/nextjs/base',
  'template-packs/frontend/nuxt/base',
  'template-packs/frontend/angular/base',
  'template-packs/frontend/expo/base',
  'template-packs/backend/nestjs/base',
  'template-packs/backend/nestjs/prisma',
  'template-packs/backend/django/base',
  'template-packs/backend/fastapi/base',
  'template-packs/database/firebase/base/functions'
];

const readJSON = p => JSON.parse(fs.readFileSync(p,'utf8'));
const dep = pkg => n => (pkg.dependencies?.[n] || pkg.devDependencies?.[n]) || null;

let failed = false;

for (const dir of roots) {
  const pkgPath = path.join(dir, 'package.json');
  if (!fs.existsSync(pkgPath)) { 
    console.log(`[SKIP] ${dir} (no package.json)`); 
    continue; 
  }
  
  const pkg = readJSON(pkgPath);
  const d = dep(pkg);
  const errs = [];

  // Common validations
  if (!pkg.engines?.node) {
    errs.push('Missing engines.node (require >=20.10.0)');
  }
  
  if (!fs.existsSync(path.join(dir, 'package-lock.json')) &&
      !fs.existsSync(path.join(dir, 'pnpm-lock.yaml')) &&
      !fs.existsSync(path.join(dir, 'yarn.lock'))) {
    errs.push('Missing lockfile (templates must be deterministic)');
  }

  // Next.js template (Babel + Jest30 only)
  if (dir.includes('/frontend/nextjs/')) {
    const hasBabelrc = fs.existsSync(path.join(dir, '.babelrc'));
    const hasTsJest = !!d('ts-jest');
    const jest = d('jest') || '';
    const babelJest = d('babel-jest') || '';
    
    if (!hasBabelrc) {
      errs.push('Next: .babelrc missing (Babel pipeline required)');
    }
    if (hasTsJest) {
      errs.push('Next: ts-jest must NOT be present (use Babel path)');
    }
    if (!jest.startsWith('^30')) {
      errs.push('Next: jest must be ^30');
    }
    if (!babelJest?.startsWith('^30')) {
      errs.push('Next: babel-jest must be ^30');
    }
    if (!d('@babel/preset-typescript')) {
      errs.push('Next: @babel/preset-typescript required for tests');
    }
  }

  // Nuxt 4 template (Vitest only, ESM)
  if (dir.includes('/frontend/nuxt/')) {
    if (pkg.type !== 'module') {
      errs.push('Nuxt: set "type":"module"');
    }
    if (!d('vitest')) {
      errs.push('Nuxt: vitest required');
    }
    if (d('jest') || d('babel-jest') || d('ts-jest')) {
      errs.push('Nuxt: remove all Jest deps');
    }
  }

  // Angular
  if (dir.includes('/frontend/angular/')) {
    if (!d('karma') || !d('jasmine-core')) {
      errs.push('Angular: karma/jasmine-core required');
    }
  }

  // Expo
  if (dir.includes('/frontend/expo/')) {
    if (!d('expo')) {
      errs.push('Expo: expo dependency required');
    }
    if (!d('react-native')) {
      errs.push('Expo: react-native required');
    }
  }

  // NestJS
  if (dir.includes('/backend/nestjs/')) {
    if (!d('@nestjs/core')) {
      errs.push('Nest: @nestjs/core required');
    }
  }

  // Firebase functions: single ESLint config
  if (dir.includes('/database/firebase/base/functions')) {
    const hasJs = fs.existsSync(path.join(dir, '.eslintrc.js'));
    const hasJson = fs.existsSync(path.join(dir, '.eslintrc.json'));
    if (hasJs && hasJson) {
      errs.push('Firebase: choose one ESLint config (.js or .json)');
    }
  }

  if (errs.length) {
    failed = true;
    console.error(`\n[FAIL] ${dir}\n- ${errs.join('\n- ')}`);
  } else {
    console.log(`[OK] ${dir}`);
  }
}

process.exit(failed ? 1 : 0);
