

import { Routes } from '@angular/router';
import { PublicContentFull }  from './layout/public/content-full/content-full';
import { PrivateContentFull } from './layout/private/content-full/content-full';
import { Form } from './features/form/form';
import { Encuesta } from './features/encuesta/encuesta';
import { Dashboard } from './features/dashboard/dashboard';
import { Dashboard2 } from './features/dashboard2/dashboard2';
import { ModeloGestion } from './features/modelo-gestion/modelo-gestion';
import { Formulario } from './features/formulario/formulario';


export const routes: Routes = [

    {
        path: '',
        redirectTo: 'private/formulario',
        pathMatch: 'full'
    },

    {
        path: 'public',
        component: PublicContentFull,
    },

    {
        path: 'private',
        component: PrivateContentFull,
        children: [
            { path: '', redirectTo: 'formulario', pathMatch: 'full' },
            { path: 'encuesta', component: Encuesta },
            { path: 'formulario', component: Formulario },
            { path: 'dashboard', component: Dashboard },
            { path: 'modelo', component: ModeloGestion },
        ]
    },

    {
        path: 'test',
        component: PrivateContentFull,
        children: [
            { path: 'formulario-encuesta', component: Form },
            { path: 'dashboard2', component: Dashboard2 },
        ]
    },

    {
        path: '**',
        redirectTo: 'public'
    }

];
