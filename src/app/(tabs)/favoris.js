import { FlatList, View, Text, Image, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import TypeBadge, { TYPE_COLORS } from "../../components/TypeBadge";
import { useCollection } from "../../context/Collection";

const ARTWORK =
  "https://raw.githubusercontent.com/PokeAPI/sprites" +
  "/master/sprites/pokemon/other/official-artwork/";

// phase 3 : les Pokémon mis en favori depuis leur fiche
export default function Favoris() {
  const { favoris } = useCollection();

  return (
    <FlatList
      style={styles.page}
      contentContainerStyle={styles.contenu}
      data={favoris}
      keyExtractor={(item) => String(item.number)}
      numColumns={2}
      columnWrapperStyle={styles.ligne}
      ListHeaderComponent={<Text style={styles.titre}>Mes favoris</Text>}
      // ce qui s'affiche quand la liste est vide
      ListEmptyComponent={
        <Text style={styles.vide}>
          Aucun favori pour l'instant. Ouvre une fiche et appuie sur le cœur.
        </Text>
      }
      renderItem={({ item }) => {
        const color = TYPE_COLORS[item.types[0]] || "#9ca3af";
        return (
          <Pressable
            style={[styles.carte, { backgroundColor: color + "33", borderColor: color }]}
            onPress={() => router.push(`/pokemon/${item.number}`)}
          >
            <Image source={{ uri: `${ARTWORK}${item.number}.png` }} style={styles.image} />
            <Text style={styles.numero}>#{item.number}</Text>
            <Text style={styles.nom}>{item.name}</Text>
            <View style={styles.types}>
              {item.types.map((t) => (
                <TypeBadge key={t} type={t} />
              ))}
            </View>
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#f3f4f6" },
  contenu: { padding: 20 },
  titre: { fontSize: 26, fontWeight: "bold", color: "#111827", marginBottom: 16 },
  vide: { fontSize: 15, color: "#6b7280", textAlign: "center", marginTop: 40 },
  ligne: { gap: 10 },
  carte: { flex: 1, alignItems: "center", padding: 12, marginBottom: 10, borderRadius: 14, borderWidth: 2 },
  image: { width: 80, height: 80 },
  numero: { fontSize: 12, color: "#6b7280" },
  nom: { fontSize: 16, fontWeight: "bold", color: "#111827" },
  types: { flexDirection: "row", gap: 4 },
});
