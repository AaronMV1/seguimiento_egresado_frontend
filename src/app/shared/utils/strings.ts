

export class Strings {


    static capitalize(texto: string | null | undefined): string {

        if (!texto) {
            return '';
        }

        return texto
            .trim()
            .toLowerCase()
            .split(/\s+/)
            .map(palabra =>
                palabra.charAt(0).toUpperCase() + palabra.slice(1)
            )
            .join(' ');

    }

    static lowerCase(texto: string | null | undefined): string {

        if (!texto) {
            return '';
        }

        return texto.trim().toLowerCase();

    }

    static upperCase(texto: string | null | undefined): string {

        if (!texto) {
            return '';
        }

        return texto.trim().toUpperCase();

    }


}

