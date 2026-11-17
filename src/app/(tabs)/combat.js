import { useState } from "react";
import { ScrollView, View, Text, Pressable, StyleSheet } from "react-native";
import { TYPE_COLORS } from "../../components/TypeBadge";
import Faiblesses from "../../components/Faiblesses";
import { TYPES } from "../../data/types";

// phase 2 : on choisit un ou deux types et on voit ce qui leur fait mal
export default function Combat() {
  const [choisis, setChoisis] = useState([]); // au plus 2 types

  function choisir(type) {
    if (choisis.includes(type)) {
      // déjà choisi : on l'enlève
      setChoisis(choisis.filter((t) => t !== type));
    } else if (choisis.length < 2) {
      // encore de la place : on l'ajoute
      setChoisis([...choisis, type]);
    } else {
      // déjà 2 types : on remplace le deuxième
      setChoisis([choisis[0], type]);
    }
  }

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.contenu}>
      <Text style={styles.titre}>Calculateur de types</Text>
      <Text style={styles.texte}>Choisis un ou deux types.</Text>

      <View style={styles.grille}>
        {TYPES.map((t) => {
          const choisi = choisis.includes(t);
          return (
            <Pressable
              key={t}
              style={[
                styles.type,
                { borderColor: TYPE_COLORS[t] },
                // le type choisi est rempli de sa couleur
                choisi && { backgroundColor: TYPE_COLORS[t] },
              ]}
              onPress={() => choisir(t)}
            >
              <Text style={[styles.typeTexte, { color: choisi ? "#ffffff" : TYPE_COLORS[t] }]}>
                {t}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {choisis.length > 0 && (
        <View style={styles.bloc}>
          <Text style={styles.titreBloc}>Un Pokémon {choisis.join(" / ")}</Text>
          <Faiblesses types={choisis} />
          <Pressable onPress={() => setChoisis([])}>
            <Text style={styles.effacer}>Effacer</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#f3f4f6" },
  contenu: { padding: 20 },
  titre: { fontSize: 26, fontWeight: "bold", color: "#111827" },
  texte: { fontSize: 15, color: "#6b7280", marginBottom: 16 },
  grille: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  // 3 types par ligne environ
  type: { width: "31%", paddingVertical: 8, borderRadius: 12, borderWidth: 2, alignItems: "center", backgroundColor: "#ffffff" },
  typeTexte: { fontWeight: "bold" },
  bloc: { backgroundColor: "#ffffff", borderRadius: 16, padding: 16 },
  titreBloc: { fontSize: 18, fontWeight: "bold", color: "#111827", marginBottom: 12 },
  effacer: { color: "#2f5be7", fontWeight: "bold", textDecorationLine: "underline", textAlign: "center", marginTop: 4 },
});
