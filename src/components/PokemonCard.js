import { View, Text, Image, StyleSheet } from "react-native";
import TypeBadge, { TYPE_COLORS } from "./TypeBadge";

const ARTWORK =
  "https://raw.githubusercontent.com/PokeAPI/sprites" +
  "/master/sprites/pokemon/other/official-artwork/";

export default function PokemonCard({ number, name, type }) {
  // la couleur de la carte depend du type
  const color = TYPE_COLORS[type] ?? "#A8A878";

  return (
    <View style={[styles.card, { backgroundColor: color + "33", borderColor: color }]}>
      <Image source={{ uri: ARTWORK + number + ".png" }} style={styles.image} />
      <View>
        <Text style={styles.numero}>#{number}</Text>
        <Text style={styles.nom}>{name}</Text>
        <TypeBadge type={type} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 12,
    marginBottom: 10,
    borderRadius: 14,
    borderWidth: 2,
  },
  image: { width: 80, height: 80 },
  numero: { fontSize: 12, color: "#6b7280" },
  nom: { fontSize: 18, fontWeight: "bold", color: "#111827" },
});
