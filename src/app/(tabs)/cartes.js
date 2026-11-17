import { useState, useEffect } from "react";
import { FlatList, ScrollView, View, Text, Pressable, TextInput, ActivityIndicator, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TYPE_COLORS } from "../../components/TypeBadge";
import TypeIcone from "../../components/TypeIcone";
import REGIONS from "../../data/regions";
import { chargerRegion } from "../../data/api";
import { useTheme } from "../../context/Theme";

const ARTWORK =
  "https://raw.githubusercontent.com/PokeAPI/sprites" +
  "/master/sprites/pokemon/other/official-artwork/";

// cartes : la même liste que le Pokédex, mais en petites cartes holo
export default function Cartes() {
  const { couleurs: c } = useTheme();
  const [region, setRegion] = useState(REGIONS[0]);
  const [pokemons, setPokemons] = useState(null);
  const [search, setSearch] = useState("");

  async function charger() {
    const liste = await chargerRegion(region);
    setPokemons(liste);
  }

  useEffect(() => {
    setPokemons(null);
    charger();
  }, [region]);

  const visibles =
    pokemons === null
      ? []
      : pokemons.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <FlatList
      style={[styles.page, { backgroundColor: c.fond }]}
      contentContainerStyle={styles.contenu}
      data={visibles}
      keyExtractor={(item) => String(item.number)}
      numColumns={3}
      columnWrapperStyle={styles.ligne}
      ListHeaderComponent={
        <View>
          <Text style={[styles.titre, { color: c.texte }]}>Mes cartes</Text>
          <Text style={[styles.sousTitre, { color: c.texteDoux }]}>
            Touche une carte pour la voir en grand
          </Text>

          {/* les régions, comme dans le Pokédex */}
          <ScrollView horizontal style={styles.regions}>
            {REGIONS.map((r) => (
              <Pressable
                key={r.nom}
                style={[styles.region, r.nom === region.nom && styles.regionChoisie]}
                onPress={() => setRegion(r)}
              >
                <Text style={[styles.regionTexte, r.nom === region.nom && styles.regionTexteChoisi]}>
                  {r.nom}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <View style={[styles.recherche, { backgroundColor: c.surface }]}>
            <Ionicons name="search" size={18} color={c.texteDoux} />
            <TextInput
              style={[styles.rechercheChamp, { color: c.texte }]}
              placeholder="Rechercher une carte"
              placeholderTextColor={c.texteDoux}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {pokemons === null && <ActivityIndicator size="large" color="#e3350d" style={styles.chargement} />}
        </View>
      }
      renderItem={({ item }) => {
        const color = TYPE_COLORS[item.types[0]] || "#9ca3af";
        return (
          <Pressable style={styles.case} onPress={() => router.push(`/carte/${item.number}`)}>
            {/* le petit cadre doré */}
            <LinearGradient
              colors={["#fde68a", "#f59e0b", "#fef3c7", "#d97706"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cadre}
            >
              {/* l'intérieur dans la couleur du type */}
              <LinearGradient colors={[color, "#111827"]} style={styles.interieur}>
                <View style={styles.haut}>
                  <Text style={styles.nom} numberOfLines={1}>{item.name}</Text>
                  <TypeIcone type={item.types[0]} taille={16} />
                </View>
                <View style={styles.fenetre}>
                  <Image
                    source={{ uri: `${ARTWORK}${item.number}.png` }}
                    style={styles.image}
                    contentFit="contain"
                    cachePolicy="memory-disk"
                  />
                </View>
                <Text style={styles.numero}>N°{String(item.number).padStart(3, "0")}</Text>
              </LinearGradient>
            </LinearGradient>
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  contenu: { padding: 16 },
  titre: { fontSize: 26, fontWeight: "900" },
  sousTitre: { fontSize: 14, marginBottom: 12 },
  regions: { marginBottom: 12 },
  region: { borderWidth: 2, borderColor: "#e3350d", borderRadius: 20, paddingVertical: 4, paddingHorizontal: 12, marginRight: 8 },
  regionChoisie: { backgroundColor: "#e3350d" },
  regionTexte: { color: "#e3350d", fontWeight: "bold" },
  regionTexteChoisi: { color: "#ffffff" },
  recherche: { flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 12, paddingHorizontal: 12, marginBottom: 14 },
  rechercheChamp: { flex: 1, paddingVertical: 10 },
  chargement: { marginTop: 40 },
  ligne: { gap: 10 },
  // 3 cartes par ligne : chaque case prend un tiers
  case: { flex: 1 / 3, marginBottom: 10 },
  cadre: { borderRadius: 10, padding: 3 },
  interieur: { borderRadius: 7, padding: 5, aspectRatio: 0.72 },
  haut: { flexDirection: "row", alignItems: "center", gap: 2 },
  nom: { flex: 1, fontSize: 10, fontWeight: "900", color: "#ffffff" },
  fenetre: { flex: 1, backgroundColor: "rgba(255,255,255,0.85)", borderRadius: 4, borderWidth: 2, borderColor: "#e5e7eb", marginTop: 3, alignItems: "center", justifyContent: "center" },
  image: { width: "90%", height: "90%" },
  numero: { fontSize: 8, fontWeight: "bold", fontStyle: "italic", color: "#fde68a", textAlign: "right", marginTop: 3 },
});
