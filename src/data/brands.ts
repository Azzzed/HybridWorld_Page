/**
 * Marcas que atendemos. Logos en /public/img/brands.
 * `scale` iguala el peso óptico: el logo de Lexus es un logotipo muy ancho
 * y los demás son emblemas, así que sin ajuste uno se come a los otros.
 */
export type Brand = { name: string; file: string; scale: number };

export const brands: Brand[] = [
  { name: "Toyota", file: "toyota", scale: 1 },
  { name: "Lexus", file: "lexus", scale: 0.52 },
  { name: "Ford", file: "ford", scale: 0.86 },
  { name: "Tesla", file: "tesla", scale: 0.92 },
];
