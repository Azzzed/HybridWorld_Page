import type { SiteContent } from "./types";

/**
 * English copy (main language of the site, at /).
 *
 * It only states facts taken from the current site, the old GoDaddy site and
 * the Google listings, plus general hybrid know-how. What needs the client's
 * input is marked `TODO(cliente)` and listed in docs/pendientes-cliente.md.
 */
export const en: SiteContent = {
  ui: {
    skip: "Skip to content",
    mainNav: "Main",
    homeLabel: "Hybrid World Inc — home",
    nav: { services: "Services", locations: "Locations", reviews: "Reviews", faq: "FAQ" },
    seeAll: {
      services: "All services",
      locations: "Addresses, hours and directions",
      reviews: "All reviews",
      faq: "All questions",
    },
    breadcrumbHome: "Home",
    breadcrumbLabel: "Breadcrumb",
    switchLanguage: "Español",
    call: "Call",
    whatsapp: "WhatsApp",
    askWhatsapp: "Ask on WhatsApp",
    freeQuote: "Free quote",
    directions: "Directions",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    quickContact: "Quick contact",
    quickContactClose: "Close quick contact",
    quickContactTitle: "Call your shop",
    closed: "Closed",
    serviceAdvisor: "Service advisor",
    languages: "English · Español",
    newBadge: "New",
    mainBadge: "Main shop",
    viewService: "View service",
    starsLabel: "out of 5 stars",
    reviewsLabel: "reviews",
    googleReview: "Google review",
    readReviews: "Read reviews on Google",
    writeReview: "Write a review",
    whatsappMessage: "Hi Hybrid World, I'd like information about:",
    cta: {
      title: "Talk to a hybrid specialist",
      text: "Call the shop closest to you or send us a WhatsApp message with your year, model and the warning you're seeing.",
    },
    footer: {
      pitch: "Message us and we'll get back to you with a quote.",
      spanish: "Se habla español.",
      locations: "Locations",
      hours: "Hours",
      navigation: "Navigation",
      quoteWhatsapp: "Quote on WhatsApp",
      googleListing: "Google listing",
      facebook: "Facebook",
      rights: "All rights reserved.",
      credits:
        "Shop photos: Hybrid World Inc Google listing · Vehicle photos: Wikimedia Commons · Logos: Simple Icons. Trademarks belong to their owners.",
    },
  },

  home: {
    title: "Hybrid Battery Repair & Replacement | Norwalk, Fullerton & Mountain View",
    description:
      "Hybrid battery repair and replacement, diagnostics and full service for Prius, Lexus, Camry, Ford and Tesla. Shops in Norwalk, Fullerton and Mountain View.",
    hero: {
      h1: "Hybrid battery repair & replacement",
      wordmark: ["Hybrid", "World"],
      lede: "Hybrid batteries, diagnostics and full repair. Three shops in California. Give us a call.",
      callCta: "Call now",
      aboutCta: "About us",
      // TODO(cliente): "Guaranteed repairs" se apoya en "We guarantee the quality of our
      // workmanship" del sitio anterior; confirmar que pueden prometerlo así.
      features: [
        ["Better", "fuel economy"],
        ["Professional", "diagnostics"],
        ["Guaranteed", "repairs"],
      ],
      outroTitle: ["We check the whole car,", "not just the battery."],
      outroLede:
        "Battery rebuilds, diagnostics and general repair for your hybrid. English and Spanish spoken at all three shops.",
      locationsCta: "Locations",
      scrollCue: "Scroll",
      posterAlt: "Toyota Prius in a dark studio, lit in green, at the start of a 360° camera turn",
    },
    brandsLabel: "Brands we service",
    services: {
      eyebrow: "Services",
      title: ["Specialized service", "for hybrids"],
      lede: "Specialized service for hybrid vehicles and high-voltage systems.",
    },
    team: {
      title: "The team",
      text: "One team across Norwalk, Fullerton and Mountain View. Se habla español at all three.",
      cta: "See our locations",
      hint: "Keep scrolling",
    },
    cars: { eyebrow: "In the shop", title: "Prius, Lexus, Camry, Ford and Tesla" },
    locations: {
      eyebrow: "Locations",
      title: "Three shops in California",
      showAll: "Show all 3",
      mapCredit: "© Esri · OpenStreetMap",
    },
    reviews: {
      eyebrow: "Customers",
      title: "What people say on Google",
      source: "Google reviews",
    },
    faq: { eyebrow: "Questions", title: "Frequently asked questions" },
    gallery: { label: "Photos from the shop" },
  },

  servicesPage: {
    title: "Hybrid Repair Services: Batteries, A/C & More | Hybrid World",
    description:
      "Hybrid battery repair and replacement, A/C, transmission, water pump, oil change and radiator service for Prius, Lexus, Camry, Ford and Tesla in California.",
    h1: "Hybrid repair services",
    intro:
      "Everything a hybrid needs under one roof: the high-voltage battery and the hybrid system, plus the transmission, cooling, A/C and regular maintenance. Available at our Norwalk, Fullerton and Mountain View shops.",
    modelsTitle: "Vehicles we work on",
    items: {
      "hybrid-battery": {
        paragraphs: [
          "When a hybrid battery pack can't hold a charge anymore, the car warns you: a red triangle on the dash, the gas engine running all the time and fuel economy dropping fast. Often only a few of the pack's modules are weak, and they drag the whole pack down.",
          "We test the pack module by module, replace the weak modules and balance the pack so every module works at the same level. When the pack is too far gone, we replace it. A rebuilt pack is an affordable alternative to a dealership replacement.",
          // TODO(cliente): ¿instalan baterías nuevas además de reconstruidas? Plazo de la garantía y cuánto tarda el trabajo.
        ],
        listTitle: "Signs your hybrid battery needs attention",
        list: [
          "Red triangle or \"Check Hybrid System\" warning on the dash",
          "Trouble codes P0A80 or P3000",
          "Fuel economy noticeably lower than usual",
          "The gas engine runs almost all the time, even at low speed",
          "The battery gauge jumps from full to empty in minutes",
        ],
        models: ["Toyota Prius (every generation)", "Prius Prime", "Camry Hybrid", "Lexus CT 200h", "Lexus RX 400h / 450h", "Lexus GS 450h", "Ford Escape Hybrid", "Nissan Altima Hybrid", "Chevrolet Tahoe Hybrid"],
      },
      ac: {
        paragraphs: [
          "Most hybrids use an electric A/C compressor powered by the high-voltage battery, so the air keeps blowing cold when the engine shuts off. That compressor needs a special non-conductive oil, and the wrong service can damage it.",
          "We find leaks, recharge the refrigerant and check the electric compressor and its high-voltage wiring, using the oil the system was designed for.",
        ],
        listTitle: "Signs your A/C needs service",
        list: [
          "Air blows warm or only cools while driving",
          "The A/C cuts out when the engine stops",
          "Hissing, clicking or new noises from the compressor",
        ],
        models: ["Toyota Prius", "Camry Hybrid", "Lexus hybrids", "Ford hybrids", "Tesla"],
      },
      transmission: {
        paragraphs: [
          "Hybrids like the Prius don't have a conventional gearbox. They use a transaxle (eCVT) with electric motor-generators inside, so it takes a shop that knows the hybrid system.",
          "We diagnose, repair and rebuild hybrid transaxles, and we also work on conventional automatic transmissions. After the diagnosis we tell you whether it can be repaired or needs a rebuild, and what each option involves.",
        ],
        listTitle: "Signs of transmission trouble",
        list: [
          "Whining or grinding that changes with speed",
          "Shudder or clunk when accelerating or braking",
          "Fluid leaks under the car",
          "Transaxle or motor-generator trouble codes",
        ],
        models: ["Toyota Prius 2004–2009", "Toyota Prius 2010–2015", "Camry Hybrid", "Lexus hybrids"],
      },
      "water-pump": {
        paragraphs: [
          "Many hybrids have two cooling circuits: one for the engine and one for the inverter, the unit that drives the electric motors. Each has its own pump, and when the inverter pump fails the hybrid system can overheat and shut down.",
          "We replace the engine water pump or the electric inverter pump, refill the right coolant and bleed the system so no air stays trapped.",
        ],
        listTitle: "Signs of a failing pump",
        list: [
          "Temperature gauge rising or overheating warnings",
          "Coolant leaks or a sweet smell after driving",
          "Hybrid system warning once the car warms up",
        ],
        models: ["Toyota Prius", "Camry Hybrid", "Lexus hybrids", "Ford hybrids"],
      },
      "oil-change": {
        paragraphs: [
          "A hybrid engine starts and stops many times per trip and often runs cooler than a regular engine, so it needs the right low-viscosity oil and a filter changed on schedule.",
          "While the car is in, we look at the brakes, the coolant and the 12-volt battery and tell you if anything needs attention.",
        ],
        listTitle: "What's included",
        // TODO(cliente): qué revisa exactamente la inspección multipunto.
        list: ["Oil and filter change", "Multi-point inspection", "Fluid level check"],
        models: ["Toyota Prius", "Camry Hybrid", "Lexus hybrids", "Ford hybrids"],
      },
      radiator: {
        paragraphs: [
          "The radiator keeps the engine and, on many hybrids, the inverter at the right temperature. A small leak can turn into overheating and expensive damage, especially in a California summer.",
          "We find the leak, repair or replace the radiator, change the coolant and check the inverter cooling loop so the whole system is sealed and full.",
        ],
        listTitle: "Signs of radiator trouble",
        list: ["Coolant puddles under the front of the car", "Low coolant warning or overheating", "Electric cooling fan running all the time"],
        models: ["Toyota Prius", "Camry Hybrid", "Lexus hybrids", "Ford hybrids"],
      },
    },
  },

  locationsPage: {
    title: "Locations: Norwalk, Fullerton & Mountain View | Hybrid World",
    description:
      "Visit Hybrid World in Norwalk, Fullerton or Mountain View, CA. Addresses, phone numbers, hours and directions for our three hybrid repair shops.",
    h1: "Hybrid repair shops in Norwalk, Fullerton and Mountain View",
    intro: "Three shops in California, one team. English and Spanish spoken at all three.",
    hoursTitle: "Hours",
    contactTitle: "Contact",
    nearbyTitle: "Close to",
    googleTitle: "On Google",
    items: {
      norwalk: {
        heading: "Norwalk, CA",
        paragraphs: [
          "Norwalk is our main shop and the home of our battery rebuilding center, on Firestone Boulevard in southeast Los Angeles County.",
          "Bring your hybrid here for battery testing, reconditioning and replacement, hybrid diagnostics, and the bigger jobs: engines, transmissions, cooling and A/C.",
        ],
      },
      fullerton: {
        heading: "Fullerton, CA",
        paragraphs: [
          "Our Fullerton shop on West Commonwealth Avenue gives Orange County drivers full hybrid service without the drive to Los Angeles County.",
          "Inland Orange County summers are hard on hybrids: heat ages the battery faster and puts the A/C and the inverter cooling system to work, so a battery and cooling check before summer is time well spent.",
        ],
      },
      "mountain-view": {
        heading: "Mountain View, CA",
        paragraphs: [
          "Mountain View is our newest shop and our home in Northern California, on Old Middlefield Way. It brings the same hybrid know-how as our Southern California shops to the Bay Area.",
          "Bay Area traffic means a lot of stop-and-go driving, which is when a hybrid leans hardest on its battery and brakes. Bring it in for battery service, hybrid diagnostics and general maintenance.",
        ],
      },
    },
  },

  reviewsPage: {
    title: "Customer Reviews on Google | Hybrid World Inc",
    description:
      "Read what customers say on Google about Hybrid World's hybrid battery and repair service in Norwalk, Fullerton and Mountain View, and leave your own review.",
    h1: "Customer reviews",
    intro: "Every review on this page comes from Google. Had your hybrid serviced with us? Tell other drivers how it went.",
    summary: "{rating} average from {count} Google reviews across our three shops",
    placesTitle: "Each shop on Google",
    latestTitle: "Recent reviews",
    bundledNote: "A few reviews from our Norwalk shop. Read them all on Google.",
  },

  faqPage: {
    title: "Hybrid Repair FAQ: Battery, Hours & Locations | Hybrid World",
    description:
      "Answers about hybrid battery warning signs, rebuilt batteries, the vehicles we service, warranty, hours and locations at Hybrid World in California.",
    h1: "Frequently asked questions",
    intro: "Quick answers to what customers ask us most. Don't see your question? Give us a call.",
  },

  faq: [
    {
      q: "What do you repair?",
      a: "Hybrid batteries, engines, transmissions, brakes, A/C, radiators and general maintenance.",
    },
    {
      q: "How do I know my hybrid battery is failing?",
      a: "A warning appears on the dash. On a Prius it's the red triangle with codes P0A80 or P3000. Lower fuel economy and an engine that runs all the time are other common signs.",
    },
    {
      // TODO(cliente): confirmar la cifra "hasta 90% del rendimiento a ~1/4 del costo" (viene del sitio actual).
      q: "Why choose a rebuilt battery?",
      a: "Up to 90% of the performance for about a quarter of the dealership price.",
    },
    {
      q: "Do you speak Spanish?",
      a: "Yes, at all three shops.",
    },
    {
      q: "Which vehicles do you work on?",
      a: "Toyota Prius of every generation, Prius Prime, Camry Hybrid, Lexus hybrids, Ford Escape Hybrid, Nissan Altima Hybrid and Chevrolet Tahoe Hybrid. We also service Tesla.",
    },
    {
      q: "What are your hours?",
      a: "{hours}",
    },
    {
      q: "Where are your shops?",
      a: "{addresses}",
    },
    {
      // TODO(cliente): plazo y condiciones de la garantía.
      q: "Do you offer a warranty?",
      a: "Yes. We guarantee the quality of our workmanship and offer warranty packages for our services. Ask for the terms of your repair.",
    },
  ],
};
