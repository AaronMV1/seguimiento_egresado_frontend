

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';


@Injectable({
    providedIn: 'root',
})


export class Http {


    constructor(private http:HttpClient) { }


    public postUPSJBIntegracionesAcademico(req: any, collection: string): Observable<any> {

        const jsonrequest = JSON.stringify(req);
        const url = environment.apiUniversidad.integraciones.academico.apiURL + collection;

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'country': 'PE',
                'provider': 'integracion',
                'apiKey': environment.apiUniversidad.integraciones.academico.apiKEY
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
