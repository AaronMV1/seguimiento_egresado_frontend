

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
    egresadoId PRIMARY KEY,
    dni INTEGER,
    nombres VARCHAR(100),
    apellido_paterno VARCHAR(100),
    apellido_materno VARCHAR(100),
    genero VARCHAR(10),
    correo_institucional VARCHAR(100),
    correo_personal VARCHAR(100),
    celular_personal VARCHAR(15),
    sede_id BIGINT REFERENCES sede(id),
    facultad_id BIGINT REFERENCES facultad(id),
    carrera_id BIGINT REFERENCES carrera(id),
    anio_egreso INTEGER,
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    fecha_modificacion TIMESTAMPTZ
);


--#endregion


--#region       INSERT DATA


INSERT INTO seguimiento_egresado.sede
    (nombre)
VALUES
    ('Sede Chorrillos'),
    ('Sede San Borja'),
    ('Filial Ica'),
    ('Filial Chincha'),
    ('Otro (Lima Norte, etc.)');


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
    (1, 'Odontología'),
    (1, 'Psicología'),
    (1, 'Tecnología Médica'),
    (1, 'Medicina Veterinaria'),
    (2, 'Ingeniería de Sistemas'),
    (2, 'Ingeniería Civil'),
    (2, 'Ingeniería Agroindustrial'),
    (2, 'Ingeniería en Enología y Viticultura'),
    (3, 'Derecho'),
    (3, 'Contabilidad'),
    (3, 'Administración de Empresas'),
    (3, 'Administración de Negocios Internacionales'),
    (3, 'Administración y Marketing'),
    (4, 'Ciencias de la Comunicación'),
    (4, 'Turismo, Hotelería y Gastronomía');


--#endregion


--#region       SELECT DATA


SELECT * FROM seguimiento_egresado.sede;
SELECT * FROM seguimiento_egresado.facultad;
SELECT * FROM seguimiento_egresado.carrera;
SELECT * FROM seguimiento_egresado.egresado;


--#endregion


--#region       DROP TABLES


DROP TABLE IF EXISTS seguimiento_egresado.sede;
DROP TABLE IF EXISTS seguimiento_egresado.carrera;
DROP TABLE IF EXISTS seguimiento_egresado.facultad;
DROP TABLE IF EXISTS seguimiento_egresado.egresado;


--#endregion

