import { useTheme } from "../../context/Theme";
// ANCIEN (séance 2 à carte holo) : import { View, Text, Image, Pressable, Alert, StyleSheet } from "react-native";
import { ScrollView, View, Text, Image, Pressable, Alert, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Tag from "../../components/Tag";
import Avatar from "../../components/Avatar";
import InfoLigne from "../../components/InfoLigne";
import { useCollection } from "../../context/Collection";
import REGIONS from "../../data/regions";

const INTERETS = ["STM32", "React Native", "Électronique"];

const ARTWORK =
  "https://raw.githubusercontent.com/PokeAPI/sprites" +
  "/master/sprites/pokemon/other/official-artwork/";

// carte de dresseur : un badge par région, gagné à partir de 10 captures
const POUR_LE_BADGE = 10;
const COULEURS_BADGES = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#6366f1", "#ec4899", "#14b8a6", "#8b5cf6", "#f97316"];

// ANCIEN (séance 2 à carte holo) : la carte de profil simple
// export default function Profil() {
//   const { couleurs: c } = useTheme();
//   return (
//     <View style={[styles.container, { backgroundColor: c.fond }]}>
//       <View style={[styles.carte, { backgroundColor: c.surface }]}>
//         <Avatar uri="https://i.pravatar.cc/200" size={110} />
//         <Text style={[styles.nom, { color: c.texte }]}>Ange Vanessa</Text>
//         <Text style={[styles.description, { color: c.texteDoux }]}>Élève ingénieure · ISEN 3</Text>
//         <View style={styles.tags}>
//           {INTERETS.map((interet) => (
//             <Tag key={interet} label={interet} />
//           ))}
//         </View>
//         <InfoLigne label="Email" value="moi@ecole.fr" />
//         <InfoLigne label="Ville" value="Toulon" />
//         <InfoLigne label="École" value="ISEN Méditerranée" />
//         <Text style={[styles.prefereTitre, { color: c.texte }]}>Mon Pokémon préféré</Text>
//         <Image source={{ uri: `${ARTWORK}493.png` }} style={styles.prefereImage} />
//         <Text style={[styles.prefereNom, { color: c.texte }]}>Arceus</Text>
//         <Text style={[styles.description, { color: c.texteDoux }]}>J'adore les Pokémon légendaires</Text>
//         <View style={styles.contour}>
//           <Pressable style={styles.bouton} onPress={() => Alert.alert("Contact", "moi@ecole.fr")}>
//             <Text style={styles.boutonTexte}>Me contacter</Text>
//           </Pressable>
//         </View>
//       </View>
//     </View>
//   );
// }

// carte de dresseur : le profil devient une vraie carte de Dresseuse
export default function Profil() {
  // thème : les couleurs, et le mode choisi pour les réglages
  const { couleurs: c, mode, setMode } = useTheme();
  const { captured, favoris, equipe } = useCollection();

  // le Pokédex complet a 1025 Pokémon
  const pourcentage = Math.round((captured.length / 1025) * 100);

  // pour chaque région : combien de ses Pokémon sont capturés
  const badges = REGIONS.map((r, i) => {
    const total = r.fin - r.debut + 1;
    const pris = captured.filter((n) => n >= r.debut && n <= r.fin).length;
    return { nom: r.nom, total: total, pris: pris, gagne: pris >= POUR_LE_BADGE, couleur: COULEURS_BADGES[i] };
  });
  const nbBadges = badges.filter((b) => b.gagne).length;

  return (
    <ScrollView style={{ backgroundColor: c.fond }} contentContainerStyle={styles.page}>
      {/* 1. la carte de Dresseuse, avec un cadre doré comme les cartes holo */}
      <LinearGradient
        colors={["#fde68a", "#f59e0b", "#fef3c7", "#d97706"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cadre}
      >
        <LinearGradient colors={["#7f1d1d", "#e3350d", "#f59e0b"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.carteDresseur}>
          {/* une grande Poké Ball en filigrane */}
          <View style={styles.ballFiligrane}>
            <View style={styles.ballBande} />
            <View style={styles.ballBouton} />
          </View>
          {/* Arceus, le partenaire, qui dépasse sur la droite */}
          <Image source={{ uri: `${ARTWORK}493.png` }} style={styles.partenaire} />

          <View style={styles.enteteCarte}>
            <Text style={styles.petitTitre}>CARTE DE DRESSEUSE</Text>
            <Text style={styles.identifiant}>ID 2026-0493</Text>
          </View>

          <View style={styles.identite}>
            {/* <Avatar> a une marge en bas : ici on veut un rond parfait dans le cadre doré */}
            <Image source={{ uri: "https://i.pravatar.cc/200" }} style={styles.avatar} />
            <View style={styles.identiteTexte}>
              <Text style={styles.nomDresseur}>Ange Vanessa</Text>
              <Text style={styles.infoDresseur}>Élève ingénieure · ISEN 3</Text>
              <Text style={styles.infoDresseur}>Toulon</Text>
              <Text style={styles.partenaireTexte}>✦ Partenaire : Arceus</Text>
            </View>
          </View>

          {/* les chiffres de la collection */}
          <View style={styles.chiffres}>
            <View style={styles.chiffre}>
              <Text style={styles.chiffreValeur}>{captured.length}</Text>
              <Text style={styles.chiffreTexte}>captures</Text>
            </View>
            <View style={styles.chiffre}>
              <Text style={styles.chiffreValeur}>{favoris.length}</Text>
              <Text style={styles.chiffreTexte}>favoris</Text>
            </View>
            <View style={styles.chiffre}>
              <Text style={styles.chiffreValeur}>{nbBadges}/9</Text>
              <Text style={styles.chiffreTexte}>badges</Text>
            </View>
          </View>
        </LinearGradient>
      </LinearGradient>

      {/* 2. l'avancement du Pokédex */}
      <View style={[styles.bloc, { backgroundColor: c.surface }]}>
        <View style={styles.ligne}>
          <Text style={[styles.titreBloc, { color: c.texte }]}>Pokédex national</Text>
          <Text style={[styles.pourcent, { color: "#e3350d" }]}>{pourcentage} %</Text>
        </View>
        <View style={[styles.barreFond, { backgroundColor: c.surfaceDouce }]}>
          <LinearGradient
            colors={["#e3350d", "#f59e0b"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            // au moins 2 % pour qu'on voie le début de la barre
            style={[styles.barre, { width: `${Math.max(pourcentage, 2)}%` }]}
          />
        </View>
        <Text style={[styles.petit, { color: c.texteDoux }]}>{captured.length} / 1025 Pokémon capturés</Text>
      </View>

      {/* 3. les badges des 9 régions */}
      <View style={[styles.bloc, { backgroundColor: c.surface }]}>
        <Text style={[styles.titreBloc, { color: c.texte }]}>Badges des régions</Text>
        <Text style={[styles.petit, { color: c.texteDoux, marginBottom: 10 }]}>
          Capture {POUR_LE_BADGE} Pokémon d'une région pour gagner son badge
        </Text>
        <View style={styles.badges}>
          {badges.map((b) => (
            <View key={b.nom} style={styles.badge}>
              {/* le badge brille s'il est gagné, sinon il reste gris */}
              <View
                style={[
                  styles.badgeRond,
                  { borderColor: b.gagne ? b.couleur : c.bordure, backgroundColor: b.gagne ? b.couleur : c.surfaceDouce },
                ]}
              >
                <Ionicons name={b.gagne ? "medal" : "lock-closed"} size={22} color={b.gagne ? "#ffffff" : c.texteDoux} />
              </View>
              <Text style={[styles.badgeNom, { color: c.texte }]}>{b.nom}</Text>
              <Text style={[styles.badgeCompte, { color: c.texteDoux }]}>
                {b.pris}/{b.total}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* 4. un aperçu de l'équipe */}
      <Pressable style={[styles.bloc, { backgroundColor: c.surface }]} onPress={() => router.push("/equipe")}>
        <View style={styles.ligne}>
          <Text style={[styles.titreBloc, { color: c.texte }]}>Mon équipe</Text>
          <Ionicons name="chevron-forward" size={20} color={c.texteDoux} />
        </View>
        <View style={styles.equipe}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <View key={"place" + i} style={[styles.equipePlace, { backgroundColor: c.surfaceDouce }]}>
              {equipe[i] && (
                <Image source={{ uri: `${ARTWORK}${equipe[i].number}.png` }} style={styles.equipeImage} />
              )}
            </View>
          ))}
        </View>
      </Pressable>

      {/* 5. les réglages : le thème */}
      <View style={[styles.bloc, { backgroundColor: c.surface }]}>
        <Text style={[styles.titreBloc, { color: c.texte }]}>Apparence</Text>
        <View style={[styles.choix, { backgroundColor: c.surfaceDouce }]}>
          {[
            { valeur: "clair", texte: "Clair", icone: "sunny" },
            { valeur: "sombre", texte: "Sombre", icone: "moon" },
            { valeur: "auto", texte: "Auto", icone: "phone-portrait" },
          ].map((o) => (
            <Pressable
              key={o.valeur}
              style={[styles.choixBouton, mode === o.valeur && styles.choixBoutonActif]}
              onPress={() => setMode(o.valeur)}
            >
              <Ionicons name={o.icone} size={16} color={mode === o.valeur ? "#ffffff" : c.texteDoux} />
              <Text style={[styles.choixTexte, { color: mode === o.valeur ? "#ffffff" : c.texteDoux }]}>{o.texte}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* 6. à propos de moi (l'ancienne carte de profil) */}
      <View style={[styles.bloc, { backgroundColor: c.surface }]}>
        <Text style={[styles.titreBloc, { color: c.texte }]}>À propos de moi</Text>
        <View style={styles.tags}>
          {INTERETS.map((interet) => (
            <Tag key={interet} label={interet} />
          ))}
        </View>
        <InfoLigne label="Email" value="moi@ecole.fr" />
        <InfoLigne label="Ville" value="Toulon" />
        <InfoLigne label="École" value="ISEN Méditerranée" />
        <Text style={[styles.petit, { color: c.texteDoux, marginTop: 10 }]}>J'adore les Pokémon légendaires ✦</Text>
        <Pressable style={styles.bouton} onPress={() => Alert.alert("Contact", "moi@ecole.fr")}>
          <Text style={styles.boutonTexte}>Me contacter</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // ANCIEN (séance 2 à carte holo) :
  // container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f4f1ea", padding: 20 },
  // carte: { width: "100%", maxWidth: 380, backgroundColor: "#ffffff", borderRadius: 24, padding: 24, alignItems: "center", ... },
  // prefereTitre: { fontSize: 16, fontWeight: "bold", color: "#111827", marginTop: 18 },
  // prefereImage: { width: 120, height: 120 },
  // prefereNom: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  // nom: { fontSize: 24, fontWeight: "bold", color: "#111827" },
  // description: { fontSize: 14, color: "#6b7280", marginTop: 4, marginBottom: 14 },
  // contour: { borderWidth: 2, borderColor: "#2f5be7", borderStyle: "dashed", borderRadius: 14, padding: 3, marginTop: 18 },
  page: { padding: 16, paddingBottom: 40 },

  // la carte de Dresseuse
  cadre: { borderRadius: 22, padding: 6, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 8 },
  carteDresseur: { borderRadius: 17, padding: 16, overflow: "hidden", minHeight: 220 },
  ballFiligrane: { position: "absolute", right: -60, top: -60, width: 200, height: 200, borderRadius: 100, borderWidth: 14, borderColor: "rgba(255,255,255,0.12)", justifyContent: "center", alignItems: "center" },
  ballBande: { position: "absolute", left: 0, right: 0, height: 14, backgroundColor: "rgba(255,255,255,0.12)" },
  ballBouton: { width: 50, height: 50, borderRadius: 25, borderWidth: 12, borderColor: "rgba(255,255,255,0.12)" },
  partenaire: { position: "absolute", right: -18, bottom: 34, width: 150, height: 150, opacity: 0.95 },
  enteteCarte: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  petitTitre: { fontSize: 11, fontWeight: "900", letterSpacing: 2, color: "#fde68a" },
  identifiant: { fontSize: 11, fontWeight: "bold", color: "rgba(255,255,255,0.8)" },
  identite: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: { width: 78, height: 78, borderRadius: 39, borderWidth: 3, borderColor: "#fde68a" },
  identiteTexte: { flex: 1, paddingRight: 60 },
  nomDresseur: { fontSize: 22, fontWeight: "900", color: "#ffffff", textShadowColor: "rgba(0,0,0,0.4)", textShadowRadius: 4 },
  infoDresseur: { fontSize: 13, color: "rgba(255,255,255,0.9)" },
  partenaireTexte: { fontSize: 12, fontWeight: "bold", color: "#fde68a", marginTop: 4 },
  chiffres: { flexDirection: "row", gap: 8, marginTop: 16 },
  chiffre: { flex: 1, backgroundColor: "rgba(0,0,0,0.25)", borderRadius: 12, paddingVertical: 8, alignItems: "center" },
  chiffreValeur: { fontSize: 20, fontWeight: "900", color: "#ffffff" },
  chiffreTexte: { fontSize: 11, color: "rgba(255,255,255,0.85)" },

  // les blocs en dessous
  bloc: { borderRadius: 18, padding: 16, marginBottom: 14 },
  ligne: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  titreBloc: { fontSize: 18, fontWeight: "900", marginBottom: 6 },
  pourcent: { fontSize: 22, fontWeight: "900" },
  barreFond: { height: 12, borderRadius: 6, overflow: "hidden", marginVertical: 6 },
  barre: { height: 12, borderRadius: 6 },
  petit: { fontSize: 12 },
  badges: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 14 },
  badge: { width: "31%", alignItems: "center" },
  badgeRond: { width: 52, height: 52, borderRadius: 26, borderWidth: 3, alignItems: "center", justifyContent: "center" },
  badgeNom: { fontSize: 13, fontWeight: "bold", marginTop: 4 },
  badgeCompte: { fontSize: 11 },
  equipe: { flexDirection: "row", justifyContent: "space-between", marginTop: 6 },
  equipePlace: { width: "15%", aspectRatio: 1, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  equipeImage: { width: "90%", height: "90%" },
  choix: { flexDirection: "row", borderRadius: 14, padding: 4, marginTop: 4 },
  choixBouton: { flex: 1, flexDirection: "row", gap: 6, alignItems: "center", justifyContent: "center", paddingVertical: 8, borderRadius: 10 },
  choixBoutonActif: { backgroundColor: "#e3350d" },
  choixTexte: { fontWeight: "bold" },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 10 },
  bouton: { backgroundColor: "#2f5be7", paddingVertical: 12, borderRadius: 12, alignItems: "center", marginTop: 14 },
  boutonTexte: { color: "#ffffff", fontWeight: "bold", fontSize: 16 },
});
