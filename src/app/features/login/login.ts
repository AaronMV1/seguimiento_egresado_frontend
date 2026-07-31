

import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthSessionService } from '../../core/services/auth-session.service';
import { Http } from '../../core/services/http';

import Swal from 'sweetalert2';
import { FormsModule } from "@angular/forms";


@Component({
    selector: 'app-login',
    imports: [FormsModule, CommonModule],
    templateUrl: './login.html',
    styleUrl: './login.css',
})


export class Login {


    private readonly http = inject(Http);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly authSession = inject(AuthSessionService);


    registroActivo: number = 0;
    loginForm: boolean = true;
    registroForm: boolean = false;


    anio: number = new Date().getFullYear();


    login() {

        const test = false;

        const req = {
            correo: (<HTMLInputElement>document.querySelector('#correo')).value,
            contrasena: (<HTMLInputElement>document.querySelector('#contrasena')).value,
            rol: (<HTMLSelectElement>document.querySelector('#rol')).value,
        }

        if (!test) {


            this.http.post(req, 'enviar-login').subscribe({

                next: (res) => {

                    if (String(res?.estado) !== '200') {

                        Swal.fire({
                            title: 'Datos incorrectos',
                            // text: res?.mensaje ?? 'Verifique sus credenciales e inténtelo nuevamente.',
                            text: 'Verifique sus credenciales e inténtelo nuevamente.',
                            icon: 'error',
                            confirmButtonText: 'Entendido',
                        });

                        return;

                    }

                    const sesionRegistrada = this.authSession.registerSession(res); //  Para el Guard y AuthSessionService, se registra la sesión en el localStorage y se actualiza el estado de autenticación.

                    if (!sesionRegistrada) {

                        console.error(
                            'La respuesta del backend no confirmó la sesión.'
                        );

                        Swal.fire({
                            title: 'No se pudo iniciar la sesión',
                            text: 'La autenticación fue correcta, pero no se pudo registrar la sesión.',
                            icon: 'error',
                            confirmButtonText: 'Entendido',
                        });

                        return;
                    }

                    Swal.fire({
                        title: '¡Bienvenido!',
                        text: res?.mensaje ?? 'Ha iniciado sesión correctamente.',
                        icon: 'success',
                        confirmButtonText: 'Continuar',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                    }).then((result) => {

                        if (!result.isConfirmed) {
                            return;
                        }

                        const returnUrl =
                            this.route.snapshot.queryParamMap.get(
                                'returnUrl'
                            ) ?? '/private/dashboard';

                        void this.router.navigateByUrl(returnUrl);

                    });

                },

            });

            return

        }


        if (req.correo === 'admin' && req.contrasena === 'admin' && req.rol === '1') {

            this.authSession.registerSession(true);

            const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/private/dashboard';

            void this.router.navigateByUrl(returnUrl);

            Swal.fire({
                title: '¡Bienvenid@!',
                text: 'Ha iniciado sesión correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar',
            });

        } else {

            Swal.fire({
                title: 'Usuario o contraseña incorrectos',
                text: 'Por favor, inténtelo nuevamente.',
                icon: 'error',
                confirmButtonText: 'Entendido',
            });

        }


        //#endregion



    }


    activarRegistro() {

        this.registroActivo++;

        if (this.registroActivo == 11) {
            this.registroActivo = 0;
            this.loginForm = true;
            this.registroForm = false;
            return;
        }

        if (this.registroActivo == 10) {

            this.loginForm = false;
            this.registroForm = true;

        }

    }


}
