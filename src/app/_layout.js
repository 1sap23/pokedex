import { Stack } from "expo-router";
import { CollectionProvider } from "../context/Collection";

export default function RootLayout() {
  return (
    // ANCIEN (séance 2 à 4) : les deux écrans directement dans la pile
    // <Stack>
    //   <Stack.Screen name="index" options={{ title: "Pokédex" }} />
    //   <Stack.Screen name="profil" options={{ title: "Ma carte" }} />
    // </Stack>
    // ANCIEN (séance 5 et 6) : <Stack>
    // la fiche aussi a le haut en rouge Poké Ball
    // phase 3 : CollectionProvider entoure toute l'app,
    // tous les écrans partagent les mêmes captures, favoris et équipe
    <CollectionProvider>
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#e3350d" },
        headerTintColor: "#ffffff",
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
    </CollectionProvider>
  );
}
