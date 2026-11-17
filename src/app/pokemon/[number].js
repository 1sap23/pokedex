// ANCIEN (séance 5) : import { View, Text, Image, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
// ANCIEN (séance 6) : import { View, Text, Image, ActivityIndicator, StyleSheet } from "react-native";
// ANCIEN (projet, étape 3) : import { ScrollView, View, Text, Image, ActivityIndicator, StyleSheet } from "react-native";
// ANCIEN (avant la phase 4) : import { ScrollView, View, Text, Image, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import { ScrollView, View, Text, Pressable, ActivityIndicator, StyleSheet } from "react-native";
// phase 4 : l'Image d'expo-image garde les images en cache (plus rapide)
import { Image } from "expo-image";
// ANCIEN (séance 5 et 6) : import { Stack, useLocalSearchParams } from "expo-router";
import { Stack, router, useLocalSearchParams } from "expo-router";
// ANCIEN (séance 5) : la fiche lisait pokemons.js, maintenant c'est la PokéAPI
// import POKEMONS from "../../data/pokemons";
// ANCIEN (séance 6) : import TypeBadge from "../../components/TypeBadge";
import TypeBadge, { TYPE_COLORS } from "../../components/TypeBadge";
import { Ionicons } from "@expo/vector-icons";
import Faiblesses from "../../components/Faiblesses";
import { TYPES_FR } from "../../data/types";
import { useCollection } from "../../context/Collection";

const ARTWORK =
  "https://raw.githubusercontent.com/PokeAPI/sprites" +
  "/master/sprites/pokemon/other/official-artwork/";

/* ANCIEN (séance 6 à phase 3) : déplacé dans src/data/types.js
// l'API donne les types en anglais, on les traduit pour garder nos couleurs
const TYPES_FR = {
  grass: "Plante",
  fire: "Feu",
  water: "Eau",
  electric: "Électrik",
  normal: "Normal",
  bug: "Insecte",
  poison: "Poison",
  ground: "Sol",
  fairy: "Fée",
  fighting: "Combat",
  psychic: "Psy",
  rock: "Roche",
  ghost: "Spectre",
  ice: "Glace",
  dragon: "Dragon",
  // projet : les types des autres régions
  steel: "Acier",
  dark: "Ténèbres",
  flying: "Vol",
};
*/

// projet : le nom des statistiques en français
const STATS_FR = {
  hp: "PV",
  attack: "Attaque",
  defense: "Défense",
  "special-attack": "Atq. Spé.",
  "special-defense": "Déf. Spé.",
  speed: "Vitesse",
};

export default function FichePokemon() {
  const { number } = useLocalSearchParams();
  // ANCIEN (séance 5) :
  // number est un texte dans l'adresse, on le transforme en nombre
  // const pokemon = POKEMONS.find((p) => p.number === Number(number));

  // null au départ : le Pokémon n'est pas encore arrivé
  const [pokemon, setPokemon] = useState(null);
  const [nomFr, setNomFr] = useState("");
  // projet : la catégorie (ex : « Pokémon Souris ») et la description du jeu
  const [categorie, setCategorie] = useState("");
  const [description, setDescription] = useState("");
  // projet : la liste des évolutions, { number, name } comme dans la liste
  const [evolutions, setEvolutions] = useState([]);
  // phase 1 : les talents, l'onglet affiché et la version Shiny
  const [talents, setTalents] = useState([]);
  const [onglet, setOnglet] = useState("apropos");
  const [shiny, setShiny] = useState(false);
  // phase 3 : favoris et équipe, partagés avec les onglets
  const { estFavori, toggleFavori, estDansEquipe, toggleEquipe, equipe } = useCollection();

  async function charger() {
    const reponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${number}`);
    const data = await reponse.json();
    setPokemon(data);

    // bonus : le nom en français, dans l'espèce du Pokémon
    const reponseFr = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${number}`);
    const dataFr = await reponseFr.json();
    // setNomFr(dataFr.names.find((n) => n.language.name === "fr").name);

    // projet : on cherche à chaque fois la version "fr",
    // et on vérifie qu'elle existe avant de s'en servir
    const nom = dataFr.names.find((n) => n.language.name === "fr");
    if (nom) {
      setNomFr(nom.name);
    }

    const genre = dataFr.genera.find((g) => g.language.name === "fr");
    if (genre) {
      setCategorie(genre.genus);
    }

    const texte = dataFr.flavor_text_entries.find((t) => t.language.name === "fr");
    if (texte) {
      // le texte du jeu contient des retours à la ligne, on les remplace par des espaces
      setDescription(texte.flavor_text.replaceAll("\n", " ").replaceAll("\f", " "));
    }

    // phase 1 : les talents, chacun a son adresse avec le nom français
    const listeTalents = [];
    for (const a of data.abilities) {
      const reponseTalent = await fetch(a.ability.url);
      const talent = await reponseTalent.json();
      const nomTalent = talent.names.find((n) => n.language.name === "fr");
      listeTalents.push({
        nom: nomTalent ? nomTalent.name : a.ability.name,
        cache: a.is_hidden, // true si c'est le talent caché
      });
    }
    setTalents(listeTalents);

    // projet : la chaîne d'évolution, à une autre adresse donnée par l'espèce
    const reponseEvo = await fetch(dataFr.evolution_chain.url);
    const dataEvo = await reponseEvo.json();

    // la chaîne est rangée par étages : le premier Pokémon,
    // puis dans evolves_to ses évolutions, puis leurs évolutions...
    // on lit un étage, puis on passe à l'étage suivant
    const liste = [];
    let etage = [dataEvo.chain];
    while (etage.length > 0) {
      let suivant = [];
      for (const e of etage) {
        // pour chaque Pokémon on va chercher son nom français
        const reponseEspece = await fetch(e.species.url);
        const espece = await reponseEspece.json();
        const nomEspece = espece.names.find((n) => n.language.name === "fr");
        // liste.push({ number: espece.id, name: nomEspece ? nomEspece.name : espece.name });
        // phase 1 : on ajoute comment on obtient ce Pokémon
        const condition = await texteCondition(e.evolution_details[0]);
        liste.push({
          number: espece.id,
          name: nomEspece ? nomEspece.name : espece.name,
          condition: condition,
        });
        suivant = [...suivant, ...e.evolves_to];
      }
      etage = suivant;
    }
    setEvolutions(liste);
  }

  // phase 1 : transforme les détails d'une évolution en petit texte
  // le premier Pokémon de la chaîne n'a pas de détails : texte vide
  async function texteCondition(details) {
    if (!details) {
      return "";
    }
    if (details.min_level) {
      return `Niveau ${details.min_level}`;
    }
    if (details.item) {
      // l'objet a lui aussi son adresse avec le nom français (ex : Pierre Feu)
      const reponseObjet = await fetch(details.item.url);
      const objet = await reponseObjet.json();
      const nomObjet = objet.names.find((n) => n.language.name === "fr");
      return nomObjet ? nomObjet.name : details.item.name;
    }
    if (details.trigger.name === "trade") {
      return "Échange";
    }
    if (details.min_happiness) {
      return "Bonheur";
    }
    return "Spécial";
  }

  useEffect(() => {
    charger();
  }, []);

  if (pokemon === null) {
    return (
      <View style={styles.chargement}>
        <ActivityIndicator size="large" color="#2f5be7" />
      </View>
    );
  }

  // en attendant le nom français, on affiche le nom anglais
  const nom = nomFr || pokemon.name;
  const type = pokemon.types[0].type.name;
  // projet : la couleur du premier type, pour le bandeau et les barres
  const color = TYPE_COLORS[TYPES_FR[type]] || "#9ca3af";

  // phase 3 : ce qu'on garde dans les favoris et l'équipe
  const resume = {
    number: pokemon.id,
    name: nom,
    types: pokemon.types.map((t) => TYPES_FR[t.type.name] || t.type.name),
  };
  const favori = estFavori(pokemon.id);
  const dansEquipe = estDansEquipe(pokemon.id);

  // phase 1 : le total des statistiques, on additionne les 6 valeurs
  let total = 0;
  for (const s of pokemon.stats) {
    total = total + s.base_stat;
  }

  // ANCIEN (séance 6) : la fiche simple
  // return (
  //   <View style={styles.page}>
  //     <Stack.Screen options={{ title: nom }} />
  //     <Text style={styles.numero}>#{pokemon.id}</Text>
  //     <Image source={{ uri: `${ARTWORK}${pokemon.id}.png` }} style={styles.image} contentFit="contain" cachePolicy="memory-disk" />
  //     <Text style={styles.nom}>{nom}</Text>
  //     <TypeBadge type={TYPES_FR[type] || type} />
  //
  //     <View style={styles.infos}>
  //       <Text style={styles.info}>Taille : {pokemon.height / 10} m</Text>
  //       <Text style={styles.info}>Poids : {pokemon.weight / 10} kg</Text>
  //     </View>
  //   </View>
  // );

  // projet : la fiche façon livre
  return (
    <ScrollView style={styles.page}>
      {/* le haut de l'écran prend aussi la couleur du type */}
      <Stack.Screen options={{ title: nom, headerStyle: { backgroundColor: color } }} />

      {/* le bandeau de couleur avec le numéro et l'image */}
      <View style={[styles.bandeau, { backgroundColor: color }]}>
        <Text style={styles.numero}>#{pokemon.id}</Text>
        {/* <Image source={{ uri: `${ARTWORK}${pokemon.id}.png` }} style={styles.image} /> */}
        {/* phase 1 : les images Shiny sont dans le dossier shiny/ */}
        <Image
          source={{ uri: `${ARTWORK}${shiny ? "shiny/" : ""}${pokemon.id}.png` }}
          style={styles.image}
          contentFit="contain"
          cachePolicy="memory-disk"
          transition={300} // fondu de 0,3 seconde entre normal et Shiny
        />
        {/* phase 3 : les trois boutons sont sur une ligne */}
        <View style={styles.boutonsBandeau}>
          <Pressable style={styles.boutonShiny} onPress={() => setShiny(!shiny)}>
            <Ionicons name="sparkles" size={16} color={shiny ? "#facc15" : "#ffffff"} />
            <Text style={styles.boutonShinyTexte}>{shiny ? "Normal" : "Shiny"}</Text>
          </Pressable>
          <Pressable style={styles.boutonShiny} onPress={() => toggleFavori(resume)}>
            {/* coeur plein si favori, coeur vide sinon */}
            <Ionicons name={favori ? "heart" : "heart-outline"} size={16} color="#ffffff" />
            <Text style={styles.boutonShinyTexte}>Favori</Text>
          </Pressable>
          <Pressable style={styles.boutonShiny} onPress={() => toggleEquipe(resume)}>
            <Ionicons name={dansEquipe ? "people" : "people-outline"} size={16} color="#ffffff" />
            <Text style={styles.boutonShinyTexte}>
              {/* si l'équipe est pleine, on le dit */}
              {dansEquipe ? "Dans l'équipe" : equipe.length < 6 ? "Équipe" : "Équipe pleine"}
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.contenu}>
        <Text style={styles.nom}>{nom}</Text>
        {categorie !== "" && <Text style={styles.categorie}>{categorie}</Text>}

        {/* tous les types, pas seulement le premier */}
        <View style={styles.types}>
          {pokemon.types.map((t) => (
            <TypeBadge key={t.type.name} type={TYPES_FR[t.type.name] || t.type.name} />
          ))}
        </View>

        {/* phase 1 : les onglets de la fiche */}
        <View style={styles.onglets}>
          <Pressable
            style={[styles.onglet, onglet === "apropos" && { backgroundColor: color }]}
            onPress={() => setOnglet("apropos")}
          >
            <Text style={[styles.ongletTexte, onglet === "apropos" && styles.ongletTexteChoisi]}>
              À propos
            </Text>
          </Pressable>
          <Pressable
            style={[styles.onglet, onglet === "stats" && { backgroundColor: color }]}
            onPress={() => setOnglet("stats")}
          >
            <Text style={[styles.ongletTexte, onglet === "stats" && styles.ongletTexteChoisi]}>
              Stats
            </Text>
          </Pressable>
          <Pressable
            style={[styles.onglet, onglet === "evolutions" && { backgroundColor: color }]}
            onPress={() => setOnglet("evolutions")}
          >
            <Text style={[styles.ongletTexte, onglet === "evolutions" && styles.ongletTexteChoisi]}>
              Évolutions
            </Text>
          </Pressable>
          {/* phase 2 : l'onglet combat */}
          <Pressable
            style={[styles.onglet, onglet === "combat" && { backgroundColor: color }]}
            onPress={() => setOnglet("combat")}
          >
            <Text style={[styles.ongletTexte, onglet === "combat" && styles.ongletTexteChoisi]}>
              Combat
            </Text>
          </Pressable>
        </View>

        {/* ===== onglet Combat ===== */}
        {onglet === "combat" && (
          <View style={styles.bloc}>
            <Text style={styles.titreBloc}>Faiblesses et résistances</Text>
            {/* les types du Pokémon en français, ex : ["Feu", "Vol"] */}
            <Faiblesses types={pokemon.types.map((t) => TYPES_FR[t.type.name])} />
          </View>
        )}

        {/* ===== onglet À propos ===== */}
        {onglet === "apropos" && (
        <View>
        {description !== "" && (
          <View style={styles.bloc}>
            <Text style={styles.description}>{description}</Text>
          </View>
        )}

        <View style={styles.infos}>
          <View style={styles.info}>
            <Text style={styles.infoTitre}>Taille</Text>
            <Text style={styles.infoValeur}>{pokemon.height / 10} m</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.infoTitre}>Poids</Text>
            <Text style={styles.infoValeur}>{pokemon.weight / 10} kg</Text>
          </View>
        </View>

        {/* phase 1 : les talents, le talent caché est signalé */}
        <View style={styles.bloc}>
          <Text style={styles.titreBloc}>Talents</Text>
          {talents.map((t) => (
            <View key={t.nom} style={styles.talent}>
              <Text style={styles.talentNom}>{t.nom}</Text>
              {t.cache && <Text style={[styles.talentCache, { color: color }]}>caché</Text>}
            </View>
          ))}
        </View>
        </View>
        )}

        {/* ===== onglet Stats ===== */}
        {onglet === "stats" && (
        <View style={styles.bloc}>
          <Text style={styles.titreBloc}>Statistiques</Text>
          {pokemon.stats.map((s) => (
            <View key={s.stat.name} style={styles.stat}>
              <Text style={styles.statNom}>{STATS_FR[s.stat.name]}</Text>
              <Text style={styles.statValeur}>{s.base_stat}</Text>
              {/* le fond gris, et dedans la barre de couleur */}
              <View style={styles.barreFond}>
                {/* 255 est la plus grande valeur possible, on la met à 100 % */}
                <View
                  style={[
                    styles.barre,
                    { width: `${(s.base_stat / 255) * 100}%`, backgroundColor: color },
                  ]}
                />
              </View>
            </View>
          ))}
          {/* phase 1 : le total */}
          <View style={styles.stat}>
            <Text style={[styles.statNom, styles.totalTexte]}>Total</Text>
            <Text style={[styles.statValeur, styles.totalTexte]}>{total}</Text>
          </View>
        </View>
        )}

        {/* ===== onglet Évolutions ===== */}
        {onglet === "evolutions" && evolutions.length <= 1 && (
          <View style={styles.bloc}>
            <Text style={styles.description}>Ce Pokémon n'évolue pas.</Text>
          </View>
        )}

        {/* projet : les évolutions, seulement si le Pokémon en a */}
        {/* {evolutions.length > 1 && ( */}
        {onglet === "evolutions" && evolutions.length > 1 && (
          <View style={styles.bloc}>
            <Text style={styles.titreBloc}>Évolutions</Text>
            <View style={styles.evolutions}>
              {evolutions.map((e) => (
                <Pressable
                  key={e.number}
                  // le Pokémon de la fiche est entouré de sa couleur
                  style={[styles.evolution, e.number === pokemon.id && { borderColor: color }]}
                  onPress={() => router.push(`/pokemon/${e.number}`)}
                >
                  <Image source={{ uri: `${ARTWORK}${e.number}.png` }} style={styles.evolutionImage} contentFit="contain" cachePolicy="memory-disk" />
                  <Text style={styles.evolutionNom}>{e.name}</Text>
                  {/* phase 1 : comment on l'obtient */}
                  {e.condition !== "" && (
                    <Text style={styles.evolutionCondition}>{e.condition}</Text>
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  chargement: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f3f4f6" },
  // ANCIEN (séance 6) :
  // page: { flex: 1, alignItems: "center", padding: 24, backgroundColor: "#f3f4f6" },
  // numero: { alignSelf: "flex-end", fontSize: 18, color: "#6b7280" },
  // image: { width: 250, height: 250 },
  // nom: { fontSize: 30, fontWeight: "bold", color: "#111827", marginBottom: 8 },
  // infos: { flexDirection: "row", gap: 24, marginTop: 20 },
  // info: { fontSize: 18, color: "#111827" },
  page: { flex: 1, backgroundColor: "#f3f4f6" },
  bandeau: { alignItems: "center", paddingTop: 12, paddingBottom: 20, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  numero: { alignSelf: "flex-end", marginRight: 20, fontSize: 20, fontWeight: "bold", color: "#ffffff" },
  image: { width: 220, height: 220 },
  contenu: { padding: 20 },
  nom: { fontSize: 32, fontWeight: "bold", color: "#111827", textAlign: "center" },
  categorie: { fontSize: 16, color: "#6b7280", textAlign: "center", marginTop: 2 },
  types: { flexDirection: "row", justifyContent: "center", gap: 8, marginTop: 8, marginBottom: 16 },
  bloc: { backgroundColor: "#ffffff", borderRadius: 16, padding: 16, marginBottom: 16 },
  description: { fontSize: 15, fontStyle: "italic", color: "#374151", lineHeight: 22 },
  infos: { flexDirection: "row", gap: 12, marginBottom: 16 },
  info: { flex: 1, backgroundColor: "#ffffff", borderRadius: 16, padding: 16, alignItems: "center" },
  infoTitre: { fontSize: 14, color: "#6b7280" },
  infoValeur: { fontSize: 22, fontWeight: "bold", color: "#111827", marginTop: 4 },
  titreBloc: { fontSize: 18, fontWeight: "bold", color: "#111827", marginBottom: 12 },
  stat: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  statNom: { width: 80, fontSize: 14, color: "#6b7280" },
  statValeur: { width: 36, fontSize: 14, fontWeight: "bold", color: "#111827" },
  barreFond: { flex: 1, height: 10, backgroundColor: "#e5e7eb", borderRadius: 5 },
  barre: { height: 10, borderRadius: 5 },
  evolutions: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 10 },
  evolution: { alignItems: "center", padding: 8, borderRadius: 14, borderWidth: 3, borderColor: "#f3f4f6", backgroundColor: "#f3f4f6" },
  evolutionImage: { width: 80, height: 80 },
  evolutionNom: { fontSize: 13, fontWeight: "bold", color: "#111827" },
  // phase 1
  evolutionCondition: { fontSize: 11, color: "#6b7280", marginTop: 2 },
  boutonShiny: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "rgba(0,0,0,0.25)", borderRadius: 20, paddingVertical: 6, paddingHorizontal: 14 },
  boutonShinyTexte: { color: "#ffffff", fontWeight: "bold" },
  boutonsBandeau: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8 },
  onglets: { flexDirection: "row", backgroundColor: "#e5e7eb", borderRadius: 14, padding: 4, marginBottom: 16 },
  onglet: { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: "center" },
  // ongletTexte: { fontWeight: "bold", color: "#6b7280" },
  ongletTexte: { fontSize: 13, fontWeight: "bold", color: "#6b7280" }, // plus petit : 4 onglets
  ongletTexteChoisi: { color: "#ffffff" },
  talent: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  talentNom: { fontSize: 16, color: "#111827" },
  talentCache: { fontSize: 12, fontWeight: "bold" },
  totalTexte: { fontWeight: "bold", color: "#111827" },
});
