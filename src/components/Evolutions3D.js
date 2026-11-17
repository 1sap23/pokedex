import { useState, useRef, useEffect } from "react";
import { View, Text, Pressable, Animated, ActivityIndicator, useWindowDimensions, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import RadarStats from "./RadarStats";
import TypeIcone from "./TypeIcone";
import { TYPE_COLORS } from "./TypeBadge";
import { TYPES_FR } from "../data/types";

const ARTWORK =
  "https://raw.githubusercontent.com/PokeAPI/sprites" +
  "/master/sprites/pokemon/other/official-artwork/";

const LARGEUR = 170; // la place d'un Pokémon dans le carrousel

// évolutions 3D : un carrousel où les Pokémon tournent comme sur un manège.
// celui du milieu est grand et de face, ceux des côtés sont petits et tournés.
export default function Evolutions3D({ evolutions, actuel }) {
  const { width } = useWindowDimensions();
  const marge = (width - 40 - LARGEUR) / 2; // pour que le premier soit centré

  // au départ, on centre le Pokémon de la fiche
  const depart = Math.max(0, evolutions.findIndex((e) => e.number === actuel));
  const [choisi, setChoisi] = useState(depart);
  const [details, setDetails] = useState(null); // les stats du Pokémon choisi
  const defile = useRef(new Animated.Value(depart * LARGEUR)).current;
  const liste = useRef(null);

  // à chaque nouveau choix, on va chercher ses statistiques
  async function chargerDetails(index) {
    setDetails(null);
    const reponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${evolutions[index].number}`);
    const data = await reponse.json();
    setDetails(data);
  }

  useEffect(() => {
    chargerDetails(choisi);
  }, [choisi]);

  // au tout début, on fait tourner le carrousel jusqu'au Pokémon de la fiche
  // (petit délai : la liste doit d'abord être affichée)
  useEffect(() => {
    const minuteur = setTimeout(() => {
      if (liste.current) {
        liste.current.scrollTo({ x: depart * LARGEUR, animated: false });
      }
    }, 50);
    return () => clearTimeout(minuteur);
  }, []);

  // on a fini de faire glisser : le Pokémon le plus proche du centre est choisi
  function finDuGlisser(e) {
    const index = Math.round(e.nativeEvent.contentOffset.x / LARGEUR);
    const borne = Math.max(0, Math.min(evolutions.length - 1, index));
    if (borne !== choisi) {
      setChoisi(borne);
    }
  }

  // toucher un Pokémon : le carrousel tourne jusqu'à lui
  function toucher(index) {
    liste.current.scrollTo({ x: index * LARGEUR, animated: true });
    setChoisi(index);
  }

  const evo = evolutions[choisi];
  const types = details ? details.types.map((t) => TYPES_FR[t.type.name]) : [];
  const color = TYPE_COLORS[types[0]] || "#6366f1";
  let total = 0;
  if (details) {
    for (const s of details.stats) {
      total = total + s.base_stat;
    }
  }

  return (
    <LinearGradient colors={["#0f172a", color + "aa", "#0f172a"]} style={styles.cadre}>
      <Text style={styles.titre}>Évolutions et formes</Text>
      <Text style={styles.aide}>Fais tourner, puis touche un Pokémon</Text>

      <Animated.ScrollView
        ref={liste}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={LARGEUR} // on s'arrête toujours pile sur un Pokémon
        decelerationRate="fast"
        contentOffset={{ x: depart * LARGEUR, y: 0 }}
        // paddingBottom : le Pokémon du centre est agrandi (x1.15),
        // sans cette marge le bas (niveau, forme) était coupé
        contentContainerStyle={{ paddingHorizontal: marge, paddingTop: 10, paddingBottom: 34 }}
        scrollEventThrottle={16}
        // Animated.event : la position du défilement va directement dans "defile"
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: defile } } }], { useNativeDriver: false })}
        onMomentumScrollEnd={finDuGlisser}
        onScrollEndDrag={finDuGlisser}
      >
        {evolutions.map((e, i) => {
          // la 3D : selon la distance au centre, on tourne, on rétrécit et on pâlit
          const autour = [(i - 1) * LARGEUR, i * LARGEUR, (i + 1) * LARGEUR];
          const tourne = defile.interpolate({ inputRange: autour, outputRange: ["50deg", "0deg", "-50deg"], extrapolate: "clamp" });
          const taille = defile.interpolate({ inputRange: autour, outputRange: [0.7, 1.15, 0.7], extrapolate: "clamp" });
          const clarte = defile.interpolate({ inputRange: autour, outputRange: [0.45, 1, 0.45], extrapolate: "clamp" });
          const monte = defile.interpolate({ inputRange: autour, outputRange: [14, -6, 14], extrapolate: "clamp" });

          return (
            <Pressable key={e.number} onPress={() => toucher(i)}>
              <Animated.View
                style={[
                  styles.place,
                  { opacity: clarte, transform: [{ perspective: 600 }, { translateY: monte }, { rotateY: tourne }, { scale: taille }] },
                ]}
              >
                {/* le socle lumineux sous le Pokémon */}
                <View style={[styles.socle, i === choisi && styles.socleChoisi]} />
                <Animated.Image source={{ uri: `${ARTWORK}${e.number}.png` }} style={styles.image} resizeMode="contain" />
                <Text style={styles.nom} numberOfLines={1}>{e.name}</Text>
                {e.condition !== "" && <Text style={styles.condition}>{e.condition}</Text>}
              </Animated.View>
            </Pressable>
          );
        })}
      </Animated.ScrollView>

      {/* les statistiques du Pokémon choisi */}
      <View style={styles.panneau}>
        {details === null && <ActivityIndicator color="#ffffff" />}
        {details !== null && (
          <View style={styles.panneauLigne}>
            <RadarStats stats={details.stats} color={color} taille={150} />
            <View style={styles.panneauDroite}>
              <Text style={styles.panneauNom}>{evo.name}</Text>
              <View style={styles.types}>
                {types.map((t) => (
                  <TypeIcone key={t} type={t} taille={24} />
                ))}
              </View>
              <Text style={styles.petit}>Puissance</Text>
              <Text style={styles.total}>{total}</Text>
              <Text style={styles.petit}>
                {details.height / 10} m · {details.weight / 10} kg
              </Text>
              {evo.number !== actuel && (
                <Pressable style={styles.bouton} onPress={() => router.push(`/pokemon/${evo.number}`)}>
                  <Text style={styles.boutonTexte}>Ouvrir la fiche</Text>
                </Pressable>
              )}
            </View>
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  cadre: { borderRadius: 20, paddingVertical: 16, marginBottom: 16, overflow: "hidden" },
  titre: { fontSize: 18, fontWeight: "900", color: "#ffffff", marginLeft: 16 },
  aide: { fontSize: 12, color: "#cbd5e1", marginLeft: 16, marginBottom: 8 },
  place: { width: LARGEUR, height: 210, alignItems: "center", justifyContent: "flex-end" },
  socle: { position: "absolute", bottom: 36, width: 120, height: 26, borderRadius: 60, backgroundColor: "rgba(255,255,255,0.15)", borderWidth: 1, borderColor: "rgba(255,255,255,0.35)" },
  socleChoisi: { backgroundColor: "rgba(253,230,138,0.35)", borderColor: "#fde68a" },
  image: { width: 130, height: 130, marginBottom: 6 },
  nom: { fontSize: 14, fontWeight: "900", color: "#ffffff" },
  condition: { fontSize: 11, color: "#fde68a", fontWeight: "bold" },
  panneau: { backgroundColor: "rgba(0,0,0,0.3)", marginHorizontal: 12, marginTop: 0, borderRadius: 16, padding: 12, minHeight: 120, justifyContent: "center" },
  panneauLigne: { flexDirection: "row", alignItems: "center" },
  panneauDroite: { flex: 1, paddingLeft: 8 },
  panneauNom: { fontSize: 20, fontWeight: "900", color: "#ffffff" },
  types: { flexDirection: "row", gap: 4, marginVertical: 4 },
  petit: { fontSize: 11, color: "#cbd5e1", fontWeight: "bold" },
  total: { fontSize: 24, fontWeight: "900", color: "#fde68a" },
  bouton: { backgroundColor: "#e3350d", borderRadius: 14, paddingVertical: 6, paddingHorizontal: 12, alignSelf: "flex-start", marginTop: 6 },
  boutonTexte: { color: "#ffffff", fontWeight: "bold", fontSize: 12 },
});
