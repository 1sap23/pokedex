import { View, Text, Pressable, Alert, StyleSheet } from "react-native";
import Tag from "../components/Tag";
import Avatar from "../components/Avatar";
import InfoLigne from "../components/InfoLigne";

const INTERETS = ["STM32", "React Native", "Électronique"];

export default function Profil() {
  return (
    <View style={styles.container}>
      <View style={styles.carte}>
        <Avatar uri="https://i.pravatar.cc/200" size={110} />
        <Text style={styles.nom}>Ange Vanessa</Text>
        <Text style={styles.description}>Élève ingénieure · ISEN 3</Text>

        <View style={styles.tags}>
          {INTERETS.map((interet) => (
            <Tag key={interet} label={interet} />
          ))}
        </View>

        <InfoLigne label="Email" value="moi@ecole.fr" />
        <InfoLigne label="Ville" value="Toulon" />
        <InfoLigne label="École" value="ISEN Méditerranée" />

        <View style={styles.contour}>
          <Pressable
            style={styles.bouton}
            onPress={() => Alert.alert("Contact", "moi@ecole.fr")}
          >
            <Text style={styles.boutonTexte}>Me contacter</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f4f1ea", padding: 20 },
  carte: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  nom: { fontSize: 24, fontWeight: "bold", color: "#111827" },
  description: { fontSize: 14, color: "#6b7280", marginTop: 4, marginBottom: 14 },
  tags: { flexDirection: "row", gap: 8, marginBottom: 14 },
  contour: { borderWidth: 2, borderColor: "#2f5be7", borderStyle: "dashed", borderRadius: 14, padding: 3, marginTop: 18 },
  bouton: { backgroundColor: "#2f5be7", paddingVertical: 12, paddingHorizontal: 28, borderRadius: 10 },
  boutonTexte: { color: "#ffffff", fontWeight: "bold", fontSize: 16 },
});