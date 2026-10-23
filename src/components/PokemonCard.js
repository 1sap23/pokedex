import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import TypeBadge, { TYPE_COLORS } from "./TypeBadge";

const ARTWORK =
  "https://raw.githubusercontent.com/PokeAPI/sprites" +
  "/master/sprites/pokemon/other/official-artwork/";

export default function PokemonCard({ number, name, type, captured, onToggle }) {
  // la couleur de la carte depend du type
  const color = TYPE_COLORS[type] ?? "#A8A878";

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: color + "33", borderColor: color },
        captured && styles.capturee,
      ]}
    >
      <Image source={{ uri: ARTWORK + number + ".png" }} style={styles.image} />
      <View style={{ flex: 1 }}>
        <Text style={styles.numero}>#{number}</Text>
        <Text style={styles.nom}>{name}</Text>
        <TypeBadge type={type} />
      </View>

      <Pressable
        style={[styles.bouton, captured && styles.boutonCapture]}
        onPress={onToggle}
      >
        <Text style={styles.boutonTexte}>{captured ? "Capturé" : "Capturer"}</Text>
      </Pressable>
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
  capturee: { borderWidth: 4, backgroundColor: "#fff7d6" },
  image: { width: 80, height: 80 },
  numero: { fontSize: 12, color: "#6b7280" },
  nom: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  bouton: { backgroundColor: "#2f5be7", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
  boutonCapture: { backgroundColor: "#16a34a" },
  boutonTexte: { color: "#ffffff", fontWeight: "bold" },
});
