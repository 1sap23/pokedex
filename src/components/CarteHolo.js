import { useRef, useEffect } from "react";
import { View, Text, Animated, PanResponder, useWindowDimensions, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Accelerometer } from "expo-sensors";
import TypeIcone from "./TypeIcone";
import RadarStats from "./RadarStats";
import { TYPES, efficacite } from "../data/types";

const ARTWORK =
  "https://raw.githubusercontent.com/PokeAPI/sprites" +
  "/master/sprites/pokemon/other/official-artwork/";

// les couleurs de l'arc-en-ciel qui glisse sur la carte (l'effet holo)
const ARC_EN_CIEL = [
  "rgba(255,255,255,0)",
  "rgba(255,0,128,0.28)",
  "rgba(255,200,0,0.28)",
  "rgba(0,255,170,0.28)",
  "rgba(0,140,255,0.28)",
  "rgba(180,0,255,0.28)",
  "rgba(255,255,255,0)",
];

// garde un nombre entre -1 et 1
function borne(v) {
  return Math.max(-1, Math.min(1, v));
}

// la carte façon carte Pokémon brillante, qui s'incline au doigt ou quand on penche le téléphone
export default function CarteHolo({ pokemon, nom, categorie, description, types, color, shiny }) {
  const { width } = useWindowDimensions();
  const W = Math.min(width - 32, 360); // largeur de la carte
  const H = W * 1.45; // hauteur environ, pour les calculs de l'effet

  // tilt.x et tilt.y vont de -1 à 1 : de combien la carte est penchée
  const tilt = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const touche = useRef(false); // true pendant qu'on touche la carte
  // le Pokémon flotte doucement de haut en bas
  const flotte = useRef(new Animated.Value(0)).current;

  // 1. au doigt : on penche la carte selon le glissement
  const glisser = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        touche.current = true;
      },
      onPanResponderMove: (e, g) => {
        tilt.setValue({ x: borne(g.dx / (W / 2)), y: borne(g.dy / (H / 2)) });
      },
      onPanResponderRelease: () => revenir(),
      onPanResponderTerminate: () => revenir(),
    })
  ).current;

  // quand on lâche, la carte revient droite avec un petit rebond
  function revenir() {
    touche.current = false;
    Animated.spring(tilt, { toValue: { x: 0, y: 0 }, friction: 4, useNativeDriver: false }).start();
  }

  // 2. avec le téléphone : l'accéléromètre dit comment il est penché
  useEffect(() => {
    let abonnement = null;
    let depart = null; // la position du téléphone au début
    let lisse = { x: 0, y: 0 }; // valeur adoucie, sinon la carte tremble

    async function ecouter() {
      // try / catch : sur ordinateur le capteur peut planter, on ignore l'erreur
      try {
        const dispo = await Accelerometer.isAvailableAsync();
        if (!dispo) {
          return; // pas de capteur : seulement le doigt
        }
        Accelerometer.setUpdateInterval(50);
        abonnement = Accelerometer.addListener(bouger);
      } catch (erreur) {
        abonnement = null;
      }
    }

    // appelée à chaque nouvelle mesure du capteur
    function bouger(m) {
      if (depart === null) {
        depart = m;
        return;
      }
      // on garde 80 % de l'ancienne valeur et 20 % de la nouvelle
      lisse = {
        x: lisse.x * 0.8 + (m.x - depart.x) * 2.5 * 0.2,
        y: lisse.y * 0.8 + (m.y - depart.y) * 2.5 * 0.2,
      };
      if (!touche.current) {
        tilt.setValue({ x: borne(lisse.x), y: borne(-lisse.y) });
      }
    }
    ecouter();

    // le flottement, en boucle
    Animated.loop(
      Animated.sequence([
        Animated.timing(flotte, { toValue: 1, duration: 1600, useNativeDriver: false }),
        Animated.timing(flotte, { toValue: 0, duration: 1600, useNativeDriver: false }),
      ])
    ).start();

    // quand on quitte la fiche, on arrête d'écouter le capteur
    return () => {
      if (abonnement) {
        abonnement.remove();
      }
    };
  }, []);

  // interpolate : transforme -1..1 en angles ou en déplacements
  const rotateY = tilt.x.interpolate({ inputRange: [-1, 1], outputRange: ["-14deg", "14deg"], extrapolate: "clamp" });
  const rotateX = tilt.y.interpolate({ inputRange: [-1, 1], outputRange: ["14deg", "-14deg"], extrapolate: "clamp" });
  const holoX = tilt.x.interpolate({ inputRange: [-1, 1], outputRange: [-W * 0.9, W * 0.9], extrapolate: "clamp" });
  const holoY = tilt.y.interpolate({ inputRange: [-1, 1], outputRange: [-H * 0.3, H * 0.3], extrapolate: "clamp" });
  const refletX = tilt.x.interpolate({ inputRange: [-1, 1], outputRange: [W * 0.8, -W * 0.8], extrapolate: "clamp" });
  const monte = flotte.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });

  const pv = pokemon.stats[0].base_stat;
  let total = 0;
  for (const s of pokemon.stats) {
    total = total + s.base_stat;
  }
  // ce qui lui fait mal / ce qu'il encaisse bien (4 au maximum)
  const faiblesses = TYPES.filter((t) => efficacite(t, types) > 1).slice(0, 4);
  const resistances = TYPES.filter((t) => efficacite(t, types) < 1).slice(0, 4);
  const numero = String(pokemon.id).padStart(3, "0"); // 6 devient "006"

  return (
    <Animated.View
      {...glisser.panHandlers}
      style={[
        styles.ombre,
        { width: W, transform: [{ perspective: 800 }, { rotateX: rotateX }, { rotateY: rotateY }] },
      ]}
    >
      {/* le cadre doré */}
      <LinearGradient
        colors={["#fde68a", "#f59e0b", "#fef3c7", "#d97706", "#fde68a"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cadre}
      >
        {/* l'intérieur, dans la couleur du type */}
        <LinearGradient
          colors={[color, color, "#111827"]}
          locations={[0, 0.45, 1]}
          style={styles.interieur}
        >
          {/* en-tête : nom, PV et types */}
          <View style={styles.entete}>
            <Text style={styles.nom} numberOfLines={1}>{nom}</Text>
            <Text style={styles.pvPetit}>PV</Text>
            <Text style={styles.pv}>{pv}</Text>
            {types.map((t) => (
              <TypeIcone key={t} type={t} taille={26} />
            ))}
          </View>
          {categorie !== "" && <Text style={styles.categorie}>{categorie}</Text>}

          {/* le cadre de l'illustration */}
          <LinearGradient
            colors={["#ffffff", color + "88", "#ffffff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.illustration, { height: W * 0.58 }]}
          >
            <Animated.Image
              source={{ uri: `${ARTWORK}${shiny ? "shiny/" : ""}${pokemon.id}.png` }}
              style={{ width: W * 0.52, height: W * 0.52, transform: [{ translateY: monte }] }}
              resizeMode="contain"
            />
          </LinearGradient>

          {/* le bandeau d'infos sous l'image */}
          <View style={styles.bandeau}>
            <Text style={styles.bandeauTexte}>
              N°{numero} · {pokemon.height / 10} m · {pokemon.weight / 10} kg
            </Text>
          </View>

          {/* le milieu : radar à gauche, faiblesses à droite */}
          <View style={styles.milieu}>
            <RadarStats stats={pokemon.stats} color={color} taille={W * 0.46} />
            <View style={styles.droite}>
              <Text style={styles.petitTitre}>Faiblesse</Text>
              <View style={styles.icones}>
                {faiblesses.map((t) => (
                  <TypeIcone key={t} type={t} taille={22} />
                ))}
              </View>
              <Text style={styles.petitTitre}>Résistance</Text>
              <View style={styles.icones}>
                {resistances.length === 0 && <Text style={styles.aucune}>aucune</Text>}
                {resistances.map((t) => (
                  <TypeIcone key={t} type={t} taille={22} />
                ))}
              </View>
              <Text style={styles.petitTitre}>Puissance</Text>
              <Text style={styles.total}>{total}</Text>
            </View>
          </View>

          {/* la description, comme le petit texte en bas des cartes */}
          {description !== "" && (
            <View style={styles.descriptionCadre}>
              <Text style={styles.description} numberOfLines={3}>{description}</Text>
            </View>
          )}
          <Text style={styles.pied}>Mon Pokédex · {numero}/1025 ✦</Text>

          {/* l'effet holo : un arc-en-ciel et un reflet blanc qui glissent */}
          {/* pointerEvents none : ils ne bloquent pas le doigt */}
          <Animated.View
            pointerEvents="none"
            style={[styles.holo, { left: -W, width: W * 3, transform: [{ translateX: holoX }, { translateY: holoY }] }]}
          >
            <LinearGradient colors={ARC_EN_CIEL} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.remplir} />
          </Animated.View>
          <Animated.View
            pointerEvents="none"
            style={[styles.holo, { left: -W / 2, width: W * 2, transform: [{ translateX: refletX }] }]}
          >
            <LinearGradient
              colors={["rgba(255,255,255,0)", "rgba(255,255,255,0.35)", "rgba(255,255,255,0)"]}
              locations={[0.4, 0.5, 0.6]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0.6 }}
              style={styles.remplir}
            />
          </Animated.View>
        </LinearGradient>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  ombre: {
    alignSelf: "center",
    borderRadius: 20,
    // une ombre sous la carte
    shadowColor: "#000000",
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  cadre: { borderRadius: 20, padding: 8 },
  interieur: { borderRadius: 13, padding: 12, overflow: "hidden" },
  entete: { flexDirection: "row", alignItems: "center", gap: 4 },
  nom: { flex: 1, fontSize: 22, fontWeight: "900", color: "#ffffff", textShadowColor: "rgba(0,0,0,0.5)", textShadowRadius: 4 },
  pvPetit: { fontSize: 11, fontWeight: "bold", color: "#ffffff", marginTop: 6 },
  pv: { fontSize: 24, fontWeight: "900", color: "#ffffff", marginRight: 4 },
  categorie: { fontSize: 12, fontStyle: "italic", color: "rgba(255,255,255,0.9)", marginBottom: 6 },
  illustration: { borderRadius: 10, borderWidth: 4, borderColor: "#e5e7eb", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  bandeau: { backgroundColor: "rgba(0,0,0,0.35)", borderRadius: 6, paddingVertical: 3, marginTop: 6, alignItems: "center" },
  bandeauTexte: { fontSize: 11, fontWeight: "bold", fontStyle: "italic", color: "#fde68a" },
  milieu: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  droite: { flex: 1, paddingLeft: 6 },
  petitTitre: { fontSize: 11, fontWeight: "bold", color: "rgba(255,255,255,0.8)", marginTop: 4 },
  icones: { flexDirection: "row", gap: 3, marginTop: 2 },
  aucune: { fontSize: 12, color: "#ffffff", fontStyle: "italic" },
  total: { fontSize: 22, fontWeight: "900", color: "#fde68a" },
  descriptionCadre: { borderWidth: 1, borderColor: "rgba(253,230,138,0.7)", borderRadius: 6, padding: 6, marginTop: 6 },
  description: { fontSize: 11, fontStyle: "italic", color: "#ffffff", lineHeight: 15 },
  pied: { fontSize: 9, color: "rgba(255,255,255,0.6)", textAlign: "right", marginTop: 6 },
  holo: { position: "absolute", top: -200, bottom: -200 },
  remplir: { flex: 1 },
});
