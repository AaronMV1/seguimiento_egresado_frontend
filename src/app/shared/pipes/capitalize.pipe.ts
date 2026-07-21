

import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'capitalize',
    standalone: true,
})


export class CapitalizePipe implements PipeTransform {

    transform(value: string | null | undefined): string {

        if (!value) return '';

        return value
            .toLowerCase()
            .replace(/\b\p{L}/gu, letra => letra.toUpperCase());
    }

}

