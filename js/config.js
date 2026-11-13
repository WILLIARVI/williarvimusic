// ================================================
// CONFIGURACIÓN GLOBAL - WILLI ARVI MUSIC
// ================================================
const CONFIG = {

  github: {
    user: "WILLIARVI",
    repo: "williarvimusic",
    galleryFolder: "galeria",
    musicFolder: "music"
  },

  forms: {
    compras:        "https://docs.google.com/forms/d/e/1FAIpQLSc25RVMU3kOOta4PH4qimfaBBAY_-6aD7QwM2DOtw90Yuw3qw/viewform",
    contrataciones: "https://docs.google.com/forms/d/e/1FAIpQLSf4P8Kv-0xLL_dI4hapQnRwAm0DY8EqgBnoEgl_Y1likAT5yg/viewform",
    resenasLibro:   "https://docs.google.com/forms/d/e/1FAIpQLSdhcWsPOuuBuljwApvYvokSbz-R8a3k9QsO_Uz1ixagHTqEWA/viewform"
  },

  reviewsCSV: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJ_ci6_Jm0_tVAS8Q1zN0J2aOEd32C9thH7i_N_IkkyxXZ5SZl9RAdt7r-yJQ8d2UeqNlmoEHL5oul/pub?gid=650806511&single=true&output=csv",

  social: {
    instagram: "https://www.instagram.com/williarvimusic",
    facebook:  "https://www.facebook.com/share/1ENDiojW8x/",
    youtube:   "https://www.youtube.com/@WilliamArizawilliarvi",
    tiktok:    "https://www.tiktok.com/@williarvimusic",
    spotify:   "https://open.spotify.com/user/313jhvfipr4zxs7hg3scyebbjkpi",
    appleMusic:"#",
    soundcloud:"#"
  },

  whatsapp: "573014951799",
  ubicacion: "Bogotá - Colombia",
  correo: "williarvimusic@gmail.com",

  productos: [
    {
      slug: "workbook",
      nombre: "Workbook - El Eco De Lo Eterno (PDF)",
      precio: "¡GRATIS con tu compra!",
      descripcionCorta: "Tu Bitácora de Reconstrucción y Sanidad Interior. Anexo exclusivo.",
      descripcionLarga: "Este Workbook no es un libro para leer de corrido. Es una herramienta. Es un taller de reconstrucción. Aquí vamos a hacer visible lo invisible. Te lo llevas completamente GRATIS en formato PDF al adquirir cualquier formato de El Eco de lo Eterno.",
      fotos: 1
    },
    {
      slug: "libro-epub",
      nombre: "Libro EPUB - El Eco De Lo Eterno",
      precio: "$30.000",
      descripcionCorta: "Versión digital en formato EPUB. Léelo al instante en cualquier dispositivo.",
      descripcionLarga: "La versión digital del libro que te conecta con lo eterno en formato EPUB. Compatible con e-readers, tablets y celulares. Disfruta de una lectura cómoda y adaptable, con acceso inmediato tras confirmar el pago.",
      fotos: 3
    },
    {
      slug: "libro-blanda",
      nombre: "Libro Físico - Pasta Blanda",
      precio: "$65.000",
      descripcionCorta: "Edición de pasta blanda. Cómoda, ligera y perfecta para leer una y otra vez.",
      descripcionLarga: "El Eco De Lo Eterno en edición de pasta blanda. Cómoda, ligera y perfecta para llevar contigo a donde quieras. Envío a toda Colombia.",
      fotos: 3
    },
    {
      slug: "libro-lujo",
      nombre: "Libro Físico - Pasta de Lujo",
      precio: "$120.000",
      descripcionCorta: "Edición premium con pasta de lujo. Un objeto para atesorar.",
      descripcionLarga: "Edición premium de El Eco De Lo Eterno con pasta de lujo. Un objeto para atesorar y exhibir en tu biblioteca. Papel de alta calidad y encuadernación resistente.",
      fotos: 4
    },
    {
      slug: "audiolibro",
      nombre: "Audiolibro - El Eco De Lo Eterno",
      precio: "$80.000",
      descripcionCorta: "Escucha el libro en la voz real de Willi ArVi. Capítulo por capítulo en MP3.",
      descripcionLarga: "Sumérgete en El Eco de lo Eterno como nunca antes. Esta edición especial ha sido narrada completamente en la voz real de Willi ArVi. Cada capítulo está dividido en pistas individuales en formato MP3, permitiéndote pausar, avanzar y volver a escuchar exactamente el tema que necesitas en el momento preciso. Una experiencia de acompañamiento íntimo, diseñada para que escuches mientras viajas, descansas o buscas un momento de reflexión. Disponible también en Audible/ACX, Google Play y Spotify.",
      fotos: 3
    },
    {
      slug: "camiseta",
      nombre: "Camiseta",
      precio: "$65.000",
      descripcionCorta: "Camiseta oficial de Willi ArVi Music.",
      descripcionLarga: "Camiseta oficial de Willi ArVi Music. Diseño exclusivo para fans que viven el proyecto. Tallas disponibles (se confirman por WhatsApp): S, M, L, XL.",
      fotos: 3
    },
    {
      slug: "gorra",
      nombre: "Gorra",
      precio: "$45.000",
      descripcionCorta: "Gorra oficial Willi ArVi Music.",
      descripcionLarga: "Gorra oficial Willi ArVi Music. Estilo y actitud para el día a día. Diseño bordado con el logo del artista.",
      fotos: 3
    },
    {
      slug: "posillo",
      nombre: "Posillo",
      precio: "$35.000",
      descripcionCorta: "Posillo oficial Willi ArVi Music.",
      descripcionLarga: "Posillo oficial Willi ArVi Music. Tu compañero en cada sesión de escucha. Cerámica de alta calidad con diseño exclusivo.",
      fotos: 3
    },
    {
      slug: "afiche",
      nombre: "Afiche",
      precio: "$25.000",
      descripcionCorta: "Afiche de edición exclusiva de Willi ArVi.",
      descripcionLarga: "Afiche de edición exclusiva de Willi ArVi. Impresión de alta calidad para enmarcar y coleccionar. Tamaño 60x90 cm.",
      fotos: 3
    },
    {
      slug: "capa-perrito",
      nombre: "Capa para perrito",
      precio: "$55.000",
      descripcionCorta: "Capa oficial para tu compañero peludo.",
      descripcionLarga: "Capa oficial para tu compañero peludo. Porque la familia Willi ArVi también camina con cuatro patas. Tallas disponibles (se confirman por WhatsApp).",
      fotos: 3
    },
    {
      slug: "edicion-lujo",
      nombre: "Edición de Lujo El Eco De Lo Eterno",
      precio: "$599.000",
      descripcionCorta: "Estuche de lujo + auriculares + SD con toda mi obra + libro pasta de lujo + afiche.",
      descripcionLarga: "Una experiencia de colección completa para vivir el universo de Willi ArVi con todos los sentidos. Esta edición de lujo reúne lo esencial de su obra en un solo estuche de coleccionista, impreso a todo color por dentro y por fuera con su biografía y fotografías exclusivas. Incluye: auriculares inalámbricos, Colección Musical Willi ArVi (toda la obra en una SD), libro El Eco De Lo Eterno en pasta de lujo, y afiche oficial firmado. Cada unidad está numerada y firmada a mano.",
      fotos: 5
    },
    {
      slug: "edicion-leyenda",
      nombre: "Edición Leyenda - Willi ArVi",
      precio: "$699.000",
      descripcionCorta: "Todo el pack: estuche + auriculares + SD + libro + afiche + camiseta + gorra + capa.",
      descripcionLarga: "La experiencia definitiva para el fan que lo quiere todo. La Edición Leyenda reúne la colección completa de Willi ArVi más el merchandising oficial, presentado en un estuche de lujo impreso a todo color con su biografía y fotografías exclusivas. Incluye: auriculares inalámbricos, Colección Musical Willi ArVi (toda la obra en una SD), libro El Eco De Lo Eterno en pasta de lujo, afiche oficial firmado, camiseta, gorra y capa para perrito. Cada unidad está numerada y firmada a mano.",
      fotos: 5
    }
  ],

  podcast: {
    nombre: "El Eco De Lo Eterno",
    descripcion: "Conversaciones sobre música, arte y la vida detrás de cada canción.",
    playlistId: "PLNTETHdzvRRU" // ID de la playlist del podcast
  },

  videos: {
    nuevoVideo: "UCY4zaZeDafBvcma5zXmQFTA", // Channel ID de Willi ArVi
    conciertos: "PLSRU7xGfEBVvUiw4nUm6yu6t6CF8Z0zFp", 
    conferencias: "PLNTETHdzvRRU", 
    backstage: "PLbQ93LwKnA8I" 
  },

  apoyos: {
    paypal:    "https://www.paypal.com/donate/?business=williarvimusic@gmail.com",
    nuQR:      "assets/qr/nu.png",
    paypalQR:  "assets/qr/paypal.png"
  }
};