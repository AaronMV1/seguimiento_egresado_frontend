import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Http } from '../../core/services/http';



// Función: Define la estructura de datos de cada egresado.
interface Egresado {
	nombre: string;
	apellidoPaterno: string;
	apellidoMaterno: string;
	anioEgreso: string;
	carrera: string;
	correoIInstitucional: string;
    facultad: string;
    sedeFilial: string;
}


// Función: Define la estructura de datos de cada egresado.
interface EgresadoBK {
	tipoDocumento: string;
    numeroDocumento: string;
    nombresApellidos: string;
    genero: string;
    sede: string;
    facultad: string;
    carrera: string;
	anioEgreso: number;
	correoElectronico: string;
    numeroCelular: string;
}


// Función: Define la plantilla base para construir cada fase del dashboard.
interface PlantillaFase {
	id: string;
	titulo: string;
	aniosMinimosDesdeEgreso: number;
	aniosMaximosDesdeEgreso: number | null;
	etiquetaCohorte: string;
	descripcion: string;
	imagen: string;
}


// Función: Define la estructura final de cada fase ya procesada con sus años y egresados.
interface FaseDashboard {
	id: string;
	titulo: string;
	etiquetaCohorte: string;
	anios: number[];
	egresados: EgresadoBK[];
	descripcion: string;
	imagen: string;
}


@Component({
	selector: 'app-dashboard',
	imports: [CommonModule, FormsModule],
	templateUrl: './dashboard.html',
	styleUrl: './dashboard.css',
})


export class Dashboard implements OnInit {

	egresadoBK: EgresadoBK[] = [];


    ngOnInit(): void {
        this.obtenerEncuestados();
    }


    constructor( private _http: Http, private readonly cdr: ChangeDetectorRef ) { }


	// Función: Define el año actual usado para calcular dinámicamente las cohortes.
	readonly anioActual = new Date().getFullYear();
	// readonly anioActual = 2030;


	// Función: Contiene la configuración base de las fases del dashboard.
	readonly plantillasFases: PlantillaFase[] = [
		{ id: 'fase_1', titulo: 'Fase 1: Información', aniosMinimosDesdeEgreso: 0, aniosMaximosDesdeEgreso: 3, etiquetaCohorte: '0 - 3 años', descripcion: 'Corresponde a los egresados que inician su vida profesional. En esta etapa se realiza el seguimiento de su inserción laboral, la actualización de sus datos y el fortalecimiento de su empleabilidad mediante oportunidades de trabajo, capacitación inicial y acompañamiento profesional.', imagen: 'assets/images/fases/Fase%201.png', },
		{ id: 'fase_2', titulo: 'Fase 2: Formación', aniosMinimosDesdeEgreso: 4, aniosMaximosDesdeEgreso: 5, etiquetaCohorte: '3 - 5 años', descripcion: 'Comprende a los egresados que han consolidado experiencia laboral. Se recopila información sobre su desempeño, logros y formación continua, además de obtener retroalimentación para contribuir a la mejora del plan curricular y de la calidad académica.', imagen: 'assets/images/fases/Fase%202.png', },
		{ id: 'fase_3', titulo: 'Fase 3: Autocapacitación', aniosMinimosDesdeEgreso: 6, aniosMaximosDesdeEgreso: 7, etiquetaCohorte: '5 - 7 años', descripcion: 'En esta etapa se evalúa el crecimiento académico y profesional del egresado, identificando estudios de posgrado, especializaciones, certificaciones y otros procesos de actualización que fortalecen su perfil profesional.', imagen: 'assets/images/fases/Fase%203.png', },
		{ id: 'fase_4', titulo: 'Fase 4: Innovación', aniosMinimosDesdeEgreso: 8, aniosMaximosDesdeEgreso: null, etiquetaCohorte: '7 - X años', descripcion: 'Corresponde a los egresados con una trayectoria profesional consolidada. Se identifican sus aportes en investigación, innovación, emprendimiento, liderazgo y generación de conocimiento, evidenciando su impacto en la sociedad y en el desarrollo de su profesión.', imagen: 'assets/images/fases/Fase%204.png', },
	];


	// Función: Lista histórica local de egresados (ya no usada en la lógica principal).

    // readonly egresados: Egresado[] = [
    //     { nombre: 'Diego Alejandro', apellidoPaterno: 'Ramos', apellidoMaterno: 'Paredes', anioEgreso: '2014', correoIInstitucional: 'diego.ramos@upsjb.edu.pe', sedeFilial: 'Sede Chorrillos', facultad: 'Ingenierías', carrera: 'Ingeniería de Sistemas' },
    //     { nombre: 'Valeria Sofía', apellidoPaterno: 'Gómez', apellidoMaterno: 'Salinas', anioEgreso: '2022', correoIInstitucional: 'valeria.gomez@upsjb.edu.pe', sedeFilial: 'Sede San Borja', facultad: 'Ciencias de la Salud', carrera: 'Psicología' },
    //     { nombre: 'José Luis', apellidoPaterno: 'Quispe', apellidoMaterno: 'Huamán', anioEgreso: '2018', correoIInstitucional: 'jose.quispe@upsjb.edu.pe', sedeFilial: 'Filial Ica', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Administración de Empresas' },
    //     { nombre: 'Camila Fernanda', apellidoPaterno: 'Torres', apellidoMaterno: 'Vargas', anioEgreso: '2012', correoIInstitucional: 'camila.torres@upsjb.edu.pe', sedeFilial: 'Filial Chincha', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Derecho' },
    //     { nombre: 'Sebastián Andrés', apellidoPaterno: 'Castro', apellidoMaterno: 'León', anioEgreso: '2020', correoIInstitucional: 'sebastian.castro@upsjb.edu.pe', sedeFilial: 'Sede Chorrillos', facultad: 'Ingenierías', carrera: 'Ingeniería Civil' },
    //     { nombre: 'Lucía Isabel', apellidoPaterno: 'Mendoza', apellidoMaterno: 'Rojas', anioEgreso: '2023', correoIInstitucional: 'lucia.mendoza@upsjb.edu.pe', sedeFilial: 'Filial Ica', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Contabilidad' },
    //     { nombre: 'Mateo Gabriel', apellidoPaterno: 'Silva', apellidoMaterno: 'Navarro', anioEgreso: '2025', correoIInstitucional: 'mateo.silva@upsjb.edu.pe', sedeFilial: 'Sede San Borja', facultad: 'Ciencias de la Salud', carrera: 'Medicina Humana' },
    //     { nombre: 'Daniela Alejandra', apellidoPaterno: 'Cruz', apellidoMaterno: 'Valdez', anioEgreso: '2011', correoIInstitucional: 'daniela.cruz@upsjb.edu.pe', sedeFilial: 'Filial Chincha', facultad: 'Ciencias de la Salud', carrera: 'Enfermería' },
    //     { nombre: 'Kevin Alonso', apellidoPaterno: 'Flores', apellidoMaterno: 'Campos', anioEgreso: '2016', correoIInstitucional: 'kevin.flores@upsjb.edu.pe', sedeFilial: 'Sede Chorrillos', facultad: 'Ingenierías', carrera: 'Ingeniería Agroindustrial' },
    //     { nombre: 'Mariana Fernanda', apellidoPaterno: 'Benites', apellidoMaterno: 'López', anioEgreso: '2019', correoIInstitucional: 'mariana.benites@upsjb.edu.pe', sedeFilial: 'Filial Ica', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Turismo, Hotelería y Gastronomía' },
    //     { nombre: 'Joaquín Mateo', apellidoPaterno: 'Ortega', apellidoMaterno: 'Reyes', anioEgreso: '2015', correoIInstitucional: 'joaquin.ortega@upsjb.edu.pe', sedeFilial: 'Sede San Borja', facultad: 'Ciencias de la Salud', carrera: 'Medicina Veterinaria y Zootecnia' },
    //     { nombre: 'Valentina Camila', apellidoPaterno: 'Aguilar', apellidoMaterno: 'Soto', anioEgreso: '2013', correoIInstitucional: 'valentina.aguilar@upsjb.edu.pe', sedeFilial: 'Sede Chorrillos', facultad: 'Ciencias de la Salud', carrera: 'Estomatología' },
    //     { nombre: 'Cristopher David', apellidoPaterno: 'Ponce', apellidoMaterno: 'Núñez', anioEgreso: '2022', correoIInstitucional: 'cristopher.ponce@upsjb.edu.pe', sedeFilial: 'Filial Chincha', facultad: 'Ingenierías', carrera: 'Ingeniería de Sistemas' },
    //     { nombre: 'Andrea Nicole', apellidoPaterno: 'Espinoza', apellidoMaterno: 'Delgado', anioEgreso: '2010', correoIInstitucional: 'andrea.espinoza@upsjb.edu.pe', sedeFilial: 'Filial Ica', facultad: 'Ciencias de la Salud', carrera: 'Laboratorio Clínico y Anatomía Patológica' },
    //     { nombre: 'Renato Martín', apellidoPaterno: 'Cárdenas', apellidoMaterno: 'Peña', anioEgreso: '2021', correoIInstitucional: 'renato.cardenas@upsjb.edu.pe', sedeFilial: 'Sede San Borja', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Administración y Marketing' },
    //     { nombre: 'Paula Daniela', apellidoPaterno: 'Rivera', apellidoMaterno: 'Fuentes', anioEgreso: '2014', correoIInstitucional: 'paula.rivera@upsjb.edu.pe', sedeFilial: 'Sede Chorrillos', facultad: 'Ciencias de la Salud', carrera: 'Psicología' },
    //     { nombre: 'Miguel Ángel', apellidoPaterno: 'Morales', apellidoMaterno: 'Ríos', anioEgreso: '2024', correoIInstitucional: 'miguel.morales@upsjb.edu.pe', sedeFilial: 'Filial Chincha', facultad: 'Ingenierías', carrera: 'Ingeniería Civil' },
    //     { nombre: 'Fernanda Lucía', apellidoPaterno: 'Bravo', apellidoMaterno: 'Mora', anioEgreso: '2012', correoIInstitucional: 'fernanda.bravo@upsjb.edu.pe', sedeFilial: 'Filial Ica', facultad: 'Ciencias de la Salud', carrera: 'Enfermería' },
    //     { nombre: 'Álvaro Sebastián', apellidoPaterno: 'Herrera', apellidoMaterno: 'Carrillo', anioEgreso: '2018', correoIInstitucional: 'alvaro.herrera@upsjb.edu.pe', sedeFilial: 'Sede Chorrillos', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Derecho' },
    //     { nombre: 'Gabriela Alejandra', apellidoPaterno: 'Sánchez', apellidoMaterno: 'Vega', anioEgreso: '2017', correoIInstitucional: 'gabriela.sanchez@upsjb.edu.pe', sedeFilial: 'Sede San Borja', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Contabilidad' },
    //     { nombre: 'Carlos Eduardo', apellidoPaterno: 'Ramírez', apellidoMaterno: 'Alarcón', anioEgreso: '2023', correoIInstitucional: 'carlos.ramirez@upsjb.edu.pe', sedeFilial: 'Filial Chincha', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Administración y Negocios Internacionales' },
    //     { nombre: 'Natalia Sofía', apellidoPaterno: 'Suárez', apellidoMaterno: 'Medina', anioEgreso: '2020', correoIInstitucional: 'natalia.suarez@upsjb.edu.pe', sedeFilial: 'Sede Chorrillos', facultad: 'Ingenierías', carrera: 'Ingeniería en Enología y Viticultura' },
    //     { nombre: 'Rodrigo Alonso', apellidoPaterno: 'Valencia', apellidoMaterno: 'Luna', anioEgreso: '2011', correoIInstitucional: 'rodrigo.valencia@upsjb.edu.pe', sedeFilial: 'Filial Ica', facultad: 'Ciencias de la Salud', carrera: 'Terapia Física y Rehabilitación' },
    //     { nombre: 'Antonella María', apellidoPaterno: 'Guerrero', apellidoMaterno: 'Rivas', anioEgreso: '2016', correoIInstitucional: 'antonella.guerrero@upsjb.edu.pe', sedeFilial: 'Sede San Borja', facultad: 'Ciencias de la Salud', carrera: 'Medicina Humana' },
    //     { nombre: 'Mauricio Javier', apellidoPaterno: 'Yáñez', apellidoMaterno: 'Cornejo', anioEgreso: '2019', correoIInstitucional: 'mauricio.yanez@upsjb.edu.pe', sedeFilial: 'Filial Chincha', facultad: 'Ingenierías', carrera: 'Ingeniería Agroindustrial' },
    //     { nombre: 'Ariana Valentina', apellidoPaterno: 'Palacios', apellidoMaterno: 'Villacorta', anioEgreso: '2013', correoIInstitucional: 'ariana.palacios@upsjb.edu.pe', sedeFilial: 'Sede Chorrillos', facultad: 'Ciencias de la Salud', carrera: 'Estomatología' },
    //     { nombre: 'Bruno Nicolás', apellidoPaterno: 'Guzmán', apellidoMaterno: 'Mestanza', anioEgreso: '2025', correoIInstitucional: 'bruno.guzman@upsjb.edu.pe', sedeFilial: 'Filial Ica', facultad: 'Ingenierías', carrera: 'Ingeniería de Sistemas' },
    //     { nombre: 'Kiara Fernanda', apellidoPaterno: 'Llerena', apellidoMaterno: 'Ortiz', anioEgreso: '2015', correoIInstitucional: 'kiara.llerena@upsjb.edu.pe', sedeFilial: 'Sede San Borja', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Administración de Empresas' },
    //     { nombre: 'Leonardo Andrés', apellidoPaterno: 'Velásquez', apellidoMaterno: 'Arce', anioEgreso: '2010', correoIInstitucional: 'leonardo.velasquez@upsjb.edu.pe', sedeFilial: 'Filial Chincha', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Turismo, Hotelería y Gastronomía' },
    //     { nombre: 'Milagros Nicole', apellidoPaterno: 'Villacís', apellidoMaterno: 'Cáceres', anioEgreso: '2022', correoIInstitucional: 'milagros.villacis@upsjb.edu.pe', sedeFilial: 'Sede Chorrillos', facultad: 'Ciencias de la Salud', carrera: 'Psicología' },
    //     { nombre: 'Franco Emiliano', apellidoPaterno: 'Maldonado', apellidoMaterno: 'Rosales', anioEgreso: '2017', correoIInstitucional: 'franco.maldonado@upsjb.edu.pe', sedeFilial: 'Filial Ica', facultad: 'Ciencias de la Salud', carrera: 'Laboratorio Clínico y Anatomía Patológica' },
    //     { nombre: 'Luciana Isabel', apellidoPaterno: 'Paz', apellidoMaterno: 'Benavides', anioEgreso: '2019', correoIInstitucional: 'luciana.paz@upsjb.edu.pe', sedeFilial: 'Sede San Borja', facultad: 'Ingenierías', carrera: 'Medicina Veterinaria y Zootecnia' },
    //     { nombre: 'Adrián José', apellidoPaterno: 'Acuña', apellidoMaterno: 'Montoya', anioEgreso: '2017', correoIInstitucional: 'adrian.acuna@upsjb.edu.pe', sedeFilial: 'Filial Chincha', facultad: 'Ingenierías', carrera: 'Ingeniería Civil' },
    //     { nombre: 'Micaela Sofía', apellidoPaterno: 'Solís', apellidoMaterno: 'Mejía', anioEgreso: '2015', correoIInstitucional: 'micaela.solis@upsjb.edu.pe', sedeFilial: 'Sede Chorrillos', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Administración y Marketing' },
    //     { nombre: 'Thiago Matías', apellidoPaterno: 'Valle', apellidoMaterno: 'Escobar', anioEgreso: '2019', correoIInstitucional: 'thiago.valle@upsjb.edu.pe', sedeFilial: 'Filial Ica', facultad: 'Ingenierías', carrera: 'Ingeniería en Enología y Viticultura' },
    //     { nombre: 'Carolina Andrea', apellidoPaterno: 'Farfán', apellidoMaterno: 'Rentería', anioEgreso: '2012', correoIInstitucional: 'carolina.farfan@upsjb.edu.pe', sedeFilial: 'Sede San Borja', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Derecho' },
    //     { nombre: 'Samuel David', apellidoPaterno: 'Pineda', apellidoMaterno: 'Tello', anioEgreso: '2019', correoIInstitucional: 'samuel.pineda@upsjb.edu.pe', sedeFilial: 'Filial Chincha', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Contabilidad' },
    //     { nombre: 'Noelia Camila', apellidoPaterno: 'Lozano', apellidoMaterno: 'Santillán', anioEgreso: '2016', correoIInstitucional: 'noelia.lozano@upsjb.edu.pe', sedeFilial: 'Sede Chorrillos', facultad: 'Ciencias de la Salud', carrera: 'Enfermería' },
    //     { nombre: 'Fabricio Alonso', apellidoPaterno: 'Chávez', apellidoMaterno: 'Murillo', anioEgreso: '2023', correoIInstitucional: 'fabricio.chavez@upsjb.edu.pe', sedeFilial: 'Filial Ica', facultad: 'Ciencias de la Salud', carrera: 'Terapia Física y Rehabilitación' },
    //     { nombre: 'Daniela Lucero', apellidoPaterno: 'Gallegos', apellidoMaterno: 'Zevallos', anioEgreso: '2011', correoIInstitucional: 'daniela.gallegos@upsjb.edu.pe', sedeFilial: 'Sede San Borja', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Administración y Negocios Internacionales' },
    //     { nombre: 'Hugo Sebastián', apellidoPaterno: 'Romero', apellidoMaterno: 'Vallejos', anioEgreso: '2020', correoIInstitucional: 'hugo.romero@upsjb.edu.pe', sedeFilial: 'Filial Chincha', facultad: 'Ciencias de la Salud', carrera: 'Medicina Humana' },
	// 	   { nombre: 'Isabella María', apellidoPaterno: 'Cabrera', apellidoMaterno: 'Salazar', anioEgreso: '2025', correoIInstitucional: 'isabella.cabrera@upsjb.edu.pe', sedeFilial: 'Sede Chorrillos', facultad: 'Ciencias de la Salud', carrera: 'Psicología' },
	// 	   { nombre: 'Jean Pierre', apellidoPaterno: 'Medrano', apellidoMaterno: 'Arias', anioEgreso: '2025', correoIInstitucional: 'jean.medrano@upsjb.edu.pe', sedeFilial: 'Sede San Borja', facultad: 'Ingenierías', carrera: 'Ingeniería Civil' },
	// 	   { nombre: 'Melissa Fernanda', apellidoPaterno: 'Rengifo', apellidoMaterno: 'Paredes', anioEgreso: '2023', correoIInstitucional: 'melissa.rengifo@upsjb.edu.pe', sedeFilial: 'Filial Ica', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Administración de Empresas' },
	// 	   { nombre: 'Cristian Eduardo', apellidoPaterno: 'Salas', apellidoMaterno: 'Gamarra', anioEgreso: '2024', correoIInstitucional: 'cristian.salas@upsjb.edu.pe', sedeFilial: 'Filial Chincha', facultad: 'Ingenierías', carrera: 'Ingeniería de Sistemas' },
	// 	   { nombre: 'María José', apellidoPaterno: 'Del Castillo', apellidoMaterno: 'Zúñiga', anioEgreso: '2022', correoIInstitucional: 'maria.delcastillo@upsjb.edu.pe', sedeFilial: 'Sede Chorrillos', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Derecho' },
	// 	   { nombre: 'Piero Alessandro', apellidoPaterno: 'Vargas', apellidoMaterno: 'Poma', anioEgreso: '2021', correoIInstitucional: 'piero.vargas@upsjb.edu.pe', sedeFilial: 'Sede San Borja', facultad: 'Ciencias de la Salud', carrera: 'Medicina Humana' },
	// 	   { nombre: 'Nicole Alexandra', apellidoPaterno: 'Reátegui', apellidoMaterno: 'Córdova', anioEgreso: '2022', correoIInstitucional: 'nicole.reategui@upsjb.edu.pe', sedeFilial: 'Filial Ica', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Contabilidad' },
	// 	   { nombre: 'Luis Fernando', apellidoPaterno: 'Salcedo', apellidoMaterno: 'Pinto', anioEgreso: '2021', correoIInstitucional: 'luis.salcedo@upsjb.edu.pe', sedeFilial: 'Filial Chincha', facultad: 'Ingenierías', carrera: 'Ingeniería Agroindustrial' },
	// 	   { nombre: 'Karen Alejandra', apellidoPaterno: 'Olivares', apellidoMaterno: 'Lévano', anioEgreso: '2020', correoIInstitucional: 'karen.olivares@upsjb.edu.pe', sedeFilial: 'Sede Chorrillos', facultad: 'Ciencias de la Salud', carrera: 'Enfermería' },
	// 	   { nombre: 'Diego Armando', apellidoPaterno: 'Bautista', apellidoMaterno: 'Sarmiento', anioEgreso: '2019', correoIInstitucional: 'diego.bautista@upsjb.edu.pe', sedeFilial: 'Filial Ica', facultad: 'Ingenierías', carrera: 'Ingeniería de Sistemas' },
	// 	   { nombre: 'Fiorella Andrea', apellidoPaterno: 'Arroyo', apellidoMaterno: 'Vilchez', anioEgreso: '2015', correoIInstitucional: 'fiorella.arroyo@upsjb.edu.pe', sedeFilial: 'Sede San Borja', facultad: 'Ciencias de la Salud', carrera: 'Psicología' },
	// 	   { nombre: 'Juan Esteban', apellidoPaterno: 'Mendoza', apellidoMaterno: 'Caballero', anioEgreso: '2017', correoIInstitucional: 'juan.mendoza@upsjb.edu.pe', sedeFilial: 'Filial Chincha', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Administración y Marketing' },
	// 	   { nombre: 'Rosa Milagros', apellidoPaterno: 'Huertas', apellidoMaterno: 'Quintana', anioEgreso: '2022', correoIInstitucional: 'rosa.huertas@upsjb.edu.pe', sedeFilial: 'Sede Chorrillos', facultad: 'Ciencias de la Salud', carrera: 'Laboratorio Clínico y Anatomía Patológica' },
	// 	   { nombre: 'Fernando Alonso', apellidoPaterno: 'Sifuentes', apellidoMaterno: 'Loayza', anioEgreso: '2015', correoIInstitucional: 'fernando.sifuentes@upsjb.edu.pe', sedeFilial: 'Filial Ica', facultad: 'Ingenierías', carrera: 'Ingeniería en Enología y Viticultura' },
	// 	   { nombre: 'Patricia Elena', apellidoPaterno: 'Correa', apellidoMaterno: 'Zambrano', anioEgreso: '2015', correoIInstitucional: 'patricia.correa@upsjb.edu.pe', sedeFilial: 'Sede San Borja', facultad: 'Ciencias de la Salud', carrera: 'Estomatología' },
	// 	   { nombre: 'Ricardo Javier', apellidoPaterno: 'Tapia', apellidoMaterno: 'Garcés', anioEgreso: '2013', correoIInstitucional: 'ricardo.tapia@upsjb.edu.pe', sedeFilial: 'Filial Chincha', facultad: 'Ciencias de la Salud', carrera: 'Medicina Veterinaria y Zootecnia' },
	// 	   { nombre: 'Cynthia Beatriz', apellidoPaterno: 'Navarrete', apellidoMaterno: 'Cueva', anioEgreso: '2012', correoIInstitucional: 'cynthia.navarrete@upsjb.edu.pe', sedeFilial: 'Sede Chorrillos', facultad: 'Ciencias de la Salud', carrera: 'Terapia Física y Rehabilitación' },
	// 	   { nombre: 'Óscar Iván', apellidoPaterno: 'Valdivieso', apellidoMaterno: 'Pizarro', anioEgreso: '2011', correoIInstitucional: 'oscar.valdivieso@upsjb.edu.pe', sedeFilial: 'Filial Ica', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Administración y Negocios Internacionales' },
	// 	   { nombre: 'Ruth Karina', apellidoPaterno: 'Alfaro', apellidoMaterno: 'Gavidia', anioEgreso: '2010', correoIInstitucional: 'ruth.alfaro@upsjb.edu.pe', sedeFilial: 'Sede San Borja', facultad: 'Ingenierías', carrera: 'Ingeniería Civil' },
	// 	   { nombre: 'Kevin Mauricio', apellidoPaterno: 'Cisneros', apellidoMaterno: 'Peralta', anioEgreso: '2025', correoIInstitucional: 'kevin.cisneros@upsjb.edu.pe', sedeFilial: 'Filial Chincha', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Derecho' },
    // ]

    readonly egresados: Egresado[] = [
            { nombre: 'Fernanda Lucia', apellidoPaterno: 'Arroyo', apellidoMaterno: 'Zavaleta', anioEgreso: '2023', correoIInstitucional: 'fernanda.arroyo@upsjb.edu.pe', sedeFilial: 'Local Chorrillos', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Ciencias de la Comunicación' },
            { nombre: 'Alejandra Giuliana', apellidoPaterno: 'Chuguala', apellidoMaterno: 'Valencia', anioEgreso: '2023', correoIInstitucional: 'alejandra.chuguala@upsjb.edu.pe', sedeFilial: 'Local Chorrillos', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Ciencias de la Comunicación' },
            { nombre: 'Rossana Lisbeth', apellidoPaterno: 'Rodriguez', apellidoMaterno: 'Salcedo', anioEgreso: '2016', correoIInstitucional: 'rossana.rodriguez@upsjb.edu.pe', sedeFilial: 'Local San Borja', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Administración de Negocios' },
            { nombre: 'Tatyana Anthuanet', apellidoPaterno: 'Ysla', apellidoMaterno: 'Neyra', anioEgreso: '2019', correoIInstitucional: 'tatyana.ysla@upsjb.edu.pe', sedeFilial: 'Local Chorrillos', facultad: 'Ingenierías', carrera: 'Ingeniería Civil' },
            { nombre: 'Juan Alberto', apellidoPaterno: 'Arancivia', apellidoMaterno: 'Salas', anioEgreso: '2022', correoIInstitucional: 'juan.arancivia@upsjb.edu.pe', sedeFilial: 'Local San Borja', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Derecho' },
            { nombre: 'Miguel Angel', apellidoPaterno: 'Lévano', apellidoMaterno: 'Lecca', anioEgreso: '2022', correoIInstitucional: 'miguel.levano@upsjb.edu.pe', sedeFilial: 'Local San Borja', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Derecho' },
            { nombre: 'Karla Flor', apellidoPaterno: 'Larico', apellidoMaterno: 'Condori', anioEgreso: '2023', correoIInstitucional: 'karla.larico@upsjb.edu.pe', sedeFilial: 'Local San Borja', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Derecho' },
            { nombre: 'Dario Ignacio', apellidoPaterno: 'Chavez', apellidoMaterno: 'Marcell', anioEgreso: '2023', correoIInstitucional: 'dario.chavez@upsjb.edu.pe', sedeFilial: 'Local Chorrillos', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Derecho' },
            { nombre: 'Carla Teresa', apellidoPaterno: 'Cerron', apellidoMaterno: 'Leyva', anioEgreso: '2022', correoIInstitucional: 'carla.cerron@upsjb.edu.pe', sedeFilial: 'Local Chorrillos', facultad: 'Ciencias de la Salud', carrera: 'Enfermería' },
            { nombre: 'Alejandra Isabel', apellidoPaterno: 'Cáceres', apellidoMaterno: 'Herrera', anioEgreso: '2022', correoIInstitucional: 'alejandra.caceres@upsjb.edu.pe', sedeFilial: 'Local San Borja', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Derecho' },
            { nombre: 'Kleidy Dayanne', apellidoPaterno: 'Campos', apellidoMaterno: 'Yaurima', anioEgreso: '2022', correoIInstitucional: 'kleidy.campos@upsjb.edu.pe', sedeFilial: 'Local Chorrillos', facultad: 'Ciencias de la Salud', carrera: 'Enfermería' },
            { nombre: 'Alexandra Massiel', apellidoPaterno: 'Velasquez', apellidoMaterno: 'Mendoza', anioEgreso: '2024', correoIInstitucional: 'alexandra.velasquez@upsjb.edu.pe', sedeFilial: 'Local Chorrillos', facultad: 'Ciencias de la Salud', carrera: 'Enfermería' },
            { nombre: 'Katherinne Lizbeth', apellidoPaterno: 'Jacinto', apellidoMaterno: 'Machado', anioEgreso: '2022', correoIInstitucional: 'katherinne.jacinto@upsjb.edu.pe', sedeFilial: 'Local Chorrillos', facultad: 'Ciencias de la Salud', carrera: 'Enfermería' },
            { nombre: 'Silvana Cecilia', apellidoPaterno: 'Cabrera', apellidoMaterno: 'Espichan de Mendoza', anioEgreso: '2017', correoIInstitucional: 'silvana.cabrera@upsjb.edu.pe', sedeFilial: 'Local Chorrillos', facultad: 'Ciencias de la Salud', carrera: 'Enfermería' },
            { nombre: 'Hector', apellidoPaterno: 'Espinoza', apellidoMaterno: 'Huaman', anioEgreso: '2021', correoIInstitucional: 'hector.espinoza@upsjb.edu.pe', sedeFilial: 'Local San Borja', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Derecho' },
            { nombre: 'Maripaz', apellidoPaterno: 'Cabrera', apellidoMaterno: 'Lujan', anioEgreso: '2022', correoIInstitucional: 'maripaz.cabrera@upsjb.edu.pe', sedeFilial: 'Local San Borja', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Administración de Negocios' },
            { nombre: 'Sebastian Mauricio', apellidoPaterno: 'Flores', apellidoMaterno: 'Rodriguez', anioEgreso: '2023', correoIInstitucional: 'sebastian.flores@upsjb.edu.pe', sedeFilial: 'Local Chorrillos', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Ciencias de la Comunicación' },
            { nombre: 'Lizeth', apellidoPaterno: 'Bartra', apellidoMaterno: 'Portugal', anioEgreso: '2024', correoIInstitucional: 'lizeth.bartra@upsjb.edu.pe', sedeFilial: 'Local San Borja', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Administración de Negocios' },
            { nombre: 'Maria Guadalupe', apellidoPaterno: 'Cuyutupa', apellidoMaterno: 'Coronado', anioEgreso: '2021', correoIInstitucional: 'maria.cuyutupa@upsjb.edu.pe', sedeFilial: 'Local San Borja', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Administración de Negocios' },
            { nombre: 'Elena', apellidoPaterno: 'Ponce', apellidoMaterno: 'Cartolin', anioEgreso: '2022', correoIInstitucional: 'elena.ponce@upsjb.edu.pe', sedeFilial: 'Local San Borja', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Administración de Negocios' },
            { nombre: 'Liz Patricia', apellidoPaterno: 'Pachas', apellidoMaterno: 'Cordova', anioEgreso: '2024', correoIInstitucional: 'liz.pachas@upsjb.edu.pe', sedeFilial: 'Local San Borja', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Derecho' },
            { nombre: 'Karol Antonette', apellidoPaterno: 'Prado', apellidoMaterno: 'Chávez', anioEgreso: '2022', correoIInstitucional: 'karol.prado@upsjb.edu.pe', sedeFilial: 'Local San Borja', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Administración de Negocios' },
            { nombre: 'Elar Alexander', apellidoPaterno: 'Monteza', apellidoMaterno: 'Fernández', anioEgreso: '2022', correoIInstitucional: 'elar.monteza@upsjb.edu.pe', sedeFilial: 'Local San Borja', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Administración de Negocios' },
            { nombre: 'Alondra Brigette', apellidoPaterno: 'Reyes', apellidoMaterno: 'Pizarro', anioEgreso: '2023', correoIInstitucional: 'alondra.reyes@upsjb.edu.pe', sedeFilial: 'Local San Borja', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Administración de Negocios' },
            { nombre: 'Jenny', apellidoPaterno: 'Sosa', apellidoMaterno: 'Mas', anioEgreso: '2024', correoIInstitucional: 'jenny.sosa@upsjb.edu.pe', sedeFilial: 'Local Chorrillos', facultad: 'Ciencias de la Salud', carrera: 'Enfermería' },
            { nombre: 'Giovana Ysabel', apellidoPaterno: 'Flores', apellidoMaterno: 'Arotinco', anioEgreso: '2021', correoIInstitucional: 'giovana.flores@upsjb.edu.pe', sedeFilial: 'Local San Borja', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Administración de Negocios' },
            { nombre: 'Celia Griselda', apellidoPaterno: 'Huaytalla', apellidoMaterno: 'Ramos', anioEgreso: '2022', correoIInstitucional: 'celia.huaytalla@upsjb.edu.pe', sedeFilial: 'Local San Borja', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Administración de Negocios' },
            { nombre: 'Carlos Alejandro', apellidoPaterno: 'Arias', apellidoMaterno: 'Arrese', anioEgreso: '2024', correoIInstitucional: 'carlosa.arias@upsjb.edu.pe', sedeFilial: 'Local San Borja', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Derecho' },
            { nombre: 'Luis Jair', apellidoPaterno: 'Contreras', apellidoMaterno: 'Amasifuen', anioEgreso: '2024', correoIInstitucional: 'luisj.contreras@upsjb.edu.pe', sedeFilial: 'Local Chorrillos', facultad: 'Ciencias de la Salud', carrera: 'Enfermería' },
            { nombre: 'Liza Ivette', apellidoPaterno: 'Herrer', apellidoMaterno: 'Travi', anioEgreso: '2022', correoIInstitucional: 'liza.herrer@upsjb.edu.pe', sedeFilial: 'Local San Borja', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Administración de Negocios' },
            { nombre: 'Rosmery', apellidoPaterno: 'Cupe', apellidoMaterno: 'Flores', anioEgreso: '2013', correoIInstitucional: 'rosmery.cupe@upsjb.edu.pe', sedeFilial: 'Local Chorrillos', facultad: 'Ingenierías', carrera: 'Ingeniería de Computación y Sistemas' },
            { nombre: 'Orlando', apellidoPaterno: 'Carbajal', apellidoMaterno: 'Quispe', anioEgreso: '2015', correoIInstitucional: 'orlando.carbajal@upsjb.edu.pe', sedeFilial: 'Local Chorrillos', facultad: 'Ingenierías', carrera: 'Ingeniería Civil' },
            { nombre: 'Andrea del Pilar', apellidoPaterno: 'García', apellidoMaterno: 'Melo', anioEgreso: '2024', correoIInstitucional: 'andread.garcia@upsjb.edu.pe', sedeFilial: 'Local San Borja', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Derecho' },
            { nombre: 'Manuel Enrique', apellidoPaterno: 'Alvino', apellidoMaterno: 'Alburqueque', anioEgreso: '2021', correoIInstitucional: 'manuel.alvino@upsjb.edu.pe', sedeFilial: 'Local San Borja', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Derecho' },
            { nombre: 'Susana Denisse', apellidoPaterno: 'Iñape', apellidoMaterno: 'Mallma', anioEgreso: '2020', correoIInstitucional: 'susana.inape@upsjb.edu.pe', sedeFilial: 'Local San Borja', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Derecho' },
            { nombre: 'Cinthya Yomira', apellidoPaterno: 'Flores', apellidoMaterno: 'Quisurocco', anioEgreso: '2024', correoIInstitucional: 'cinthya.flores@upsjb.edu.pe', sedeFilial: 'Local Chorrillos', facultad: 'Ciencias de la Salud', carrera: 'Enfermería' },
            { nombre: 'Julia Victoria', apellidoPaterno: 'Ramon', apellidoMaterno: 'Salinas', anioEgreso: '2020', correoIInstitucional: 'julia.ramon@upsjb.edu.pe', sedeFilial: 'Local Chorrillos', facultad: 'Ciencias de la Salud', carrera: 'Enfermería' },
            { nombre: 'Miriam Elizabeth', apellidoPaterno: 'Livaque', apellidoMaterno: 'Chupillon', anioEgreso: '2022', correoIInstitucional: 'miriam.livaque@upsjb.edu.pe', sedeFilial: 'Local San Borja', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Derecho' },
            { nombre: 'Jandira Katherine', apellidoPaterno: 'Figueroa', apellidoMaterno: 'Ruiz', anioEgreso: '2022', correoIInstitucional: 'jandira.figueroa@upsjb.edu.pe', sedeFilial: 'Local San Borja', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Derecho' },
            { nombre: 'Cindia Guísela', apellidoPaterno: 'Antay', apellidoMaterno: 'Sanchez', anioEgreso: '2022', correoIInstitucional: 'cindia.antay@upsjb.edu.pe', sedeFilial: 'Local Chorrillos', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Derecho' },
            { nombre: 'Ruth Victoria', apellidoPaterno: 'Dolores', apellidoMaterno: 'Rojas de Paredes', anioEgreso: '2023', correoIInstitucional: 'ruth.dolores@upsjb.edu.pe', sedeFilial: 'Local Chorrillos', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Derecho' },
            { nombre: 'Liliana', apellidoPaterno: 'Castillo', apellidoMaterno: 'Gómez', anioEgreso: '2022', correoIInstitucional: 'liliana.castillog@upsjb.edu.pe', sedeFilial: 'Local Chorrillos', facultad: 'Derecho y Ciencias Empresariales', carrera: 'Derecho' },
            { nombre: 'Abigail', apellidoPaterno: 'Alarcon', apellidoMaterno: 'Chavez', anioEgreso: '2024', correoIInstitucional: 'abigail.alarcon@upsjb.edu.pe', sedeFilial: 'Local Chorrillos', facultad: 'Ciencias de la Salud', carrera: 'Enfermería' },
            { nombre: 'Almendra', apellidoPaterno: 'Vega', apellidoMaterno: 'Cardenas', anioEgreso: '2024', correoIInstitucional: 'almendra.vega@upsjb.edu.pe', sedeFilial: 'Local Chorrillos', facultad: 'Ciencias de la Salud', carrera: 'Enfermería' },
            { nombre: 'Marcos Antonio', apellidoPaterno: 'Astuchado', apellidoMaterno: 'Fuertes', anioEgreso: '2026', correoIInstitucional: 'marcos.astuchado@upsjb.edu.pe', sedeFilial: 'Local Chorrillos', facultad: 'Ciencias de la Salud', carrera: 'Enfermería' },
    ]


	// Función: Construye las fases finales con sus años y egresados correspondientes.
	fases: FaseDashboard[] = [];


	// Función: Guarda el ID de la fase seleccionada actualmente.
	idFaseSeleccionada = '';


	// Función: Guarda el valor actual de los controles de filtro antes de aplicarlos.
	textoBusqueda = '';
	seleccionCarrera = '';
	seleccionFacultad = '';
	seleccionSede = '';
	seleccionAnio = '';


	// Función: Guarda los filtros activos que se aplican a la tabla.
	filtroTexto = '';
	filtroCarrera = '';
	filtroFacultad = '';
	filtroSede = '';
	filtroAnio = '';


	// Función: Devuelve la cantidad total de egresados registrados.
	get cantidadEgresados(): number {
		return this.egresadoBK.length;
	}


	// Función: Devuelve la fase seleccionada actualmente.
	get faseSeleccionada(): FaseDashboard | undefined {
		return this.fases.find((fase) => fase.id === this.idFaseSeleccionada);
	}


	// Función: Devuelve los egresados pertenecientes a la fase seleccionada.
	get egresadosFaseSeleccionada(): EgresadoBK[] {
		return this.faseSeleccionada?.egresados ?? [];
	}


	// Función: Devuelve los egresados que se mostrarán en la tabla.
	get egresadosVisibles(): EgresadoBK[] {
		return this.aplicarCriterios(this.egresadosBaseVisibles);
	}


	// Función: Devuelve los egresados base según la fase seleccionada.
	get egresadosBaseVisibles(): EgresadoBK[] {

		if (this.egresadosFaseSeleccionada.length > 0) {
			return this.egresadosFaseSeleccionada;
		}
		return [...this.egresadoBK].sort((a, b) => Number(b.anioEgreso) - Number(a.anioEgreso));
	}


	// Función: Devuelve las opciones dinámicas de carrera según los registros visibles.
	get opcionesCarrera(): string[] {
		return this.obtenerOpcionesUnicas(this.egresadosBaseVisibles.map((egresado) => egresado.carrera));
	}


	// Función: Devuelve las opciones dinámicas de facultad según los registros visibles.
	get opcionesFacultad(): string[] {
		return this.obtenerOpcionesUnicas(this.egresadosBaseVisibles.map((egresado) => egresado.facultad));
	}


	// Función: Devuelve las opciones dinámicas de sede según los registros visibles.
	get opcionesSede(): string[] {
		return this.obtenerOpcionesUnicas(this.egresadosBaseVisibles.map((egresado) => egresado.sede));
	}


	// Función: Devuelve las opciones dinámicas de año según los registros visibles.
	get opcionesAnio(): string[] {
		return this.obtenerOpcionesUnicas(this.egresadosBaseVisibles.map((egresado) => String(egresado.anioEgreso)))
			.sort((a, b) => Number(b) - Number(a));
	}


	// Función: Indica si se están mostrando todos los egresados porque la fase seleccionada no tiene registros.
	get mostrarTodosEgresadosComoRespaldo(): boolean {
		return this.egresadosFaseSeleccionada.length === 0 && this.egresadoBK.length > 0;
	}


	// Función: Obtiene la cantidad máxima de egresados entre fases para calcular el ancho de las barras.
	get cantidadMaximaGraficoFases(): number {
		const maximo = Math.max(...this.fases.map((fase) => fase.egresados.length), 0);
		return maximo > 0 ? maximo : 1;
	}


	// Función: Obtiene la cantidad máxima de egresados por año dentro de la fase seleccionada.
	get cantidadMaximaGraficoAnios(): number {
		const maximo = Math.max(...this.filasAniosFaseSeleccionada.map((fila) => fila.cantidad), 0);
		return maximo > 0 ? maximo : 1;
	}


	// Función: Genera las filas del gráfico de egresados por año de la fase seleccionada.
	get filasAniosFaseSeleccionada(): { anio: number; cantidad: number }[] {
		if (!this.faseSeleccionada) {
			return [];
		}

		return this.faseSeleccionada.anios.map((anio) => ({
			anio,
			cantidad: this.egresadosFaseSeleccionada.filter((egresado) => Number(egresado.anioEgreso) === anio).length,
		}));
	}


	// Función: Cambia la fase seleccionada al hacer clic en la línea de tiempo.
	seleccionarFase(idFase: string): void {
		this.idFaseSeleccionada = idFase;
	}


	// Función: Aplica el filtro de texto en tiempo real sobre los seis campos de la tabla.
	aplicarFiltroTexto(): void {
		this.filtroTexto = this.textoBusqueda.trim();
	}


	// Función: Aplica los filtros seleccionados desde los controles de la interfaz.
	aplicarFiltros(): void {
		this.aplicarFiltroTexto();
		this.filtroCarrera = this.seleccionCarrera;
		this.filtroFacultad = this.seleccionFacultad;
		this.filtroSede = this.seleccionSede;
		this.filtroAnio = this.seleccionAnio;
	}


	// Función: Reinicia los controles y filtros activos para mostrar nuevamente todos los registros.
	reiniciarFiltros(): void {
		this.textoBusqueda = '';
		this.seleccionCarrera = '';
		this.seleccionFacultad = '';
		this.seleccionSede = '';
		this.seleccionAnio = '';

		this.filtroTexto = '';
		this.filtroCarrera = '';
		this.filtroFacultad = '';
		this.filtroSede = '';
		this.filtroAnio = '';
	}


	// Función: Calcula el ancho porcentual de la barra de una fase.
	obtenerAnchoBarraFase(fase: FaseDashboard): number {
		return Math.round((fase.egresados.length / this.cantidadMaximaGraficoFases) * 100);
	}


	// Función: Calcula el ancho porcentual de la barra de un año.
	obtenerAnchoBarraAnio(cantidad: number): number {
		return Math.round((cantidad / this.cantidadMaximaGraficoAnios) * 100);
	}


	// Función: Une los nombres y apellidos del egresado.
	obtenerNombreCompleto(egresado: EgresadoBK): string {
		return egresado.nombresApellidos;
	}


	// Función: Optimiza el renderizado de fases dentro del *ngFor.
	identificarFase = (_: number, fase: FaseDashboard): string => {
		return fase.id;
	};


	// Función: Optimiza el renderizado de egresados dentro del *ngFor.
	identificarEgresado(_: number, egresado: EgresadoBK): string {
		return `${egresado.numeroDocumento}-${egresado.anioEgreso}-${egresado.carrera}-${egresado.correoElectronico}`;
	}


	// Función: Construye todas las fases y asigna sus egresados según el año de egreso.
	private construirFases(): FaseDashboard[] {

		return this.plantillasFases.map((plantilla) => {
			const anios = this.obtenerAniosPorFase(plantilla);

			const egresados = this.egresadoBK
				.filter((egresado) => anios.includes(Number(egresado.anioEgreso)))
				.sort((a, b) => Number(b.anioEgreso) - Number(a.anioEgreso));

			return {
				id: plantilla.id,
				titulo: plantilla.titulo,
				etiquetaCohorte: plantilla.etiquetaCohorte,
				anios,
				egresados,
				descripcion: plantilla.descripcion,
				imagen: plantilla.imagen,
			};
		});
	}


	// Función: Calcula los años que pertenecen a una fase según el año actual.
	private obtenerAniosPorFase(plantilla: PlantillaFase): number[] {

		const aniosEgreso = this.egresadoBK.map((egresado) => Number(egresado.anioEgreso));
		const anioMaximoDatos = Math.max(...aniosEgreso, this.anioActual);
		const anioMinimoDatos = Math.min(...aniosEgreso, this.anioActual - 8);

		const anioInicio = Math.min(this.anioActual - plantilla.aniosMinimosDesdeEgreso, anioMaximoDatos);

		const anioFin = plantilla.aniosMaximosDesdeEgreso === null
			? anioMinimoDatos
			: this.anioActual - plantilla.aniosMaximosDesdeEgreso;

		const anios: number[] = [];

		for (let anio = anioInicio; anio >= anioFin; anio--) {
			anios.push(anio);
		}

		return anios;

	}


	// Función: Selecciona automáticamente la primera fase que tenga egresados registrados.
	private obtenerIdFaseInicial(): string {
		const primeraFaseConDatos = this.fases.find((fase) => fase.egresados.length > 0);
		return primeraFaseConDatos?.id ?? this.fases[0]?.id ?? '';
	}


	// Función: Devuelve true si el egresado cumple el texto buscado en cualquiera de los seis campos de la tabla.
	private cumpleFiltroTexto(egresado: EgresadoBK): boolean {
		const texto = this.normalizarTexto(this.filtroTexto);

		if (!texto) {
			return true;
		}

		const camposBuscables = [
			this.obtenerNombreCompleto(egresado),
			String(egresado.anioEgreso),
			egresado.correoElectronico,
			egresado.carrera,
			egresado.sede,
			egresado.facultad,
			egresado.numeroDocumento,
		];

		return camposBuscables.some((campo) => this.normalizarTexto(campo).includes(texto));
	}


	// Función: Aplica todos los criterios activos de filtro sobre un listado de egresados.
	private aplicarCriterios(egresados: EgresadoBK[]): EgresadoBK[] {
		return egresados.filter((egresado) => {
			const coincideTexto = this.cumpleFiltroTexto(egresado);
			const coincideCarrera = !this.filtroCarrera || egresado.carrera === this.filtroCarrera;
			const coincideFacultad = !this.filtroFacultad || egresado.facultad === this.filtroFacultad;
			const coincideSede = !this.filtroSede || egresado.sede === this.filtroSede;
			const coincideAnio = !this.filtroAnio || String(egresado.anioEgreso) === this.filtroAnio;

			return coincideTexto && coincideCarrera && coincideFacultad && coincideSede && coincideAnio;
		});
	}


	// Función: Devuelve una lista única y ordenada alfabéticamente de valores para poblar los selects.
	private obtenerOpcionesUnicas(valores: string[]): string[] {
		return Array.from(new Set(valores)).sort((a, b) => a.localeCompare(b));
	}


	// Función: Normaliza texto para comparación sin tildes y sin distinguir mayúsculas.
	private normalizarTexto(valor: string): string {
		return valor
			.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '');
	}

    obtenerEncuestados() {

        this._http.get('consultar-encuestados').subscribe({

            next: (res) => {

                console.log(res.lista);
                this.egresadoBK = res.lista;
				this.fases = this.construirFases();
				this.idFaseSeleccionada = this.obtenerIdFaseInicial();

                this.cdr.detectChanges();

            },

            error: (err) => {

                console.error('Error al obtener los encuestados:', err);

            }

        });

    }

}



/**/


