// les 9 régions, avec le premier et le dernier numéro de leur Pokédex
const REGIONS = [
  { nom: "Kanto", debut: 1, fin: 151 },
  { nom: "Johto", debut: 152, fin: 251 },
  { nom: "Hoenn", debut: 252, fin: 386 },
  { nom: "Sinnoh", debut: 387, fin: 493 },
  { nom: "Unys", debut: 494, fin: 649 },
  { nom: "Kalos", debut: 650, fin: 721 },
  { nom: "Alola", debut: 722, fin: 809 },
  { nom: "Galar", debut: 810, fin: 905 },
  { nom: "Paldea", debut: 906, fin: 1025 },
];

// légendaires : pas une vraie région, mais un bouton doré à part
// legendaires: true dit au Pokédex de charger les Légendaires et Fabuleux
export const LEGENDAIRES = { nom: "Légendaires", legendaires: true };

export default REGIONS;
