

import { PlantillaFase } from './formulario.models';


export const POLITICA_PRIVACIDAD_MESSAGE = `
    Con su aceptación autoriza a la Universidad Privada San Juan Bautista S.A.C.
    (UPSJB SAC), a través de la Subdirección de Seguimiento al Egresado, para que
    pueda tratar los datos personales que proporcione como egresado.

    Sus datos personales serán tratados con la finalidad de mantener contacto con
    usted, informarle acerca de servicios, beneficios, oportunidades profesionales
    y académicas, así como recoger su opinión sobre la universidad.

    Su información será almacenada de manera confidencial y no será vendida ni
    cedida a terceros.

    Correo: seguimiento.egresado@upsjb.edu.pe
`;


export const PLANTILLAS_FASES: PlantillaFase[] = [

    {
        id: 'fase_1',
        titulo: 'Fase 1: Información',
        aniosMinimosDesdeEgreso: 0,
        aniosMaximosDesdeEgreso: 3,
        etiquetaCohorte: '0 - 3 años',
        descripcion:
            'Seguimiento de inserción laboral, actualización de datos y fortalecimiento de empleabilidad.',
    },

    {
        id: 'fase_2',
        titulo: 'Fase 2: Formación',
        aniosMinimosDesdeEgreso: 4,
        aniosMaximosDesdeEgreso: 5,
        etiquetaCohorte: '4 - 5 años',
        descripcion:
            'Evaluación de la formación recibida y retroalimentación para la mejora curricular.',
    },

    {
        id: 'fase_3',
        titulo: 'Fase 3: Autocapacitación',
        aniosMinimosDesdeEgreso: 6,
        aniosMaximosDesdeEgreso: 7,
        etiquetaCohorte: '6 - 7 años',
        descripcion:
            'Identificación de especializaciones, posgrados y procesos de actualización profesional.',
    },

    {
        id: 'fase_4',
        titulo: 'Fase 4: Innovación',
        aniosMinimosDesdeEgreso: 8,
        aniosMaximosDesdeEgreso: null,
        etiquetaCohorte: '8 años a más',
        descripcion:
            'Identificación de aportes en investigación, innovación, liderazgo y generación de conocimiento.',
    },

];


export const DASHBOARD_QUESTION_IDS = [
    'sede',
    'grupos',
    'estudios_concluidos',
];
