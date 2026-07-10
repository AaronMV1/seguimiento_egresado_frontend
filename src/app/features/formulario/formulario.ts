

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Http } from '../../core/services/http';


type QuestionType = 'text' | 'radio' | 'action';


interface FormSection {
id: string;
title: string;
questions: FormQuestion[];
}


interface FormOption {
value: string;
text: string;
finishForm?: boolean;
targetSectionId?: string;
}


interface FormQuestion {
id: string;
numero: number;
label: string;
type: QuestionType;
required: boolean;
placeholder?: string;
actionLabel?: string;
options?: FormOption[];
visibleWhen?: {
    questionId: string;
    value: string;
};
dashboard?: {
    enabled: boolean;
    chartType: 'bar' | 'pie' | 'doughnut';
    title?: string;
};
validators?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
};
}


interface PlantillaFase {
	id: string;
	titulo: string;
	aniosMinimosDesdeEgreso: number;
	aniosMaximosDesdeEgreso: number | null;
	etiquetaCohorte: string;
	descripcion: string;
}


@Component({
    selector: 'app-formulario',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './formulario.html',
    styleUrl: './formulario.css',
})


export class Formulario implements OnInit {

    readonly testData = {
        terminos_condiciones: 'acepto',
        nombresApellidos: 'Christian Aarón Mori Valdivia',
        dni: '75116260',
        sexo: 'masculino',
        sede: 'lima-chorrillos',
        grupos: 'ninguno',
        correo_personal: 'christian.mori@upsjb.edu.pe',
        celular_personal: '933216749',
        estudios_concluidos: 'Pregrado',
        tiene_trabajo: 'si',
        empresa_actual: 'Universidad Privada San Juan Bautista',
    };

    readonly plantillasFases: PlantillaFase[] = [
		{ id: 'fase_1', titulo: 'Fase 1: Información', aniosMinimosDesdeEgreso: 0, aniosMaximosDesdeEgreso: 3, etiquetaCohorte: '0 - 3 años', descripcion: 'Corresponde a los egresados que inician su vida profesional. En esta etapa se realiza el seguimiento de su inserción laboral, la actualización de sus datos y el fortalecimiento de su empleabilidad mediante oportunidades de trabajo, capacitación inicial y acompañamiento profesional.' },
		{ id: 'fase_2', titulo: 'Fase 2: Formación', aniosMinimosDesdeEgreso: 4, aniosMaximosDesdeEgreso: 5, etiquetaCohorte: '4 - 5 años', descripcion: 'Comprende a los egresados que han consolidado experiencia laboral. Se recopila información sobre su desempeño, logros y formación continua, además de obtener retroalimentación para contribuir a la mejora del plan curricular y de la calidad académica.' },
		{ id: 'fase_3', titulo: 'Fase 3: Autocapacitación', aniosMinimosDesdeEgreso: 6, aniosMaximosDesdeEgreso: 7, etiquetaCohorte: '6 - 7 años', descripcion: 'En esta etapa se evalúa el crecimiento académico y profesional del egresado, identificando estudios de posgrado, especializaciones, certificaciones y otros procesos de actualización que fortalecen su perfil profesional.' },
		{ id: 'fase_4', titulo: 'Fase 4: Innovación', aniosMinimosDesdeEgreso: 8, aniosMaximosDesdeEgreso: null, etiquetaCohorte: '8 - X años', descripcion: 'Corresponde a los egresados con una trayectoria profesional consolidada. Se identifican sus aportes en investigación, innovación, emprendimiento, liderazgo y generación de conocimiento, evidenciando su impacto en la sociedad y en el desarrollo de su profesión.' },
	];

    //#region Configuracion del cuestionario
    // Define la estructura del cuestionario: secciones, preguntas, opciones y reglas.
    readonly sections: FormSection[] = [
        {
        id: 'consentimiento_informado',
        title: 'SECCIÓN 1: CONSENTIMIENTO INFORMADO',
        questions: [
            {
            id: 'terminos_condiciones',
            numero: 1,
            label:
                'Al aceptar la política de privacidad, autorizas a la UPSJB SAC a hacer uso de tus datos personales en los términos y condiciones.',
            type: 'radio',
            required: true,
            options: [
                { value: 'acepto', text: 'Acepto' },
                { value: 'no_acepto', text: 'No acepto', finishForm: true },
            ],
            },
        ],
        },
        {
        id: 'informacion_personal',
        title: 'SECCIÓN 2: INFORMACIÓN PERSONAL DEL EGRESADO',
        questions: [
            {
            id: 'actualizar_datos_personales',
            numero: 1,
            label: 'Si desea completar automáticamente sus datos personales, use el siguiente botón.',
            type: 'action',
            required: false,
            placeholder: 'Ingrese su correo institucional',
            actionLabel: 'Validar correo institucional',
            },
            {
            id: 'nombresApellidos',
            numero: 2,
            label: 'Por favor ingrese sus nombres y apellidos',
            type: 'text',
            required: true,
            placeholder: 'Escriba su respuesta',
            validators: {
                minLength: 5,
            },
            },
            {
            id: 'dni',
            numero: 3,
            label: 'Ingrese su DNI',
            type: 'text',
            required: true,
            placeholder: 'Escriba su respuesta',
            validators: {
                pattern: '^[0-9]{8}$',
            },
            },
            {
            id: 'sexo',
            numero: 4,
            label: 'Sexo',
            type: 'radio',
            required: true,
            options: [
                { value: 'masculino', text: 'Masculino' },
                { value: 'femenino', text: 'Femenino' },
            ],
            },
            {
            id: 'sede',
            numero: 5,
            label: '¿En qué sede/filial estudió?',
            type: 'radio',
            required: true,
            options: [
                { value: 'CP001', text: 'Lima - Chorrillos' },
                { value: 'CP002', text: 'Lima - San Borja' },
                { value: 'CP003', text: 'Ica' },
                { value: 'CP005', text: 'Chincha' },
                { value: 'Otro', text: 'Otro (Lima norte, etc.)' },
            ],
            dashboard: {
                enabled: true,
                chartType: 'pie',
                title: 'Sede/Filial donde estudió',
            },
            },
            {
            id: 'anio_egreso',
            numero: 6,
            label: 'Año de egreso',
            type: 'text',
            required: true,
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
            numero: 7,
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
            numero: 8,
            label:
                'Por favor un número de celular mediante el cual la UPSJB SAC pueda comunicarse con usted',
            type: 'text',
            required: true,
            placeholder: 'Escriba su respuesta',
            validators: {
                pattern: '^[0-9]{9}$',
            },
            },
            // {
            // id: 'estudios_concluidos',
            // numero: 10,
            // label:
            //     'Considerando únicamente estudios realizados en la UPSJB SAC, usted concluyó estudios de:',
            // type: 'radio',
            // required: true,
            // options: [
            //     { value: 'Pregrado', text: 'Solo Pregrado', targetSectionId: 'pregrado' },
            //     { value: 'Maestría', text: 'Solo Maestría', targetSectionId: 'maestria' },
            //     {
            //     value: 'Segunda Especialidad / Residentado',
            //     text: 'Segunda Especialidad / Residentado',
            //     targetSectionId: 'segunda_especialidad',
            //     },
            //     {
            //     value: 'Pregrado y Maestría',
            //     text: 'Pregrado y Maestría',
            //     targetSectionId: 'pregrado_maestria',
            //     },
            //     {
            //     value: 'Pregrado y Segunda Especialidad / Residentado',
            //     text: 'Pregrado y Segunda Especialidad / Residentado',
            //     targetSectionId: 'pregrado_segunda_especialidad',
            //     },
            //     {
            //     value: 'Maestría y Segunda Especialidad / Residentado',
            //     text: 'Maestría y Segunda Especialidad / Residentado',
            //     targetSectionId: 'maestria_segunda_especialidad',
            //     },
            //     {
            //     value: 'Pregrado, Maestría y Segunda Especialidad / Residentado',
            //     text: 'Pregrado, Maestría y Segunda Especialidad / Residentado',
            //     targetSectionId: 'pregrado_maestria_segunda_especialidad',
            //     },
            //     {
            //     value: 'Ninguna de las anteriores',
            //     text: 'Ninguna de las anteriores',
            //     finishForm: true,
            //     },
            // ],
            // dashboard: {
            //     enabled: true,
            //     chartType: 'pie',
            //     title: 'Estudios concluidos en la UPSJB SAC',
            // },
            // },
            // {
            // id: 'tiene_trabajo',
            // numero: 11,
            // label: '¿Actualmente se encuentra trabajando?',
            // type: 'radio',
            // required: true,
            // options: [
            //     { value: 'si', text: 'Sí' },
            //     { value: 'no', text: 'No' },
            // ],
            // },
            // {
            // id: 'empresa_actual',
            // numero: 9,
            // label: 'Ingrese el nombre de la empresa donde trabaja',
            // type: 'text',
            // required: true,
            // placeholder: 'Escriba su respuesta',
            // visibleWhen: {
            //     questionId: 'tiene_trabajo',
            //     value: 'si',
            // },
            // },
        ],
        },
        {
        id: 'fase_1',
        title: 'SECCIÓN 3: FASE 1 - INFORMACIÓN (0 - 3 AÑOS)',
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
        title: 'SECCIÓN 3: FASE 2 - FORMACIÓN (4 - 5 AÑOS)',
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
        title: 'SECCIÓN 3: FASE 3 - AUTOCAPACITACIÓN (6 - 7 AÑOS)',
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
        title: 'SECCIÓN 3: FASE 4 - INNOVACIÓN (8 A MÁS AÑOS)',
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
    //#endregion

    //#region Estado del componente
    // Lista de IDs que se deben mostrar en el dashboard final.
    readonly dashboardQuestionIds: string[] = ['sede', 'grupos', 'estudios_concluidos'];

    currentSectionIndex = 0;
    submitted = false;
    showDashboard = false;
    correoPersona = 'christian.mori@upsjb.edu.pe';
    selectedFaseSectionId: string | null = null;
    form!: ReturnType<FormBuilder['group']>;
    //#endregion


    //#region Constructor
    constructor(private readonly fb: FormBuilder,public _http: Http) {
        this.form = this.buildForm();
        // this.loadTestData();
    }
    //#endregion


    ngOnInit(): void {
        // Se mantiene por contrato de OnInit; la carga de datos ahora es manual desde el botón.
    }



    private loadTestData(): void {
        this.form.patchValue(this.testData);
    }

    //#region Getters de navegacion y dashboard
    get questions(): FormQuestion[] {
        return this.sections.flatMap((section) => section.questions);
    }

    get currentSection(): FormSection {
        return this.sections[this.currentSectionIndex];
    }

    get isFirstSection(): boolean {
        return this.currentSectionIndex === 0;
    }

    get isLastSection(): boolean {
        if (this.selectedFaseSectionId && this.currentSection.id === this.selectedFaseSectionId) {
        return true;
        }

        return this.currentSectionIndex === this.sections.length - 1;
    }

    get shouldFinishCurrentSection(): boolean {
        for (const question of this.currentSection.questions) {
        const selectedValue = this.form.get(question.id)?.value;

        const selectedOption = question.options?.find((option) => option.value === selectedValue);

        if (selectedOption?.finishForm) {
            return true;
        }
        }

        return false;
    }

    get dashboardQuestions(): FormQuestion[] {
        return this.questions.filter((question) => {
        const isEnabled = question.dashboard?.enabled;
        const isConfigured = this.dashboardQuestionIds.includes(question.id);
        const isAnswered = this.isQuestionAnswered(question.id);

        return Boolean(isEnabled && isConfigured && isAnswered);
        });
    }

    getOptionCount(questionId: string, optionValue: string): number {
        const selectedValue = this.form.get(questionId)?.value;

        return selectedValue === optionValue ? 1 : 0;
    }

    getOptionPercentage(questionId: string, optionValue: string): number {
        const total = 1; // Por ahora solo existe una respuesta

        const count = this.getOptionCount(questionId, optionValue);

        return Math.round((count / total) * 100);
    }

    get hasDashboardData(): boolean {
        return this.dashboardQuestions.length > 0;
    }
    //#endregion

    //#region Flujo del cuestionario

    previousSection(): void {
        if (this.currentSection.id.startsWith('fase_')) {
        const informacionPersonalIndex = this.sections.findIndex(
            (section) => section.id === 'informacion_personal',
        );

        if (informacionPersonalIndex !== -1) {
            this.currentSectionIndex = informacionPersonalIndex;
            return;
        }
        }

        if (!this.isFirstSection) {
        this.currentSectionIndex--;
        }
    }

    nextSection(): void {
        if (this.currentSection.id === 'informacion_personal') {
        const selectedFaseSectionId = this.resolveFaseSectionIdByAnioEgreso();

        if (selectedFaseSectionId) {
            const faseIndex = this.sections.findIndex((section) => section.id === selectedFaseSectionId);

            if (faseIndex !== -1) {
            this.currentSectionIndex = faseIndex;
            return;
            }
        }
        }

        const targetSectionId = this.getCurrentSectionTargetSectionId();

        if (targetSectionId) {
        const targetIndex = this.sections.findIndex((section) => section.id === targetSectionId);

        if (targetIndex !== -1) {
            this.currentSectionIndex = targetIndex;
            return;
        }
        }

        if (!this.isLastSection) {
        this.currentSectionIndex++;
        }
    }

    onSubmit(): void {
        this.submitted = true;

        if (!this.shouldFinishCurrentSection && this.form.invalid) {
        this.form.markAllAsTouched();
        return;
        }

        console.log('Respuestas del formulario:', this.form.value);

        this.showDashboard = true;
    }
    //#endregion

    //#region Utilidades de plantilla
    isFieldInvalid(fieldId: string): boolean {
        const control = this.form.get(fieldId);
        return Boolean(control && control.invalid && (control.touched || this.submitted));
    }

    isQuestionVisible(question: FormQuestion): boolean {
        if (!question.visibleWhen) {
        return true;
        }

        const currentValue = this.form.get(question.visibleWhen.questionId)?.value;

        return currentValue === question.visibleWhen.value;
    }

    trackByQuestionId(_: number, question: FormQuestion): string {
        return question.id;
    }

    onCorreoPersonaChange(event: Event): void {
        this.correoPersona = (event.target as HTMLInputElement).value;
    }
    //#endregion

    //#region Helpers privados
    private getCurrentSectionTargetSectionId(): string | null {
        for (const question of this.currentSection.questions) {
        const selectedValue = this.form.get(question.id)?.value;

        const selectedOption = question.options?.find((option) => option.value === selectedValue);

        if (selectedOption?.targetSectionId) {
            return selectedOption.targetSectionId;
        }
        }

        return null;
    }

    private resolveFaseSectionIdByAnioEgreso(): string | null {
        const anioEgresoValue = this.form.get('anio_egreso')?.value;
        const anioEgreso = Number.parseInt(String(anioEgresoValue), 10);
        const anioActual = new Date().getFullYear();

        if (!Number.isInteger(anioEgreso) || anioEgreso < 1900 || anioEgreso > anioActual) {
        this.selectedFaseSectionId = null;
        return null;
        }

        const aniosDesdeEgreso = anioActual - anioEgreso;

        const fase = this.plantillasFases.find((plantillaFase) => {
        const cumpleMinimo = aniosDesdeEgreso >= plantillaFase.aniosMinimosDesdeEgreso;
        const cumpleMaximo =
            plantillaFase.aniosMaximosDesdeEgreso === null ||
            aniosDesdeEgreso <= plantillaFase.aniosMaximosDesdeEgreso;

        return cumpleMinimo && cumpleMaximo;
        });

        this.selectedFaseSectionId = fase?.id ?? null;

        return this.selectedFaseSectionId;
    }

    private isQuestionAnswered(questionId: string): boolean {
        const value = this.form.get(questionId)?.value;

        if (value === null || value === undefined) {
        return false;
        }

        if (typeof value === 'string') {
        return value.trim().length > 0;
        }

        return true;
    }

    private buildForm() {
        const controlsConfig: Record<string, unknown> = {};

        for (const question of this.questions) {
        if (question.type === 'action') {
            continue;
        }
        controlsConfig[question.id] = ['', this.getQuestionValidators(question)];
        }

        return this.fb.group(controlsConfig);
    }

    private getQuestionValidators(question: FormQuestion): ValidatorFn[] {

        const validators: ValidatorFn[] = [];

        if (question.required) {
        validators.push(Validators.required);
        }

        if (question.validators?.pattern) {
        validators.push(Validators.pattern(question.validators.pattern));
        }

        if (question.validators?.minLength) {
        validators.push(Validators.minLength(question.validators.minLength));
        }

        if (question.validators?.maxLength) {
        validators.push(Validators.maxLength(question.validators.maxLength));
        }

        return validators;
    }
    //#endregion



    obtenerInformacionPersona() {

        const correo = this.correoPersona.trim();

        if (!correo) {
            return;
        }

        let req = {
            correo,
        };

        this._http.postUPSJBIntegracionesAcademico(req, 'obtener-informacion-persona').subscribe(

            (res) => {

                console.log(res);

                this.form.patchValue({
                    nombresApellidos: res.result.nombre + ' ' + res.result.apellidoPaterno + ' ' + res.result.apellidoMaterno,
                    dni: res.result.nacionalidadId,
                    sexo: res.result.sexo === 'M' ? 'masculino' : 'femenino',
                    sede: res.result.detalleInformacionAcademica[0].campus === 'CP001' ? 'CP001' : res.result.detalleInformacionAcademica[0].campus === 'CP002' ? 'CP002' : res.result.detalleInformacionAcademica[0].campus === 'CP003' ? 'CP003' : res.result.detalleInformacionAcademica[0].campus === 'CP005' ? 'CP005' : 'Otro',
                    anio_egreso: res.result.detalleInformacionAcademica[0].desAcadTerm.substring(0, 4),


                });

                this.resolveFaseSectionIdByAnioEgreso();

                console.log()

            }

        );

    }



}

