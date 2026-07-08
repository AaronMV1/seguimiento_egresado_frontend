

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';


interface Egresado {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    annoEgreso: string;
    carrera: string;
}


interface Fase {
    id: number;
    titulo: string;
    rango: string;
    anios: number[];
}


@Component({
    selector: 'app-dashboard-2',
    imports: [CommonModule],
    templateUrl: './dashboard2.html',
    styleUrl: './dashboard2.css',
})


export class Dashboard2 {


    // readonly currentYear = new Date().getFullYear();
    readonly currentYear = 2036;


    selectedFaseId = 1;


    readonly egresados: Egresado[] = [
        { nombre: 'Christian Aarón', apellidoPaterno: 'Mori', apellidoMaterno: 'Valdivia', annoEgreso: '2018', carrera: 'Ingeniería de Sistemas' },
        { nombre: 'Juan Carlos', apellidoPaterno: 'Pérez', apellidoMaterno: 'García', annoEgreso: '2019', carrera: 'Ingeniería Industrial' },
        { nombre: 'María Fernanda', apellidoPaterno: 'López', apellidoMaterno: 'Ramírez', annoEgreso: '2020', carrera: 'Ingeniería Civil' },
        { nombre: 'Luis Alberto', apellidoPaterno: 'González', apellidoMaterno: 'Hernández', annoEgreso: '2017', carrera: 'Ingeniería Electrónica' },
        { nombre: 'Ana Sofía', apellidoPaterno: 'Martínez', apellidoMaterno: 'Torres', annoEgreso: '2021', carrera: 'Ingeniería Mecánica' },
        { nombre: 'Carlos Eduardo', apellidoPaterno: 'Ramírez', apellidoMaterno: 'Vargas', annoEgreso: '2016', carrera: 'Ingeniería Química' },
        { nombre: 'Valentina Isabel', apellidoPaterno: 'Sánchez', apellidoMaterno: 'Rojas', annoEgreso: '2018', carrera: 'Ingeniería Ambiental' },
        { nombre: 'Diego Alejandro', apellidoPaterno: 'Torres', apellidoMaterno: 'Castillo', annoEgreso: '2019', carrera: 'Ingeniería de Telecomunicaciones' },
        { nombre: 'Isabella Camila', apellidoPaterno: 'Vargas', apellidoMaterno: 'Mendoza', annoEgreso: '2020', carrera: 'Ingeniería de Software' },
        { nombre: 'Sebastián Andrés', apellidoPaterno: 'Hernández', apellidoMaterno: 'Cruz', annoEgreso: '2017', carrera: 'Ingeniería Biomédica' },
        { nombre: 'Camila Valentina', apellidoPaterno: 'Rojas', apellidoMaterno: 'Santos', annoEgreso: '2021', carrera: 'Ingeniería de Energías Renovables' },
        { nombre: 'Matías Alejandro', apellidoPaterno: 'Castillo', apellidoMaterno: 'Vega', annoEgreso: '2016', carrera: 'Ingeniería de Materiales' },
        { nombre: 'Sofía Isabella', apellidoPaterno: 'Mendoza', apellidoMaterno: 'Paredes', annoEgreso: '2018', carrera: 'Ingeniería de Transporte' },
        { nombre: 'Emiliano Sebastián', apellidoPaterno: 'Cruz', apellidoMaterno: 'Ríos', annoEgreso: '2019', carrera: 'Ingeniería de Minas' },
        { nombre: 'Valeria Camila', apellidoPaterno: 'Santos', apellidoMaterno: 'Luna', annoEgreso: '2020', carrera: 'Ingeniería de Petróleos' },
        { nombre: 'Nicolás Alejandro', apellidoPaterno: 'Vega', apellidoMaterno: 'Salazar', annoEgreso: '2017', carrera: 'Ingeniería de Sistemas de Información' },
        { nombre: 'Camila Valentina', apellidoPaterno: 'Paredes', apellidoMaterno: 'Cordero', annoEgreso: '2021', carrera: 'Ingeniería de Telecomunicaciones y Redes' },
        { nombre: 'Mateo Sebastián', apellidoPaterno: 'Ríos', apellidoMaterno: 'Mora', annoEgreso: '2025', carrera: 'Ingeniería de Control y Automatización' },
        { nombre: 'Valentina Camila', apellidoPaterno: 'Luna', apellidoMaterno: 'Vargas', annoEgreso: '2018', carrera: 'Ingeniería de Sistemas de Producción' },
        { nombre: 'Santiago Nicolás', apellidoPaterno: 'Salazar', apellidoMaterno: 'Cruz', annoEgreso: '2024', carrera: 'Ingeniería de Sistemas de Transporte' },
        { nombre: 'Isabella Valentina', apellidoPaterno: 'Cordero', apellidoMaterno: 'Rojas', annoEgreso: '2020', carrera: 'Ingeniería de Sistemas de Energía' },
        { nombre: 'Emiliano Mateo', apellidoPaterno: 'Mora', apellidoMaterno: 'Vega', annoEgreso: '2017', carrera: 'Ingeniería de Sistemas de Información y Control' },
        { nombre: 'Valeria Isabella', apellidoPaterno: 'Vargas', apellidoMaterno: 'Luna', annoEgreso: '2021', carrera: 'Ingeniería de Sistemas de Producción y Logística' }
    ];

    get fases(): Fase[] {
        return [
            {
                id: 1,
                titulo: 'Información',
                rango: '0 - 3 años',
                anios: this.getYearsFromOffset(0, 3),
            },
            {
                id: 2,
                titulo: 'Formación',
                rango: '4 - 5 años',
                anios: this.getYearsFromOffset(4, 5),
            },
            {
                id: 3,
                titulo: 'Autocapacitación',
                rango: '6 - 7 años',
                anios: this.getYearsFromOffset(6, 7),
            },
            {
                id: 4,
                titulo: 'Innovación',
                rango: '8 años a más',
                anios: this.getInnovationYears(),
            },
        ];
    }

    get selectedFase(): Fase {
        return this.fases.find(fase => fase.id === this.selectedFaseId) ?? this.fases[0];
    }

    get egresadosFiltrados(): Egresado[] {
        return this.egresados.filter(egresado =>
            this.selectedFase.anios.includes(Number(egresado.annoEgreso))
        );
    }

    get totalEgresados(): number {
        return this.egresados.length;
    }

    get totalSelectedFase(): number {
        return this.egresadosFiltrados.length;
    }

    get chartByYear() {
        return this.selectedFase.anios.map(anio => {
            const total = this.egresados.filter(e => Number(e.annoEgreso) === anio).length;

            return {
                anio,
                total,
                percentage: this.totalSelectedFase > 0
                    ? Math.round((total / this.totalSelectedFase) * 100)
                    : 0,
            };
        });
    }

    selectFase(faseId: number): void {
        this.selectedFaseId = faseId;
    }

    countByFase(fase: Fase): number {
        return this.egresados.filter(egresado =>
            fase.anios.includes(Number(egresado.annoEgreso))
        ).length;
    }

    getFasePercentage(fase: Fase): number {
        const count = this.countByFase(fase);

        if (this.totalEgresados === 0) {
            return 0;
        }

        return Math.round((count / this.totalEgresados) * 100);
    }

    private getYearsFromOffset(startOffset: number, endOffset: number): number[] {
        const years: number[] = [];

        for (let offset = startOffset; offset <= endOffset; offset++) {
            years.push(this.currentYear - offset);
        }

        return years;
    }

    private getInnovationYears(): number[] {
        const minYear = Math.min(...this.egresados.map(e => Number(e.annoEgreso)));
        const years: number[] = [];

        for (let year = this.currentYear - 8; year >= minYear; year--) {
            years.push(year);
        }

        return years;
    }
}