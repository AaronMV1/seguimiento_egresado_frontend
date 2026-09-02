


SELECT * FROM seguimiento_egresado.sede;
SELECT * FROM seguimiento_egresado.facultad;
SELECT * FROM seguimiento_egresado.carrera;
SELECT * FROM seguimiento_egresado.egresado;
SELECT * FROM seguimiento_egresado.administrador;
SELECT count(*) FROM seguimiento_egresado.egresado;


SELECT * FROM seguimiento_egresado.egresado;
SELECT * FROM seguimiento_egresado.seguimiento;
SELECT * FROM seguimiento_egresado.seguimiento_fase_1;
SELECT * FROM seguimiento_egresado.seguimiento_fase_2;
SELECT * FROM seguimiento_egresado.seguimiento_fase_3;
SELECT * FROM seguimiento_egresado.seguimiento_fase_4;


SELECT * FROM seguimiento_egresado.egresado WHERE numero_documento = '75116260';
SELECT * FROM seguimiento_egresado.seguimiento WHERE egresado_id = 44;


TRUNCATE TABLE seguimiento_egresado.sede     RESTART IDENTITY CASCADE;
TRUNCATE TABLE seguimiento_egresado.facultad RESTART IDENTITY CASCADE;
TRUNCATE TABLE seguimiento_egresado.carrera  RESTART IDENTITY CASCADE;
TRUNCATE TABLE seguimiento_egresado.egresado RESTART IDENTITY CASCADE;

