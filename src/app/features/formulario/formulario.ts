

import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators, } from '@angular/forms';
import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { FormOption, FormQuestion, FormSection, QuestionLink, SedeApiItem } from './formulario.models';
import { Http } from '../../core/services/http';
import { DASHBOARD_QUESTION_IDS, PLANTILLAS_FASES, POLITICA_PRIVACIDAD_MESSAGE } from './formulario.constants';
import { FORMULARIO_SECTIONS } from './formulario.config';


@Component({
    selector: 'app-formulario',
    imports: [
        CommonModule,
        ReactiveFormsModule,
    ],
    templateUrl: './formulario.html',
    styleUrl: './formulario.css',
})


export class Formulario implements OnInit, OnDestroy {


    // Configuración


    readonly sections: FormSection[] = structuredClone(FORMULARIO_SECTIONS);
    readonly plantillasFases = PLANTILLAS_FASES;
    readonly dashboardQuestionIds = DASHBOARD_QUESTION_IDS;
    readonly politicaPrivacidadMessage = POLITICA_PRIVACIDAD_MESSAGE;


    // Formulario


    form: FormGroup;


    // Estado de navegación


    currentSectionIndex = 0;
    selectedFaseSectionId: string | null = null;
    submitted = false;
    showDashboard = false;

    private readonly autofillRequiredFieldIds = [
        'nombresApellidos',
        'dni',
        'sexo',
        'sede',
        'anio_egreso',
    ];


    // Estado de integración


    correoPersona = 'christian.mori@upsjb.edu.pe';


    // Popup


    isPopupVisible = false;
    popupTitle = 'Información';
    popupMessage = '';


    // Ciclo de vida


    private readonly destroy$ = new Subject<void>();

    constructor( private readonly fb: FormBuilder, private readonly http: Http ) { this.form = this.buildForm(); }


    ngOnInit(): void {
        this.listenFacultadChanges();
        this.obtenerSedeLista();
    }


    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }


    // Getters


    get questions(): FormQuestion[] {
        return this.sections.flatMap(
            (section) => section.questions,
        );
    }

    get currentSection(): FormSection {
        return this.sections[this.currentSectionIndex];
    }

    get isFirstSection(): boolean {
        return this.currentSectionIndex === 0;
    }

    get isLastSection(): boolean {
        return (
            this.currentSection.id === this.selectedFaseSectionId ||
            this.currentSectionIndex === this.sections.length - 1
        );
    }

    get shouldFinishCurrentSection(): boolean {
        return this.currentSection.questions.some((question) => {
            const selectedValue = this.form.get(question.id)?.value;

            return question.options?.some(
                (option) =>
                    option.value === selectedValue &&
                    option.finishForm,
            );
        });
    }

    get dashboardQuestions(): FormQuestion[] {
        return this.questions.filter((question) => {
            return (
                question.dashboard?.enabled &&
                this.dashboardQuestionIds.includes(question.id) &&
                this.isQuestionAnswered(question.id)
            );
        });
    }

    get hasDashboardData(): boolean {
        return this.dashboardQuestions.length > 0;
    }


    // Navegación


    previousSection(): void {
        if (this.currentSection.id.startsWith('fase_')) {
            this.goToSection('informacion_personal');
            return;
        }

        if (!this.isFirstSection) {
            this.currentSectionIndex--;
        }
    }

    nextSection(): void {
        if (!this.isCurrentSectionValid()) {
            return;
        }

        if (this.currentSection.id === 'informacion_personal') {
            const faseId = this.resolveFaseSectionIdByAnioEgreso();

            if (faseId) {
                this.goToSection(faseId);
            }

            return;
        }

        const targetSectionId =
            this.getCurrentSectionTargetSectionId();

        if (targetSectionId) {
            this.goToSection(targetSectionId);
            return;
        }

        if (!this.isLastSection) {
            this.currentSectionIndex++;
        }
    }

    onSubmit(): void {
        this.submitted = true;

        if (
            !this.shouldFinishCurrentSection &&
            !this.isCurrentSectionValid()
        ) {
            return;
        }

        console.log(
            'Respuestas del formulario:',
            this.form.getRawValue(),
        );

        this.showDashboard = true;
    }

    private goToSection(sectionId: string): void {
        const index = this.sections.findIndex(
            (section) => section.id === sectionId,
        );

        if (index !== -1) {
            this.currentSectionIndex = index;
        }
    }

    private isCurrentSectionValid(): boolean {
        const controls = this.currentSection.questions
            .filter((question) => question.type !== 'action')
            .filter((question) => !question.disabled)
            .filter((question) => this.isQuestionVisible(question))
            .filter((question) => !this.isQuestionControlDisabled(question))
            .map((question) => this.form.get(question.id))
            .filter((control) => control !== null);

        controls.forEach((control) => {
            control?.markAsTouched();
            control?.updateValueAndValidity();
        });

        if (this.currentSection.id === 'informacion_personal') {
            const rawValue = this.form.getRawValue() as Record<string, unknown>;

            const missingAutofillFields = this.autofillRequiredFieldIds.some((fieldId) => {
                const value = rawValue[fieldId];

                return value === null || value === undefined || String(value).trim().length === 0;
            });

            if (missingAutofillFields) {
                return false;
            }
        }

        return controls.every(
            (control) => control?.valid,
        );
    }


    // Utilidades para la plantilla


    isFieldInvalid(fieldId: string): boolean {
        const control = this.form.get(fieldId);

        if (
            this.currentSection.id === 'informacion_personal' &&
            this.autofillRequiredFieldIds.includes(fieldId)
        ) {
            const rawValue = this.form.getRawValue() as Record<string, unknown>;
            const value = rawValue[fieldId];

            return Boolean(
                (value === null || value === undefined || String(value).trim().length === 0) &&
                (control?.touched || control?.dirty || this.submitted),
            );
        }

        return Boolean(
            control &&
            control.invalid &&
            (control.touched || this.submitted),
        );
    }

    isQuestionVisible(question: FormQuestion): boolean {
        if (!question.visibleWhen) {
            return true;
        }

        const currentValue = this.form.get(
            question.visibleWhen.questionId,
        )?.value;

        return currentValue === question.visibleWhen.value;
    }

    getQuestionOptions(
        question: FormQuestion,
    ): FormOption[] {
        if (
            !question.dependsOnQuestionId ||
            !question.optionsByValue
        ) {
            return question.options ?? [];
        }

        const dependencyValue = this.form.get(
            question.dependsOnQuestionId,
        )?.value;

        if (typeof dependencyValue !== 'string') {
            return [];
        }

        return question.optionsByValue[dependencyValue] ?? [];
    }

    isQuestionControlDisabled(
        question: FormQuestion,
    ): boolean {
        if (question.disabled) {
            return true;
        }

        if (
            question.type !== 'select' ||
            !question.dependsOnQuestionId
        ) {
            return false;
        }

        return this.getQuestionOptions(question).length === 0;
    }

    trackByQuestionId(
        _: number,
        question: FormQuestion,
    ): string {
        return question.id;
    }

    getOptionCount(
        questionId: string,
        optionValue: string,
    ): number {
        return this.form.get(questionId)?.value === optionValue
            ? 1
            : 0;
    }

    getOptionPercentage(
        questionId: string,
        optionValue: string,
    ): number {
        return this.getOptionCount(
            questionId,
            optionValue,
        ) * 100;
    }


    // Popup y enlaces


    isUrlLink(link?: QuestionLink): boolean {
        return Boolean(
            link &&
            this.resolveLinkAction(link) === 'url' &&
            link.url,
        );
    }

    onQuestionLinkClick(
        link: QuestionLink | undefined,
        event: MouseEvent,
    ): void {
        if (!link) {
            return;
        }

        event.preventDefault();

        const action = this.resolveLinkAction(link);

        if (action === 'popup') {
            this.openPopup(
                link.popupMessage ?? '',
                link.popupTitle ?? 'Información',
            );

            return;
        }

        if (action === 'function' && link.func) {
            this.executeLinkFunction(link.func);
        }
    }

    openPopup(
        message: string,
        title = 'Información',
    ): void {
        this.popupTitle = title;
        this.popupMessage = message;
        this.isPopupVisible = true;
    }

    closePopup(): void {
        this.isPopupVisible = false;
    }

    popupInformativo(): void {
        this.openPopup(
            `Se ha enviado un correo electrónico a su correo institucional
            con la información de su perfil. Revise su bandeja de entrada.`,
            'Información',
        );
    }

    private resolveLinkAction(
        link: QuestionLink,
    ): 'url' | 'popup' | 'function' | null {
        if (link.action) {
            return link.action;
        }

        if (link.url) {
            return 'url';
        }

        if (link.popupMessage) {
            return 'popup';
        }

        if (link.func) {
            return 'function';
        }

        return null;
    }

    private executeLinkFunction(
        functionName: string,
    ): void {
        const handlers: Record<string, () => void> = {
            politicaPrivacidad: () =>
                this.openPopup(
                    this.politicaPrivacidadMessage,
                    'Política de Privacidad',
                ),

            popupInformativo: () =>
                this.popupInformativo(),
        };

        const handler = handlers[functionName];

        if (!handler) {
            console.warn(
                `No existe un manejador para la función: ${functionName}`,
            );

            return;
        }

        handler();
    }


    // Formulario dinámico


    private buildForm(): FormGroup {
        const controlsConfig: Record<string, unknown> = {};

        for (const question of this.questions) {
            if (question.type === 'action') {
                continue;
            }

            controlsConfig[question.id] = [
                {
                    value: '',
                    disabled: Boolean(question.disabled),
                },
                this.getQuestionValidators(question),
            ];
        }

        return this.fb.group(controlsConfig);
    }

    private getQuestionValidators(
        question: FormQuestion,
    ): ValidatorFn[] {
        const validators: ValidatorFn[] = [];

        if (question.required) {
            validators.push(Validators.required);
        }

        if (question.validators?.pattern) {
            validators.push(
                Validators.pattern(
                    question.validators.pattern,
                ),
            );
        }

        if (question.validators?.minLength) {
            validators.push(
                Validators.minLength(
                    question.validators.minLength,
                ),
            );
        }

        if (question.validators?.maxLength) {
            validators.push(
                Validators.maxLength(
                    question.validators.maxLength,
                ),
            );
        }

        return validators;
    }

    private listenFacultadChanges(): void {
    this.form.get('facultad')?.valueChanges
        .pipe(
            distinctUntilChanged(),
            takeUntil(this.destroy$),
        )
        .subscribe(() => {
            this.form.get('carrera')?.reset('', {
                emitEvent: false,
            });
        });
}


    // Cálculo de fase


    private resolveFaseSectionIdByAnioEgreso():

        string | null {

        const value = this.form.get('anio_egreso')?.value;

        const anioEgreso = Number.parseInt(
            String(value),
            10,
        );

        const anioActual = new Date().getFullYear();

        if (
            !Number.isInteger(anioEgreso) ||
            anioEgreso < 1900 ||
            anioEgreso > anioActual
        ) {
            this.selectedFaseSectionId = null;
            return null;
        }

        const aniosDesdeEgreso =
            anioActual - anioEgreso;

        const fase = this.plantillasFases.find(
            (item) => {
                const cumpleMinimo =
                    aniosDesdeEgreso >=
                    item.aniosMinimosDesdeEgreso;

                const cumpleMaximo =
                    item.aniosMaximosDesdeEgreso === null ||
                    aniosDesdeEgreso <=
                    item.aniosMaximosDesdeEgreso;

                return cumpleMinimo && cumpleMaximo;
            },
        );

        this.selectedFaseSectionId =
            fase?.id ?? null;

        return this.selectedFaseSectionId;
    }

    private getCurrentSectionTargetSectionId():
        string | null {

        for (const question of this.currentSection.questions) {
            const selectedValue =
                this.form.get(question.id)?.value;

            const selectedOption =
                question.options?.find(
                    (option) =>
                        option.value === selectedValue,
                );

            if (selectedOption?.targetSectionId) {
                return selectedOption.targetSectionId;
            }
        }

        return null;
    }

    private isQuestionAnswered(
        questionId: string,
    ): boolean {
        const value = this.form.get(questionId)?.value;

        if (value === null || value === undefined) {
            return false;
        }

        if (typeof value === 'string') {
            return value.trim().length > 0;
        }

        return true;
    }


    // Integración académica


    onCorreoPersonaChange(event: Event): void {

        this.correoPersona = (event.target as HTMLInputElement).value;

    }


    obtenerInformacionPersona(): void {

        const correo = this.correoPersona.trim();

        if (!correo) { this.openPopup( 'Ingrese un correo institucional.', 'Información' );
            return;
        }

        this.http.postUPSJBIntegracionesAcademico( { correo }, 'obtener-informacion-persona' ).subscribe({

            next: (res) => {

                const statusCode = Number(
                    res?.status_code ??
                    res?.statusCode,
                );

                const persona = res?.result;

                const detalleAcademico = persona?.detalleInformacionAcademica?.[0];

                if (
                    statusCode !== 200 ||
                    !persona ||
                    !detalleAcademico
                ) {
                    this.openPopup('No se encontró al usuario ingresado.','Información',);
                    return;
                }

                this.form.patchValue({

                    nombresApellidos: [
                        persona.nombre,
                        persona.apellidoPaterno,
                        persona.apellidoMaterno,
                    ]
                        .filter(Boolean)
                        .join(' '),

                    dni: persona.nacionalidadId,

                    sexo:
                        persona.sexo === 'M'
                            ? 'masculino'
                            : 'femenino',

                    sede: this.resolveSedeOptionValue(
                        detalleAcademico.campus,
                    ),

                    anio_egreso: String(
                        detalleAcademico.desAcadTerm ?? '',
                    ).substring(0, 4),

                });

                this.resolveFaseSectionIdByAnioEgreso();

            },

            error: () => {

                this.openPopup(
                    'No se encontró al usuario ingresado.',
                    'Información',
                );

            },

        });

    }


    obtenerSedeLista(): void {

        this.http.get('consultar-sede').subscribe({

            next: (res) => {
                const listaSedes: SedeApiItem[] =
                    Array.isArray(res?.lista)
                        ? res.lista
                        : [];

                const options = listaSedes
                    .filter(
                        (item) =>
                            item.activo !== false,
                    )
                    .map((item) => ({
                        value: String(item.id),
                        text: item.nombre,
                    }));

                const sedeQuestion =
                    this.questions.find(
                        (question) =>
                            question.id === 'sede',
                    );

                if (sedeQuestion) {
                    sedeQuestion.options = options;
                }
            },

            error: () => {
                this.openPopup(
                    'No se pudo obtener la lista de sedes.',
                    'Información',
                );
            },

        });

    }


    obtenerDatoEgresado(tipo: string, documento: string): void {

        const tipoConsulta = tipo.trim();
        const numeroDocumento = documento.trim();

        if (!tipoConsulta || !numeroDocumento) {
            this.openPopup('Debe indicar el tipo de documento y el número de documento.', 'Información');
            return;
        }

        this.http.getUPSJBIntegracionesEgresado( { tipo: tipoConsulta, documento: numeroDocumento }, 'obtenerDato',).subscribe({

            next: (res) => {

                console.log('Respuesta obtenerDato:', res);

                if (res.length === 0) {
                    this.openPopup('No se encontró información del egresado.', 'Información');
                    return;
                }

                const statusCode = Number(
                    res?.status_code ??
                    res?.statusCode,
                );

                const persona = res[0];

                this.form.patchValue({

                    nombresApellidos: persona?.nombre_completo ?? '',

                    anio_egreso: String(
                        persona?.descr_egreso ?? '',
                    ).substring(0, 4),

                });

            },

            error: () => {
                this.openPopup('No se pudo consultar el dato del egresado.', 'Información');
            },

        });

    }


    validarDatoEgresado(): void {

        const tipo = String(this.form.get('tipoDocumentos')?.value ?? '').trim();
        const documento = String(this.form.get('numeroDocumento')?.value ?? '').trim();

        if (!tipo || !documento) {
            this.openPopup('Debe completar el tipo y número de documento.', 'Información');
            return;
        }

        this.obtenerDatoEgresado(tipo, documento);

    }


    private resolveSedeOptionValue( campus?: string | null ): string {

        const normalizedCampus = String(
            campus ?? '',
        )
            .trim()
            .toUpperCase();

        const mapping: Record<string, string> = {
            CP001: '1',
            CP002: '2',
            CP003: '3',
            CP005: '4',
        };

        return mapping[normalizedCampus] ?? '5';

    }

}

