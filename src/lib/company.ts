export const company = {
  tradeName: "Agua Ser Plus",
  legalName: "AGUAS LUIS ALBERTO HERNANDEZ HERNANDEZ EIRL",
  rut: "77.057.595-8",
  domain: "www.aguaser.cl",
  websiteUrl: "https://www.aguaser.cl",
  email: "contacto@aguaser.cl",
  logo: {
    src: "/images/logo-agua-ser-plus.jpeg",
    alt: "Agua Ser Plus - Salud, Economía y Reciclaje",
    width: 1503,
    height: 1600,
  },
  address: {
    street: "La Farfana 1562",
    commune: "Maipú",
    city: "Santiago",
    full: "La Farfana 1562, Maipú, Santiago",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=La+Farfana+1562+Maipu",
    mapsEmbedUrl:
      "https://maps.google.com/maps?q=La+Farfana+1562,+Maip%C3%BA,+Santiago,+Chile&z=16&output=embed",
  },
  hours: {
    label: "Lunes a viernes",
    from: "09:00",
    to: "18:00",
    display: "09:00 - 18:00 hrs",
  },
  phone: {
    landline: "229046610",
    landlineDisplay: "+56 2 2904 6610",
    landlineHref: "tel:+56229046610",
    mobile: "944786334",
    mobileDisplay: "+56 9 4478 6334",
    mobileHref: "tel:+56944786334",
  },
  whatsapp: {
    number: "56944786334",
    href: "https://wa.me/56944786334?text=Hola%20AguaSer%2C%20quiero%20pedir%20agua%20pura",
  },
  /** Completar cuando existan perfiles activos */
  social: [] as Array<{
    label: string;
    href: string;
  }>,
} as const;
