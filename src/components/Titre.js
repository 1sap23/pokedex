import { View, Text, StyleSheet } from "react-native";

export default function Titre({ texte, sousTitre }) {
  return (
    <View style={styles.bloc}>
      <Text style={styles.titre}>{texte}</Text>
      {sousTitre && <Text style={styles.sousTitre}>{sousTitre}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { marginBottom: 16 },
  titre: { fontSize: 30, fontWeight: "bold", color: "#111827" },
  sousTitre: { fontSize: 15, color: "#6b7280", marginTop: 2 },
});