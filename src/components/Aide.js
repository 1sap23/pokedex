import { useTheme } from "../context/Theme";
import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function Aide() {
  // thème : les couleurs du mode clair ou sombre
  const { couleurs: c } = useTheme();
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.bloc}>
      <Pressable style={styles.bouton} onPress={() => setVisible(!visible)}>
        <Text style={styles.boutonTexte}>
          {visible ? "Masquer l'aide" : "Afficher l'aide"}
        </Text>
      </Pressable>

      {visible && (
        <Text style={[styles.texte, { color: c.texteDoux }]}>
          Golden brown, the commencement of evil forebodings. Heading south,
          the breeze from the icy climes of the north was never strangled.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // ANCIEN (séance 3) : un gros bouton bleu
  // bloc: { alignItems: "center", marginBottom: 20 },
  // bouton: { borderWidth: 2, borderColor: "#2f5be7", borderRadius: 10, paddingVertical: 8, paddingHorizontal: 16 },
  // boutonTexte: { color: "#2f5be7", fontWeight: "bold" },
  // phase 1 : un simple lien, plus discret
  bloc: { alignItems: "center", marginBottom: 12 },
  bouton: { paddingVertical: 4 },
  boutonTexte: { color: "#2f5be7", fontWeight: "bold", textDecorationLine: "underline" },
  texte: { marginTop: 10, color: "#6b7280", textAlign: "center" },
});
