import { useRef, useEffect } from "react";
import { View, Text, Animated, useWindowDimensions, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Polygon } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import TypeIcone, { ICONES } from "./TypeIcone";

// scène : l'ambiance de chaque type (du plus sombre au plus clair)
const AMBIANCES = {
  Feu: ["#3b0a02", "#c2410c", "#fbbf24"],
  Eau: ["#020617", "#1e3a8a", "#22d3ee"],
  Plante: ["#022c16", "#15803d", "#bef264"],
  Électrik: ["#1c1917", "#a16207", "#fde047"],
  Psy: ["#2e1065", "#a21caf", "#f9a8d4"],
  Glace: ["#082f49", "#0284c7", "#e0f2fe"],
  Dragon: ["#0f0a2e", "#4338ca", "#f97316"],
  Spectre: ["#0f0a1f", "#5b21b6", "#c4b5fd"],
  Ténèbres: ["#030303", "#3f3f46", "#ef4444"],
  Fée: ["#3b0a2a", "#db2777", "#fbcfe8"],
  Combat: ["#290404", "#b91c1c", "#fdba74"],
  Poison: ["#1e0533", "#7e22ce", "#a3e635"],
  Sol: ["#1c1003", "#a16207", "#fde68a"],
  Roche: ["#1c1917", "#78716c", "#d6d3d1"],
  Acier: ["#0f172a", "#64748b", "#e2e8f0"],
  Vol: ["#0c1e3e", "#3b82f6", "#e0f2fe"],
  Insecte: ["#14200a", "#4d7c0f", "#d9f99d"],
  Normal: ["#1c1917", "#78716c", "#f5f5f4"],
};

// 14 particules, chacune avec sa place et son départ (en % et en ms)
const PARTICULES = [
  [8, 0], [22, 900], [35, 300], [48, 1500], [62, 600], [76, 1200], [90, 200],
  [14, 2000], [28, 2600], [42, 1800], [56, 2300], [70, 2900], [84, 1600], [96, 2500],
];

// une particule qui monte en boucle et s'efface (braise, bulle, étincelle...)
function Particule({ x, retard, hauteur, icone, couleur }) {
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(retard),
        Animated.timing(t, { toValue: 1, duration: 3200, useNativeDriver: false }),
        Animated.timing(t, { toValue: 0, duration: 0, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  const monte = t.interpolate({ inputRange: [0, 1], outputRange: [hauteur, hauteur * 0.15] });
  const opacite = t.interpolate({ inputRange: [0, 0.2, 0.8, 1], outputRange: [0, 0.9, 0.6, 0] });
  const tourne = t.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "180deg"] });

  return (
    <Animated.View
      pointerEvents="none"
      style={{ position: "absolute", left: `${x}%`, opacity: opacite, transform: [{ translateY: monte }, { rotate: tourne }] }}
    >
      <Ionicons name={icone} size={12 + (x % 4) * 4} color={couleur} />
    </Animated.View>
  );
}

// la grande image de la fiche : le Pokémon qui jaillit d'une scène de son type
export default function SceneType({ uri, nom, numero, categorie, types, fondPage }) {
  const { width } = useWindowDimensions();
  const H = 460; // hauteur de la scène
  const type = types[0];
  const ambiance = AMBIANCES[type] || ["#111827", "#6b7280", "#f3f4f6"];

  // les rayons tournent doucement, le Pokémon respire
  const rotation = useRef(new Animated.Value(0)).current;
  const souffle = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(Animated.timing(rotation, { toValue: 1, duration: 40000, useNativeDriver: false })).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(souffle, { toValue: 1, duration: 1800, useNativeDriver: false }),
        Animated.timing(souffle, { toValue: 0, duration: 1800, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  const tourne = rotation.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });
  const monte = souffle.interpolate({ inputRange: [0, 1], outputRange: [0, -12] });
  const grossit = souffle.interpolate({ inputRange: [0, 1], outputRange: [1, 1.04] });

  // les rayons de vitesse : 18 triangles fins qui partent du centre
  const R = width * 1.2;
  const rayons = [];
  for (let i = 0; i < 18; i++) {
    const a1 = (i * 20 * Math.PI) / 180;
    const a2 = ((i * 20 + 7) * Math.PI) / 180;
    rayons.push(`${R},${R} ${R + R * Math.cos(a1)},${R + R * Math.sin(a1)} ${R + R * Math.cos(a2)},${R + R * Math.sin(a2)}`);
  }

  return (
    <View style={[styles.scene, { height: H }]}>
      {/* 1. le fond en dégradé de l'ambiance du type */}
      <LinearGradient colors={ambiance} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }} style={StyleSheet.absoluteFill} />

      {/* 2. les rayons qui tournent derrière le Pokémon */}
      <Animated.View
        pointerEvents="none"
        style={[styles.rayons, { width: R * 2, height: R * 2, left: width / 2 - R, top: H * 0.45 - R, transform: [{ rotate: tourne }] }]}
      >
        <Svg width={R * 2} height={R * 2}>
          {rayons.map((points, i) => (
            <Polygon key={i} points={points} fill="#ffffff" fillOpacity={0.09} />
          ))}
        </Svg>
      </Animated.View>

      {/* 3. le grand numéro en filigrane, comme dans le livre */}
      <Text style={styles.filigrane}>{numero}</Text>

      {/* 4. le halo lumineux derrière le Pokémon */}
      <View style={[styles.halo, { backgroundColor: ambiance[2], left: width / 2 - 130, top: H * 0.45 - 130 }]} />

      {/* 5. les particules du type (flammes, bulles, éclairs...) */}
      {PARTICULES.map(([x, retard]) => (
        <Particule key={x} x={x} retard={retard} hauteur={H} icone={ICONES[type] || "sparkles"} couleur={ambiance[2]} />
      ))}

      {/* 6. le Pokémon, avec une lueur autour (l'ombre claire) */}
      <Animated.Image
        source={{ uri: uri }}
        resizeMode="contain"
        style={[styles.pokemon, { width: width * 0.85, height: H * 0.7, transform: [{ translateY: monte }, { scale: grossit }], shadowColor: ambiance[2] }]}
      />

      {/* 7. le bas se fond dans la page, et le nom par-dessus */}
      <LinearGradient colors={["transparent", fondPage]} style={styles.fondu} />
      <View style={styles.texte}>
        <Text style={styles.nom}>{nom}</Text>
        {categorie !== "" && <Text style={styles.categorie}>{categorie}</Text>}
        <View style={styles.types}>
          {types.map((t) => (
            <View key={t} style={styles.type}>
              <TypeIcone type={t} taille={22} />
              <Text style={styles.typeTexte}>{t}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scene: { width: "100%", overflow: "hidden", alignItems: "center" },
  rayons: { position: "absolute" },
  filigrane: { position: "absolute", top: 6, right: 14, fontSize: 92, fontWeight: "900", color: "rgba(255,255,255,0.13)" },
  halo: { position: "absolute", width: 260, height: 260, borderRadius: 130, opacity: 0.35 },
  // la lueur : une ombre claire tout autour de l'image (sur iPhone)
  pokemon: { marginTop: 10, shadowOpacity: 0.9, shadowRadius: 24, shadowOffset: { width: 0, height: 0 } },
  fondu: { position: "absolute", left: 0, right: 0, bottom: 0, height: 150 },
  texte: { position: "absolute", left: 20, right: 20, bottom: 14 },
  nom: { fontSize: 38, fontWeight: "900", color: "#ffffff", textShadowColor: "rgba(0,0,0,0.6)", textShadowRadius: 8 },
  categorie: { fontSize: 15, fontStyle: "italic", fontWeight: "600", color: "rgba(255,255,255,0.9)", textShadowColor: "rgba(0,0,0,0.6)", textShadowRadius: 6 },
  types: { flexDirection: "row", gap: 8, marginTop: 8 },
  type: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "rgba(0,0,0,0.35)", borderRadius: 20, paddingRight: 12 },
  typeTexte: { color: "#ffffff", fontWeight: "bold" },
});
