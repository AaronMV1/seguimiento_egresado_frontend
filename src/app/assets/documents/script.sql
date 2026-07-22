

--#region       CREATE SCHEMA


CREATE SCHEMA IF NOT EXISTS seguimiento_egresado;


--#endregion


--#region       CREATE TABLES


CREATE TABLE IF NOT EXISTS seguimiento_egresado.sede (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    fecha_modificacion TIMESTAMPTZ,
    activo BOOLEAN DEFAULT TRUE
);


CREATE TABLE IF NOT EXISTS seguimiento_egresado.facultad (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    fecha_modificacion TIMESTAMPTZ,
    activo BOOLEAN DEFAULT TRUE
);


CREATE TABLE IF NOT EXISTS seguimiento_egresado.carrera (
    id BIGSERIAL PRIMARY KEY,
    facultad_id BIGINT REFERENCES seguimiento_egresado.facultad(id),
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    fecha_modificacion TIMESTAMPTZ,
    activo BOOLEAN DEFAULT TRUE
);


CREATE TABLE IF NOT EXISTS seguimiento_egresado.egresado (
    egresado_id BIGSERIAL PRIMARY KEY,
    tipo_documento VARCHAR(20),
    numero_documento VARCHAR(20),
    nombres_apellidos VARCHAR(100),
    genero VARCHAR(10),
    sede_id BIGINT REFERENCES seguimiento_egresado.sede(id),
    facultad_id BIGINT REFERENCES seguimiento_egresado.facultad(id),
    carrera_id BIGINT REFERENCES seguimiento_egresado.carrera(id),
    anio_egreso INTEGER,
    correo_institucional VARCHAR(100),
    correo_electronico VARCHAR(100),
    numero_celular VARCHAR(15),
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    fecha_modificacion TIMESTAMPTZ
);


CREATE TABLE IF NOT EXISTS seguimiento_egresado.seguimiento (
    seguimiento_id BIGSERIAL PRIMARY KEY,                                                                                           -- Identificador único del registro de seguimiento.
    egresado_id BIGINT NOT NULL REFERENCES seguimiento_egresado.egresado(egresado_id),                                              -- Egresado al que pertenece este seguimiento.
    fase SMALLINT NOT NULL CHECK (fase BETWEEN 1 AND 4),                                                                            -- Fase respondida (1=Información, 2=Formación, 3=Autocapacitación, 4=Innovación).
    anio_seguimiento INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER,                                             -- Año en que el egresado respondió esta fase.
    fecha_inicio TIMESTAMPTZ NOT NULL DEFAULT NOW(),                                                                                -- Fecha y hora en que inició la encuesta.
    fecha_fin TIMESTAMPTZ,                                                                                                          -- Fecha y hora en que finalizó la encuesta.
    completado BOOLEAN NOT NULL DEFAULT FALSE,                                                                                      -- Indica si el egresado terminó completamente la encuesta.
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),                                                                              -- Fecha de creación del registro.
    fecha_modificacion TIMESTAMPTZ,                                                                                                 -- Última modificación del registro.
    activo BOOLEAN NOT NULL DEFAULT TRUE,                                                                                           -- Permite realizar eliminaciones lógicas.
    CONSTRAINT uq_seguimiento_egresado_fase_anio UNIQUE (egresado_id, fase, anio_seguimiento)                                       -- Evita que un egresado responda dos veces la misma fase en el mismo año.
);


CREATE TABLE IF NOT EXISTS seguimiento_egresado.seguimiento_fase_1 (

    seguimiento_fase_1_id BIGSERIAL PRIMARY KEY,                                                                                    -- Identificador único de las respuestas de la fase 1.
    seguimiento_id BIGINT NOT NULL UNIQUE REFERENCES seguimiento_egresado.seguimiento(seguimiento_id) ON DELETE CASCADE,            -- Seguimiento al que pertenecen estas respuestas.

    fase1_participacion VARCHAR(50) NOT NULL,                                                                                       -- Frecuencia con la que participa en cursos o talleres de empleabilidad organizados por la universidad.
    fase1_situacion VARCHAR(150) NOT NULL,                                                                                          -- Situación actual del egresado (trabajando, estudiando, emprendiendo, etc.).
    fase1_trabajando VARCHAR(150) NOT NULL,                                                                                         -- Relación del trabajo actual con la carrera profesional.
    fase1_primerempleo VARCHAR(150) NOT NULL,                                                                                       -- Tiempo que tardó en conseguir el primer empleo relacionado con su profesión.
    fase1_medios VARCHAR(200) NOT NULL,                                                                                             -- Medio por el cual consiguió el empleo actual.

    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),                                                                              -- Fecha de creación.
    fecha_modificacion TIMESTAMPTZ                                                                                                  -- Última modificación.
);


CREATE TABLE IF NOT EXISTS seguimiento_egresado.seguimiento_fase_2 (
    seguimiento_fase_2_id BIGSERIAL PRIMARY KEY,                                                                                    -- Identificador único de las respuestas de la fase 2.
    seguimiento_id BIGINT NOT NULL UNIQUE REFERENCES seguimiento_egresado.seguimiento(seguimiento_id) ON DELETE CASCADE,            -- Seguimiento al que pertenece.

    fase2_satisfaccionestudios VARCHAR(50) NOT NULL,                                                                                 -- Nivel de satisfacción con los conocimientos adquiridos durante la formación profesional.
    fase2_participacion BOOLEAN NOT NULL,                                                                                            -- Indica si participó en procesos de gestión curricular.
    fase2_satisfaccionservicio VARCHAR(50) NOT NULL,                                                                                 -- Nivel de satisfacción con el servicio educativo brindado por la universidad.
    fase2_planificacion BOOLEAN NOT NULL,                                                                                            -- Indica si participó en procesos de planificación estratégica.
    fase2_empresanombre VARCHAR(200),                                                                                                -- Empresa donde actualmente labora.
    fase2_empresaempleadornombre VARCHAR(150),                                                                                       -- Nombre del jefe inmediato.
    fase2_empresaempleadorcorreo VARCHAR(150),                                                                                       -- Correo electrónico del jefe inmediato.
    fase2_empresaempleadornumero VARCHAR(150),                                                                                       -- Número de contacto del jefe inmediato.

    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),                                                                              -- Fecha de creación.
    fecha_modificacion TIMESTAMPTZ                                                                                                  -- Última modificación.
);



CREATE TABLE IF NOT EXISTS seguimiento_egresado.seguimiento_fase_3 (
    seguimiento_fase_3_id BIGSERIAL PRIMARY KEY,                                                                                    -- Identificador único de las respuestas de la fase 3.
    seguimiento_id BIGINT NOT NULL UNIQUE REFERENCES seguimiento_egresado.seguimiento(seguimiento_id) ON DELETE CASCADE,            -- Seguimiento al que pertenece.

    fase3_especialidad VARCHAR(100) NOT NULL,                                                                                       -- Mayor nivel de especialización alcanzado (diplomado, maestría, doctorado, etc.).
    fase3_participacion VARCHAR(50) NOT NULL,                                                                                       -- Frecuencia de participación en cursos de educación continua.
    fase3_educacioncontinua VARCHAR(150) NOT NULL,                                                                                  -- Principal necesidad de capacitación o educación continua.

    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),                                                                              -- Fecha de creación.
    fecha_modificacion TIMESTAMPTZ                                                                                                  -- Última modificación.
);


CREATE TABLE IF NOT EXISTS seguimiento_egresado.seguimiento_fase_4 (
    seguimiento_fase_4_id BIGSERIAL PRIMARY KEY,                                                                                    -- Identificador único de las respuestas de la fase 4.
    seguimiento_id BIGINT NOT NULL UNIQUE REFERENCES seguimiento_egresado.seguimiento(seguimiento_id) ON DELETE CASCADE,            -- Seguimiento al que pertenece.

    fase4_investigacion BOOLEAN NOT NULL,                                                                                           -- Indica si actualmente realiza actividades de investigación.
    fase4_innovacion VARCHAR(50) NOT NULL,                                                                                          -- Frecuencia con la que participa en capacitaciones relacionadas con investigación o innovación.
    fase4_satisfaccion VARCHAR(50) NOT NULL,                                                                                        -- Nivel de satisfacción con las capacitaciones recibidas sobre investigación e innovación.

    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),                                                                              -- Fecha de creación.
    fecha_modificacion TIMESTAMPTZ                                                                                                  -- Última modificación.
);


--#endregion


--#region       INSERT DATA


INSERT INTO seguimiento_egresado.sede
    (nombre)
VALUES
    ('Sede Lima'),
    ('Filial Ica'),
    ('Filial Chincha');


INSERT INTO seguimiento_egresado.facultad
    (nombre)
VALUES
    ('Ciencias de la Salud'),
    ('Ingenierías'),
    ('Derecho y Ciencias Empresariales'),
    ('Comunicación y Ciencias Administrativas');


INSERT INTO seguimiento_egresado.carrera
    (facultad_id, nombre)
VALUES
    (1, 'Medicina Humana'),
    (1, 'Enfermería'),
    (1, 'Estomatología'),
    (1, 'Psicología'),
    (1, 'Tecnología Médica en Laboratorio Clínico y Anatomía Patológica'),
    (1, 'Tecnología Médica en Terapia Física y Rehabilitación'),
    (1, 'Medicina Veterinaria y Zootecnia'),
    (2, 'Ingeniería de Sistemas'),
    (2, 'Ingeniería Civil'),
    (2, 'Ingeniería Agroindustrial'),
    (2, 'Ingeniería en Enología y Viticultura'),
    (3, 'Derecho'),
    (3, 'Contabilidad'),
    (3, 'Administración de Empresas'),
    (3, 'Administración y Negocios Internacionales'),
    (3, 'Administración y Marketing'),
    (3, 'Turismo, Hotelería y Gastronomía'),
    (4, 'Ciencias de la Comunicación')


--#endregion


--#region       SELECT DATA


SELECT * FROM seguimiento_egresado.sede;
SELECT * FROM seguimiento_egresado.facultad;
SELECT * FROM seguimiento_egresado.carrera;
SELECT * FROM seguimiento_egresado.egresado;


--#endregion


--#region       DROP TABLES


DROP TABLE IF EXISTS seguimiento_egresado.sede;
DROP TABLE IF EXISTS seguimiento_egresado.facultad;
DROP TABLE IF EXISTS seguimiento_egresado.carrera;
DROP TABLE IF EXISTS seguimiento_egresado.egresado;


--#endregion


--#region       TRUNCATE TABLES


TRUNCATE TABLE IF EXISTS seguimiento_egresado.sede;
TRUNCATE TABLE IF EXISTS seguimiento_egresado.facultad;
TRUNCATE TABLE IF EXISTS seguimiento_egresado.carrera;
TRUNCATE TABLE IF EXISTS seguimiento_egresado.egresado;


--#endregion

