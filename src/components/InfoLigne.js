import { View, Text, StyleSheet } from "react-native";

export default function InfoLigne({ label, value }) {
  return (
    <View style={styles.ligne}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
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