

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';


type QuestionType = 'text' | 'radio';


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


@Component({
    selector: 'app-form',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './form.html',
    styleUrl: './form.css',
})


export class Form {


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
                    label: 'Al aceptar la política de privacidad, autorizas a la UPSJB SAC a hacer uso de tus datos personales en los términos y condiciones.',
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
                        { value: 'lima-chorrillos', text: 'Lima - Chorrillos' },
                        { value: 'lima-san-borja', text: 'Lima - San Borja' },
                        { value: 'ica', text: 'Ica' },
                        { value: 'chincha', text: 'Chincha' },
                        { value: 'otro', text: 'Otro (Lima norte, etc.)' },
                    ],
                    dashboard: {
                        enabled: true,
                        chartType: 'pie',
                        title: 'Sede/Filial donde estudió'
                    }
                },
                {
                    id: 'grupos',
                    numero: 6,
                    label: 'Durante sus estudios en la UPSJB SAC, ¿Usted perteneció a alguno de los siguientes grupos?',
                    type: 'radio',
                    required: true,
                    options: [
                        { value: 'conadis', text: 'CONADIS' },
                        { value: 'becado', text: 'Becado' },
                        { value: 'ninguno', text: 'Ninguno' },
                        { value: 'otras', text: 'Otras' },
                    ],
                    dashboard: {
                        enabled: true,
                        chartType: 'pie',
                        title: 'Pertenencia a grupos durante sus estudios'
                    }
                },
                {
                    id: 'correo_personal',
                    numero: 7,
                    label: 'Por favor ingrese un correo electrónico para informarle de oportunidades profesionales y académicas',
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
                    label: 'Por favor un número de celular mediante el cual la UPSJB SAC pueda comunicarse con usted',
                    type: 'text',
                    required: true,
                    placeholder: 'Escriba su respuesta',
                    validators: {
                        pattern: '^[0-9]{9}$',
                    },
                },
                {
                    id: 'estudios_concluidos',
                    numero: 9,
                    label: 'Considerando únicamente estudios realizados en la UPSJB SAC, usted concluyó estudios de:',
                    type: 'radio',
                    required: true,
                    options: [
                        { value: 'Pregrado', text: 'Solo Pregrado', targetSectionId: 'pregrado' },
                        { value: 'Maestría', text: 'Solo Maestría', targetSectionId: 'maestria' },
                        { value: 'Segunda Especialidad / Residentado', text: 'Segunda Especialidad / Residentado', targetSectionId: 'segunda_especialidad' },
                        { value: 'Pregrado y Maestría', text: 'Pregrado y Maestría', targetSectionId: 'pregrado_maestria' },
                        { value: 'Pregrado y Segunda Especialidad / Residentado', text: 'Pregrado y Segunda Especialidad / Residentado', targetSectionId: 'pregrado_segunda_especialidad' },
                        { value: 'Maestría y Segunda Especialidad / Residentado', text: 'Maestría y Segunda Especialidad / Residentado', targetSectionId: 'maestria_segunda_especialidad' },
                        { value: 'Pregrado, Maestría y Segunda Especialidad / Residentado', text: 'Pregrado, Maestría y Segunda Especialidad / Residentado', targetSectionId: 'pregrado_maestria_segunda_especialidad' },
                        { value: 'Ninguna de las anteriores', text: 'Ninguna de las anteriores', finishForm: true },
                    ],
                    dashboard: {
                        enabled: true,
                        chartType: 'pie',
                        title: 'Estudios concluidos en la UPSJB SAC'
                    }
                },
                {
                    id: 'tiene_trabajo',
                    numero: 10,
                    label: '¿Actualmente se encuentra trabajando?',
                    type: 'radio',
                    required: true,
                    options: [
                        { value: 'si', text: 'Sí' },
                        { value: 'no', text: 'No' },
                    ],
                },
                {
                    id: 'empresa_actual',
                    numero: 11,
                    label: 'Ingrese el nombre de la empresa donde trabaja',
                    type: 'text',
                    required: true,
                    placeholder: 'Escriba su respuesta',
                    visibleWhen: {
                        questionId: 'tiene_trabajo',
                        value: 'si',
                    },
                }

            ]

        }

    ];
    //#endregion


    //#region Estado del componente
    // Lista de IDs que se deben mostrar en el dashboard final.
    readonly dashboardQuestionIds: string[] = [
        'sede',
        'grupos',
        'estudios_concluidos'
    ];

    currentSectionIndex = 0;
    submitted = false;
    showDashboard = false;
    form!: ReturnType<FormBuilder['group']>;
    //#endregion


    //#region Constructor
    constructor(private readonly fb: FormBuilder) {
        this.form = this.buildForm();
        this.loadTestData();
    }
    //#endregion


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
        return this.currentSectionIndex === this.sections.length - 1;
    }

    get shouldFinishCurrentSection(): boolean {

        for (const question of this.currentSection.questions) {
            const selectedValue = this.form.get(question.id)?.value;

            const selectedOption = question.options?.find(
                option => option.value === selectedValue
            );

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
        if (!this.isFirstSection) {
            this.currentSectionIndex--;
        }
    }

    nextSection(): void {

        const targetSectionId = this.getCurrentSectionTargetSectionId();

        if (targetSectionId) {
            const targetIndex = this.sections.findIndex(section => section.id === targetSectionId);

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
    //#endregion


    //#region Helpers privados
    private getCurrentSectionTargetSectionId(): string | null {

        for (const question of this.currentSection.questions) {

            const selectedValue = this.form.get(question.id)?.value;

            const selectedOption = question.options?.find(
                (option) => option.value === selectedValue
            );

            if (selectedOption?.targetSectionId) {
                return selectedOption.targetSectionId;
            }

        }

        return null;

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


}

