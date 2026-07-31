import { Injectable, computed, signal } from '@angular/core';


@Injectable({
    providedIn: 'root',
})


export class AuthSessionService {


    private readonly storageKey = 'seguimiento_egresado_autenticacion';


    private readonly authenticated = signal<boolean>(this.restoreSession());


    readonly isAuthenticated = computed(() => this.authenticated());


    hasActiveSession(): boolean {

        return this.authenticated();

    }


    registerSession(response: unknown): boolean {

        const isAuthenticated = this.isSuccessfulResponse(response);

        this.authenticated.set(isAuthenticated);
        this.persistSession(isAuthenticated);

        return isAuthenticated;

    }


    clearSession(): void {

        this.authenticated.set(false);
        this.persistSession(false);

    }


    private restoreSession(): boolean {

        return localStorage.getItem(this.storageKey) === 'true';

    }


    private persistSession(isAuthenticated: boolean): void {

        localStorage.setItem(this.storageKey, String(isAuthenticated));

    }


    private isSuccessfulResponse(response: unknown): boolean {

        if (
            typeof response !== 'object' ||
            response === null
        ) {
            return false;
        }

        const candidate = response as Record<string, unknown>;

        return String(candidate['estado']) === '200';
    }


}
