

import { Routes } from '@angular/router';
import { PublicContentFull }  from './layout/public/content-full/content-full';
import { PrivateContentFull } from './layout/private/content-full/content-full';
import { Form } from './extras/descartados/form/form';
import { Encuesta } from './features/encuesta/encuesta';
import { Dashboard } from './features/dashboard/dashboard';
import { Dashboard2 } from './extras/descartados/dashboard2/dashboard2';
import { ModeloGestion } from './features/modelo-gestion/modelo-gestion';
import { Formulario } from './features/formulario/formulario';
import { Elementos } from './extras/practica/elementos/elementos';


export const routes: Routes = [


    {
        path: 'public',
        component: PublicContentFull,
    },

    {
        path: 'private',
        component: PrivateContentFull,
        children: [
            { path: '', redirectTo: 'encuesta', pathMatch: 'full' },
            { path: 'encuesta', component: Encuesta },
            // { path: 'formulario', component: Formulario },
            { path: 'dashboard', component: Dashboard },
            { path: 'modelo', component: ModeloGestion },
        ]
    },

    {
        path: 'extras',
        component: PrivateContentFull,
        children: [
            { path: 'formulario-encuesta', component: Form },
            { path: 'dashboard2', component: Dashboard2 },
        ]
    },

    {
        path: 'practica',
        component: PrivateContentFull,
        children: [
            { path: '', redirectTo: 'elementos', pathMatch: 'full' },
            { path: 'elementos', component: Elementos },
        ]
    },

    {
        path: '**',
        redirectTo: 'private'
    }

];
