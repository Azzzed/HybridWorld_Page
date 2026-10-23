import type { SiteContent } from "./types";

/**
 * Textos en español (/es). Parten del contenido en español del sitio
 * original; lo nuevo está escrito para clientes hispanohablantes de
 * California, no traducido palabra por palabra.
 *
 * Lo marcado con `TODO(cliente)` está pendiente de confirmar
 * (docs/pendientes-cliente.md).
 */
export const es: SiteContent = {
  ui: {
    skip: "Saltar al contenido",
    mainNav: "Principal",
    homeLabel: "Hybrid World Inc — inicio",
    nav: { services: "Servicios", locations: "Sucursales", reviews: "Reseñas", faq: "Preguntas" },
    seeAll: {
      services: "Todos los servicios",
      locations: "Direcciones, horarios y cómo llegar",
      reviews: "Todas las reseñas",
      faq: "Todas las preguntas",
    },
    breadcrumbHome: "Inicio",
    breadcrumbLabel: "Ruta de navegación",
    switchLanguage: "English",
    call: "Llamar",
    whatsapp: "WhatsApp",
    askWhatsapp: "Preguntar por WhatsApp",
    freeQuote: "Cotización gratis",
    directions: "Cómo llegar",
    menuOpen: "Abrir menú",
    menuClose: "Cerrar menú",
    quickContact: "Contacto rápido",
    quickContactClose: "Cerrar contacto rápido",
    quickContactTitle: "Marca a tu sucursal",
    closed: "Cerrado",
    serviceAdvisor: "Asesor de servicio",
    languages: "Español · English",
    newBadge: "Nueva",
    mainBadge: "Casa matriz",
    viewService: "Ver servicio",
    starsLabel: "de 5 estrellas",
    reviewsLabel: "reseñas",
    googleReview: "Reseña de Google",
    readReviews: "Leer reseñas en Google",
    writeReview: "Escribir una reseña",
    whatsappMessage: "Hola, quiero información del servicio:",
    legal: { privacy: "Política de privacidad", terms: "Términos y condiciones", englishOnly: "(en inglés)" },
    cta: {
      title: "Habla con un especialista en híbridos",
      text: "Llama a la sucursal más cercana o mándanos un WhatsApp con el año, el modelo y el aviso que te aparece.",
    },
    footer: {
      pitch: "Escríbenos y te respondemos con una cotización.",
      spanish: "Se habla español.",
      locations: "Sucursales",
      hours: "Horario",
      navigation: "Navegación",
      quoteWhatsapp: "Cotización por WhatsApp",
      googleListing: "Ficha en Google",
      facebook: "Facebook",
      rights: "Todos los derechos reservados.",
      credits:
        "Fotos del taller: ficha de Google de Hybrid World Inc · Fotos de vehículos: Wikimedia Commons · Logos: Simple Icons. Las marcas son de sus dueños.",
    },
  },

  home: {
    title: "Reparación y cambio de baterías híbridas | Norwalk, Fullerton y Mountain View",
    description:
      "Taller especializado en híbridos: baterías Prius, Lexus, Camry, Ford y Tesla, diagnóstico y reparación general. Sucursales en Norwalk, Fullerton y Mountain View.",
    hero: {
      h1: "Reparación de baterías híbridas",
      wordmark: ["Hybrid", "World"],
      lede: "Baterías híbridas, diagnóstico y reparación general. Tres talleres en California. Llama ya.",
      callCta: "Llamar",
      aboutCta: "Acerca de nosotros",
      // TODO(cliente): confirmar "Reparación garantizada" (ver nota en en.ts).
      features: [
        ["Mayor", "eficiencia"],
        ["Diagnóstico", "profesional"],
        ["Reparación", "garantizada"],
      ],
      outroTitle: ["Lo revisamos entero,", "no solo la batería."],
      outroLede:
        "Reconstrucción de baterías, diagnóstico y mecánica general para tu híbrido. Se habla español en los tres talleres.",
      locationsCta: "Sucursales",
      scrollCue: "Desliza",
      posterAlt: "Toyota Prius en un estudio oscuro con luz verde, al inicio de un giro de cámara de 360°",
    },
    brandsLabel: "Marcas que atendemos",
    services: {
      eyebrow: "Servicios",
      title: ["Servicio especializado", "en híbridos"],
      lede: "Servicios especializados para vehículos híbridos y sistemas de alto voltaje.",
    },
    team: {
      title: "El equipo",
      text: "Un solo equipo entre Norwalk, Fullerton y Mountain View. Se habla español en las tres.",
      cta: "Conoce las sucursales",
      hint: "Sigue bajando",
    },
    cars: { eyebrow: "Lo que pasa por el taller", title: "Prius, Lexus, Camry, Ford y Tesla" },
    locations: {
      eyebrow: "Sucursales",
      title: "Tres talleres en California",
      showAll: "Ver las 3",
      mapCredit: "© Esri · OpenStreetMap",
    },
    reviews: {
      eyebrow: "Clientes",
      title: "Lo que dicen en Google",
      source: "reseñas de Google",
    },
    faq: { eyebrow: "Dudas", title: "Preguntas frecuentes" },
    gallery: { label: "Fotos del taller" },
  },

  servicesPage: {
    title: "Servicios para autos híbridos: baterías, aire y más | Hybrid World",
    description:
      "Reparación y cambio de baterías híbridas, aire acondicionado, transmisión, bomba de agua, cambio de aceite y radiador para Prius, Lexus, Camry, Ford y Tesla.",
    h1: "Servicios para autos híbridos",
    intro:
      "Todo lo que necesita un híbrido en un mismo taller: la batería de alto voltaje y el sistema híbrido, y también la transmisión, el enfriamiento, el aire acondicionado y el mantenimiento. En nuestras sucursales de Norwalk, Fullerton y Mountain View.",
    modelsTitle: "Vehículos que atendemos",
    items: {
      "hybrid-battery": {
        paragraphs: [
          "Cuando el paquete de la batería híbrida ya no aguanta la carga, el auto avisa: el triángulo rojo en el tablero, el motor de gasolina prendido todo el tiempo y el rendimiento que se va para abajo. Muchas veces solo unos cuantos módulos están débiles y jalan para abajo a todo el paquete.",
          "Probamos módulo por módulo, cambiamos los débiles y balanceamos el paquete para que todos trabajen parejo. Cuando el paquete ya no tiene arreglo, lo cambiamos. Una batería reconstruida cuesta mucho menos que cambiarla en la agencia.",
          // TODO(cliente): ver la nota en en.ts (baterías nuevas, garantía, tiempos).
        ],
        listTitle: "Señales de que la batería necesita atención",
        list: [
          "Triángulo rojo o aviso de «Check Hybrid System» en el tablero",
          "Códigos P0A80 o P3000",
          "Rinde bastante menos gasolina que antes",
          "El motor de gasolina casi nunca se apaga, ni a baja velocidad",
          "El indicador de la batería pasa de lleno a vacío en minutos",
        ],
        models: ["Toyota Prius (todas las generaciones)", "Prius Prime", "Camry Hybrid", "Lexus CT 200h", "Lexus RX 400h / 450h", "Lexus GS 450h", "Ford Escape Hybrid", "Nissan Altima Hybrid", "Chevrolet Tahoe Hybrid"],
      },
      ac: {
        paragraphs: [
          "Casi todos los híbridos usan un compresor de aire eléctrico que funciona con la batería de alto voltaje, para que el clima siga enfriando cuando el motor se apaga. Ese compresor lleva un aceite especial que no conduce electricidad, y un servicio mal hecho lo puede dañar.",
          "Buscamos fugas, cargamos el refrigerante y revisamos el compresor eléctrico y su cableado de alto voltaje, con el aceite que pide el sistema.",
        ],
        listTitle: "Señales de que el aire necesita servicio",
        list: [
          "Echa aire caliente o solo enfría en movimiento",
          "Deja de enfriar cuando el motor se apaga",
          "Silbidos, chasquidos o ruidos nuevos del compresor",
        ],
        models: ["Toyota Prius", "Camry Hybrid", "Híbridos Lexus", "Híbridos Ford", "Tesla"],
      },
      transmission: {
        paragraphs: [
          "Los híbridos como el Prius no tienen una caja de cambios normal: usan un transeje (eCVT) con motores-generadores eléctricos adentro, así que hace falta un taller que conozca el sistema híbrido.",
          "Diagnosticamos, reparamos y reconstruimos transejes híbridos, y también trabajamos transmisiones automáticas convencionales. Con el diagnóstico te decimos si la falla se repara o si hace falta reconstruirla.",
        ],
        listTitle: "Señales de falla en la transmisión",
        list: [
          "Zumbido o rechinido que cambia con la velocidad",
          "Jaloneos o golpes al acelerar o frenar",
          "Fugas de aceite debajo del auto",
          "Códigos del transeje o de los motores-generadores",
        ],
        models: ["Toyota Prius 2004–2009", "Toyota Prius 2010–2015", "Camry Hybrid", "Híbridos Lexus"],
      },
      "water-pump": {
        paragraphs: [
          "Muchos híbridos tienen dos circuitos de enfriamiento: uno para el motor y otro para el inversor, la pieza que mueve los motores eléctricos. Cada uno tiene su bomba, y si la del inversor falla, el sistema híbrido se calienta y se apaga.",
          "Cambiamos la bomba de agua del motor o la bomba eléctrica del inversor, rellenamos con el anticongelante correcto y purgamos el sistema para que no quede aire adentro.",
        ],
        listTitle: "Señales de que la bomba está fallando",
        list: [
          "La temperatura sube o aparece aviso de sobrecalentamiento",
          "Fugas de anticongelante u olor dulce después de manejar",
          "Aviso del sistema híbrido cuando el auto ya está caliente",
        ],
        models: ["Toyota Prius", "Camry Hybrid", "Híbridos Lexus", "Híbridos Ford"],
      },
      "oil-change": {
        paragraphs: [
          "El motor de un híbrido se prende y se apaga muchas veces en cada viaje y suele trabajar más frío que uno normal, así que necesita el aceite de baja viscosidad correcto y su filtro cambiado a tiempo.",
          "Mientras el auto está en el taller revisamos los frenos, el anticongelante y la batería de 12 voltios, y te avisamos si algo necesita atención.",
        ],
        listTitle: "Qué incluye",
        list: ["Cambio de aceite y filtro", "Revisión multipunto", "Revisión de niveles"],
        models: ["Toyota Prius", "Camry Hybrid", "Híbridos Lexus", "Híbridos Ford"],
      },
      radiator: {
        paragraphs: [
          "El radiador mantiene a la temperatura correcta el motor y, en muchos híbridos, también el inversor. Una fuga pequeña puede acabar en un sobrecalentamiento y una reparación cara, sobre todo en el verano de California.",
          "Encontramos la fuga, reparamos o cambiamos el radiador, renovamos el anticongelante y revisamos el circuito del inversor para que todo quede sellado y lleno.",
        ],
        listTitle: "Señales de falla en el radiador",
        list: ["Charcos de anticongelante debajo del frente del auto", "Aviso de anticongelante bajo o sobrecalentamiento", "El ventilador eléctrico no se apaga"],
        models: ["Toyota Prius", "Camry Hybrid", "Híbridos Lexus", "Híbridos Ford"],
      },
    },
  },

  locationsPage: {
    title: "Sucursales en Norwalk, Fullerton y Mountain View | Hybrid World",
    description:
      "Visita Hybrid World en Norwalk, Fullerton o Mountain View, California. Direcciones, teléfonos, horarios y cómo llegar a nuestros tres talleres de híbridos.",
    h1: "Talleres de híbridos en Norwalk, Fullerton y Mountain View",
    intro: "Tres talleres en California y un solo equipo. Se habla español en los tres.",
    hoursTitle: "Horario",
    contactTitle: "Contacto",
    nearbyTitle: "Cerca de",
    googleTitle: "En Google",
    items: {
      norwalk: {
        heading: "Norwalk, CA",
        paragraphs: [
          "Norwalk es nuestra casa matriz y el centro donde reconstruimos las baterías híbridas, sobre Firestone Boulevard, en el sureste del condado de Los Ángeles.",
          "Tráenos tu híbrido para probar, reacondicionar o cambiar la batería, para un diagnóstico del sistema híbrido o para los trabajos grandes: motor, transmisión, enfriamiento y aire acondicionado.",
        ],
      },
      fullerton: {
        heading: "Fullerton, CA",
        paragraphs: [
          "Nuestra sucursal de Fullerton, sobre West Commonwealth Avenue, da servicio completo a los híbridos de Orange County sin tener que manejar hasta el condado de Los Ángeles.",
          "Los veranos del interior de Orange County son duros para un híbrido: el calor envejece la batería más rápido y hace trabajar al aire y al enfriamiento del inversor. Por eso vale la pena revisar la batería y el enfriamiento antes de que llegue el calor.",
        ],
      },
      "mountain-view": {
        heading: "Mountain View, CA",
        paragraphs: [
          "Mountain View es nuestra sucursal más reciente y nuestra casa en el norte de California, sobre Old Middlefield Way. Lleva al Área de la Bahía la misma experiencia en híbridos de los talleres del sur.",
          "Con el tráfico de la Bahía se maneja mucho en arranque y parada, que es justo cuando un híbrido más le exige a su batería y a sus frenos. Aquí te atendemos la batería, el diagnóstico del sistema híbrido y el mantenimiento general.",
        ],
      },
    },
  },

  reviewsPage: {
    title: "Reseñas de clientes en Google | Hybrid World Inc",
    description:
      "Lee lo que dicen en Google los clientes de Hybrid World sobre nuestro servicio de baterías y reparación de híbridos en Norwalk, Fullerton y Mountain View.",
    h1: "Reseñas de clientes",
    intro: "Todas las reseñas de esta página vienen de Google. ¿Trajiste tu híbrido con nosotros? Cuéntales a otros conductores cómo te fue.",
    summary: "{rating} de promedio en {count} reseñas de Google de nuestros tres talleres",
    placesTitle: "Cada sucursal en Google",
    latestTitle: "Reseñas recientes",
    bundledNote: "Algunas reseñas de nuestra sucursal de Norwalk. Léelas todas en Google.",
  },

  faqPage: {
    title: "Preguntas frecuentes: batería, horario y sucursales | Hybrid World",
    description:
      "Respuestas sobre los avisos de la batería híbrida, baterías reconstruidas, vehículos que atendemos, garantía, horario y sucursales de Hybrid World.",
    h1: "Preguntas frecuentes",
    intro: "Lo que más nos preguntan, en corto. ¿No está tu pregunta? Llámanos.",
  },

  faq: [
    {
      q: "¿Qué reparan?",
      a: "Baterías híbridas, motor, transmisión, frenos, aire acondicionado, radiador y mantenimiento general.",
    },
    {
      q: "¿Cómo sé si la batería está fallando?",
      a: "Aparece un aviso en el tablero. En el Prius es el triángulo rojo con los códigos P0A80 o P3000. También rinde menos gasolina y el motor casi no se apaga.",
    },
    {
      q: "¿Por qué una batería reconstruida?",
      a: "Hasta 90% del rendimiento a cerca de una cuarta parte del costo de la agencia.",
    },
    {
      q: "¿Atienden en español?",
      a: "Sí, en las tres sucursales.",
    },
    {
      q: "¿Qué vehículos atienden?",
      a: "Toyota Prius de todas las generaciones, Prius Prime, Camry Hybrid, híbridos Lexus, Ford Escape Hybrid, Nissan Altima Hybrid y Chevrolet Tahoe Hybrid. También damos servicio a Tesla.",
    },
    {
      q: "¿Cuál es el horario?",
      a: "{hours}",
    },
    {
      q: "¿Dónde están las sucursales?",
      a: "{addresses}",
    },
    {
      q: "¿Dan garantía?",
      a: "Sí. Garantizamos la calidad de nuestro trabajo y ofrecemos paquetes de garantía para nuestros servicios. Pregunta los términos de tu reparación.",
    },
  ],
};
