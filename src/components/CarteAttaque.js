import { useState, useRef } from "react";
import { View, Text, Pressable, Animated, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import TypeIcone, { ICONES } from "./TypeIcone";
import { AMBIANCES } from "./SceneType";

// attaques : le symbole de chaque catégorie
const SYMBOLES = { Physique: "hand-right", Spéciale: "radio", Statut: "shield-half" };

// une petite jauge de 0 à 100 %
function Jauge({ titre, valeur, max, texte }) {
  const pourcent = valeur === null ? 100 : Math.min(valeur / max, 1) * 100;
  return (
    <View style={styles.jauge}>
      <Text style={styles.jaugeTitre}>{titre}</Text>
      <View style={styles.jaugeFond}>
        <View style={[styles.jaugeBarre, { width: `${pourcent}%` }]} />
      </View>
      <Text style={styles.jaugeValeur}>{texte}</Text>
    </View>
  );
}

// une attaque présentée comme une carte de combat, dans l'ambiance de son type.
// on la touche : elle s'ouvre avec une explosion d'énergie et sa description
export default function CarteAttaque({ attaque }) {
  const [ouverte, setOuverte] = useState(false);
  const explosion = useRef(new Animated.Value(0)).current;
  const ambiance = AMBIANCES[attaque.type] || ["#111827", "#6b7280", "#f3f4f6"];

  function toucher() {
    setOuverte(!ouverte);
    // l'explosion : un cercle d'énergie qui grandit et disparaît
    explosion.setValue(0);
    Animated.timing(explosion, { toValue: 1, duration: 700, useNativeDriver: false }).start();
  }

  const taille = explosion.interpolate({ inputRange: [0, 1], outputRange: [0.2, 3] });
  const opacite = explosion.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 0.8, 0] });

  return (
    <Pressable onPress={toucher}>
      <LinearGradient colors={ambiance} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.carte}>
        {/* l'énergie qui explose derrière le symbole quand on touche */}
        <Animated.View
          pointerEvents="none"
          style={[styles.explosion, { backgroundColor: ambiance[2], opacity: opacite, transform: [{ scale: taille }] }]}
        />
        {/* le grand symbole du type en filigrane, à droite */}
        <View style={styles.filigrane}>
          <Ionicons name={ICONES[attaque.type] || "flash"} size={90} color="rgba(255,255,255,0.12)" />
        </View>

        <View style={styles.haut}>
          <TypeIcone type={attaque.type} taille={34} />
          <View style={styles.titres}>
            <Text style={styles.nom}>{attaque.nom}</Text>
            <View style={styles.ligne}>
              <Ionicons name={SYMBOLES[attaque.categorie] || "help"} size={13} color="#fde68a" />
              <Text style={styles.categorie}>{attaque.categorie}</Text>
              {attaque.portee !== "" && <Text style={styles.portee}>· {attaque.portee}</Text>}
            </View>
          </View>
          <View style={styles.niveau}>
            <Text style={styles.niveauPetit}>NIV.</Text>
            <Text style={styles.niveauTexte}>{attaque.niveau === 0 ? "Évo" : attaque.niveau}</Text>
          </View>
        </View>

        {/* les trois chiffres de l'attaque */}
        <View style={styles.jauges}>
          <Jauge titre="Puissance" valeur={attaque.puissance || 0} max={150} texte={attaque.puissance || "—"} />
          <Jauge titre="Précision" valeur={attaque.precision} max={100} texte={attaque.precision ? attaque.precision + " %" : "∞"} />
          <Jauge titre="Charge (PP)" valeur={attaque.pp} max={40} texte={attaque.pp} />
        </View>

        {ouverte && attaque.description !== "" && (
          <Text style={styles.description}>{attaque.description}</Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  carte: { borderRadius: 18, padding: 14, marginBottom: 12, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.25)" },
  explosion: { position: "absolute", left: -10, top: -10, width: 80, height: 80, borderRadius: 40 },
  filigrane: { position: "absolute", right: -6, top: -8 },
  haut: { flexDirection: "row", alignItems: "center", gap: 10 },
  titres: { flex: 1 },
  nom: { fontSize: 19, fontWeight: "900", color: "#ffffff", textShadowColor: "rgba(0,0,0,0.5)", textShadowRadius: 4 },
  ligne: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  categorie: { fontSize: 12, fontWeight: "bold", color: "#fde68a" },
  portee: { fontSize: 11, color: "rgba(255,255,255,0.75)", flexShrink: 1 },
  niveau: { alignItems: "center", backgroundColor: "rgba(0,0,0,0.35)", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  niveauPetit: { fontSize: 9, fontWeight: "bold", color: "rgba(255,255,255,0.7)" },
  niveauTexte: { fontSize: 18, fontWeight: "900", color: "#ffffff" },
  jauges: { flexDirection: "row", gap: 10, marginTop: 12 },
  jauge: { flex: 1 },
  jaugeTitre: { fontSize: 10, fontWeight: "bold", color: "rgba(255,255,255,0.8)" },
  jaugeFond: { height: 6, borderRadius: 3, backgroundColor: "rgba(0,0,0,0.35)", marginVertical: 3 },
  jaugeBarre: { height: 6, borderRadius: 3, backgroundColor: "#ffffff" },
  jaugeValeur: { fontSize: 14, fontWeight: "900", color: "#ffffff" },
  description: { fontSize: 13, fontStyle: "italic", color: "#ffffff", marginTop: 10, lineHeight: 18 },
});
