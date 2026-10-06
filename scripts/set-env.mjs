// Lê o arquivo .env (mesmas variáveis do projeto React) e gera src/environments/environment.ts
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';

const vars = { ...process.env };
if (existsSync('.env')) {
  for (const line of readFileSync('.env', 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([\w.]+)\s*=\s*(.*?)\s*$/);
    if (m && !line.trim().startsWith('#')) vars[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
}

const url = vars.VITE_SUPABASE_URL ?? vars.SUPABASE_URL ?? '';
const key = vars.VITE_SUPABASE_ANON_KEY ?? vars.SUPABASE_ANON_KEY ?? '';

if (!url || !key) {
  console.warn('⚠️  VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY não encontrados no .env — o login não vai funcionar.');
}

mkdirSync('src/environments', { recursive: true });
writeFileSync(
  'src/environments/environment.ts',
  `// ARQUIVO GERADO por scripts/set-env.mjs — não edite nem versione.\nexport const environment = {\n  supabaseUrl: ${JSON.stringify(url)},\n  supabaseAnonKey: ${JSON.stringify(key)},\n};\n`,
);
console.log('✔ src/environments/environment.ts gerado');
