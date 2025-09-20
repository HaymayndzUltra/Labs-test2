#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const templates = [
  'project_generator/template-packs/frontend/nextjs/base',
  'project_generator/template-packs/frontend/nuxt/base',
  'project_generator/template-packs/frontend/angular/base',
  'project_generator/template-packs/frontend/expo/base',
  'project_generator/template-packs/backend/nestjs/base',
  'project_generator/template-packs/backend/nestjs/prisma',
  'project_generator/template-packs/database/firebase/base/functions'
];

let failed = false;

for (const dir of templates) {
  const pkgPath = path.join(dir, 'package.json');
  const expPath = path.join(dir, 'expected-versions.json');
  
  if (!fs.existsSync(pkgPath) || !fs.existsSync(expPath)) {
    console.log(`[SKIP] ${dir} (missing package.json or expected-versions.json)`); 
    continue;
  }
  
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const exp = JSON.parse(fs.readFileSync(expPath, 'utf8'));

  const get = (obj, k) => obj?.[k];
  const diffs = [];

  for (const section of ['dependencies', 'devDependencies']) {
    const want = exp[section] || {};
    for (const [name, range] of Object.entries(want)) {
      const got = get(pkg[section], name);
      if (!got) {
        diffs.push(`${section}.${name} missing (want ${range})`);
      } else if (got !== range) {
        diffs.push(`${section}.${name} = ${got} (want ${range})`);
      }
    }
  }

  if (diffs.length) {
    failed = true;
    console.error(`\n[DIFF] ${dir}\n- ${diffs.join('\n- ')}`);
  } else {
    console.log(`[MATCH] ${dir}`);
  }
}

process.exit(failed ? 2 : 0);
