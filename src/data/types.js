// la table des types : pour chaque type qui ATTAQUE,
// le multiplicateur contre chaque type qui DÉFEND.
// on n'écrit que les cas différents de x1 :
//   2 = super efficace, 0.5 = pas très efficace, 0 = aucun effet
const TABLE = {
  Normal: { Roche: 0.5, Acier: 0.5, Spectre: 0 },
  Feu: { Plante: 2, Glace: 2, Insecte: 2, Acier: 2, Feu: 0.5, Eau: 0.5, Roche: 0.5, Dragon: 0.5 },
  Eau: { Feu: 2, Sol: 2, Roche: 2, Eau: 0.5, Plante: 0.5, Dragon: 0.5 },
  Électrik: { Eau: 2, Vol: 2, Électrik: 0.5, Plante: 0.5, Dragon: 0.5, Sol: 0 },
  Plante: {
    Eau: 2, Sol: 2, Roche: 2,
    Feu: 0.5, Plante: 0.5, Poison: 0.5, Vol: 0.5, Insecte: 0.5, Dragon: 0.5, Acier: 0.5,
  },
  Glace: { Plante: 2, Sol: 2, Vol: 2, Dragon: 2, Feu: 0.5, Eau: 0.5, Glace: 0.5, Acier: 0.5 },
  Combat: {
    Normal: 2, Glace: 2, Roche: 2, Ténèbres: 2, Acier: 2,
    Poison: 0.5, Vol: 0.5, Psy: 0.5, Insecte: 0.5, Fée: 0.5, Spectre: 0,
  },
  Poison: { Plante: 2, Fée: 2, Poison: 0.5, Sol: 0.5, Roche: 0.5, Spectre: 0.5, Acier: 0 },
  Sol: { Feu: 2, Électrik: 2, Poison: 2, Roche: 2, Acier: 2, Plante: 0.5, Insecte: 0.5, Vol: 0 },
  Vol: { Plante: 2, Combat: 2, Insecte: 2, Électrik: 0.5, Roche: 0.5, Acier: 0.5 },
  Psy: { Combat: 2, Poison: 2, Psy: 0.5, Acier: 0.5, Ténèbres: 0 },
  Insecte: {
    Plante: 2, Psy: 2, Ténèbres: 2,
    Feu: 0.5, Combat: 0.5, Poison: 0.5, Vol: 0.5, Spectre: 0.5, Acier: 0.5, Fée: 0.5,
  },
  Roche: { Feu: 2, Glace: 2, Vol: 2, Insecte: 2, Combat: 0.5, Sol: 0.5, Acier: 0.5 },
  Spectre: { Psy: 2, Spectre: 2, Ténèbres: 0.5, Normal: 0 },
  Dragon: { Dragon: 2, Acier: 0.5, Fée: 0 },
  Ténèbres: { Psy: 2, Spectre: 2, Combat: 0.5, Ténèbres: 0.5, Fée: 0.5 },
  Acier: { Glace: 2, Roche: 2, Fée: 2, Feu: 0.5, Eau: 0.5, Électrik: 0.5, Acier: 0.5 },
  Fée: { Combat: 2, Dragon: 2, Ténèbres: 2, Feu: 0.5, Poison: 0.5, Acier: 0.5 },
};

// l'API donne les types en anglais, on les traduit pour garder nos couleurs
// phase 4 : déplacé ici depuis la fiche, la liste en a besoin aussi
export const TYPES_FR = {
  grass: "Plante",
  fire: "Feu",
  water: "Eau",
  electric: "Électrik",
  normal: "Normal",
  bug: "Insecte",
  poison: "Poison",
  ground: "Sol",
  fairy: "Fée",
  fighting: "Combat",
  psychic: "Psy",
  rock: "Roche",
  ghost: "Spectre",
  ice: "Glace",
  dragon: "Dragon",
  steel: "Acier",
  dark: "Ténèbres",
  flying: "Vol",
};

// la liste des 18 types, dans l'ordre de la table
export const TYPES = Object.keys(TABLE);

// le multiplicateur d'une attaque contre un Pokémon qui a un ou deux types
// ex : efficacite("Roche", ["Feu", "Vol"]) = 2 x 2 = 4
export function efficacite(attaque, defenses) {
  let multiplicateur = 1;
  for (const d of defenses) {
    const valeur = TABLE[attaque][d];
    // attention : on ne peut pas écrire "valeur || 1", car 0 deviendrait 1
    if (valeur !== undefined) {
      multiplicateur = multiplicateur * valeur;
    }
  }
  return multiplicateur;
}
