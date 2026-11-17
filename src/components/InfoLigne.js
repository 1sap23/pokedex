import { useTheme } from "../context/Theme";
import { View, Text, StyleSheet } from "react-native";

export default function InfoLigne({ label, value }) {
  // thème : les couleurs du mode clair ou sombre
  const { couleurs: c } = useTheme();
  return (
    <View style={[styles.ligne, { borderBottomColor: c.bordure }]}>
      <Text style={[styles.label, { color: c.texteDoux }]}>{label}</Text>
      <Text style={[styles.value, { color: c.texte }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  ligne: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },
  label: { color: "#6b7280", fontSize: 14 },
  value: { color: "#111827", fontSize: 14, fontWeight: "600" },
});