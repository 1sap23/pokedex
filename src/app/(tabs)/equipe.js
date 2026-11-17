// ANCIEN (avant la phase 4) : import { ScrollView, View, Text, Image, Pressable, StyleSheet } from "react-native";
import { ScrollView, View, Text, Pressable, StyleSheet } from "react-native";
// phase 4 : l'Image d'expo-image garde les images en cache (plus rapide)
import { Image } from "expo-image";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import TypeBadge, { TYPE_COLORS } from "../../components/TypeBadge";
import { useCollection } from "../../context/Collection";
import { TYPES, efficacite } from "../../data/types";

const ARTWORK =
  "https://raw.githubusercontent.com/PokeAPI/sprites" +
  "/master/sprites/pokemon/other/official-artwork/";

// les 6 places de l'équipe : 0, 1, 2, 3, 4, 5
const PLACES = [0, 1, 2, 3, 4, 5];

// phase 3 : l'équipe de 6 Pokémon et ses points faibles
export default function Equipe() {
  const { equipe, toggleEquipe } = useCollection();

  // pour chaque type d'attaque, on compte combien de membres sont faibles
  // et combien résistent
  const analyse = TYPES.map((t) => {
    const faibles = equipe.filter((p) => efficacite(t, p.types) > 1).length;
    const resistants = equipe.filter((p) => efficacite(t, p.types) < 1).length;
    return { type: t, faibles: faibles, resistants: resistants };
  });

  // un point faible : au moins 2 membres faibles, et plus de faibles que de résistants
  const pointsFaibles = analyse
    .filter((a) => a.faibles >= 2 && a.faibles > a.resistants)
    .sort((a, b) => b.faibles - a.faibles);

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.contenu}>
      <Text style={styles.titre}>Mon équipe</Text>
      <Text style={styles.texte}>{equipe.length} / 6 Pokémon</Text>

      <View style={styles.grille}>
        {PLACES.map((i) => {
          const p = equipe[i];

          // place vide
          if (!p) {
            return (
              <View key={i} style={[styles.place, styles.placeVide]}>
                <Ionicons name="add" size={28} color="#9ca3af" />
              </View>
            );
          }

          const color = TYPE_COLORS[p.types[0]] || "#9ca3af";
          return (
            <Pressable
              key={p.number}
              style={[styles.place, { backgroundColor: color + "33", borderColor: color }]}
              onPress={() => router.push(`/pokemon/${p.number}`)}
            >
              {/* la petite croix retire le Pokémon de l'équipe */}
              <Pressable style={styles.retirer} onPress={() => toggleEquipe(p)}>
                <Ionicons name="close" size={14} color="#ffffff" />
              </Pressable>
              <Image source={{ uri: `${ARTWORK}${p.number}.png` }} style={styles.image} contentFit="contain" cachePolicy="memory-disk" />
              <Text style={styles.nom}>{p.name}</Text>
            </Pressable>
          );
        })}
      </View>

      {equipe.length === 0 && (
        <Text style={styles.vide}>
          Ouvre la fiche d'un Pokémon et appuie sur « Équipe » pour l'ajouter.
        </Text>
      )}

      {equipe.length > 0 && (
        <View style={styles.bloc}>
          <Text style={styles.titreBloc}>Points faibles de l'équipe</Text>
          {pointsFaibles.length === 0 && (
            <Text style={styles.texte}>Aucun gros point faible, bien joué !</Text>
          )}
          {pointsFaibles.map((a) => (
            <View key={a.type} style={styles.analyseLigne}>
              <TypeBadge type={a.type} />
              <Text style={styles.analyseTexte}>
                {a.faibles} faible{a.faibles > 1 ? "s" : ""} · {a.resistants} résiste
                {a.resistants > 1 ? "nt" : ""}
              </Text>
            </View>
          ))}
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
  grille: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16 },
  // 3 places par ligne environ
  place: { width: "31%", height: 120, borderRadius: 14, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  placeVide: { borderStyle: "dashed", borderColor: "#d1d5db", backgroundColor: "#ffffff" },
  retirer: { position: "absolute", top: 4, right: 4, backgroundColor: "#ef4444", borderRadius: 10, width: 20, height: 20, alignItems: "center", justifyContent: "center", zIndex: 1 },
  image: { width: 70, height: 70 },
  nom: { fontSize: 13, fontWeight: "bold", color: "#111827" },
  vide: { fontSize: 15, color: "#6b7280", textAlign: "center", marginBottom: 16 },
  bloc: { backgroundColor: "#ffffff", borderRadius: 16, padding: 16 },
  titreBloc: { fontSize: 18, fontWeight: "bold", color: "#111827", marginBottom: 12 },
  analyseLigne: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
  analyseTexte: { fontSize: 14, color: "#374151" },
});
