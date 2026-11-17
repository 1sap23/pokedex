// ANCIEN (séance 5) : import { View, Text, Image, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
// ANCIEN (séance 6) : import { View, Text, Image, ActivityIndicator, StyleSheet } from "react-native";
import { ScrollView, View, Text, Image, ActivityIndicator, StyleSheet } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
// ANCIEN (séance 5) : la fiche lisait pokemons.js, maintenant c'est la PokéAPI
// import POKEMONS from "../../data/pokemons";
// ANCIEN (séance 6) : import TypeBadge from "../../components/TypeBadge";
import TypeBadge, { TYPE_COLORS } from "../../components/TypeBadge";

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
  // projet : les types des autres régions
  steel: "Acier",
  dark: "Ténèbres",
  flying: "Vol",
};

// projet : le nom des statistiques en français
const STATS_FR = {
  hp: "PV",
  attack: "Attaque",
  defense: "Défense",
  "special-attack": "Atq. Spé.",
  "special-defense": "Déf. Spé.",
  speed: "Vitesse",
};

export default function FichePokemon() {
  const { number } = useLocalSearchParams();
  // ANCIEN (séance 5) :
  // number est un texte dans l'adresse, on le transforme en nombre
  // const pokemon = POKEMONS.find((p) => p.number === Number(number));

  // null au départ : le Pokémon n'est pas encore arrivé
  const [pokemon, setPokemon] = useState(null);
  const [nomFr, setNomFr] = useState("");
  // projet : la catégorie (ex : « Pokémon Souris ») et la description du jeu
  const [categorie, setCategorie] = useState("");
  const [description, setDescription] = useState("");

  async function charger() {
    const reponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${number}`);
    const data = await reponse.json();
    setPokemon(data);

    // bonus : le nom en français, dans l'espèce du Pokémon
    const reponseFr = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${number}`);
    const dataFr = await reponseFr.json();
    // setNomFr(dataFr.names.find((n) => n.language.name === "fr").name);

    // projet : on cherche à chaque fois la version "fr",
    // et on vérifie qu'elle existe avant de s'en servir
    const nom = dataFr.names.find((n) => n.language.name === "fr");
    if (nom) {
      setNomFr(nom.name);
    }

    const genre = dataFr.genera.find((g) => g.language.name === "fr");
    if (genre) {
      setCategorie(genre.genus);
    }

    const texte = dataFr.flavor_text_entries.find((t) => t.language.name === "fr");
    if (texte) {
      // le texte du jeu contient des retours à la ligne, on les remplace par des espaces
      setDescription(texte.flavor_text.replaceAll("\n", " ").replaceAll("\f", " "));
    }
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
  // projet : la couleur du premier type, pour le bandeau et les barres
  const color = TYPE_COLORS[TYPES_FR[type]] || "#9ca3af";

  // ANCIEN (séance 6) : la fiche simple
  // return (
  //   <View style={styles.page}>
  //     <Stack.Screen options={{ title: nom }} />
  //     <Text style={styles.numero}>#{pokemon.id}</Text>
  //     <Image source={{ uri: `${ARTWORK}${pokemon.id}.png` }} style={styles.image} />
  //     <Text style={styles.nom}>{nom}</Text>
  //     <TypeBadge type={TYPES_FR[type] || type} />
  //
  //     <View style={styles.infos}>
  //       <Text style={styles.info}>Taille : {pokemon.height / 10} m</Text>
  //       <Text style={styles.info}>Poids : {pokemon.weight / 10} kg</Text>
  //     </View>
  //   </View>
  // );

  // projet : la fiche façon livre
  return (
    <ScrollView style={styles.page}>
      {/* le haut de l'écran prend aussi la couleur du type */}
      <Stack.Screen options={{ title: nom, headerStyle: { backgroundColor: color } }} />

      {/* le bandeau de couleur avec le numéro et l'image */}
      <View style={[styles.bandeau, { backgroundColor: color }]}>
        <Text style={styles.numero}>#{pokemon.id}</Text>
        <Image source={{ uri: `${ARTWORK}${pokemon.id}.png` }} style={styles.image} />
      </View>

      <View style={styles.contenu}>
        <Text style={styles.nom}>{nom}</Text>
        {categorie !== "" && <Text style={styles.categorie}>{categorie}</Text>}

        {/* tous les types, pas seulement le premier */}
        <View style={styles.types}>
          {pokemon.types.map((t) => (
            <TypeBadge key={t.type.name} type={TYPES_FR[t.type.name] || t.type.name} />
          ))}
        </View>

        {description !== "" && (
          <View style={styles.bloc}>
            <Text style={styles.description}>{description}</Text>
          </View>
        )}

        <View style={styles.infos}>
          <View style={styles.info}>
            <Text style={styles.infoTitre}>Taille</Text>
            <Text style={styles.infoValeur}>{pokemon.height / 10} m</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.infoTitre}>Poids</Text>
            <Text style={styles.infoValeur}>{pokemon.weight / 10} kg</Text>
          </View>
        </View>

        <View style={styles.bloc}>
          <Text style={styles.titreBloc}>Statistiques</Text>
          {pokemon.stats.map((s) => (
            <View key={s.stat.name} style={styles.stat}>
              <Text style={styles.statNom}>{STATS_FR[s.stat.name]}</Text>
              <Text style={styles.statValeur}>{s.base_stat}</Text>
              {/* le fond gris, et dedans la barre de couleur */}
              <View style={styles.barreFond}>
                {/* 255 est la plus grande valeur possible, on la met à 100 % */}
                <View
                  style={[
                    styles.barre,
                    { width: `${(s.base_stat / 255) * 100}%`, backgroundColor: color },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  chargement: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f3f4f6" },
  // ANCIEN (séance 6) :
  // page: { flex: 1, alignItems: "center", padding: 24, backgroundColor: "#f3f4f6" },
  // numero: { alignSelf: "flex-end", fontSize: 18, color: "#6b7280" },
  // image: { width: 250, height: 250 },
  // nom: { fontSize: 30, fontWeight: "bold", color: "#111827", marginBottom: 8 },
  // infos: { flexDirection: "row", gap: 24, marginTop: 20 },
  // info: { fontSize: 18, color: "#111827" },
  page: { flex: 1, backgroundColor: "#f3f4f6" },
  bandeau: { alignItems: "center", paddingTop: 12, paddingBottom: 20, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  numero: { alignSelf: "flex-end", marginRight: 20, fontSize: 20, fontWeight: "bold", color: "#ffffff" },
  image: { width: 220, height: 220 },
  contenu: { padding: 20 },
  nom: { fontSize: 32, fontWeight: "bold", color: "#111827", textAlign: "center" },
  categorie: { fontSize: 16, color: "#6b7280", textAlign: "center", marginTop: 2 },
  types: { flexDirection: "row", justifyContent: "center", gap: 8, marginTop: 8, marginBottom: 16 },
  bloc: { backgroundColor: "#ffffff", borderRadius: 16, padding: 16, marginBottom: 16 },
  description: { fontSize: 15, fontStyle: "italic", color: "#374151", lineHeight: 22 },
  infos: { flexDirection: "row", gap: 12, marginBottom: 16 },
  info: { flex: 1, backgroundColor: "#ffffff", borderRadius: 16, padding: 16, alignItems: "center" },
  infoTitre: { fontSize: 14, color: "#6b7280" },
  infoValeur: { fontSize: 22, fontWeight: "bold", color: "#111827", marginTop: 4 },
  titreBloc: { fontSize: 18, fontWeight: "bold", color: "#111827", marginBottom: 12 },
  stat: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  statNom: { width: 80, fontSize: 14, color: "#6b7280" },
  statValeur: { width: 36, fontSize: 14, fontWeight: "bold", color: "#111827" },
  barreFond: { flex: 1, height: 10, backgroundColor: "#e5e7eb", borderRadius: 5 },
  barre: { height: 10, borderRadius: 5 },
});
