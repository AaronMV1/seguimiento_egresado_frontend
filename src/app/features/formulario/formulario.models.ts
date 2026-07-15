

export type QuestionType = 'text' | 'radio' | 'select' | 'action';
export type LinkAction = 'url' | 'popup' | 'function';
export type ChartType = 'bar' | 'pie' | 'doughnut';


export interface FormOption {
    value: string;
    text: string;
    finishForm?: boolean;
    targetSectionId?: string;
}

export interface QuestionLink {
    text: string;
    action?: LinkAction;
    url?: string;
    func?: string;
    popupTitle?: string;
    popupMessage?: string;
}

export interface QuestionVisibility {
    questionId: string;
    value: string;
}

export interface QuestionDashboard {
    enabled: boolean;
    chartType: ChartType;
    title?: string;
}

export interface QuestionValidators {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
}

export interface FormQuestion {
    id: string;
    numero: number;
    label: string;
    type: QuestionType;
    required: boolean;

    link?: QuestionLink;
    disabled?: boolean;
    placeholder?: string;
    actionLabel?: string;
    options?: FormOption[];
    dependsOnQuestionId?: string;
    optionsByValue?: Record<string, FormOption[]>;
    visibleWhen?: QuestionVisibility;
    dashboard?: QuestionDashboard;
    validators?: QuestionValidators;
}

export interface FormSection {
    id: string;
    title: string;
    description?: string;
    questions: FormQuestion[];
}

export interface PlantillaFase {
    id: string;
    titulo: string;
    aniosMinimosDesdeEgreso: number;
    aniosMaximosDesdeEgreso: number | null;
    etiquetaCohorte: string;
    descripcion: string;
}

export interface SedeApiItem {
    id: number;
    nombre: string;
    activo?: boolean;
}

