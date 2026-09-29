const fs = require('fs');
const html = fs.readFileSync('IQVIA_MAT_Jul_Dashboard.html', 'utf8');

const startTag = '<script type="application/json" id="iqvia-data">';
const endTag = '</script>';
const sIdx = html.indexOf(startTag);
if (sIdx === -1) {
  console.log('startTag not found!');
  process.exit(1);
}
const contentStart = sIdx + startTag.length;
const eIdx = html.indexOf(endTag, contentStart);
const jsonStr = html.substring(contentStart, eIdx).trim();

console.log('JSON length:', jsonStr.length);
try {
  const data = JSON.parse(jsonStr);
  console.log('Successfully parsed rows:', data.length);
  console.log('Sample row 0:', data[0]);

  // Let's check Zurcal or top rows
  const zurcalRows = data.filter(r => r[1].toLowerCase().includes('zurcal'));
  console.log('Zurcal rows count:', zurcalRows.length);
  if (zurcalRows.length > 0) {
    console.log('Sample Zurcal row:', zurcalRows[0]);
  }
} catch (e) {
  console.error('JSON parse error:', e);
}
