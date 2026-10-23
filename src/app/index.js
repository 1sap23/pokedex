import { useState } from "react";
import { ScrollView, View, Text, Pressable, StyleSheet } from "react-native";
import Titre from "../components/Titre";
import PokemonCard from "../components/PokemonCard";
import Aide from "../components/Aide";

const POKEMONS = [
  { number: 1, name: "Bulbizarre", type: "Plante" },
  { number: 4, name: "Salamèche", type: "Feu" },
  { number: 7, name: "Carapuce", type: "Eau" },
  { number: 25, name: "Pikachu", type: "Électrik" },
  { number: 37, name: "Goupix", type: "Feu" },
  { number: 43, name: "Mystherbe", type: "Plante" },
];

export default function Index() {
  const [balls, setBalls] = useState(0);
  const [feuSeulement, setFeuSeulement] = useState(false);
  const [captured, setCaptured] = useState([]); // les numéros capturés

  // la liste a afficher, recalculee a chaque clic
  const visibles = feuSeulement
    ? POKEMONS.filter((p) => p.type === "Feu")
    : POKEMONS;

  // capturer ou relâcher un Pokémon
  function toggle(number) {
    if (captured.includes(number)) {
      setCaptured(captured.filter((n) => n !== number));
    } else {
      setCaptured([...captured, number]);
    }
  }

  function ajouter() {
    // on ne monte jamais au-dessus de 10
    if (balls < 10) {
      setBalls(balls + 1);
    }
  }

  function enlever() {
    // on ne descend jamais sous 0
    if (balls > 0) {
      setBalls(balls - 1);
    }
  }

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.contenu}>
      <Titre texte="Mon Pokédex" sousTitre={`${POKEMONS.length} Pokémon`} />
      <Text style={styles.captures}>{captured.length} Pokémon capturés</Text>

      <Aide />

      <View style={styles.sac}>
        <Text style={styles.balls}>Poké Balls : {balls}</Text>

        <View style={styles.boutons}>
          <Pressable style={styles.bouton} onPress={enlever}>
            <Text style={styles.boutonTexte}>-</Text>
          </Pressable>
          <Pressable style={styles.bouton} onPress={ajouter}>
            <Text style={styles.boutonTexte}>+</Text>
          </Pressable>
        </View>

        <Pressable style={styles.vider} onPress={() => setBalls(0)}>
          <Text style={styles.viderTexte}>Vider le sac</Text>
        </Pressable>
      </View>

      <Pressable style={styles.filtre} onPress={() => setFeuSeulement(!feuSeulement)}>
        <Text style={styles.viderTexte}>
          {feuSeulement ? "Tout afficher" : "Seulement le type Feu"}
        </Text>
      </Pressable>

      {visibles.map((p) => (
        <PokemonCard
          key={p.number}
          number={p.number}
          name={p.name}
          type={p.type}
          captured={captured.includes(p.number)}
          onToggle={() => toggle(p.number)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#f3f4f6" },
  contenu: { padding: 20 },
  captures: { fontSize: 15, fontWeight: "bold", color: "#16a34a", marginBottom: 16 },
  sac: { alignItems: "center", marginBottom: 20 },
  balls: { fontSize: 22, fontWeight: "bold", color: "#111827" },
  boutons: { flexDirection: "row", gap: 10, marginTop: 10 },
  bouton: { backgroundColor: "#2f5be7", width: 50, height: 50, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  boutonTexte: { color: "#ffffff", fontSize: 24, fontWeight: "bold" },
  vider: { marginTop: 10, borderWidth: 2, borderColor: "#2f5be7", borderRadius: 10, paddingVertical: 8, paddingHorizontal: 16 },
  viderTexte: { color: "#2f5be7", fontWeight: "bold" },
  filtre: { alignSelf: "flex-start", marginBottom: 12, borderWidth: 2, borderColor: "#2f5be7", borderRadius: 10, paddingVertical: 8, paddingHorizontal: 16 },
});