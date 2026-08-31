# Transformación de Datos: Microsoft Forms → Base de Datos PostgreSQL

## 📊 Resumen de la Transformación

Se ha generado exitosamente un script SQL con los datos del Excel **Encuesta.xlsx** (respuestas de Microsoft Forms) homologados a la estructura de la base de datos **Seguimiento Egresado**.

### Estadísticas:
- **Total de Egresados**: 454
- **Total de Registros de Seguimiento**: 454
- **Registros Fase 1 (Información)**: 151
- **Registros Fase 2 (Formación)**: 165
- **Registros Fase 3 (Autocapacitación)**: 124
- **Registros Fase 4 (Innovación)**: 14

---

## 📂 Archivo Generado

**Ubicación**: `src/app/assets/documents/inserts_generados.sql`

---

## 🔄 Homologación Realizada

### Mapeo de Datos:

#### 1. **Tabla Egresado**
| Campo Excel | Campo BD | Transformación |
|------------|----------|--|
| Ingrese su N° de DNI | numero_documento | Directo |
| Ingrese sus nombres y apellidos | nombres_apellidos | Directo |
| Género | genero | M/F (Masculino/Femenino) |
| ¿En qué sede/filial estudió? | sede_id | Local Chorrillos→1, Filial Ica→2, Filial Chincha→3 |
| Indique a que Escuela Profesional | carrera_id + facultad_id | Mapeo a tabla carrera |
| Seleccione su Año de Egreso | anio_egreso | Directo |
| Ingrese su correo personal | correo_electronico | Directo |
| Ingrese número de celular | numero_celular | Directo |
| tipo_documento | '01' | DNI (fijo) |

#### 2. **Tabla Seguimiento**
| Campo | Valor | Lógica |
|-------|-------|--------|
| fase | 1, 2, 3 ó 4 | Basada en años desde egreso: ≥5 años→Fase 1; 3-4→Fase 2; 1-2→Fase 3; 0→Fase 4 |
| anio_seguimiento | 2026 | Año actual |

#### 3. **Tablas Fase 1-4**
Se mapean automáticamente las respuestas de cada pregunta de la encuesta a los campos correspondientes en las tablas `seguimiento_fase_1`, `seguimiento_fase_2`, `seguimiento_fase_3` y `seguimiento_fase_4`.

---

## 📋 Mapeo de Carreras

| Carrera | Facultad ID | Carrera ID |
|---------|-------------|-----------|
| Medicina Humana | 1 | 1 |
| Enfermería | 1 | 2 |
| Estomatología | 1 | 3 |
| Psicología | 1 | 4 |
| Tecnología Médica | 1 | 5 |
| Medicina Veterinaria y Zootecnia | 1 | 7 |
| Ingeniería de Sistemas | 2 | 8 |
| Ingeniería Civil | 2 | 9 |
| Ingeniería Agroindustrial | 2 | 10 |
| Derecho | 3 | 12 |
| Contabilidad | 3 | 13 |
| Administración de Empresas | 3 | 14 |
| Administración de Negocios | 3 | 15 |
| Turismo, Hotelería y Gastronomía | 3 | 17 |
| Ciencias de la Comunicación | 4 | 18 |

---

## 🚀 Cómo Utilizar el Script

### Opción 1: En pgAdmin
1. Abre **pgAdmin**
2. Conecta a tu servidor PostgreSQL
3. Selecciona la base de datos **seguimiento_egresado**
4. Abre la herramienta **Query Tool**
5. Copia el contenido de `inserts_generados.sql`
6. Ejecuta el script

### Opción 2: En Terminal/CLI
```bash
psql -U usuario -d seguimiento_egresado -f inserts_generados.sql
```

### Opción 3: Desde aplicación backend
Ejecuta el script SQL desde el servicio JdbcTemplate de Spring Boot o similar.

---

## ⚙️ Consideraciones

### Datos Capturados:
- ✅ Información personal del egresado
- ✅ Datos de contacto (email, teléfono)
- ✅ Información académica (sede, facultad, carrera, año)
- ✅ Respuestas de encuesta por fase

### Validaciones Aplicadas:
- ✅ Limpieza de espacios en blanco
- ✅ Escapado de comillas simples en valores de texto
- ✅ Mapeo automático de facultades y carreras
- ✅ Conversión de tipos de datos

### Notas Importantes:
- El script respeta las restricciones de integridad referencial
- Los valores NULL se insertan para campos vacíos
- Las fases se calculan automáticamente según año de egreso
- El año de seguimiento se establece en 2026

---

## 📝 Estructura del Script

El archivo `inserts_generados.sql` contiene 4 secciones:

1. **INSERT EGRESADO** - 454 registros
2. **INSERT SEGUIMIENTO** - 454 registros
3. **INSERT SEGUIMIENTO_FASE_X** - Distribuido por fase
4. Comentarios y documentación

---

## ✅ Verificación Post-Inserción

Después de ejecutar el script, puedes verificar los datos:

```sql
-- Contar egresados por fase
SELECT f.phase, COUNT(*) as cantidad
FROM seguimiento_egresado.seguimiento s
GROUP BY s.fase
ORDER BY s.fase;

-- Ver egresados por carrera
SELECT c.nombre, COUNT(*) as cantidad
FROM seguimiento_egresado.egresado e
JOIN seguimiento_egresado.carrera c ON e.carrera_id = c.id
GROUP BY c.nombre
ORDER BY cantidad DESC;

-- Validar datos completos
SELECT COUNT(*) FROM seguimiento_egresado.egresado;
SELECT COUNT(*) FROM seguimiento_egresado.seguimiento;
SELECT COUNT(*) FROM seguimiento_egresado.seguimiento_fase_1;
SELECT COUNT(*) FROM seguimiento_egresado.seguimiento_fase_2;
```

---

## 📞 Soporte

Si encuentras inconsistencias o errores:
1. Revisa el archivo de log del servidor PostgreSQL
2. Verifica que los IDs de carreras existan en la BD
3. Asegúrate de que la base de datos está vacía o preparada para el insert

---

**Generado**: 31/08/2026
**Herramienta**: Script Node.js con librería XLSX
**Formato**: SQL Standard (PostgreSQL compatible)
