// ANCIEN (séance 5) : import { View, Text, Image, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { View, Text, Image, ActivityIndicator, StyleSheet } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
// ANCIEN (séance 5) : la fiche lisait pokemons.js, maintenant c'est la PokéAPI
// import POKEMONS from "../../data/pokemons";
import TypeBadge from "../../components/TypeBadge";

const ARTWORK =
  "https://raw.githubusercontent.com/PokeAPI/sprites" +
  "/master/sprites/pokemon/other/official-artwork/";

// l'API donne les types en anglais, on les traduit pour garder nos couleurs
const TYPES_FR = {
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
};

export default function FichePokemon() {
  const { number } = useLocalSearchParams();
  // ANCIEN (séance 5) :
  // number est un texte dans l'adresse, on le transforme en nombre
  // const pokemon = POKEMONS.find((p) => p.number === Number(number));

  // null au départ : le Pokémon n'est pas encore arrivé
  const [pokemon, setPokemon] = useState(null);
  const [nomFr, setNomFr] = useState("");

  async function charger() {
    const reponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${number}`);
    const data = await reponse.json();
    setPokemon(data);

    // bonus : le nom en français, dans l'espèce du Pokémon
    const reponseFr = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${number}`);
    const dataFr = await reponseFr.json();
    setNomFr(dataFr.names.find((n) => n.language.name === "fr").name);
  }

  useEffect(() => {
    charger();
  }, []);

  if (pokemon === null) {
    return (
      <View style={styles.chargement}>
        <ActivityIndicator size="large" color="#2f5be7" />
      </View>
    );
  }

  // en attendant le nom français, on affiche le nom anglais
  const nom = nomFr || pokemon.name;
  const type = pokemon.types[0].type.name;

  return (
    <View style={styles.page}>
      <Stack.Screen options={{ title: nom }} />
      {/* ANCIEN (séance 5) :
      <Text style={styles.numero}>#{pokemon.number}</Text>
      <Image source={{ uri: `${ARTWORK}${pokemon.number}.png` }} style={styles.image} />
      <Text style={styles.nom}>{pokemon.name}</Text>
      <TypeBadge type={pokemon.type} />
      */}
      <Text style={styles.numero}>#{pokemon.id}</Text>
      <Image source={{ uri: `${ARTWORK}${pokemon.id}.png` }} style={styles.image} />
      <Text style={styles.nom}>{nom}</Text>
      <TypeBadge type={TYPES_FR[type] || type} />

      <View style={styles.infos}>
        <Text style={styles.info}>Taille : {pokemon.height / 10} m</Text>
        <Text style={styles.info}>Poids : {pokemon.weight / 10} kg</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chargement: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f3f4f6" },
  page: { flex: 1, alignItems: "center", padding: 24, backgroundColor: "#f3f4f6" },
  numero: { alignSelf: "flex-end", fontSize: 18, color: "#6b7280" },
  image: { width: 250, height: 250 },
  nom: { fontSize: 30, fontWeight: "bold", color: "#111827", marginBottom: 8 },
  infos: { flexDirection: "row", gap: 24, marginTop: 20 },
  info: { fontSize: 18, color: "#111827" },
});
