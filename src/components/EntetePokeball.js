import { View, Text, StyleSheet } from "react-native";

// un en-tête qui ressemble à une Poké Ball :
// le haut rouge, une bande noire avec un bouton blanc, le bas blanc
export default function EntetePokeball({ titre, sousTitre }) {
  return (
    <View style={styles.boule}>
      <View style={styles.haut}>
        <Text style={styles.titre}>{titre}</Text>
      </View>

      <View style={styles.bande}>
        <View style={styles.bouton} />
      </View>

      <View style={styles.bas}>
        <Text style={styles.sousTitre}>{sousTitre}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  boule: { borderRadius: 24, borderWidth: 4, borderColor: "#111827", overflow: "hidden", marginBottom: 16 },
  haut: { backgroundColor: "#e3350d", paddingTop: 24, paddingBottom: 28, alignItems: "center" },
  titre: { fontSize: 32, fontWeight: "bold", color: "#ffffff" },
  // la bande noire, le bouton blanc est centré dessus
  // zIndex : la bande passe devant le bas, sinon le bouton serait coupé
  bande: { height: 10, backgroundColor: "#111827", justifyContent: "center", alignItems: "center", zIndex: 1 },
  bouton: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#ffffff", borderWidth: 6, borderColor: "#111827" },
  bas: { backgroundColor: "#ffffff", paddingTop: 28, paddingBottom: 16, alignItems: "center" },
  sousTitre: { fontSize: 16, color: "#6b7280", fontWeight: "bold" },
});
