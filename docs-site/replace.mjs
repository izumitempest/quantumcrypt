import fs from 'fs';

const path = 'src/pages/DocsContent.tsx';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(/text-slate-600/g, 'text-slate-700');
fs.writeFileSync(path, content);
console.log('Done');
