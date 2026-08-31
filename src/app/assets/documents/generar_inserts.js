const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Leer el Excel
const excelFile = path.join(__dirname, 'Encuesta.xlsx');
const workbook = XLSX.readFile(excelFile);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(sheet);

console.log(`Total de registros: ${data.length}\n`);

// Mapeo de sedes
const sedesMap = {
  'Local Chorrillos': 1,
  'Filial Ica': 2,
  'Filial Chincha': 3
};

// Mapeo de facultades
const facultadesMap = {
  'Facultad de Ciencias de la Salud': 1,
  'Facultad de Ingenierías': 2,
  'Facultad de Derecho y Ciencias Empresariales': 3,
  'Facultad de Comunicación y Ciencias Administrativas': 4
};

// Mapeo de carreras
const carrerasMap = {
  'Medicina Humana': 1,
  'Enfermería': 2,
  'Estomatología': 3,
  'Psicología': 4,
  'Tecnología Médica en Laboratorio Clínico y Anatomía Patológica': 5,
  'Tecnología Médica en Terapia Física y Rehabilitación': 6,
  'Medicina Veterinaria y Zootecnia': 7,
  'Ingeniería de Sistemas': 8,
  'Ingeniería Civil': 9,
  'Ingeniería Agroindustrial': 10,
  'Ingeniería en Enología y Viticultura': 11,
  'Derecho': 12,
  'Contabilidad': 13,
  'Administración de Empresas': 14,
  'Administración y Negocios Internacionales': 15,
  'Administración y Marketing': 16,
  'Turismo, Hotelería y Gastronomía': 17,
  'Ciencias de la Comunicación': 18
};

// Función para escapar strings SQL
function escapeSql(str) {
  if (!str) return 'NULL';
  if (typeof str !== 'string') str = String(str);
  return "'" + str.replace(/'/g, "''") + "'";
}

// Función para obtener tipo de documento
function getTipoDocumento(genero) {
  return '01'; // DNI - siempre 01
}

// Función para mapear genero
function mapGenero(generoForm) {
  if (!generoForm) return 'M';
  const lower = generoForm.toLowerCase();
  if (lower.includes('mas') || lower === 'm') return 'M';
  if (lower.includes('fem') || lower === 'f') return 'F';
  return 'M';
}

// Generar INSERTs para egresados y seguimientos
let insertEgresados = 'INSERT INTO seguimiento_egresado.egresado (tipo_documento, numero_documento, nombres_apellidos, genero, sede_id, facultad_id, carrera_id, anio_egreso, correo_electronico, numero_celular) VALUES\n';
let insertSeguimientos = 'INSERT INTO seguimiento_egresado.seguimiento (egresado_id, fase, anio_seguimiento) VALUES\n';
let insertFase1 = 'INSERT INTO seguimiento_egresado.seguimiento_fase_1 (seguimiento_id, fase1_participacion, fase1_situacion, fase1_trabajando, fase1_primerempleo, fase1_medios) VALUES\n';
let insertFase2 = 'INSERT INTO seguimiento_egresado.seguimiento_fase_2 (seguimiento_id, fase2_satisfaccionestudios, fase2_participacion, fase2_satisfaccionservicio, fase2_planificacion, fase2_empresanombre, fase2_empresaempleadornombre, fase2_empresaempleadorcorreo, fase2_empresaempleadornumero) VALUES\n';
let insertFase3 = 'INSERT INTO seguimiento_egresado.seguimiento_fase_3 (seguimiento_id, fase3_especialidad, fase3_participacion, fase3_educacioncontinua) VALUES\n';
let insertFase4 = 'INSERT INTO seguimiento_egresado.seguimiento_fase_4 (seguimiento_id, fase4_investigacion, fase4_participacion, fase4_resultados, fase4_innovacion, fase4_capacitacion, fase4_formacion) VALUES\n';

const egresadosValues = [];
const seguimientosValues = [];
const fase1Values = [];
const fase2Values = [];
const fase3Values = [];
const fase4Values = [];

let egresadoId = 1;
let seguimientoId = 1;

data.forEach((row, index) => {
  if (!row['Ingrese su N° de DNI']) return; // Saltar filas vacías

  try {
    // Datos básicos del egresado
    const tipoDocumento = getTipoDocumento(row['Género']);
    const numeroDocumento = String(row['Ingrese su N° de DNI']).trim();
    const nombresApellidos = row['Ingrese sus nombres y apellidos'] || row['Nombre'] || 'Desconocido';
    const genero = mapGenero(row['Género']);

    const sedeKey = row['¿En que sede /filial estudió?'] || '';
    const sedeId = sedesMap[sedeKey] || 1;

    const facultadKey = row['Indique a que Escuela Profesional pertenece'] || '';
    const facultadId = facultadesMap[facultadKey] || 1;

    const carreraKey = facultadKey; // La carrera está en la misma columna
    const carreraId = carrerasMap[carreraKey] || 1;

    const anioEgreso = parseInt(row['Seleccione su Año de Egreso']) || 2024;
    const correoElectronico = row['Ingrese su correo electrónico personal'] || '';
    const numeroCelular = String(row['Ingrese número de celular actualizado'] || '').trim();

    // INSERT EGRESADO
    const egresadoValue = `(${escapeSql(tipoDocumento)}, ${escapeSql(numeroDocumento)}, ${escapeSql(nombresApellidos)}, ${escapeSql(genero)}, ${sedeId}, ${facultadId}, ${carreraId}, ${anioEgreso}, ${escapeSql(correoElectronico)}, ${escapeSql(numeroCelular)})`;
    egresadosValues.push(egresadoValue);

    // Determinar fase basada en año de egreso
    const anioActual = new Date().getFullYear();
    let fase = 1;
    const aniosDesdeEgreso = anioActual - anioEgreso;

    if (aniosDesdeEgreso >= 5) fase = 1;
    else if (aniosDesdeEgreso >= 3) fase = 2;
    else if (aniosDesdeEgreso >= 1) fase = 3;
    else fase = 4;

    // INSERT SEGUIMIENTO
    const seguimientoValue = `(${egresadoId}, ${fase}, ${anioActual})`;
    seguimientosValues.push(seguimientoValue);

    // Datos por fase
    if (fase === 1) {
      const fase1_participacion = row['Usted participa en cursos de y/o talleres de empleabilidad organizados por la UPSJB SAC:'] || '';
      const fase1_situacion = row['Su situación actual es:'] || '';
      const fase1_trabajando = row['Actualmente, usted se encuentra trabajando:'] || '';
      const fase1_primerempleo = row['El primer empleo vinculado directamente a su profesión lo consiguió:'] || '';
      const fase1_medios = row['¿Cuál de esos medios le permitió conseguir su empleo actual?'] || '';

      const fase1Value = `(${seguimientoId}, ${escapeSql(fase1_participacion)}, ${escapeSql(fase1_situacion)}, ${escapeSql(fase1_trabajando)}, ${escapeSql(fase1_primerempleo)}, ${escapeSql(fase1_medios)})`;
      fase1Values.push(fase1Value);
    }

    if (fase === 2) {
      const fase2_satisfaccionestudios = row['Satisfacción con la utilidad de los conocimientos adquiridos durante su formación en la UPSJB SAC respecto al empleo'] || '';
      const fase2_participacion = row['Usted forma parte o ha participado en los procesos de gestión curricular.'] || '';
      const fase2_satisfaccionservicio = row['¿Qué tan satisfecho se encuentra usted con el servicio educativo brindado por la UPSJB SAC, durante su formación?'] || '';
      const fase2_planificacion = row['Usted forma parte o ha participado en la planificación estratégica.'] || '';
      const fase2_empresanombre = row['Indícanos el nombre de la Empresa en la que actualmente labora:'] || '';
      const fase2_empresaempleadornombre = row['Compartenos el nombre de su jefe inmediato'] || '';
      const fase2_empresaempleadorcorreo = row['Compartanos el correo de su jefe inmediato'] || '';
      const fase2_empresaempleadornumero = row['Mencione actualmente el número de contacto de su jefe inmediato'] || '';

      const fase2Value = `(${seguimientoId}, ${escapeSql(fase2_satisfaccionestudios)}, ${escapeSql(fase2_participacion)}, ${escapeSql(fase2_satisfaccionservicio)}, ${escapeSql(fase2_planificacion)}, ${escapeSql(fase2_empresanombre)}, ${escapeSql(fase2_empresaempleadornombre)}, ${escapeSql(fase2_empresaempleadorcorreo)}, ${escapeSql(fase2_empresaempleadornumero)})`;
      fase2Values.push(fase2Value);
    }

    if (fase === 3) {
      const fase3_especialidad = row['Mencione actualmente el nivel de especialidad o grados que ha logrado:'] || '';
      const fase3_participacion = row['Usted participa en cursos de educación continua o de especialidad organizados por la UPSJB SAC:'] || '';
      const fase3_educacioncontinua = row['¿Cuál sería actualmente la necesidad de educación continua que Usted como egresado de la UPSJB SAC, requiere?'] || '';

      const fase3Value = `(${seguimientoId}, ${escapeSql(fase3_especialidad)}, ${escapeSql(fase3_participacion)}, ${escapeSql(fase3_educacioncontinua)})`;
      fase3Values.push(fase3Value);
    }

    if (fase === 4) {
      const fase4_investigacion = row['Desde su egreso, ¿ha participado en proyectos de investigación o innovación relacionados con su profesión?'] || '';
      const fase4_participacion = row['¿Cuál fue su participación? (Puede marcar más de una opción)'] || '';
      const fase4_resultados = row['¿Qué productos o resultados ha obtenido? (Puede marcar más de una opción)'] || '';
      const fase4_innovacion = row['Actualmente, ¿con qué frecuencia participa en actividades de investigación o innovación?'] || '';
      const fase4_capacitacion = row['Desde su egreso, ¿ha participado en capacitaciones sobre investigación o innovación organizadas por la UPSJB?'] || '';
      const fase4_formacion = row['La formación recibida en la UPSJB me brindó las competencias necesarias para desarrollar actividades de investigación e innovación en mi ámbito profesional.'] || '';

      const fase4Value = `(${seguimientoId}, ${escapeSql(fase4_investigacion)}, ${escapeSql(fase4_participacion)}, ${escapeSql(fase4_resultados)}, ${escapeSql(fase4_innovacion)}, ${escapeSql(fase4_capacitacion)}, ${escapeSql(fase4_formacion)})`;
      fase4Values.push(fase4Value);
    }

    egresadoId++;
    seguimientoId++;

  } catch (error) {
    console.error(`Error en fila ${index}:`, error.message);
  }
});

// Generar scripts SQL finales
let sqlOutput = '';

if (egresadosValues.length > 0) {
  insertEgresados += egresadosValues.join(',\n') + ';\n\n';
  sqlOutput += insertEgresados;
}

if (seguimientosValues.length > 0) {
  insertSeguimientos += seguimientosValues.join(',\n') + ';\n\n';
  sqlOutput += insertSeguimientos;
}

if (fase1Values.length > 0) {
  insertFase1 += fase1Values.join(',\n') + ';\n\n';
  sqlOutput += insertFase1;
}

if (fase2Values.length > 0) {
  insertFase2 += fase2Values.join(',\n') + ';\n\n';
  sqlOutput += insertFase2;
}

if (fase3Values.length > 0) {
  insertFase3 += fase3Values.join(',\n') + ';\n\n';
  sqlOutput += insertFase3;
}

if (fase4Values.length > 0) {
  insertFase4 += fase4Values.join(',\n') + ';\n\n';
  sqlOutput += insertFase4;
}

// Guardar en archivo
const outputFile = path.join(__dirname, 'inserts_generados.sql');
fs.writeFileSync(outputFile, sqlOutput);

console.log(`✓ INSERTs generados exitosamente en: ${outputFile}`);
console.log(`  - Egresados: ${egresadosValues.length}`);
console.log(`  - Seguimientos: ${seguimientosValues.length}`);
console.log(`  - Fase 1: ${fase1Values.length}`);
console.log(`  - Fase 2: ${fase2Values.length}`);
console.log(`  - Fase 3: ${fase3Values.length}`);
console.log(`  - Fase 4: ${fase4Values.length}`);
