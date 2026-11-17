import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TYPE_COLORS } from "./TypeBadge";

// carte holo : chaque type a un petit symbole, comme l'énergie sur les cartes
export const ICONES = { // exporté : la scène de la fiche s'en sert pour ses particules
  Normal: "ellipse",
  Feu: "flame",
  Eau: "water",
  Plante: "leaf",
  Électrik: "flash",
  Glace: "snow",
  Combat: "hand-left",
  Poison: "skull",
  Sol: "earth",
  Vol: "cloud",
  Psy: "eye",
  Insecte: "bug",
  Roche: "diamond",
  Spectre: "eye-off",
  Dragon: "infinite",
  Ténèbres: "moon",
  Acier: "shield",
  Fée: "sparkles",
};

// un rond de la couleur du type, avec son symbole blanc au milieu
export default function TypeIcone({ type, taille = 28 }) {
  return (
    <View
      style={[
        styles.rond,
        {
          width: taille,
          height: taille,
          borderRadius: taille / 2,
          backgroundColor: TYPE_COLORS[type] || "#9ca3af",
        },
      ]}
    >
      <Ionicons name={ICONES[type] || "help"} size={taille * 0.6} color="#ffffff" />
    </View>
  );
}

const styles = StyleSheet.create({
  rond: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
});
