import { Stack } from "expo-router";
import { CollectionProvider } from "../context/Collection";
import { ThemeProvider, useTheme } from "../context/Theme";

export default function RootLayout() {
  return (
    // ANCIEN (séance 2 à 4) : les deux écrans directement dans la pile
    // <Stack>
    //   <Stack.Screen name="index" options={{ title: "Pokédex" }} />
    //   <Stack.Screen name="profil" options={{ title: "Ma carte" }} />
    // </Stack>
    // ANCIEN (séance 5 et 6) : <Stack>
    // phase 3 : CollectionProvider entoure toute l'app,
    // tous les écrans partagent les mêmes captures, favoris et équipe
    // thème : ThemeProvider entoure tout, pour le mode clair / sombre
    <ThemeProvider>
      <CollectionProvider>
        <Pile />
      </CollectionProvider>
    </ThemeProvider>
  );
}

// la pile d'écrans est dans un petit composant à part :
// useTheme() ne marche qu'à l'intérieur du ThemeProvider
function Pile() {
  const { couleurs: c } = useTheme();
  return (
    // la fiche aussi a le haut en rouge Poké Ball
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#e3350d" },
        headerTintColor: "#ffffff",
        contentStyle: { backgroundColor: c.fond }, // le fond derrière les écrans
      }}
    >
      {/* title : le texte du bouton retour de la fiche (avant, on lisait "(tabs)") */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false, title: "Retour" }} />
    </Stack>
  );
}
