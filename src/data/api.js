import { TYPES_FR } from "./types";

// cartes : les chargements partagés par l'onglet Cartes et la page d'une carte

const GRAPHQL = "https://graphql.pokeapi.co/v1beta2";

// légendaires : tous les Pokémon légendaires ET fabuleux, de toutes les régions
// _or : l'un OU l'autre est vrai
export async function chargerLegendaires() {
  const question = `{
    pokemonspecies(where: { _or: [{ is_legendary: { _eq: true } }, { is_mythical: { _eq: true } }] }, order_by: { id: asc }) {
      id
      is_mythical
      generation_id
      pokemonspeciesnames(where: { language_id: { _eq: 5 } }) { name }
      pokemons(limit: 1) { pokemontypes(order_by: { slot: asc }) { type { name } } }
    }
  }`;
  const reponse = await fetch(GRAPHQL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: question }),
  });
  const data = await reponse.json();
  return data.data.pokemonspecies.map((p) => {
    const nomFr = p.pokemonspeciesnames[0];
    const types = p.pokemons[0].pokemontypes.map((t) => TYPES_FR[t.type.name]);
    return {
      number: p.id,
      name: nomFr ? nomFr.name : "???",
      type: types[0],
      types: types,
      // les Fabuleux (Mew, Celebi...) sont encore plus rares que les Légendaires
      rang: p.is_mythical ? "Fabuleux" : "Légendaire",
      generation: p.generation_id,
    };
  });
}

// la liste d'une région, avec noms français et types (même question que dans index.js)
export async function chargerRegion(region) {
  // légendaires : le bouton doré charge une autre liste
  if (region.legendaires) {
    return chargerLegendaires();
  }
  const question = `{
    pokemonspecies(where: { id: { _gte: ${region.debut}, _lte: ${region.fin} } }, order_by: { id: asc }) {
      id
      pokemonspeciesnames(where: { language_id: { _eq: 5 } }) { name }
      pokemons(limit: 1) { pokemontypes(order_by: { slot: asc }) { type { name } } }
    }
  }`;
  const reponse = await fetch(GRAPHQL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: question }),
  });
  const data = await reponse.json();
  return data.data.pokemonspecies.map((p) => {
    const nomFr = p.pokemonspeciesnames[0];
    return {
      number: p.id,
      name: nomFr ? nomFr.name : "???",
      // tous les types en français, ex : ["Feu", "Vol"]
      types: p.pokemons[0].pokemontypes.map((t) => TYPES_FR[t.type.name]),
    };
  });
}

// tout ce qu'il faut pour dessiner une carte holo
export async function chargerCarte(number) {
  const reponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${number}`);
  const pokemon = await reponse.json();
  const reponseEspece = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${number}`);
  const espece = await reponseEspece.json();

  const nom = espece.names.find((n) => n.language.name === "fr");
  const genre = espece.genera.find((g) => g.language.name === "fr");
  const texte = espece.flavor_text_entries.find((t) => t.language.name === "fr");

  return {
    pokemon: pokemon,
    nom: nom ? nom.name : pokemon.name,
    categorie: genre ? genre.genus : "",
    description: texte ? texte.flavor_text.replaceAll("\n", " ").replaceAll("\f", " ") : "",
    types: pokemon.types.map((t) => TYPES_FR[t.type.name]),
  };
}

// attaques : les jeux du plus récent au plus ancien.
// on prend le premier jeu où le Pokémon apprend des attaques
// (25 = Écarlate/Violet, 20 = Épée/Bouclier, 23 = Diamant Étincelant...)
const JEUX = [25, 20, 23, 18, 17, 16, 15, 14, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

const CATEGORIES = { physical: "Physique", special: "Spéciale", status: "Statut" };

// les attaques qu'un Pokémon apprend en montant de niveau
export async function chargerAttaques(id) {
  const question = `{
    pokemonmove(where: { pokemon_id: { _eq: ${id} }, movelearnmethod: { name: { _eq: "level-up" } } }, order_by: { level: asc }) {
      level
      version_group_id
      move {
        id
        name
        power
        accuracy
        pp
        type { name }
        movedamageclass { name }
        movenames(where: { language_id: { _eq: 5 } }) { name }
        movetarget { movetargetnames(where: { language_id: { _eq: 5 } }) { name } }
        moveflavortexts(where: { language_id: { _eq: 5 } }, order_by: { version_group_id: desc }, limit: 1) { flavor_text }
      }
    }
  }`;
  const reponse = await fetch(GRAPHQL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: question }),
  });
  const data = await reponse.json();
  const toutes = data.data.pokemonmove;

  // le jeu le plus récent qui a des attaques pour ce Pokémon
  const jeu = JEUX.find((j) => toutes.some((a) => a.version_group_id === j));

  return toutes
    .filter((a) => a.version_group_id === jeu)
    .map((a) => {
      const m = a.move;
      const nom = m.movenames[0];
      const portee = m.movetarget ? m.movetarget.movetargetnames[0] : null;
      const texte = m.moveflavortexts[0];
      return {
        id: m.id,
        niveau: a.level,
        nom: nom ? nom.name : m.name,
        type: TYPES_FR[m.type.name],
        categorie: CATEGORIES[m.movedamageclass.name],
        puissance: m.power, // null pour les attaques de statut
        precision: m.accuracy, // null : ne rate jamais
        pp: m.pp, // combien de fois on peut l'utiliser
        portee: portee ? portee.name : "",
        description: texte ? texte.flavor_text.replaceAll("\n", " ") : "",
      };
    });
}
