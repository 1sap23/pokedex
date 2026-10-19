import { View, Text, StyleSheet } from "react-native";

export const TYPE_COLORS = {
  Plante: "#78C850",
  Feu: "#F08030",
  Eau: "#6890F0",
  Électrik: "#F8D030",
};

export default function TypeBadge({ type }) {
  const color = TYPE_COLORS[type] ?? "#A8A878";
  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={styles.texte}>{type}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignSelf: "flex-start", paddingVertical: 3, paddingHorizontal: 10, borderRadius: 12, marginTop: 4 },
  texte: { color: "#ffffff", fontSize: 12, fontWeight: "bold" },
});