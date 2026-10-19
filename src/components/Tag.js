import { View, Text, StyleSheet } from "react-native";

export default function Tag({ label }) {
  return (
    <View style={styles.tag}>
      <Text style={styles.texte}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: { backgroundColor: "#e0e7ff", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16 },
  texte: { color: "#1e3a8a", fontSize: 13, fontWeight: "600" },
});