import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    // ANCIEN (séance 2 à 4) : les deux écrans directement dans la pile
    // <Stack>
    //   <Stack.Screen name="index" options={{ title: "Pokédex" }} />
    //   <Stack.Screen name="profil" options={{ title: "Ma carte" }} />
    // </Stack>
    // ANCIEN (séance 5 et 6) : <Stack>
    // la fiche aussi a le haut en rouge Poké Ball
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#e3350d" },
        headerTintColor: "#ffffff",
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
