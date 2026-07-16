

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


    seccionActual = 6;


    readonly totalSecciones = 6;
    seccionFase: number | null = null;
    aniosDesdeEgreso: number | null = null;
    datosEgresadoValidados = false;


    listaSedes: any[] = [];


    consentimiento: string = '';
    tipoDocumento: string = '';
    numeroDocumento: string = '';
    nombresApellidos: string = '';
    sede: string = '';
    facultad: string = '';
    carrera: string = '';
    anioEgreso: string = '';
    correoElectronico: string = '';
    celular: string = '';

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



    tipoDocumentoOptions = [
        { value: '01', text: 'DNI' },
        { value: '02', text: 'Pasaporte' },
        { value: '03', text: 'Otro' },
    ];

    sedeOptions = [
        { value: 'Sede Chorrillos', text: 'Sede Chorrillos' },
        { value: 'Sede San Borja', text: 'Sede San Borja' },
        { value: 'Filial Ica', text: 'Filial Ica' },
        { value: 'Filial Chincha', text: 'Filial Chincha' },
        { value: 'Otros (Lima Norte, etc.)', text: 'Otros (Lima Norte, etc.)' },
    ];

    facultadOptions = [
        { value: '01', text: 'Ciencias de la Salud' },
        { value: '02', text: 'Ingenierías' },
        { value: '03', text: 'Derecho y Ciencias Empresariales' },
        { value: '04', text: 'Comunicación y Ciencias Administrativas' },
    ];

    carreraOptions = [
        { value: '01', text: 'Medicina Humana' },
        { value: '02', text: 'Enfermería' },
        { value: '03', text: 'Ingeniería de Sistemas' },
        { value: '04', text: 'Ingeniería Industrial' },
        { value: '05', text: 'Derecho' },
        { value: '06', text: 'Administración de Empresas' },
        { value: '07', text: 'Contabilidad' },
        { value: '08', text: 'Comunicación Social' },
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
    }


    constructor(
        private _http: Http,
        private readonly cdr: ChangeDetectorRef,
    ) { }


    //  Navigation


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
            alert(
                'Debe aceptar el consentimiento informado para continuar.',
            );

            return false;
        }

        return true;
    }


    validarDatoEgresado() {

        this.tipoDocumento = this.tipoDocumento.trim();
        this.numeroDocumento = this.numeroDocumento.trim();

        if (!this.tipoDocumento || !this.numeroDocumento) {
            // alert('Por favor, complete todos los campos requeridos.');
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

                res.reverse();

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
                    alert('No se pudo determinar la fase del egresado.',);
                    Swal.fire({
                        title: 'Datos no encontrados',
                        text: 'No se pudo determinar la fase del egresado.\nPor favor, verifique el año de egreso e inténtelo nuevamente.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar',
                    });
                    return;
                }

                this.datosEgresadoValidados = true;

                console.log({
                    anioEgreso: this.anioEgreso,
                    aniosDesdeEgreso: this.aniosDesdeEgreso,
                    seccionFase: this.seccionFase,
                });

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

    private validarInformacionPersonal(): boolean {

        if (!this.datosEgresadoValidados) {
            alert('Debe validar los datos del egresado antes de continuar.',);
            return false;
        }

        if (!this.nombresApellidos.trim()) {
            alert('No se encontraron los nombres del egresado.');
            return false;
        }

        if (!this.facultad) {
            alert('Seleccione una facultad.');
            return false;
        }

        if (!this.carrera) {
            alert('Seleccione una carrera.');
            return false;
        }

        if (!this.anioEgreso) {
            alert('No se encontró el año de egreso.');
            return false;
        }

        if (!this.correoElectronico.trim()) {
            alert('Ingrese su correo electrónico personal.');
            return false;
        }

        if (!this.celular.trim()) {
            alert('Ingrese su número de celular.');
            return false;
        }

        return true;

    }



    enviarEncuesta(): void {

        console.log({

            consentimiento: this.consentimiento,
            tipoDocumento: this.tipoDocumento,
            numeroDocumento: this.numeroDocumento,
            nombresApellidos: this.nombresApellidos,
            sede: this.sede,
            facultad: this.facultad,
            carrera: this.carrera,
            anioEgreso: this.anioEgreso,
            correoElectronico: this.correoElectronico,
            celular: this.celular,
            fase: this.seccionFase,
            aniosDesdeEgreso: this.aniosDesdeEgreso,

            fase1participacion: this.fase1participacion,
            fase1situacion: this.fase1situacion,
            fase1trabajando: this.fase1trabajando,
            fase1primerempleo: this.fase1primerempleo,
            fase1medios: this.fase1medios,

            fase2satisfaccionestudios: this.fase2satisfaccionestudios,
            fase2participacion: this.fase2participacion,
            fase2satisfaccionservicio: this.fase2satisfaccionservicio,
            fase2planificacion: this.fase2planificacion,
            fase2empresanombre: this.fase2empresanombre,
            fase2empresaempleadornombre: this.fase2empresaempleadornombre,
            fase2empresaempleadorcorreo: this.fase2empresaempleadorcorreo,
            fase2empresaempleadornumero: this.fase2empresaempleadornumero,

            fase3especialidad: this.fase3especialidad,
            fase3participacion: this.fase3participacion,
            fase3educacioncontinua: this.fase3educacioncontinua,

            fase4investigacion: this.fase4investigacion,
            fase4innovacion: this.fase4innovacion,
            fase4satisfaccion: this.fase4satisfaccion,

        });

        Swal.fire({
            title: '¡Encuesta enviada!',
            text: 'Gracias por completar la encuesta. Sus respuestas han sido registradas exitosamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
        }).then((result) => {
            if (result.isConfirmed) {
                // console.log('Aceptar presionado');
            }
        });

        this.limpiarFormulario();

    }

    limpiarFormulario(): void {

        this.consentimiento = '';
        this.tipoDocumento = '';
        this.numeroDocumento = '';
        this.nombresApellidos = '';
        this.sede = '';
        this.facultad = '';
        this.carrera = '';
        this.anioEgreso = '';
        this.correoElectronico = '';
        this.celular = '';

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



    /*  SERVICIOS   */


    obtenerSedeLista(): void {

        this._http.get('consultar-sede').subscribe({

            next: (res) => {

                this.listaSedes = res.lista;

            },

            error: () => {

            },

        });

    }



}
