import { View, Text, Image, StyleSheet } from "react-native";
import TypeBadge, { TYPE_COLORS } from "./TypeBadge";

const ARTWORK =
  "https://raw.githubusercontent.com/PokeAPI/sprites" +
  "/master/sprites/pokemon/other/official-artwork/";

export default function CartePokemon({ number, name, type }) {
  const color = TYPE_COLORS[type] ?? "#A8A878";

  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <Image
        source={{ uri: `${ARTWORK}${number}.png` }}
        style={{ width: 80, height: 80 }}
      />
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
    backgroundColor: "#ffffff",
    padding: 12,
    marginBottom: 10,
    borderRadius: 14,
    borderLeftWidth: 6,
  },
  numero: { fontSize: 12, color: "#9ca3af" },
  nom: { fontSize: 18, fontWeight: "bold", color: "#111827" },
});