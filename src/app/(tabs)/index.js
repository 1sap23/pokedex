// ANCIEN (séance 3 à 5) : import { useState } from "react";
import { useState, useEffect } from "react";
import { router } from "expo-router";
// ANCIEN (séance 3) : import { ScrollView, View, Text, Pressable, TextInput, StyleSheet } from "react-native";
// ANCIEN (séance 4 et 5) : import { FlatList, View, Text, Pressable, TextInput, StyleSheet } from "react-native";
import { FlatList, ActivityIndicator, View, Text, Pressable, TextInput, StyleSheet } from "react-native";
import Titre from "../../components/Titre";
import PokemonCard from "../../components/PokemonCard";
import Aide from "../../components/Aide";
// ANCIEN (séance 4 et 5) : les 100 Pokémon écrits à la main, remplacés par la PokéAPI
// import POKEMONS from "../../data/pokemons";

// séance 6 : l'adresse de la PokéAPI pour les 151 premiers Pokémon
const API = "https://pokeapi.co/api/v2/pokemon?limit=151";

// ANCIEN (séance 2 et 3) : remplacé par src/data/pokemons.js
// const POKEMONS = [
//   { number: 1, name: "Bulbizarre", type: "Plante" },
//   { number: 4, name: "Salamèche", type: "Feu" },
//   { number: 7, name: "Carapuce", type: "Eau" },
//   { number: 25, name: "Pikachu", type: "Électrik" },
//   { number: 37, name: "Goupix", type: "Feu" },
//   { number: 43, name: "Mystherbe", type: "Plante" },
// ];

export default function Index() {
  // null au départ : la liste n'est pas encore arrivée
  const [pokemons, setPokemons] = useState(null);
  const [balls, setBalls] = useState(0);
  // ANCIEN (séance 3) : le filtre Feu, remplacé par « Mes captures »
  // const [feuSeulement, setFeuSeulement] = useState(false);
  const [capturesSeulement, setCapturesSeulement] = useState(false);
  const [captured, setCaptured] = useState([]); // les numéros capturés
  const [search, setSearch] = useState("");

  // séance 6 : on va chercher la liste sur Internet
  async function charger() {
    const reponse = await fetch(API);
    const data = await reponse.json();
    // const liste = data.results.map((p, i) => ({ number: i + 1, name: p.name }));
    // bonus : la première lettre du nom en majuscule
    const liste = data.results.map((p, i) => ({
      number: i + 1,
      name: p.name[0].toUpperCase() + p.name.slice(1),
    }));
    setPokemons(liste);
  }

  // [] : on charge une seule fois, quand l'écran s'ouvre
  useEffect(() => {
    charger();
  }, []);

  // tant que la liste n'est pas arrivée, on affiche le rond qui tourne
  if (pokemons === null) {
    return (
      <View style={styles.chargement}>
        <ActivityIndicator size="large" color="#2f5be7" />
      </View>
    );
  }

  // la liste a afficher, recalculee a chaque clic
  // const parType = feuSeulement
  //   ? POKEMONS.filter((p) => p.type === "Feu")
  //   : POKEMONS;
  // const parType = capturesSeulement
  //   ? POKEMONS.filter((p) => captured.includes(p.number))
  //   : POKEMONS;
  // séance 6 : POKEMONS devient pokemons (la liste de l'API)
  const parType = capturesSeulement
    ? pokemons.filter((p) => captured.includes(p.number))
    : pokemons;

  // puis on garde seulement les noms qui contiennent la recherche
  const visibles = parType.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

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

  // ANCIEN (séance 3) : ScrollView + .map(), remplacé par la FlatList en dessous
  // return (
  //   <ScrollView style={styles.page} contentContainerStyle={styles.contenu}>
  //     <Titre texte="Mon Pokédex" sousTitre={`${POKEMONS.length} Pokémon`} />
  //     <Text style={styles.captures}>{captured.length} Pokémon capturés</Text>
  //
  //     <Aide />
  //
  //     <View style={styles.sac}>
  //       <Text style={styles.balls}>Poké Balls : {balls}</Text>
  //
  //       <View style={styles.boutons}>
  //         <Pressable style={styles.bouton} onPress={enlever}>
  //           <Text style={styles.boutonTexte}>-</Text>
  //         </Pressable>
  //         <Pressable style={styles.bouton} onPress={ajouter}>
  //           <Text style={styles.boutonTexte}>+</Text>
  //         </Pressable>
  //       </View>
  //
  //       <Pressable style={styles.vider} onPress={() => setBalls(0)}>
  //         <Text style={styles.viderTexte}>Vider le sac</Text>
  //       </Pressable>
  //     </View>
  //
  //     <TextInput
  //       style={styles.recherche}
  //       placeholder="Rechercher un Pokémon"
  //       value={search}
  //       onChangeText={setSearch}
  //     />
  //
  //     <Pressable style={styles.filtre} onPress={() => setFeuSeulement(!feuSeulement)}>
  //       <Text style={styles.viderTexte}>
  //         {feuSeulement ? "Tout afficher" : "Seulement le type Feu"}
  //       </Text>
  //     </Pressable>
  //
  //     {visibles.length === 0 && <Text>Aucun Pokémon trouvé</Text>}
  //
  //     {visibles.map((p) => (
  //       <PokemonCard
  //         key={p.number}
  //         number={p.number}
  //         name={p.name}
  //         type={p.type}
  //         captured={captured.includes(p.number)}
  //         onToggle={() => toggle(p.number)}
  //       />
  //     ))}
  //   </ScrollView>
  // );

  return (
    <FlatList
      style={styles.page}
      contentContainerStyle={styles.contenu}
      data={visibles}
      extraData={captured} // redessiner les cartes quand captured change
      keyExtractor={(item) => String(item.number)}
      numColumns={2}
      columnWrapperStyle={styles.ligne}
      ListHeaderComponent={
        <View>
          {/* <Titre texte="Mon Pokédex" sousTitre={`${POKEMONS.length} Pokémon`} /> */}
          <Titre texte="Mon Pokédex" sousTitre={`${pokemons.length} Pokémon`} />
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

          <TextInput
            style={styles.recherche}
            placeholder="Rechercher un Pokémon"
            value={search}
            onChangeText={setSearch}
          />

          {/* ANCIEN (séance 3) : le bouton du filtre Feu
          <Pressable style={styles.filtre} onPress={() => setFeuSeulement(!feuSeulement)}>
            <Text style={styles.viderTexte}>
              {feuSeulement ? "Tout afficher" : "Seulement le type Feu"}
            </Text>
          </Pressable>
          */}
          <Pressable style={styles.filtre} onPress={() => setCapturesSeulement(!capturesSeulement)}>
            <Text style={styles.viderTexte}>
              {capturesSeulement ? "Tout afficher" : "Mes captures"}
            </Text>
          </Pressable>

          {visibles.length === 0 && <Text>Aucun Pokémon trouvé</Text>}
        </View>
      }
      renderItem={({ item }) => (
        <Pressable
          style={styles.carte}
          onPress={() => router.push(`/pokemon/${item.number}`)}
        >
          <PokemonCard
            number={item.number}
            name={item.name}
            type={item.type}
            captured={captured.includes(item.number)}
            onToggle={() => toggle(item.number)}
          />
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#f3f4f6" },
  chargement: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f3f4f6" },
  contenu: { padding: 20 },
  ligne: { gap: 10 }, // espace entre les 2 colonnes
  carte: { flex: 1 }, // le Pressable prend la moitié de la ligne, comme la carte
  captures: { fontSize: 15, fontWeight: "bold", color: "#16a34a", marginBottom: 16 },
  sac: { alignItems: "center", marginBottom: 20 },
  balls: { fontSize: 22, fontWeight: "bold", color: "#111827" },
  boutons: { flexDirection: "row", gap: 10, marginTop: 10 },
  bouton: { backgroundColor: "#2f5be7", width: 50, height: 50, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  boutonTexte: { color: "#ffffff", fontSize: 24, fontWeight: "bold" },
  vider: { marginTop: 10, borderWidth: 2, borderColor: "#2f5be7", borderRadius: 10, paddingVertical: 8, paddingHorizontal: 16 },
  viderTexte: { color: "#2f5be7", fontWeight: "bold" },
  recherche: { borderWidth: 1, borderColor: "#9ca3af", borderRadius: 10, padding: 10, marginBottom: 12, backgroundColor: "#ffffff" },
  filtre: { alignSelf: "flex-start", marginBottom: 12, borderWidth: 2, borderColor: "#2f5be7", borderRadius: 10, paddingVertical: 8, paddingHorizontal: 16 },
});