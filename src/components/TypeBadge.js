import { View, Text, StyleSheet } from "react-native";

export const TYPE_COLORS = {
  Plante: "#78C850",
  Feu: "#F08030",
  Eau: "#6890F0",
  Électrik: "#F8D030",
  // séance 4 : les autres types des 100 premiers Pokémon
  Normal: "#A8A878",
  Insecte: "#A8B820",
  Poison: "#A040A0",
  Sol: "#E0C068",
  Fée: "#EE99AC",
  Combat: "#C03028",
  Psy: "#F85888",
  Roche: "#B8A038",
  Spectre: "#705898",
};

export default function TypeBadge({ type }) {
  const color = TYPE_COLORS[type];
  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={styles.texte}>{type}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignSelf: "center", paddingVertical: 3, paddingHorizontal: 10, borderRadius: 12, marginTop: 4 },
  texte: { color: "#ffffff", fontSize: 12, fontWeight: "bold" },
});