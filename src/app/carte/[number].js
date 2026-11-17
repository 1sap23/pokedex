import { useState, useEffect } from "react";
import { ScrollView, View, Text, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import CarteHolo from "../../components/CarteHolo";
import { TYPE_COLORS } from "../../components/TypeBadge";
import { chargerCarte } from "../../data/api";

// cartes : une carte holo en grand, sur un fond de scène sombre
export default function PageCarte() {
  const { number } = useLocalSearchParams();
  const [carte, setCarte] = useState(null);
  const [shiny, setShiny] = useState(false);

  async function charger() {
    setCarte(await chargerCarte(number));
  }

  useEffect(() => {
    charger();
  }, []);

  if (carte === null) {
    return (
      <View style={styles.chargement}>
        <ActivityIndicator size="large" color="#fde68a" />
      </View>
    );
  }

  const color = TYPE_COLORS[carte.types[0]] || "#9ca3af";

  return (
    // la carte est toujours mise en valeur sur un fond sombre, comme dans une vitrine
    <LinearGradient colors={["#111827", color + "55", "#111827"]} style={styles.page}>
      <Stack.Screen options={{ title: "Carte", headerStyle: { backgroundColor: "#111827" } }} />
      <ScrollView contentContainerStyle={styles.contenu}>
        <CarteHolo
          pokemon={carte.pokemon}
          nom={carte.nom}
          categorie={carte.categorie}
          description={carte.description}
          types={carte.types}
          color={color}
          shiny={shiny}
        />
        <Text style={styles.astuce}>Fais glisser la carte ou penche ton téléphone ✦</Text>

        <View style={styles.boutons}>
          <Pressable style={styles.bouton} onPress={() => setShiny(!shiny)}>
            <Ionicons name="sparkles" size={16} color={shiny ? "#facc15" : "#ffffff"} />
            <Text style={styles.boutonTexte}>{shiny ? "Normal" : "Shiny"}</Text>
          </Pressable>
          <Pressable style={styles.bouton} onPress={() => router.push(`/pokemon/${number}`)}>
            <Ionicons name="book" size={16} color="#ffffff" />
            <Text style={styles.boutonTexte}>Voir la fiche</Text>
          </Pressable>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  chargement: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#111827" },
  page: { flex: 1 },
  contenu: { paddingVertical: 24, alignItems: "center" },
  astuce: { fontSize: 12, color: "#94a3b8", marginTop: 14, marginBottom: 12 },
  boutons: { flexDirection: "row", gap: 10 },
  bouton: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 20, paddingVertical: 8, paddingHorizontal: 16 },
  boutonTexte: { color: "#ffffff", fontWeight: "bold" },
});
