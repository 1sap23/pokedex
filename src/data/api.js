import { TYPES_FR } from "./types";

// cartes : les chargements partagés par l'onglet Cartes et la page d'une carte

const GRAPHQL = "https://graphql.pokeapi.co/v1beta2";

// la liste d'une région, avec noms français et types (même question que dans index.js)
export async function chargerRegion(region) {
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
