

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';


@Injectable({
    providedIn: 'root',
})


export class Http {


    constructor(private http: HttpClient) { }


    public get(collection: string): Observable<any> {

        const url = environment.apiBackend.backend + collection;

        return this.http.get<any>(url).pipe(
            tap((data: any) => {

            }),
            catchError(err => {
                throw 'Error in source. Details: ' + err;
            }),
        );

    }


    public getUPSJBIntegracionesEgresado(
        req: { tipo: string; documento: string },
        collection: string,
    ): Observable<any> {

        const url = environment.apiUniversidad.integraciones.egresado.apiURL + collection;

        return this.http.get<any>(url, {
            params: {
                tipo: req.tipo,
                documento: req.documento,
            },
        }).pipe(
            tap((data: any) => {

            }),
            catchError(err => {
                throw 'Error in source. Details: ' + err;
            }),
        );

    }


    public postUPSJBIntegracionesAcademico(req: any, collection: string): Observable<any> {

        const jsonrequest = JSON.stringify(req);
        const url = environment.apiUniversidad.integraciones.academico.apiURL + collection;

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'country': 'PE',
                'provider': 'integracion',
                'apiKey': environment.apiUniversidad.integraciones.academico.apiKEY,
            }),
        };

        return this.http.post<any>(url, jsonrequest, httpOptions).pipe(
            tap((data: any) => {

            }),
            catchError(err => {
                throw 'Error in source. Details: ' + err;
            }),
        );

    }


}

