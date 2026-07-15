

export const environment = {

    production: true,

    apiBackend: {
        backend: "http://localhost:8080/"
    },

    apiUniversidad: {
        integraciones: {
            academico: {
                apiURL: "https://app.upsjb.edu.pe/apisIntegracionesAcademico/api/v1/integracion/academico/",
                apiKEY: "Z2ZKVS8vMk15SVg5M0Fqdlc5MFY1R2s2alJBbE01Sk9PZWhaV1ovbkhXU2VIRmQ4T0w2UU5wUHZKeWZ5bkg0dA=="
            },
            egresado: {
                apiURL: "https://backdev-campus.upsjb.edu.pe/api-intranet-ps/api/egresado/",
            }

        },

    },

};

