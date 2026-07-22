

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
    selector: 'app-elementos',
    imports: [CommonModule, FormsModule],
    templateUrl: './elementos.html',
    styleUrl: './elementos.css',
})


export class Elementos {


    //#region   Example 1


    facultad: number = 0;
    carrera: number = 0;


    facultades = [
        { value: 1, text: 'Ciencias de la Salud' },
        { value: 2, text: 'Ingenierías' },
        { value: 3, text: 'Derecho y Ciencias Empresariales' },
    ];


    carreras: Record<number, { value: number; text: string }[]> = {
        1: [
            { value: 1, text: 'Medicina Humana' },
            { value: 2, text: 'Enfermería' },
            { value: 3, text: 'Estomatología' },
            { value: 4, text: 'Psicología' },
        ],
        2: [
            { value: 1, text: 'Ingeniería de Sistemas' },
            { value: 2, text: 'Ingeniería Civil' },
            { value: 3, text: 'Ingeniería Agroindustrial' },
            { value: 4, text: 'Ingeniería en Enología y Viticultura' },
        ],
        3: [
            { value: 1, text: 'Derecho' },
            { value: 2, text: 'Contabilidad' },
            { value: 3, text: 'Administración de Empresas' },
            { value: 4, text: 'Turismo, Hotelería y Gastronomía' },
        ],
    };


    get carreraOptionsLista(): { value: number; text: string }[] {
        return this.carreras[this.facultad] ?? [];
    }

    cambiarFacultad(): void {
        this.carrera = 0;
    }


    //#endregion

    //#region   Example 2


    correoElectronico: string = '';
    numeroCelular: string = '';
    nombreCompleto: string = '';

    correoTocado: boolean = false;
    numeroTocado: boolean = false;
    textoTocado: boolean = false;

    correoValido: boolean = false;
    numeroValido: boolean = false;
    textoValido: boolean = false;


    validarCorreo(): void {

        // Convierte el correo a minúsculas.
        this.correoElectronico = this.correoElectronico.toLowerCase();

        // \s representa espacios, tabulaciones o saltos de línea.
        // g busca todas las coincidencias.
        // Elimina todos los espacios del correo.
        const regexEspacios = /\s/g;

        this.correoElectronico = this.correoElectronico.replace(regexEspacios, '');

        // ^ indica el inicio del texto.
        // [^\s@]+ permite uno o más caracteres que no sean espacios ni @.
        // @ exige la presencia de una arroba.
        // \. exige un punto literal.
        // $ indica el final del texto.
        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        this.correoValido = regexCorreo.test(this.correoElectronico);

    }


    validarNumero(): void {

        // \D representa cualquier carácter que no sea un número.
        // g busca todas las coincidencias.
        // Elimina letras, espacios y símbolos.
        const regexLimpieza = /\D/g;

        this.numeroCelular = this.numeroCelular.replace(regexLimpieza, '');
        // ^ indica el inicio del texto.
        // 9 obliga a que el celular comience con 9.
        // [0-9] permite cualquier número entre 0 y 9.
        // {8} exige exactamente ocho números adicionales.
        // $ indica el final del texto.
        const regexNumero = /^9[0-9]{8}$/;

        this.numeroValido = regexNumero.test(this.numeroCelular);

    }


    validarTexto(): void {

        // Dentro de los corchetes, ^ significa "todo lo que no sea".

        // a-z permite letras minúsculas.
        // A-Z permite letras mayúsculas.
        // áéíóúÁÉÍÓÚ permite vocales con tilde.
        // ñÑ permite la letra eñe.
        // El espacio final permite nombres compuestos.
        // g busca todas las coincidencias inválidas.
        const regexLimpieza = /[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g;

        // Elimina números y símbolos mientras el usuario escribe.
        this.nombreCompleto = this.nombreCompleto.replace(regexLimpieza, '');

        // Valida que exista al menos una letra.
        // También permite espacios entre palabras.
        const regexTexto = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/;

        this.textoValido = regexTexto.test(this.nombreCompleto.trim());

    }


    //#endregion

    //#region   Example 3


    nombresCompletos: string = '';

    nombresCompletosTocado: boolean = false;
    nombresCompletosValido: boolean = false;


    blurNombreCompleto(): void {

        if (this.nombresCompletos.length <= 4) {
            this.nombresCompletosValido = false;
        } else {
            this.nombresCompletosValido = true;
        }
        this.nombresCompletosTocado = true;

    }


    //#endregion

    //#region   Example 4


    buscar = '';
    ciudadSeleccionada = '';
    carreraSeleccionada = '';


    personas: any[] = [
        { nombre: 'Jesús', edad: 25, ciudad: 'Lima', carrera: 'Ingeniería de Sistemas' },
        { nombre: 'María', edad: 30, ciudad: 'Cusco', carrera: 'Medicina Humana' },
        { nombre: 'Marco', edad: 22, ciudad: 'Arequipa', carrera: 'Arquitectura' },
        { nombre: 'Leydi', edad: 22, ciudad: 'Ica', carrera: 'Derecho' },
        { nombre: 'Carlos', edad: 28, ciudad: 'Lima', carrera: 'Ingeniería Civil' },
        { nombre: 'Ana', edad: 27, ciudad: 'Cusco', carrera: 'Psicología' },
        { nombre: 'Luis', edad: 24, ciudad: 'Arequipa', carrera: 'Contabilidad' },
        { nombre: 'Sofía', edad: 29, ciudad: 'Ica', carrera: 'Administración de Empresas' },
        { nombre: 'Pedro', edad: 26, ciudad: 'Lima', carrera: 'Ingeniería Agroindustrial' },
        { nombre: 'Valeria', edad: 23, ciudad: 'Cusco', carrera: 'Turismo, Hotelería y Gastronomía' },
    ];


    get ciudadesFiltro(): string[] {

        // Obtiene todas las ciudades sin repetirlas.
        return [...new Set(this.personas.map(persona => persona.ciudad))];

    }

    get carrerasFiltro(): string[] {

        // Obtiene todas las carreras sin repetirlas.
        return [...new Set(this.personas.map(persona => persona.carrera))];

    }

    get personasFiltradas() {

        return this.personas.filter(persona => {

            const coincideBusqueda =
                persona.nombre.toLowerCase().includes(this.buscar.toLowerCase()) ||
                persona.edad.toString().includes(this.buscar);

            const coincideCiudad =
                !this.ciudadSeleccionada ||
                persona.ciudad === this.ciudadSeleccionada;

            const coincideCarrera =
                !this.carreraSeleccionada ||
                persona.carrera === this.carreraSeleccionada;

            return (
                coincideBusqueda &&
                coincideCiudad &&
                coincideCarrera
            );

        });

    }


    //#endregion


}

