

import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Http } from '../../core/services/http';
import Swal from 'sweetalert2';


@Component({
    selector: 'app-encuesta',
    imports: [ CommonModule, FormsModule ],
    templateUrl: './encuesta.html',
    styleUrl: './encuesta.css',
})


export class Encuesta implements OnInit {


    seccionActual = 4;


    readonly totalSecciones = 6;
    seccionFase: number | null = null;
    aniosDesdeEgreso: number | null = null;
    datosEgresadoValidados = false;


    listaSedes: any[] = [];


    consentimiento: string = '';
    tipoDocumento: string = '';
    numeroDocumento: string = '';
    nombresApellidos: string = '';
    genero: string = '';
    sede: number | null = null;
    facultad: number | null = null;
    carrera: number | null = null;
    anioEgreso: string = '';
    correoElectronico: string = '';
    numeroCelular: string = '';
    fase1participacion: string = '';
    fase1situacion: string = '';
    fase1trabajando: string = '';
    fase1primerempleo: string = '';
    fase1medios: string = '';
    fase2satisfaccionestudios: string = '';
    fase2participacion: string = '';
    fase2satisfaccionservicio: string = '';
    fase2planificacion: string = '';
    fase2empresanombre: string = '';
    fase2empresaempleadornombre: string = '';
    fase2empresaempleadorcorreo: string = '';
    fase2empresaempleadornumero: string = '';
    fase3especialidad: string = '';
    fase3participacion: string = '';
    fase3educacioncontinua: string = '';
    fase4investigacion: string = '';
    fase4innovacion: string = '';
    fase4satisfaccion: string = '';


    nombresApellidosLabel: boolean = false;
    generoLabel: boolean = false;
    sedeLabel: boolean = false;
    facultadLabel: boolean = false;
    carreraLabel: boolean = false;
    anioEgresoLabel: boolean = false;
    correoElectronicoLabel: boolean = false;
    numeroCelularLabel: boolean = false;


    tipoDocumentoOptions = [
        { value: '01', text: 'DNI' },
        { value: '02', text: 'Pasaporte' },
        { value: '03', text: 'Otro' }
    ];

    generoOptions = [
        { value: 'M', text: 'Masculino' },
        { value: 'F', text: 'Femenino' },
        { value: 'O', text: 'Otro' },
    ];

    sedeOptions = [
        { value: 1, text: 'Sede Chorrillos' },
        { value: 2, text: 'Sede San Borja' },
        { value: 3, text: 'Filial Ica' },
        { value: 4, text: 'Filial Chincha' },
        { value: 5, text: 'Otros (Lima Norte, etc.)' },
    ];

    facultadOptions = [
        { value: 1, text: 'Ciencias de la Salud' },
        { value: 2, text: 'Ingenierías' },
        { value: 3, text: 'Derecho y Ciencias Empresariales' },
        { value: 4, text: 'Comunicación y Ciencias Administrativas' },
    ];

    carreraOptions = [
        { value: 1, text: 'Medicina Humana' },
        { value: 2, text: 'Enfermería' },
        { value: 3, text: 'Ingeniería de Sistemas' },
        { value: 4, text: 'Ingeniería Industrial' },
        { value: 5, text: 'Derecho' },
        { value: 6, text: 'Administración de Empresas' },
        { value: 7, text: 'Contabilidad' },
        { value: 8, text: 'Comunicación Social' },
    ];



    get seccionTitulo(): string {

        const titulos: Record<number, string> = {
            1: 'Sección 1: Consentimiento Informado',
            2: 'Sección 2: Información Personal',
            3: 'Sección 3: Fase 1 - Información',
            4: 'Sección 4: Fase 2 - Formación',
            5: 'Sección 5: Fase 3 - Autocapacitación',
            6: 'Sección 6: Fase 4 - Innovación',
        };

        return titulos[this.seccionActual] ?? 'Encuesta para Egresado';

    }


    ngOnInit(): void {
        this.obtenerSedeLista();
        this.camposTest()
    }


    constructor( private _http: Http, private readonly cdr: ChangeDetectorRef ) { }



    /*  SERVICIOS   */



    enviarEncuesta(): void {


        if (!this.validarInformacionPersonal()) {
            return;
        }

        if (!this.validarFaseActual()) {

            Swal.fire({
                title: 'Respuestas incompletas',
                text: 'Debe responder todas las preguntas obligatorias antes de enviar la encuesta.',
                icon: 'warning',
                confirmButtonText: 'Entendido',
            });

            return;
        }

        const req = {

            tipoDocumento: this.tipoDocumento.trim(),
            numeroDocumento: this.numeroDocumento.trim(),
            nombresApellidos: this.nombresApellidos.trim(),
            genero: this.genero,
            sede: this.sede,
            facultad: this.facultad,
            carrera: this.carrera,
            anioEgreso: this.anioEgreso,
            correoElectronico: this.correoElectronico.trim(),
            numeroCelular: this.numeroCelular.replace(/\s+/g, ''),

            // fase1participacion: this.fase1participacion,
            // fase1situacion: this.fase1situacion,
            // fase1trabajando: this.fase1trabajando,
            // fase1primerempleo: this.fase1primerempleo,
            // fase1medios: this.fase1medios,
            // fase2satisfaccionestudios: this.fase2satisfaccionestudios,
            // fase2participacion: this.fase2participacion,
            // fase2satisfaccionservicio: this.fase2satisfaccionservicio,
            // fase2planificacion: this.fase2planificacion,
            // fase2empresanombre: this.fase2empresanombre.trim(),
            // fase2empresaempleadornombre: this.fase2empresaempleadornombre.trim(),
            // fase2empresaempleadorcorreo: this.fase2empresaempleadorcorreo.trim(),
            // fase2empresaempleadornumero: this.fase2empresaempleadornumero.replace(/\s+/g, ''),
            // fase3especialidad: this.fase3especialidad,
            // fase3participacion: this.fase3participacion,
            // fase3educacioncontinua: this.fase3educacioncontinua,
            // fase4investigacion: this.fase4investigacion,
            // fase4innovacion: this.fase4innovacion,
            // fase4satisfaccion: this.fase4satisfaccion,
        };

        this._http.post(req, 'enviar-encuesta').subscribe({

                next: () => {

                    this.limpiarFormulario();
                    this.cdr.detectChanges();

                    Swal.fire({
                        title: '¡Encuesta enviada!',
                        text: 'Gracias por completar la encuesta. Sus respuestas fueron registradas correctamente.',
                        icon: 'success',
                        confirmButtonText: 'Aceptar',
                    }).then(() => {

                    });

                },

                error: (err) => {

                    console.error(
                        'Error al enviar la encuesta:',
                        err
                    );

                    Swal.fire({
                        title: 'No se pudo enviar',
                        text: 'Ocurrió un error al registrar la encuesta. Inténtelo nuevamente.',
                        icon: 'error',
                        confirmButtonText: 'Entendido',
                    });

                }

        });

    }

    obtenerSedeLista(): void {

        this._http.get('consultar-sede').subscribe({

            next: (res) => {

                this.listaSedes = res.lista;

                this.cdr.detectChanges();

            },

            error: () => {

            },

        });

    }



    /*  FUNCIONES  */



    private validarInformacionPersonal(): boolean {

        this.nombresApellidos = this.nombresApellidos.trim();
        this.correoElectronico = this.correoElectronico.trim();
        this.numeroCelular = this.numeroCelular.replace(/\s+/g, '');
        this.nombresApellidosLabel = this.esTextoVacio(this.nombresApellidos);
        this.generoLabel = this.esTextoVacio(this.genero);
        this.sedeLabel = this.sede === null || this.sede <= 0;
        this.facultadLabel = this.facultad === null || this.facultad <= 0;
        this.carreraLabel = this.carrera === null || this.carrera <= 0;
        this.anioEgresoLabel = !this.esAnioEgresoValido(this.anioEgreso);
        this.correoElectronicoLabel = !this.esCorreoValido(this.correoElectronico);
        this.numeroCelularLabel = !this.esCelularValido(this.numeroCelular);

        const hayCamposInvalidos =
            this.nombresApellidosLabel ||
            this.generoLabel ||
            this.sedeLabel ||
            this.facultadLabel ||
            this.carreraLabel ||
            this.anioEgresoLabel ||
            this.correoElectronicoLabel ||
            this.numeroCelularLabel;

        if (!this.datosEgresadoValidados) {

            Swal.fire({
                title: 'Validación pendiente',
                text: 'Debe validar los datos del egresado antes de continuar.',
                icon: 'warning',
                confirmButtonText: 'Entendido',
            });

            return false;
        }

        if (hayCamposInvalidos) {

            Swal.fire({
                title: 'Información incompleta',
                text: 'Revise los campos marcados antes de continuar.',
                icon: 'warning',
                confirmButtonText: 'Entendido',
            });

            return false;
        }

        return true;

    }

    validarDatoEgresado() {

        this.tipoDocumento = this.tipoDocumento.trim();
        this.numeroDocumento = this.numeroDocumento.trim();

        if (!this.tipoDocumento || !this.numeroDocumento) {

            Swal.fire({
                title: 'Campos incompletos',
                text: 'Por favor, complete todos los campos requeridos.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
            });

            return;

        }

        this._http.getUPSJBIntegracionesEgresado( { tipo: this.tipoDocumento, documento: this.numeroDocumento }, 'obtenerDato').subscribe({

            next: (res) => {

                // res.reverse();

                const egresado = res?.[0];

                if (!egresado?.nombre_completo && !egresado?.descr_egreso) {
                    Swal.fire({
                        title: 'Datos no encontrados',
                        text: 'No se encontraron datos del egresado.\nPor favor, verifique la información e inténtelo nuevamente.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar',
                    });
                    return;
                }

                this.nombresApellidos = String(egresado.nombre_completo).trim();
                this.anioEgreso = this.obtenerAnioEgreso(egresado.descr_egreso);
                this.seccionFase =this.calcularSeccionSegunAnioEgreso();

                if (!this.seccionFase) {

                    Swal.fire({
                        title: 'Datos no encontrados',
                        text: 'No se pudo determinar la fase del egresado.\nPor favor, verifique el año de egreso e inténtelo nuevamente.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar',
                    });

                    return;

                }

                this.datosEgresadoValidados = true;

                // Fuerza la actualización inmediata del HTML.
                this.cdr.detectChanges();

            },

            error: () => {
                alert("Ocurrió un error al validar los datos del egresado.\nPor favor, inténtelo nuevamente más tarde.");
            },

        });

    }

    private calcularSeccionSegunAnioEgreso(): number | null {

        const anio = Number(this.anioEgreso);
        const anioActual = new Date().getFullYear();

        if (
            !Number.isInteger(anio) ||
            anio < 1900 ||
            anio > anioActual
        ) {
            return null;
        }

        const aniosTranscurridos = anioActual - anio;

        this.aniosDesdeEgreso = aniosTranscurridos;

        if (aniosTranscurridos <= 3) {
            return 3;
        }

        if (aniosTranscurridos <= 5) {
            return 4;
        }

        if (aniosTranscurridos <= 7) {
            return 5;
        }

        return 6;
    }

    private obtenerAnioEgreso(valor: unknown): string {

        const texto = String(valor ?? '').trim();
        const coincidencia = texto.match(/\d{4}/);
        return coincidencia?.[0] ?? '';

    }



    /*  NAVEGACIÓN ENTRE SECCIONES   */



    goToSection(section: number): void {

        if (!this.canNavigateTo(section)) {
            return;
        }

        if (section < 1 || section > this.totalSecciones) {
            return;
        }

        this.seccionActual = section;

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }

    nextSection(): void {

        if (this.seccionActual === 1) {
            this.goToSection(2);
            return;
        }

        if (this.seccionActual === 2) {

            if (!this.validarInformacionPersonal()) {
                return;
            }

            if (!this.seccionFase) {
                alert('Primero debe validar los datos del egresado.');
                return;
            }

            this.goToSection(this.seccionFase);
            return;
        }

        //  Validar Formulario

    }

    previousSection(): void {

        if (this.seccionActual >= 3) {
            this.goToSection(2);
            return;
        }

        if (this.seccionActual > 1) {
            this.goToSection(this.seccionActual - 1);
        }

    }

    private canNavigateTo(targetSection: number): boolean {

        const isMovingForward = targetSection > this.seccionActual;

        if (
            this.seccionActual === 1 &&
            isMovingForward &&
            this.consentimiento !== 'si'
        ) {

            Swal.fire({
                title: 'Consentimiento requerido',
                text: 'Para continuar con la encuesta, debe aceptar el consentimiento informado.',
                icon: 'warning',
                confirmButtonText: 'Entendido',
            });

            return false;
        }

        return true;
    }



    /*  UTILIDADES  */



    camposTest(): void {
        this.tipoDocumento = '01';
        this.numeroDocumento = '75116260';
        this.genero = 'M';
        this.sede = 1;
        this.facultad = 1;
        this.carrera = 1;
        this.correoElectronico = 'aaron-mv@outlook.com';
        this.numeroCelular = '933216749';
    }

    limpiarFormulario(): void {

        this.consentimiento = '';
        this.tipoDocumento = '';
        this.numeroDocumento = '';
        this.nombresApellidos = '';
        this.genero = '0';
        this.sede = 0;
        this.facultad = 0;
        this.carrera = 0;
        this.anioEgreso = '';
        this.correoElectronico = '';
        this.numeroCelular = '';

        this.fase1participacion = '';
        this.fase1situacion = '';
        this.fase1trabajando = '';
        this.fase1primerempleo = '';
        this.fase1medios = '';

        this.fase2satisfaccionestudios = '';
        this.fase2participacion = '';
        this.fase2satisfaccionservicio = '';
        this.fase2planificacion = '';
        this.fase2empresanombre = '';
        this.fase2empresaempleadornombre = '';
        this.fase2empresaempleadorcorreo = '';
        this.fase2empresaempleadornumero = '';

        this.fase3especialidad = '';
        this.fase3participacion = '';
        this.fase3educacioncontinua = '';

        this.fase4investigacion = '';
        this.fase4innovacion = '';
        this.fase4satisfaccion = '';

        this.seccionActual = 1;
        this.seccionFase = null;
        this.aniosDesdeEgreso = null;
        this.datosEgresadoValidados = false;

    }

    cambioDNI(): void {
        this.nombresApellidos = '';
        this.anioEgreso = '';
        this.seccionFase = null;
        this.aniosDesdeEgreso = null;
        this.datosEgresadoValidados = false;
        this.cdr.detectChanges();
    }



    /*  VALIDACIONES  */



    private validarFaseActual(): boolean {

    if (this.seccionFase === 3) {

        const valido =
            !this.esTextoVacio(
                this.fase1participacion
            ) &&
            !this.esTextoVacio(
                this.fase1situacion
            ) &&
            !this.esTextoVacio(
                this.fase1trabajando
            ) &&
            !this.esTextoVacio(
                this.fase1primerempleo
            ) &&
            !this.esTextoVacio(
                this.fase1medios
            );

        return valido;
    }

    if (this.seccionFase === 4) {

        const preguntasPrincipalesValidas =
            !this.esTextoVacio(
                this.fase2satisfaccionestudios
            ) &&
            !this.esTextoVacio(
                this.fase2participacion
            ) &&
            !this.esTextoVacio(
                this.fase2satisfaccionservicio
            ) &&
            !this.esTextoVacio(
                this.fase2planificacion
            );

        const correoJefeValido =
            this.esTextoVacio(
                this.fase2empresaempleadorcorreo
            ) ||
            this.esCorreoValido(
                this.fase2empresaempleadorcorreo
            );

        const telefonoJefeValido =
            this.esTextoVacio(
                this.fase2empresaempleadornumero
            ) ||
            this.esCelularValido(
                this.fase2empresaempleadornumero
            );

        return (
            preguntasPrincipalesValidas &&
            correoJefeValido &&
            telefonoJefeValido
        );
    }

    if (this.seccionFase === 5) {

        return (
            !this.esTextoVacio(
                this.fase3especialidad
            ) &&
            !this.esTextoVacio(
                this.fase3participacion
            ) &&
            !this.esTextoVacio(
                this.fase3educacioncontinua
            )
        );
    }

    if (this.seccionFase === 6) {

        return (
            !this.esTextoVacio(
                this.fase4investigacion
            ) &&
            !this.esTextoVacio(
                this.fase4innovacion
            ) &&
            !this.esTextoVacio(
                this.fase4satisfaccion
            )
        );
    }

    return false;
    }

    private esTextoVacio(valor: unknown): boolean {
        return String(valor ?? '').trim().length === 0;
    }

    private esCorreoValido(correo: string): boolean {
        const valor = correo.trim();

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
    }

    private esCelularValido(celular: string): boolean {
        const valor = celular.replace(/\s+/g, '');

        return /^9\d{8}$/.test(valor);
    }

    private esAnioEgresoValido(anioEgreso: string): boolean {
        const anio = Number(anioEgreso);
        const anioActual = new Date().getFullYear();

        return (
            Number.isInteger(anio) &&
            anio >= 1900 &&
            anio <= anioActual
        );
    }

}

