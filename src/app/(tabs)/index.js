import { useTheme } from "../../context/Theme";
// ANCIEN (séance 3 à 5) : import { useState } from "react";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
// ANCIEN (séance 3) : import { ScrollView, View, Text, Pressable, TextInput, StyleSheet } from "react-native";
// ANCIEN (séance 4 et 5) : import { FlatList, View, Text, Pressable, TextInput, StyleSheet } from "react-native";
// ANCIEN (séance 6) : import { FlatList, ActivityIndicator, View, Text, Pressable, TextInput, StyleSheet } from "react-native";
import { FlatList, ScrollView, ActivityIndicator, View, Text, Pressable, TextInput, StyleSheet } from "react-native";
// ANCIEN (séance 2 à 6) : import Titre from "../../components/Titre";
import EntetePokeball from "../../components/EntetePokeball";
import PokemonCard from "../../components/PokemonCard";
import Aide from "../../components/Aide";
import REGIONS from "../../data/regions";
import { useCollection } from "../../context/Collection";
import { TYPES_FR } from "../../data/types";
// ANCIEN (séance 4 et 5) : les 100 Pokémon écrits à la main, remplacés par la PokéAPI
// import POKEMONS from "../../data/pokemons";

// séance 6 : l'adresse de la PokéAPI pour les 151 premiers Pokémon
// const API = "https://pokeapi.co/api/v2/pokemon?limit=151";
// projet : l'adresse change selon la région, on la construit dans charger()
const API = "https://pokeapi.co/api/v2/pokemon";

// phase 4 : la PokéAPI a aussi une adresse GraphQL.
// on lui écrit une question, et elle renvoie en UNE seule réponse
// le nom français (language_id 5 = français) et les types de toute la région
const GRAPHQL = "https://graphql.pokeapi.co/v1beta2";
function question(debut, fin) {
  return `{
    pokemonspecies(where: { id: { _gte: ${debut}, _lte: ${fin} } }, order_by: { id: asc }) {
      id
      pokemonspeciesnames(where: { language_id: { _eq: 5 } }) { name }
      pokemons(limit: 1) { pokemontypes(order_by: { slot: asc }) { type { name } } }
    }
  }`;
}

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
  // thème : les couleurs du mode clair ou sombre
  const { couleurs: c } = useTheme();
  // null au départ : la liste n'est pas encore arrivée
  const [pokemons, setPokemons] = useState(null);
  const [balls, setBalls] = useState(0);
  // ANCIEN (séance 3) : le filtre Feu, remplacé par « Mes captures »
  // const [feuSeulement, setFeuSeulement] = useState(false);
  const [capturesSeulement, setCapturesSeulement] = useState(false);
  // ANCIEN (séance 3 à phase 2) : les captures n'existaient que sur cet écran
  // const [captured, setCaptured] = useState([]); // les numéros capturés
  // phase 3 : elles viennent du Context, partagées et sauvegardées
  const { captured, toggleCapture } = useCollection();
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState(REGIONS[0]); // Kanto au départ
  // phase 1 : le tri, "numero" ou "nom"
  const [tri, setTri] = useState("numero");

  // séance 6 : on va chercher la liste sur Internet
  async function charger() {
    // phase 4 : on essaie d'abord GraphQL (noms français + types)
    try {
      const reponse = await fetch(GRAPHQL, {
        method: "POST", // on envoie la question au serveur
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: question(region.debut, region.fin) }),
      });
      const data = await reponse.json();
      const liste = data.data.pokemonspecies.map((p) => {
        const nomFr = p.pokemonspeciesnames[0];
        const typeAnglais = p.pokemons[0].pokemontypes[0].type.name;
        return {
          number: p.id,
          name: nomFr ? nomFr.name : "???",
          type: TYPES_FR[typeAnglais],
        };
      });
      setPokemons(liste);
      return; // c'est bon, on s'arrête là
    } catch (erreur) {
      // si GraphQL ne répond pas, on garde l'ancienne méthode juste en dessous
    }

    // const reponse = await fetch(API);
    // offset : combien on en saute, limit : combien on en prend
    const offset = region.debut - 1;
    const limit = region.fin - region.debut + 1;
    const reponse = await fetch(`${API}?offset=${offset}&limit=${limit}`);
    const data = await reponse.json();
    // const liste = data.results.map((p, i) => ({ number: i + 1, name: p.name }));
    // bonus : la première lettre du nom en majuscule
    const liste = data.results.map((p, i) => ({
      // number: i + 1,
      number: region.debut + i, // le premier de la région n'est pas forcément le n°1
      name: p.name[0].toUpperCase() + p.name.slice(1),
    }));
    setPokemons(liste);
  }

  // ANCIEN (séance 6) : [] : on charge une seule fois, quand l'écran s'ouvre
  // useEffect(() => {
  //   charger();
  // }, []);
  // projet : [region] : on recharge à chaque fois qu'on change de région
  useEffect(() => {
    setPokemons(null); // on remet le rond qui tourne
    charger();
  }, [region]);

  // tant que la liste n'est pas arrivée, on affiche le rond qui tourne
  if (pokemons === null) {
    return (
      <View style={[styles.chargement, { backgroundColor: c.fond }]}>
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

  // phase 1 : on trie une copie ([...]) pour ne pas abîmer la liste d'origine
  // localeCompare compare deux textes dans l'ordre alphabétique
  const tries =
    tri === "nom"
      ? [...visibles].sort((a, b) => a.name.localeCompare(b.name))
      : visibles;

  // capturer ou relâcher un Pokémon
  // ANCIEN (séance 3 à phase 2) : déplacé dans src/context/Collection.js
  // function toggle(number) {
  //   if (captured.includes(number)) {
  //     setCaptured(captured.filter((n) => n !== number));
  //   } else {
  //     setCaptured([...captured, number]);
  //   }
  // }

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
  //   <ScrollView style={[styles.page, { backgroundColor: c.fond }]} contentContainerStyle={styles.contenu}>
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
  //     {visibles.length === 0 && <Text style={{ color: c.texteDoux }}>Aucun Pokémon trouvé</Text>}
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
      style={[styles.page, { backgroundColor: c.fond }]}
      contentContainerStyle={styles.contenu}
      // data={visibles}
      data={tries}
      extraData={captured} // redessiner les cartes quand captured change
      keyExtractor={(item) => String(item.number)}
      numColumns={2}
      columnWrapperStyle={styles.ligne}
      ListHeaderComponent={
        <View>
          {/* <Titre texte="Mon Pokédex" sousTitre={`${POKEMONS.length} Pokémon`} /> */}
          {/* <Titre texte="Mon Pokédex" sousTitre={`${pokemons.length} Pokémon`} /> */}
          {/* <EntetePokeball titre="Mon Pokédex" sousTitre={`${pokemons.length} Pokémon`} /> */}
          {/* <EntetePokeball titre="Mon Pokédex" sousTitre={`${region.nom} · ${pokemons.length} Pokémon`} /> */}
          <EntetePokeball titre="Mon Pokédex" sousTitre={`Pokédex de ${region.nom}`} />

          {/* projet : un bouton par région, on peut faire défiler sur le côté */}
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
          {/* ANCIEN (séance 3 à 6) : compteur, aide, sac et recherche les uns sous les autres
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
          */}

          {/* phase 1 : trois petites cartes côte à côte */}
          <View style={styles.statsLigne}>
            <View style={[styles.statCarte, { backgroundColor: c.surface }]}>
              <Text style={[styles.statNombre, { color: c.texte }]}>{pokemons.length}</Text>
              <Text style={[styles.statTexte, { color: c.texteDoux }]}>Pokémon</Text>
            </View>
            <View style={[styles.statCarte, { backgroundColor: c.surface }]}>
              <Text style={[styles.statNombre, { color: c.texte }, { color: "#16a34a" }]}>{captured.length}</Text>
              <Text style={[styles.statTexte, { color: c.texteDoux }]}>capturés</Text>
            </View>
            {/* le sac de Poké Balls, avec des petits boutons - et + */}
            <View style={[styles.statCarte, { backgroundColor: c.surface }]}>
              <View style={styles.sacLigne}>
                <Pressable style={styles.petitBouton} onPress={enlever}>
                  <Text style={styles.petitBoutonTexte}>-</Text>
                </Pressable>
                <Text style={[styles.statNombre, { color: c.texte }]}>{balls}</Text>
                <Pressable style={styles.petitBouton} onPress={ajouter}>
                  <Text style={styles.petitBoutonTexte}>+</Text>
                </Pressable>
              </View>
              {/* un appui long sur « Poké Balls » vide le sac */}
              <Pressable onLongPress={() => setBalls(0)}>
                <Text style={[styles.statTexte, { color: c.texteDoux }]}>Poké Balls</Text>
              </Pressable>
            </View>
          </View>

          {/* la barre de recherche avec une loupe */}
          <View style={[styles.rechercheLigne, { backgroundColor: c.surface }]}>
            <Ionicons name="search" size={18} color="#9ca3af" />
            <TextInput
              style={[styles.rechercheChamp, { color: c.texte }]}
              placeholder="Rechercher un Pokémon"
              placeholderTextColor={c.texteDoux}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* ANCIEN (séance 3) : le bouton du filtre Feu
          <Pressable style={styles.filtre} onPress={() => setFeuSeulement(!feuSeulement)}>
            <Text style={styles.viderTexte}>
              {feuSeulement ? "Tout afficher" : "Seulement le type Feu"}
            </Text>
          </Pressable>
          */}
          {/* ANCIEN (séance 4 à 6) :
          <Pressable style={styles.filtre} onPress={() => setCapturesSeulement(!capturesSeulement)}>
            <Text style={styles.viderTexte}>
              {capturesSeulement ? "Tout afficher" : "Mes captures"}
            </Text>
          </Pressable>
          */}
          {/* phase 1 : les filtres et le tri sur une seule ligne */}
          <View style={styles.filtresLigne}>
            <Pressable
              style={[styles.puce, capturesSeulement && styles.puceChoisie]}
              onPress={() => setCapturesSeulement(!capturesSeulement)}
            >
              <Text style={[styles.puceTexte, capturesSeulement && styles.puceTexteChoisi]}>
                Mes captures
              </Text>
            </Pressable>
            <Pressable
              style={[styles.puce, tri === "numero" && styles.puceChoisie]}
              onPress={() => setTri("numero")}
            >
              <Text style={[styles.puceTexte, tri === "numero" && styles.puceTexteChoisi]}>N°</Text>
            </Pressable>
            <Pressable
              style={[styles.puce, tri === "nom" && styles.puceChoisie]}
              onPress={() => setTri("nom")}
            >
              <Text style={[styles.puceTexte, tri === "nom" && styles.puceTexteChoisi]}>A → Z</Text>
            </Pressable>
          </View>

          <Aide />

          {visibles.length === 0 && <Text style={{ color: c.texteDoux }}>Aucun Pokémon trouvé</Text>}
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
            // onToggle={() => toggle(item.number)}
            onToggle={() => toggleCapture(item.number)}
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
  // regions: { marginBottom: 16 },
  // region: { borderWidth: 2, borderColor: "#e3350d", borderRadius: 20, paddingVertical: 6, paddingHorizontal: 14, marginRight: 8 },
  regions: { marginBottom: 12 },
  region: { borderWidth: 2, borderColor: "#e3350d", borderRadius: 20, paddingVertical: 4, paddingHorizontal: 12, marginRight: 8 },
  regionChoisie: { backgroundColor: "#e3350d" },
  regionTexte: { color: "#e3350d", fontWeight: "bold" },
  regionTexteChoisi: { color: "#ffffff" },
  // phase 1 : les petites cartes, la recherche et les filtres
  statsLigne: { flexDirection: "row", gap: 8, marginBottom: 12 },
  statCarte: { flex: 1, backgroundColor: "#ffffff", borderRadius: 14, paddingVertical: 10, alignItems: "center" },
  statNombre: { fontSize: 20, fontWeight: "bold", color: "#111827" },
  statTexte: { fontSize: 12, color: "#6b7280" },
  sacLigne: { flexDirection: "row", alignItems: "center", gap: 8 },
  petitBouton: { backgroundColor: "#2f5be7", width: 22, height: 22, borderRadius: 11, justifyContent: "center", alignItems: "center" },
  petitBoutonTexte: { color: "#ffffff", fontWeight: "bold" },
  rechercheLigne: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#ffffff", borderRadius: 12, paddingHorizontal: 12, marginBottom: 10 },
  rechercheChamp: { flex: 1, paddingVertical: 10 },
  filtresLigne: { flexDirection: "row", gap: 8, marginBottom: 4 },
  puce: { borderWidth: 2, borderColor: "#2f5be7", borderRadius: 20, paddingVertical: 4, paddingHorizontal: 12 },
  puceChoisie: { backgroundColor: "#2f5be7" },
  puceTexte: { color: "#2f5be7", fontWeight: "bold" },
  puceTexteChoisi: { color: "#ffffff" },
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