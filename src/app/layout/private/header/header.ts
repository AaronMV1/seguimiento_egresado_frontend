import { AuthSessionService } from './../../../core/services/auth-session.service';


import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';



@Component({
    selector: 'app-private-header',
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './header.html',
    styleUrls: ['./header.css'],
})


export class PrivateHeader {


	private readonly router = inject(Router);
	private readonly authSession = inject(AuthSessionService);

	logout(): void {
		this.authSession.clearSession();
		void this.router.navigateByUrl('/public/login');
	}


}
