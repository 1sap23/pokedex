import { ScrollView, View, StyleSheet } from "react-native";
import Titre from "../components/Titre";
import PokemonCard from "../components/PokemonCard";

const POKEMONS = [
  { number: 1, name: "Bulbizarre", type: "Plante" },
  { number: 4, name: "Salamèche", type: "Feu" },
  { number: 7, name: "Carapuce", type: "Eau" },
  { number: 25, name: "Pikachu", type: "Électrik" },
  { number: 37, name: "Goupix", type: "Feu" },
  { number: 43, name: "Mystherbe", type: "Plante" },
];

// Bonus : seulement les Pokémon de type Feu
const feu = POKEMONS.filter((p) => p.type === "Feu");

export default function Index() {
  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.contenu}>
      <Titre texte="Mon Pokédex" sousTitre={`${POKEMONS.length} Pokémon`} />

      {POKEMONS.map((p) => (
        <PokemonCard key={p.number} number={p.number} name={p.name} type={p.type} />
      ))}

      <View style={styles.section}>
        <Titre texte="Type Feu" sousTitre={`${feu.length} Pokémon`} />

        {feu.map((p) => (
          <PokemonCard key={p.number} number={p.number} name={p.name} type={p.type} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#f3f4f6" },
  contenu: { padding: 20 },
  section: { marginTop: 24 },
});