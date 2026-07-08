

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';


interface CompetenciaUniversidad {
    nombre: string;
    descripcion: string;
    icono: string;
}

interface CompetenciaCompleja {
    nombre: string;
    descripcion: string;
    icono: string;
}

interface FaseModelo {
    numero: number;
    titulo: string;
    rango: string;
    imagen: string;
    competencia: string;
    objetivo: string;
    pregunta: string;
    accionesEgresado: string[];
    accionesUniversidad: string[];
    ejemplo: string;
    icono: string;
}

interface ItemIconoTexto {
    texto: string;
    icono: string;
}


@Component({
    selector: 'app-modelo-gestion',
    imports: [NgOptimizedImage],
    templateUrl: './modelo-gestion.html',
    styleUrl: './modelo-gestion.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})


export class ModeloGestion {


    readonly competenciasUniversidad: CompetenciaUniversidad[] = [
        { nombre: 'Cognitiva', descripcion: '(Saber)', icono: 'ti-brain' },
        { nombre: 'Procedimental', descripcion: '(Saber hacer)', icono: 'ti-settings' },
        { nombre: 'Actitudinal', descripcion: '(Saber ser)', icono: 'ti-heart-handshake' },
    ];

    readonly competenciasComplejas: CompetenciaCompleja[] = [
        { nombre: 'Información', descripcion: '(Me informo y me inserto)', icono: 'ti-report-search' },
        { nombre: 'Formación', descripcion: '(Me evaluo y mejoro)', icono: 'ti-book' },
        { nombre: 'Autocapacitación', descripcion: '(Me capacito y me especializo)', icono: 'ti-chart-line' },
        { nombre: 'Innovación', descripcion: '(Aporto e investigo)', icono: 'ti-bulb' },
    ];

    readonly fases: FaseModelo[] = [
        {
            numero: 1,
            titulo: 'Fase 1',
            rango: '0 a 3 años de egreso',
            imagen: 'assets/images/modelo/F1.png',
            competencia: 'Información',
            objetivo: 'Lograr la inserción laboral del egresado en su profesión.',
            pregunta: '¿Qué hace el egresado?',
            accionesEgresado: [
                'Arma su CV y se pone hermoso.',
                'Busca cursos, seminarios y certificaciones.',
                'Busca su primer empleo relacionado a su carrera.',
            ],
            accionesUniversidad: [
                'Actualiza datos y contacto con egresados.',
                'Ofrece bolsa de trabajo y oportunidades.',
                'Orienta en empleabilidad y CV.',
                'Acompaña en procesos clave (SERUMS, colegiatura, etc.).',
            ],
            ejemplo:
                'Un empleador evalúa el desempeño de uno de nuestros egresados, destacando sus fortalezas y señalando las debilidades identificadas durante el ejercicio profesional. Esta información sirve como insumo para fortalecer las competencias del perfil de egreso y realizar mejoras en los planes curriculares.',
            icono: 'ti-id-badge-2',
        },
        {
            numero: 2,
            titulo: 'Fase 2',
            rango: '4 a 5 años de egreso',
            imagen: 'assets/images/modelo/F2.png',
            competencia: 'Formación',
            objetivo: 'Evaluar la formación recibida y retroalimentar el currículo.',
            pregunta: '¿Qué hace el egresado?',
            accionesEgresado: [
                'Se autoevalúa en sus líneas de carrera.',
                'Identifica fortalezas y debilidades.',
                'Valora qué le sirvió y qué necesita mejorar.',
            ],
            accionesUniversidad: [
                'Evalúa al egresado (autoevaluación).',
                'Evalúa al empleador (desempeño profesional).',
                'Analiza resultados y detecta brechas.',
                'Realimenta y mejora el plan curricular.',
            ],
            ejemplo:
                'Un medico descubre que en investigación y salud publica no fue bien formado. La universidad ajusta su plan para fortalecer esas areas.',
            icono: 'ti-clipboard-check',
        },
        {
            numero: 3,
            titulo: 'Fase 3',
            rango: '6 a 7 años de egreso',
            imagen: 'assets/images/modelo/F3.png',
            competencia: 'Autocapacitación',
            objetivo: 'Impulsar el crecimiento y la especialización profesional.',
            pregunta: '¿Qué hace el egresado?',
            accionesEgresado: [
                'Realiza maestrias, doctorados, especialidades, idiomas y MBA.',
                'Participa en cursos y diplomados.',
                'Busca desarrollarse continuamente.',
            ],
            accionesUniversidad: [
                'Ofrece Educación Continua (cursos, diplomados).',
                'Otorga becas y beneficios para posgrados.',
                'Acompaña y asesora en su desarrollo.',
                'Motiva y promueve su crecimiento.',
            ],
            ejemplo:
                'De 100 egresados, 20 logran maestria/doctorado y 80 todavia no. La universidad ofrece becas y cursos para impulsar a los que aun no dan el siguiente paso.',
            icono: 'ti-school',
        },
        {
            numero: 4,
            titulo: 'Fase 4',
            rango: '8 años a más de egreso',
            imagen: 'assets/images/modelo/F4.png',
            competencia: 'Innovación',
            objetivo: 'Fomentar la innovación, investigación y generación de impacto.',
            pregunta: '¿Qué hace el egresado?',
            accionesEgresado: [
                'Investiga y publica (papers, libros).',
                'Desarrolla patentes, productos o técnicas innovadoras.',
                'Asume roles de liderazgo y aporta a la sociedad.',
            ],
            accionesUniversidad: [
                'Promueve investigación e innovación.',
                'Capacita en patentes, publicaciones y registro de obras.',
                'Visibiliza logros de egresados exitosos.',
                'Genera redes y alianzas estratégicas.',
            ],
            ejemplo:
                'Un egresado desarrolla una técnica odontológica innovadora y obtiene su patente; otro publica libros y artículos científicos de alto impacto. La universidad reconoce y visibiliza estos logros como referentes para la comunidad académica. Asimismo, a través del área de Seguimiento al Egresado, acompaña y promueve el desarrollo de aquellos profesionales que aún no han alcanzado estos resultados, brindándoles oportunidades para fortalecer sus capacidades en investigación, innovación y desarrollo tecnológico.',
            icono: 'ti-rocket',
        },
    ];

    readonly pilaresTransversales: ItemIconoTexto[] = [
        { texto: 'Vinculación con egresados', icono: 'ti-users-group' },
        { texto: 'Comunicación permanente', icono: 'ti-speakerphone' },
        { texto: 'Datos e indicadores', icono: 'ti-chart-bar' },
        { texto: 'Acompañamiento continuo', icono: 'ti-user-heart' },
        { texto: 'Mejora constante', icono: 'ti-target-arrow' },
    ];

    readonly resultadosEsperados: ItemIconoTexto[] = [
        { texto: 'Egresados insertados laboralmente en su profesión', icono: 'ti-briefcase-2' },
        { texto: 'Currículos actualizados con información real del entorno laboral', icono: 'ti-adjustments-alt' },
        { texto: 'Egresados más capacitados y especializados', icono: 'ti-certificate' },
        { texto: 'Innovación, investigación y generación de impacto en la sociedad', icono: 'ti-bulb' },
        { texto: 'Orgullo e identidad UPSJB fortalecida', icono: 'ti-trophy' },
    ];
}
