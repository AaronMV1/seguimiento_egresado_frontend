

import { FormSection } from './formulario.models';
import { POLITICA_PRIVACIDAD_MESSAGE } from './formulario.constants';


export const FORMULARIO_SECTIONS: FormSection[] = [

    {
        id: 'consentimiento_informado',
        title: 'SECCIÓN 1: CONSENTIMIENTO INFORMADO',
        questions: [
            {
                id: 'terminos_condiciones',
                numero: 1,
                label:
                    'Autorizo a la UPSJB S.A.C. al tratamiento de mis datos personales de conformidad con la',
                link: {
                    text: 'Política de Privacidad',
                    action: 'popup',
                    popupTitle: 'Política de Privacidad',
                    popupMessage: POLITICA_PRIVACIDAD_MESSAGE,
                },
                type: 'radio',
                required: true,
                options: [
                    {
                        value: 'acepto',
                        text: 'Acepto',
                    },
                    {
                        value: 'no_acepto',
                        text: 'No acepto',
                        finishForm: true,
                    },
                ],
            },
        ],
    },

    {
        id: 'informacion_personal',
        title: 'SECCIÓN 2: INFORMACIÓN PERSONAL DEL EGRESADO',
        questions: [
            {
                id: 'tipoDocumentos',
                numero: 1,
                label: 'Seleccione el tipo de documento',
                type: 'select',
                required: true,
                placeholder: 'Seleccione una opción',
                options: [
                    { value: '01', text: 'DNI' },
                    { value: '04', text: 'Carné de extranjería' },
                    { value: '07', text: 'Pasaporte' },
                ],
            },
            {
                id: 'numeroDocumento',
                numero: 2,
                label: 'Ingrese el número de documento',
                type: 'text',
                required: true,
                placeholder: 'Escriba su respuesta',
                validators: {
                    pattern: '^[0-9]{8,15}$',
                },
                actionLabel: 'Validar datos',
            },
            {
                id: 'nombresApellidos',
                numero: 3,
                label: 'Por favor ingrese sus nombres y apellidos',
                type: 'text',
                required: true,
                // disabled: true,
                placeholder: 'Escriba su respuesta',
                validators: {
                    minLength: 5,
                },
            },
            {
                id: 'dni',
                numero: 4,
                label: 'Ingrese su DNI',
                type: 'text',
                required: true,
                // disabled: true,
                placeholder: 'Escriba su respuesta',
                validators: {
                    pattern: '^[0-9]{8}$',
                },
            },
            {
                id: 'sexo',
                numero: 5,
                label: 'Sexo',
                type: 'radio',
                required: true,
                // disabled: true,
                options: [
                    { value: 'masculino', text: 'Masculino' },
                    { value: 'femenino', text: 'Femenino' },
                ],
            },
            {
                id: 'sede',
                numero: 6,
                label: '¿En qué sede/filial estudió?',
                type: 'radio',
                required: true,
                // disabled: true,
                options: [],
                dashboard: {
                    enabled: true,
                    chartType: 'pie',
                    title: 'Sede/Filial donde estudió',
                },
            },
            {
                id: 'facultad',
                numero: 7,
                label: '¿Qué facultad estudió?',
                type: 'select',
                required: true,
                options: [
                    { value: 'ciencias_salud', text: 'Ciencias de la Salud' },
                    { value: 'ingenierias', text: 'Ingenierías' },
                    { value: 'derecho_empresariales', text: 'Derecho y Ciencias Empresariales' },
                    { value: 'comunicacion_admin', text: 'Comunicación y Ciencias Administrativas' },
                ],
            },
            {
                id: 'carrera',
                numero: 8,
                label: '¿Qué carrera estudió?',
                type: 'select',
                required: true,
                placeholder: 'Primero seleccione una facultad',
                dependsOnQuestionId: 'facultad',
                optionsByValue: {
                    ciencias_salud: [
                        { value: 'medicina_humana', text: 'Medicina Humana' },
                        { value: 'enfermeria', text: 'Enfermería' },
                        { value: 'estomatologia', text: 'Estomatología' },
                        { value: 'odontologia', text: 'Odontología' },
                        { value: 'psicologia', text: 'Psicología' },
                        { value: 'tecnologia_medica', text: 'Tecnología Médica' },
                        { value: 'medicina_veterinaria', text: 'Medicina Veterinaria' },
                    ],
                    derecho_empresariales: [
                        { value: 'derecho', text: 'Derecho' },
                        { value: 'administracion_empresas', text: 'Administración de Empresas' },
                        { value: 'contabilidad', text: 'Contabilidad' },
                        { value: 'administracion_negocios', text: 'Administración de Negocios Internacionales' },
                        { value: 'administracion_marketing', text: 'Administración y Marketing' },
                    ],
                    ingenierias: [
                        { value: 'ingenieria_sistemas', text: 'Ingeniería de Sistemas' },
                        { value: 'ingenieria_agroindustrial', text: 'Ingeniería Agroindustrial' },
                        { value: 'ingenieria_civil', text: 'Ingeniería Civil' },
                        { value: 'ingenieria_enologia', text: 'Ingeniería en Enología y Viticultura' },
                    ],
                    comunicacion_admin: [
                        { value: 'ciencias_comunicacion', text: 'Ciencias de la Comunicación' },
                        { value: 'turismo_hoteleria_gastronomia', text: 'Turismo, Hotelería y Gastronomía' },
                    ],
                },
            },
            {
                id: 'anio_egreso',
                numero: 9,
                label: 'Año de egreso',
                type: 'text',
                required: true,
                // disabled: true,
                placeholder: 'Escriba su respuesta',
                validators: {
                    pattern: '^[0-9]{4}$',
                },
            },

            // {
            // id: 'grupos',
            // numero: 7,
            // label:
            //     'Durante sus estudios en la UPSJB SAC, ¿Usted perteneció a alguno de los siguientes grupos?',
            // type: 'radio',
            // required: true,
            // options: [
            //     { value: 'conadis', text: 'CONADIS' },
            //     { value: 'becado', text: 'Becado' },
            //     { value: 'ninguno', text: 'Ninguno' },
            //     { value: 'otras', text: 'Otras' },
            // ],
            // dashboard: {
            //     enabled: true,
            //     chartType: 'pie',
            //     title: 'Pertenencia a grupos durante sus estudios',
            // },
            // },

            {
                id: 'correo_personal',
                numero: 10,
                label:
                    'Por favor ingrese un correo electrónico para informarle de oportunidades profesionales y académicas',
                type: 'text',
                required: true,
                placeholder: 'Escriba su respuesta',
                validators: {
                    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
                },
            },
            {
                id: 'celular_personal',
                numero: 11,
                label:
                    'Por favor un número de celular mediante el cual la UPSJB SAC pueda comunicarse con usted',
                type: 'text',
                required: true,
                placeholder: 'Escriba su respuesta',
                validators: {
                    pattern: '^[0-9]{9}$',
                },
            },

            // Continúa aquí con las demás preguntas.
        ],
    },

    {
        id: 'fase_1',
        title: 'SECCIÓN 3: FASE 1 - INFORMACIÓN (0 - 3 AÑOS)',
        description: 'Esta encuesta tiene como objetivo, actualizar sus datos y acompañarlos en su proceso de inserción laboral para ofrecerle oportunidades laborales en bolsa de trabajo, actualización de su Curriculum vitae y acompañamiento en procesos clave de su profesión (SERUMS, colegiatura, etc.).',
        questions: [
            {
                id: 'fase_1_cursos_empleabilidad',
                numero: 9,
                label: 'Usted participa en cursos de y/o talleres de empleabilidad organizados por la UPSJB SAC:',
                type: 'radio',
                required: true,
                options: [
                    { value: 'muy_frecuentemente', text: 'Muy frecuentemente' },
                    { value: 'frecuentemente', text: 'Frecuentemente' },
                    { value: 'algunas_veces', text: 'Algunas veces' },
                    { value: 'muy_rara_vez', text: 'Muy rara vez' },
                    { value: 'nunca', text: 'Nunca' },
                ],
            },
            {
                id: 'fase_1_situacion_actual',
                numero: 10,
                label: 'Su situación actual es:',
                type: 'radio',
                required: true,
                options: [
                    { value: 'buscando_trabajo', text: 'Buscando trabajo' },
                    { value: 'estudiando_pregrado', text: 'Estudiando otra carrera de pregrado' },
                    { value: 'estudiando_posgrado', text: 'Estudiando un posgrado' },
                    { value: 'cuidado_familiar', text: 'Responsable del cuidado familiar' },
                    { value: 'desarrollando_tesis', text: 'Desarrollando la tesis' },
                    { value: 'trabajos_informales', text: 'Trabajos informales u ocasionales' },
                    { value: 'comercio_ventas', text: 'Comercio, ventas' },
                    { value: 'desarrollando_emprendimiento', text: 'Desarrollando mi emprendimiento' },
                    { value: 'otro', text: 'Otro' },
                ],
            },
            {
                id: 'fase_1_situacion_laboral_actual',
                numero: 11,
                label: 'Actualmente, usted se encuentra trabajando:',
                type: 'radio',
                required: true,
                options: [
                    {
                    value: 'dentro_area_formacion',
                    text: 'Dentro del área de su formación profesional',
                    },
                    {
                    value: 'ambito_relacionado',
                    text: 'En ámbito relacionado al área de su formación profesional',
                    },
                    {
                    value: 'ambito_no_relacionado',
                    text: 'En ámbito no relacionado al área de su formación profesional',
                    },
                    { value: 'sin_trabajo', text: 'Se encuentra sin trabajo' },
                ],
            },
            {
                id: 'fase_1_primer_empleo_profesion',
                numero: 12,
                label: 'El primer empleo vinculado directamente a su profesión lo consiguió:',
                type: 'radio',
                required: true,
                options: [
                    {
                    value: 'antes_culminar_estudios',
                    text: 'Antes de culminar sus estudios universitarios.',
                    },
                    {
                    value: 'primeros_6_meses',
                    text: 'Durante los primeros 6 meses luego de culminar los estudios',
                    },
                    {
                    value: 'primeros_7_12_meses',
                    text: 'Durante los primeros 7 - 12 meses luego de culminar los estudios',
                    },
                    { value: 'entre_1_2_anios', text: 'Entre 1 y 2 años' },
                    { value: 'mas_2_anios', text: 'Más de 2 años' },
                    {
                    value: 'aun_no_empleo_vinculado',
                    text: 'Aún no he tenido un empleo vinculado directamente a mi profesión',
                    },
                ],
            },
            {
            id: 'fase_1_medio_empleo_actual',
                numero: 13,
                label: '¿Cuál de esos medios le permitió conseguir su empleo actual?',
                type: 'radio',
                required: true,
                options: [
                    {
                    value: 'bolsa_upsjb',
                    text: 'Bolsa de trabajo de la UPSJB SAC/ convocatorias a su correo institucional',
                    },
                    { value: 'linkedin', text: 'LinkedIn' },
                    { value: 'bolsa_gratuita_internet', text: 'Bolsa de trabajo gratuita en internet' },
                    { value: 'bolsa_pagada_internet', text: 'Bolsa de trabajo pagada en internet' },
                    {
                    value: 'referencia_practicas',
                    text: 'Referencia de contactos durante sus prácticas preprofesionales',
                    },
                    {
                    value: 'red_egresados_docentes',
                    text: 'Red de egresados, docentes o conocidos de UPSJB SAC',
                    },
                    { value: 'otros', text: 'Otros' },
                    { value: 'ninguno', text: 'Ninguno' },
                ],
            },
        ],
    },

    {
        id: 'fase_2',
        title: 'SECCIÓN 3: FASE 2 - FORMACIÓN (3 - 5 AÑOS)',
        description: 'Esta encuesta tiene como objetivo conocer su percepción y el de su empleador; analizar y detectar brechas para la mejora del Plan Curricular de la escuela profesional.',
        questions: [
            {
                id: 'fase_2_satisfaccion_utilidad_conocimientos',
                numero: 9,
                label:
                    'Satisfacción con la utilidad de los conocimientos adquiridos durante su formación en la UPSJB SAC respecto al empleo',
                type: 'radio',
                required: true,
                options: [
                    { value: 'muy_satisfecho', text: 'Muy satisfecho' },
                    { value: 'satisfecho', text: 'Satisfecho' },
                    { value: 'neutral', text: 'Ni satisfecho ni insatisfecho' },
                    { value: 'insatisfecho', text: 'Insatisfecho' },
                    { value: 'muy_insatisfecho', text: 'Muy insatisfecho' },
                ],
            },
            {
                id: 'fase_2_participacion_gestion_curricular',
                numero: 10,
                label: 'Usted forma parte o ha participado en los procesos de gestión curricular.',
                type: 'radio',
                required: true,
                options: [
                    { value: 'si', text: 'Sí' },
                    { value: 'no', text: 'No' },
                ],
            },
            {
                id: 'fase_2_satisfaccion_servicio_educativo',
                numero: 11,
                label:
                    '¿Qué tan satisfecho se encuentra usted con el servicio educativo brindado por la UPSJB SAC, durante su formación?',
                type: 'radio',
                required: true,
                options: [
                    { value: 'muy_satisfecho', text: 'Muy satisfecho' },
                    { value: 'satisfecho', text: 'Satisfecho' },
                    { value: 'neutral', text: 'Ni satisfecho ni insatisfecho' },
                    { value: 'insatisfecho', text: 'Insatisfecho' },
                    { value: 'muy_insatisfecho', text: 'Muy insatisfecho' },
                ],
            },
            {
                id: 'fase_2_participacion_planificacion_estrategica',
                numero: 12,
                label: 'Usted forma parte o ha participado en la planificación estratégica.',
                type: 'radio',
                required: true,
                options: [
                    { value: 'si', text: 'Sí' },
                    { value: 'no', text: 'No' },
                ],
            },
            {
                id: 'fase_2_empresa_actual',
                numero: 13,
                label: 'Podría informarnos el nombre de la Empresa en la que actualmente labora:',
                type: 'text',
                required: true,
                placeholder: 'Escriba su respuesta',
            },
            {
                id: 'fase_2_jefe_inmediato_nombre_correo',
                numero: 10,
                label: 'Podría compartirnos el nombre y correo de su jefe inmediato',
                type: 'text',
                required: true,
                placeholder: 'Ejemplo: Juan Pérez - juan.perez@empresa.com',
            },
        ],
    },

    {
        id: 'fase_3',
        title: 'SECCIÓN 3: FASE 3 - AUTOCAPACITACIÓN (5 - 7 AÑOS)',
        description: 'Esta encuesta tiene como objetivo de ofrecerle Educación Continua y acompañarlos en su desarrollo profesional.',
        questions: [
            {
                id: 'fase_3_nivel_especialidad_grados',
                numero: 9,
                label: 'Mencione actualmente el nivel de especialidad o grados que ha logrado:',
                type: 'radio',
                required: true,
                options: [
                    {
                    value: 'segunda_especialidad_residentado',
                    text: 'Segunda Especialidad / Residentado Médico',
                    },
                    { value: 'maestrias', text: 'Maestrías' },
                    { value: 'doctorados', text: 'Doctorados' },
                    { value: 'diplomados', text: 'Diplomados' },
                    { value: 'otros', text: 'Otros' },
                ],
            },
            {
                id: 'fase_3_participacion_educacion_continua_upsjb',
                numero: 10,
                label:
                    'Usted participa en cursos de educación continua o de especialidad organizados por la UPSJB SAC:',
                type: 'radio',
                required: true,
                options: [
                    { value: 'muy_frecuentemente', text: 'Muy frecuentemente' },
                    { value: 'frecuentemente', text: 'Frecuentemente' },
                    { value: 'algunas_veces', text: 'Algunas veces' },
                    { value: 'muy_rara_vez', text: 'Muy rara vez' },
                    { value: 'nunca', text: 'Nunca' },
                ],
            },
            {
                id: 'fase_3_necesidad_educacion_continua',
                numero: 11,
                label:
                    '¿Cuál sería actualmente la necesidad de educación continua que Usted como egresado de la UPSJB SAC, requiere:',
                type: 'radio',
                required: true,
                options: [
                    {
                    value: 'actualizacion_carrera',
                    text: 'Cursos de actualización de la carrera',
                    },
                    {
                    value: 'cientificos_investigacion',
                    text: 'Cursos científicos o de investigación',
                    },
                    { value: 'gestion', text: 'Cursos de gestión' },
                    {
                    value: 'herramientas_tecnologicas',
                    text: 'Cursos de herramientas tecnológicas',
                    },
                    { value: 'diplomados', text: 'Diplomados' },
                    { value: 'maestrias_doctorados', text: 'Maestrías / Doctorados' },
                ],
            },
        ],
    },

    {
        id: 'fase_4',
        title: 'SECCIÓN 3: FASE 4 - INNOVACIÓN (7 A MÁS AÑOS)',
        description: 'Esta encuesta tiene como objetivo promover la investigación e innovación, capacitar en patentes y publicaciones científicas, compartir sus logros como egresado exitoso generando red y alianzas estratégicas.',
        questions: [
            {
                id: 'fase_4_realiza_investigacion',
                numero: 9,
                label: '¿Usted realiza investigación?',
                type: 'radio',
                required: true,
                options: [
                    { value: 'si', text: 'Sí' },
                    { value: 'no', text: 'No' },
                ],
            },
            {
                id: 'fase_4_participacion_capacitaciones_innovacion',
                numero: 10,
                label:
                    'Usted participa en capacitaciones para realizar investigaciones o proyectos de innovación organizados por la UPSJB SAC:',
                type: 'radio',
                required: true,
                options: [
                    { value: 'muy_frecuentemente', text: 'Muy frecuentemente' },
                    { value: 'frecuentemente', text: 'Frecuentemente' },
                    { value: 'algunas_veces', text: 'Algunas veces' },
                    { value: 'muy_rara_vez', text: 'Muy rara vez' },
                    { value: 'nunca', text: 'Nunca' },
                ],
            },
            {
                id: 'fase_4_satisfaccion_capacitaciones_innovacion',
                numero: 11,
                label:
                    '¿Qué tan satisfecho se encuentra usted con las capacitaciones para realizar investigaciones o proyectos de innovación organizados por la UPSJB SAC?',
                type: 'radio',
                required: false,
                options: [
                    { value: 'muy_satisfecho', text: 'Muy satisfecho' },
                    { value: 'satisfecho', text: 'Satisfecho' },
                    { value: 'neutro', text: 'Neutro' },
                    { value: 'poco_satisfecho', text: 'Poco satisfecho' },
                    { value: 'insatisfecho', text: 'Insatisfecho' },
                ],
            },
        ],
    },

];

