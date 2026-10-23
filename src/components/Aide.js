import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function Aide() {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.bloc}>
      <Pressable style={styles.bouton} onPress={() => setVisible(!visible)}>
        <Text style={styles.boutonTexte}>
          {visible ? "Masquer l'aide" : "Afficher l'aide"}
        </Text>
      </Pressable>

      {visible && (
        <Text style={styles.texte}>
          Golden brown, the commencement of evil forebodings. Heading south,
          the breeze from the icy climes of the north was never strangled.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { alignItems: "center", marginBottom: 20 },
  bouton: { borderWidth: 2, borderColor: "#2f5be7", borderRadius: 10, paddingVertical: 8, paddingHorizontal: 16 },
  boutonTexte: { color: "#2f5be7", fontWeight: "bold" },
  texte: { marginTop: 10, color: "#6b7280", textAlign: "center" },
});
