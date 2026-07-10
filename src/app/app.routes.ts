

import { Routes } from '@angular/router';
import { PublicContentFull }  from './layout/public/content-full/content-full';
import { PrivateContentFull } from './layout/private/content-full/content-full';
import { Form } from './features/form/form';
import { Dashboard } from './features/dashboard/dashboard';
import { Dashboard2 } from './features/dashboard2/dashboard2';
import { ModeloGestion } from './features/modelo-gestion/modelo-gestion';
import { Formulario } from './features/formulario/formulario';


export const routes: Routes = [

    {
        path: '',
        redirectTo: 'private/formulario-encuesta',
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
            { path: '', redirectTo: 'formulario-encuesta', pathMatch: 'full' },
            { path: 'formulario', component: Formulario },
            { path: 'formulario-encuesta', component: Form },
            { path: 'dashboard', component: Dashboard },
            { path: 'dashboard2', component: Dashboard2 },
            { path: 'modelo-gestion', component: ModeloGestion }
        ]
    },
    {
        path: '**',
        redirectTo: 'public'
    }

];
