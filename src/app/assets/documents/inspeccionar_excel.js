const XLSX = require('xlsx');
const path = require('path');

const excelFile = path.join(__dirname, 'Encuesta.xlsx');
const workbook = XLSX.readFile(excelFile);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(sheet);

// Obtener columnas disponibles
console.log('COLUMNAS DISPONIBLES:');
const cols = Object.keys(data[0] || {});
cols.forEach((col, idx) => {
  console.log(`${idx + 1}. "${col}"`);
});

console.log('\n\n=== VALORES ÚNICOS EN COLUMNAS CLAVE ===\n');

// Escuelas profesionales
const escuelaKey = cols.find(c => c.includes('Escuela Profesional'));
const escuelas = new Set();
data.forEach(row => {
  if (row[escuelaKey]) escuelas.add(row[escuelaKey]);
});
console.log('Escuelas profesionales:');
Array.from(escuelas).forEach(e => console.log(`  - "${e}"`));

// Nombres
const nombresKey = cols.find(c => c.includes('nombres y apellidos'));
console.log(`\nPrimeros nombres (columna: "${nombresKey}"):`) ;
data.slice(0, 5).forEach((row, idx) => {
  if (row[nombresKey]) console.log(`  ${idx + 1}. ${row[nombresKey]}`);
});

// Correos
const correoKey = cols.find(c => c.includes('correo electrónico personal'));
console.log(`\nPrimeros correos (columna: "${correoKey}"):`) ;
data.slice(0, 5).forEach((row, idx) => {
  if (row[correoKey]) console.log(`  ${idx + 1}. ${row[correoKey]}`);
});

// Sedes
const sedeKey = cols.find(c => c.includes('sede /filial'));
const sedes = new Set();
data.forEach(row => {
  if (row[sedeKey]) sedes.add(row[sedeKey]);
});
console.log(`\nSedes (columna: "${sedeKey}"):`) ;
Array.from(sedes).forEach(s => console.log(`  - "${s}"`));

// Años
const anioKey = cols.find(c => c.includes('Año de Egreso'));
const anios = new Set();
data.forEach(row => {
  if (row[anioKey]) anios.add(row[anioKey]);
});
console.log(`\nAños (columna: "${anioKey}"):`) ;
Array.from(anios).sort().forEach(a => console.log(`  - ${a}`));

console.log(`\n✓ Total registros: ${data.length}`);
