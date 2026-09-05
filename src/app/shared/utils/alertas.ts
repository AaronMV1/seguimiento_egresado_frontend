
import { HttpErrorResponse } from '@angular/common/http';
import Swal, { SweetAlertIcon } from 'sweetalert2';


export class Alertas {


    static mostrar(title: string, text: string, icon: SweetAlertIcon = 'info', confirmButtonText: string = 'Aceptar') {

        return Swal.fire({
            title,
            text,
            icon,
            confirmButtonText,
        });

    }

    static exito(title: string, text: string, confirmButtonText: string = 'Aceptar') {
        return this.mostrar(title, text, 'success', confirmButtonText);
    }

    static advertencia(title: string, text: string, confirmButtonText: string = 'Entendido') {
        return this.mostrar(title, text, 'warning', confirmButtonText);
    }

    static error(title: string, text: string, confirmButtonText: string = 'Entendido') {
        return this.mostrar(title, text, 'error', confirmButtonText);
    }

    //  Popup para cuando el navegador no tiene conexión a internet.
    static sinConexion() {

        return this.error(
            'Sin conexión a internet',
            'No se detectó conexión a internet. Verifique su red e inténtelo nuevamente.',
            'Entendido',
        );

    }

    //  Analiza un error HTTP (o la ausencia de red) y muestra el popup más adecuado según el caso.
    static porErrorHttp(err: unknown, mensajePorDefecto: string = 'Ocurrió un error inesperado. Inténtelo nuevamente más tarde.') {

        if (typeof navigator !== 'undefined' && navigator.onLine === false) {
            return this.sinConexion();
        }

        const errorHttp = err instanceof HttpErrorResponse ? err : null;
        const status = errorHttp?.status;

        //  status 0 => el navegador no pudo contactar al servidor (sin red, servidor caído, CORS, etc.)
        if (status === 0) {
            return this.sinConexion();
        }

        if (status === 409) {

            const mensaje = errorHttp?.error?.mensaje ?? 'El registro ya existe.';

            return this.advertencia('Encuesta ya registrada', mensaje);

        }

        if (status === 401 || status === 403) {

            return this.error(
                'Sesión no autorizada',
                'Su sesión no es válida o ha expirado. Vuelva a iniciar sesión.',
            );

        }

        if (status === 404) {

            return this.error(
                'Servicio no disponible',
                'No se pudo contactar con el servicio solicitado. Inténtelo nuevamente más tarde.',
            );

        }

        if (status && status >= 500) {

            return this.error(
                'Error en el servidor',
                'Ocurrió un problema en el servidor. Inténtelo nuevamente más tarde.',
            );

        }

        return this.error('No se pudo completar la acción', mensajePorDefecto);

    }

}
