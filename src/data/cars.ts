/**
 * Autos del carrusel horizontal, uno por marca de la tira de logos.
 * Fotos en /public/img/cars (Wikimedia Commons, licencias libres).
 */
export type Car = { src: string; model: string; brand: string };

export const cars: Car[] = [
  { src: "/img/cars/prius-gen3-a.jpg", model: "Prius ZVW30", brand: "Toyota" },
  { src: "/img/cars/lexus-rx.jpg", model: "RX 450h", brand: "Lexus" },
  { src: "/img/cars/camry-hybrid.jpg", model: "Camry Hybrid", brand: "Toyota" },
  { src: "/img/cars/ford-escape.jpg", model: "Escape Hybrid", brand: "Ford" },
  { src: "/img/cars/tesla-model3.jpg", model: "Model 3", brand: "Tesla" },
  { src: "/img/cars/prius-gen3-b.jpg", model: "Prius XW30", brand: "Toyota" },
  { src: "/img/cars/prius-prime.jpg", model: "Prius Prime", brand: "Toyota" },
  { src: "/img/cars/prius-gen4.jpg", model: "Prius ZVW50", brand: "Toyota" },
];
