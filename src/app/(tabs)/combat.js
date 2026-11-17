import { useTheme } from "../../context/Theme";
// ANCIEN (phase 2) : import { useState } from "react";
import { useState, useRef, useEffect } from "react";
// ANCIEN (phase 2) : import { ScrollView, View, Text, Pressable, StyleSheet } from "react-native";
import { ScrollView, View, Text, Pressable, Animated, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { TYPE_COLORS } from "../../components/TypeBadge";
import Faiblesses from "../../components/Faiblesses";
import TypeIcone from "../../components/TypeIcone";
import { AMBIANCES } from "../../components/SceneType";
import { TYPES, efficacite } from "../../data/types";

// ANCIEN (phase 2) : un seul mode, on choisit un ou deux types et on voit ce qui leur fait mal
// export default function Combat() {
//   const { couleurs: c } = useTheme();
//   const [choisis, setChoisis] = useState([]); // au plus 2 types
//   function choisir(type) { ... }
//   return (
//     <ScrollView ...>
//       <Text>Calculateur de types</Text>
//       <View style={styles.grille}>
//         {TYPES.map((t) => <Pressable ...><Text>{t}</Text></Pressable>)}
//       </View>
//       {choisis.length > 0 && (
//         <View style={styles.bloc}>
//           <Text>Un Pokémon {choisis.join(" / ")}</Text>
//           <Faiblesses types={choisis} />
//         </View>
//       )}
//     </ScrollView>
//   );
// }

// calculateur : les 3 modes
const MODES = [
  { valeur: "defense", texte: "Défense", icone: "shield" },
  { valeur: "attaque", texte: "Attaque", icone: "flash" },
  { valeur: "duel", texte: "Duel", icone: "git-compare" },
];

// le verdict d'un duel, selon le multiplicateur
function verdict(m) {
  if (m === 0) return { texte: "Aucun effet…", couleur: "#6b7280" };
  if (m >= 4) return { texte: "Ultra efficace !!", couleur: "#b91c1c" };
  if (m >= 2) return { texte: "C'est super efficace !", couleur: "#ef4444" };
  if (m === 1) return { texte: "Efficacité normale", couleur: "#2563eb" };
  return { texte: "Ce n'est pas très efficace…", couleur: "#16a34a" };
}

// une case de la grille des types : un rond d'énergie et son nom
function CaseType({ type, choisi, onPress, c }) {
  const ambiance = AMBIANCES[type] || ["#111827", "#6b7280", "#f3f4f6"];
  return (
    <Pressable style={styles.case} onPress={onPress}>
      {choisi ? (
        // choisi : la case prend l'ambiance de son type
        <LinearGradient colors={ambiance} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.caseInterieur}>
          <TypeIcone type={type} taille={30} />
          <Text style={[styles.caseTexte, { color: "#ffffff" }]}>{type}</Text>
        </LinearGradient>
      ) : (
        <View style={[styles.caseInterieur, { backgroundColor: c.surface, borderColor: TYPE_COLORS[type] }]}>
          <TypeIcone type={type} taille={30} />
          <Text style={[styles.caseTexte, { color: c.texte }]}>{type}</Text>
        </View>
      )}
    </Pressable>
  );
}

// calculateur : défense, attaque et duel
export default function Combat() {
  // thème : les couleurs du mode clair ou sombre
  const { couleurs: c } = useTheme();
  const [mode, setMode] = useState("defense");
  const [choisis, setChoisis] = useState([]); // défense : au plus 2 types
  const [attaque, setAttaque] = useState(null); // attaque et duel : 1 type
  const [cible, setCible] = useState([]); // duel : 1 ou 2 types en défense
  const [cote, setCote] = useState("attaquant"); // duel : quel côté on remplit

  // duel : le grand chiffre "saute" à chaque nouveau résultat
  const saut = useRef(new Animated.Value(1)).current;

  // 1 ou 2 types : le même principe qu'avant, réutilisé pour la cible du duel
  function ajouterType(liste, type) {
    if (liste.includes(type)) {
      return liste.filter((t) => t !== type);
    } else if (liste.length < 2) {
      return [...liste, type];
    }
    return [liste[0], type];
  }

  function toucher(type) {
    if (mode === "defense") {
      setChoisis(ajouterType(choisis, type));
    } else if (mode === "attaque") {
      setAttaque(attaque === type ? null : type);
    } else if (cote === "attaquant") {
      setAttaque(type);
      setCote("defenseur"); // l'attaquant choisi, on passe au défenseur
    } else {
      setCible(ajouterType(cible, type));
    }
  }

  // le multiplicateur du duel
  const pret = attaque !== null && cible.length > 0;
  const multiplicateur = pret ? efficacite(attaque, cible) : 1;

  useEffect(() => {
    if (pret) {
      saut.setValue(0.3);
      Animated.spring(saut, { toValue: 1, friction: 3, useNativeDriver: false }).start();
    }
  }, [attaque, cible.join()]);

  // quelles cases sont allumées dans la grille
  function estChoisi(type) {
    if (mode === "defense") return choisis.includes(type);
    if (mode === "attaque") return attaque === type;
    return cote === "attaquant" ? attaque === type : cible.includes(type);
  }

  // attaque : les 18 types rangés selon ce que l'attaque leur fait
  const groupesAttaque = attaque
    ? [
        { titre: "Super efficace (x2)", couleur: "#ef4444", liste: TYPES.filter((t) => efficacite(attaque, [t]) === 2) },
        { titre: "Pas très efficace (x½)", couleur: "#16a34a", liste: TYPES.filter((t) => efficacite(attaque, [t]) === 0.5) },
        { titre: "Aucun effet (x0)", couleur: "#6b7280", liste: TYPES.filter((t) => efficacite(attaque, [t]) === 0) },
      ]
    : [];

  const aide = {
    defense: "Choisis 1 ou 2 types : voici ce qui leur fait mal.",
    attaque: "Choisis le type d'une attaque : voici qui elle touche fort.",
    duel: cote === "attaquant" ? "1. Choisis le type de l'attaque" : "2. Choisis 1 ou 2 types pour le défenseur",
  };

  return (
    <ScrollView style={[styles.page, { backgroundColor: c.fond }]} contentContainerStyle={styles.contenu}>
      <Text style={[styles.titre, { color: c.texte }]}>Calculateur de types</Text>

      {/* les 3 modes */}
      <View style={[styles.modes, { backgroundColor: c.surfaceDouce }]}>
        {MODES.map((m) => (
          <Pressable
            key={m.valeur}
            style={[styles.modeBouton, mode === m.valeur && styles.modeActif]}
            onPress={() => setMode(m.valeur)}
          >
            <Ionicons name={m.icone} size={16} color={mode === m.valeur ? "#ffffff" : c.texteDoux} />
            <Text style={[styles.modeTexte, { color: mode === m.valeur ? "#ffffff" : c.texteDoux }]}>{m.texte}</Text>
          </Pressable>
        ))}
      </View>

      {/* duel : le face-à-face, au-dessus de la grille */}
      {mode === "duel" && (
        <LinearGradient colors={["#0f172a", pret ? verdict(multiplicateur).couleur : "#334155", "#0f172a"]} style={styles.arene}>
          <View style={styles.face}>
            {/* le côté attaquant */}
            <Pressable style={[styles.combattant, cote === "attaquant" && styles.combattantActif]} onPress={() => setCote("attaquant")}>
              <Text style={styles.combattantTitre}>ATTAQUE</Text>
              {attaque ? <TypeIcone type={attaque} taille={52} /> : <Ionicons name="help-circle" size={52} color="#64748b" />}
              <Text style={styles.combattantNom}>{attaque || "?"}</Text>
            </Pressable>

            <Text style={styles.vs}>VS</Text>

            {/* le côté défenseur */}
            <Pressable style={[styles.combattant, cote === "defenseur" && styles.combattantActif]} onPress={() => setCote("defenseur")}>
              <Text style={styles.combattantTitre}>DÉFENSE</Text>
              <View style={styles.icones}>
                {cible.length === 0 && <Ionicons name="help-circle" size={52} color="#64748b" />}
                {cible.map((t) => (
                  <TypeIcone key={t} type={t} taille={cible.length === 2 ? 40 : 52} />
                ))}
              </View>
              <Text style={styles.combattantNom}>{cible.length > 0 ? cible.join(" / ") : "?"}</Text>
            </Pressable>
          </View>

          {/* le résultat qui saute */}
          {pret && (
            <Animated.View style={[styles.resultat, { transform: [{ scale: saut }] }]}>
              <Text style={styles.multiplicateur}>x{multiplicateur === 0.25 ? "¼" : multiplicateur === 0.5 ? "½" : multiplicateur}</Text>
              <Text style={styles.verdict}>{verdict(multiplicateur).texte}</Text>
            </Animated.View>
          )}
        </LinearGradient>
      )}

      <Text style={[styles.texte, { color: c.texteDoux }]}>{aide[mode]}</Text>

      {/* la grille des 18 types, en ronds d'énergie */}
      <View style={styles.grille}>
        {TYPES.map((t) => (
          <CaseType key={t} type={t} choisi={estChoisi(t)} onPress={() => toucher(t)} c={c} />
        ))}
      </View>

      {/* défense : le résultat (comme avant) */}
      {mode === "defense" && choisis.length > 0 && (
        <View style={[styles.bloc, { backgroundColor: c.surface }]}>
          <Text style={[styles.titreBloc, { color: c.texte }]}>Un Pokémon {choisis.join(" / ")}</Text>
          <Faiblesses types={choisis} />
          <Pressable onPress={() => setChoisis([])}>
            <Text style={styles.effacer}>Effacer</Text>
          </Pressable>
        </View>
      )}

      {/* attaque : qui elle touche fort, faiblement, ou pas du tout */}
      {mode === "attaque" && attaque && (
        <View style={[styles.bloc, { backgroundColor: c.surface }]}>
          <Text style={[styles.titreBloc, { color: c.texte }]}>Une attaque {attaque}</Text>
          {groupesAttaque.map((g) =>
            g.liste.length === 0 ? null : (
              <View key={g.titre} style={styles.groupe}>
                <Text style={[styles.groupeTitre, { color: g.couleur }]}>{g.titre}</Text>
                <View style={styles.icones}>
                  {g.liste.map((t) => (
                    <TypeIcone key={t} type={t} taille={32} />
                  ))}
                </View>
              </View>
            )
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#f3f4f6" },
  contenu: { padding: 16, paddingBottom: 40 },
  titre: { fontSize: 26, fontWeight: "900", color: "#111827", marginBottom: 10 },
  texte: { fontSize: 14, color: "#6b7280", marginBottom: 12 },
  modes: { flexDirection: "row", borderRadius: 14, padding: 4, marginBottom: 14 },
  modeBouton: { flex: 1, flexDirection: "row", gap: 6, alignItems: "center", justifyContent: "center", paddingVertical: 9, borderRadius: 10 },
  modeActif: { backgroundColor: "#e3350d" },
  modeTexte: { fontWeight: "bold" },
  // ANCIEN (phase 2) :
  // grille: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  // type: { width: "31%", paddingVertical: 8, borderRadius: 12, borderWidth: 2, alignItems: "center", backgroundColor: "#ffffff" },
  // typeTexte: { fontWeight: "bold" },
  grille: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 10, marginBottom: 16 },
  // 3 types par ligne
  case: { width: "31.5%" },
  caseInterieur: { alignItems: "center", gap: 4, paddingVertical: 10, borderRadius: 14, borderWidth: 2, borderColor: "transparent" },
  caseTexte: { fontSize: 13, fontWeight: "bold" },
  bloc: { backgroundColor: "#ffffff", borderRadius: 16, padding: 16 },
  titreBloc: { fontSize: 18, fontWeight: "900", color: "#111827", marginBottom: 12 },
  effacer: { color: "#2f5be7", fontWeight: "bold", textDecorationLine: "underline", textAlign: "center", marginTop: 4 },
  groupe: { marginBottom: 12 },
  groupeTitre: { fontSize: 15, fontWeight: "bold", marginBottom: 6 },
  icones: { flexDirection: "row", flexWrap: "wrap", gap: 6, justifyContent: "center" },
  // duel
  arene: { borderRadius: 20, padding: 16, marginBottom: 14 },
  face: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  combattant: { flex: 1, alignItems: "center", gap: 6, paddingVertical: 10, borderRadius: 16, borderWidth: 2, borderColor: "transparent" },
  combattantActif: { borderColor: "#fde68a", backgroundColor: "rgba(253,230,138,0.1)" },
  combattantTitre: { fontSize: 11, fontWeight: "900", letterSpacing: 2, color: "#fde68a" },
  combattantNom: { fontSize: 14, fontWeight: "bold", color: "#ffffff" },
  vs: { fontSize: 30, fontWeight: "900", fontStyle: "italic", color: "#ffffff", marginHorizontal: 8, textShadowColor: "#e3350d", textShadowRadius: 10 },
  resultat: { alignItems: "center", marginTop: 12 },
  multiplicateur: { fontSize: 56, fontWeight: "900", color: "#ffffff", textShadowColor: "rgba(0,0,0,0.5)", textShadowRadius: 8 },
  verdict: { fontSize: 18, fontWeight: "900", color: "#fde68a" },
});
