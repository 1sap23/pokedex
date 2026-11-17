import { View, Text, StyleSheet } from "react-native";
import TypeBadge from "./TypeBadge";
import { TYPES, efficacite } from "../data/types";

// les groupes affichés, du plus dangereux au plus protégé
const GROUPES = [
  { valeur: 4, titre: "Très faible (x4)", couleur: "#b91c1c" },
  { valeur: 2, titre: "Faible (x2)", couleur: "#ef4444" },
  { valeur: 0.5, titre: "Résiste (x½)", couleur: "#16a34a" },
  { valeur: 0.25, titre: "Résiste beaucoup (x¼)", couleur: "#15803d" },
  { valeur: 0, titre: "Immunisé (x0)", couleur: "#6b7280" },
];

// montre ce qui fait mal (ou pas) à un Pokémon qui a ces types
export default function Faiblesses({ types }) {
  return (
    <View>
      {GROUPES.map((g) => {
        // les types d'attaque qui donnent exactement ce multiplicateur
        const liste = TYPES.filter((t) => efficacite(t, types) === g.valeur);

        // on n'affiche pas un groupe vide
        if (liste.length === 0) {
          return null;
        }

        return (
          <View key={g.valeur} style={styles.groupe}>
            <Text style={[styles.titre, { color: g.couleur }]}>{g.titre}</Text>
            <View style={styles.badges}>
              {liste.map((t) => (
                <TypeBadge key={t} type={t} />
              ))}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  groupe: { marginBottom: 12 },
  titre: { fontSize: 15, fontWeight: "bold", marginBottom: 4 },
  badges: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
});
