const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const root = process.cwd();
const skipped = new Set(['node_modules', 'dist', '.git']);
const extensions = new Set(['.png', '.jpg', '.jpeg']);
const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && !skipped.has(entry.name)) walk(path.join(dir, entry.name));
    else if (entry.isFile() && extensions.has(path.extname(entry.name).toLowerCase())) files.push(path.join(dir, entry.name));
  }
}
walk(root);
(async () => {
  for (const file of files) {
    const before = await sharp(file).metadata();
    const output = file.slice(0, -path.extname(file).length) + '.webp';
    await sharp(file).webp({ lossless: true }).toFile(output);
    const after = await sharp(output).metadata();
    if (before.width !== after.width || before.height !== after.height) throw new Error('Dimension mismatch: ' + file);
    fs.unlinkSync(file);
    console.log(path.relative(root, file) + ' -> ' + path.relative(root, output) + ' [' + before.width + 'x' + before.height + ']');
  }
  console.log('Converted ' + files.length + ' raster assets.');
})().catch((error) => { console.error(error); process.exit(1); });
