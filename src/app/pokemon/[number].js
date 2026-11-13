import { View, Text, Image, StyleSheet } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import POKEMONS from "../../data/pokemons";
import TypeBadge from "../../components/TypeBadge";

const ARTWORK =
  "https://raw.githubusercontent.com/PokeAPI/sprites" +
  "/master/sprites/pokemon/other/official-artwork/";

export default function FichePokemon() {
  const { number } = useLocalSearchParams();
  // number est un texte dans l'adresse, on le transforme en nombre
  const pokemon = POKEMONS.find((p) => p.number === Number(number));

  return (
    <View style={styles.page}>
      <Stack.Screen options={{ title: pokemon.name }} />
      <Text style={styles.numero}>#{pokemon.number}</Text>
      <Image source={{ uri: `${ARTWORK}${pokemon.number}.png` }} style={styles.image} />
      <Text style={styles.nom}>{pokemon.name}</Text>
      <TypeBadge type={pokemon.type} />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, alignItems: "center", padding: 24, backgroundColor: "#f3f4f6" },
  numero: { alignSelf: "flex-end", fontSize: 18, color: "#6b7280" },
  image: { width: 250, height: 250 },
  nom: { fontSize: 30, fontWeight: "bold", color: "#111827", marginBottom: 8 },
});
