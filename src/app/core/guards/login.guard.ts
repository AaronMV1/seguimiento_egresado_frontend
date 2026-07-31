

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';


import { AuthSessionService } from '../services/auth-session.service';


export const loginGuard: CanActivateFn = (_route, state) => {


    const authSession = inject(AuthSessionService);
    const router = inject(Router);


    if (authSession.hasActiveSession()) {

        return true;

    }


    return router.createUrlTree(['/public/login'], {
        queryParams: {
            returnUrl: state.url,
        },
    });


};

