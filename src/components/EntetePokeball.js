import { useTheme } from "../context/Theme";
import { View, Text, StyleSheet } from "react-native";

// un en-tête qui ressemble à une Poké Ball :
// le haut rouge, une bande noire avec un bouton blanc, le bas blanc
export default function EntetePokeball({ titre, sousTitre }) {
  // thème : les couleurs du mode clair ou sombre
  const { couleurs: c } = useTheme();
  return (
    <View style={styles.boule}>
      <View style={styles.haut}>
        <Text style={styles.titre}>{titre}</Text>
      </View>

      <View style={styles.bande}>
        <View style={styles.bouton} />
      </View>

      <View style={[styles.bas, { backgroundColor: c.surface }]}>
        <Text style={[styles.sousTitre, { color: c.texteDoux }]}>{sousTitre}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // ANCIEN (étape 1) : l'en-tête prenait trop de place sur l'accueil
  // boule: { borderRadius: 24, borderWidth: 4, borderColor: "#111827", overflow: "hidden", marginBottom: 16 },
  // haut: { backgroundColor: "#e3350d", paddingTop: 24, paddingBottom: 28, alignItems: "center" },
  // titre: { fontSize: 32, fontWeight: "bold", color: "#ffffff" },
  // bas: { backgroundColor: "#ffffff", paddingTop: 28, paddingBottom: 16, alignItems: "center" },
  // phase 1 : la même Poké Ball, en plus petit
  boule: { borderRadius: 20, borderWidth: 3, borderColor: "#111827", overflow: "hidden", marginBottom: 12 },
  haut: { backgroundColor: "#e3350d", paddingTop: 12, paddingBottom: 16, alignItems: "center" },
  titre: { fontSize: 24, fontWeight: "bold", color: "#ffffff" },
  // la bande noire, le bouton blanc est centré dessus
  // zIndex : la bande passe devant le bas, sinon le bouton serait coupé
  bande: { height: 10, backgroundColor: "#111827", justifyContent: "center", alignItems: "center", zIndex: 1 },
  bouton: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#ffffff", borderWidth: 5, borderColor: "#111827" },
  bas: { backgroundColor: "#ffffff", paddingTop: 18, paddingBottom: 8, alignItems: "center" },
  sousTitre: { fontSize: 16, color: "#6b7280", fontWeight: "bold" },
});
