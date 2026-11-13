import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    // ANCIEN (séance 2 à 4) : les deux écrans directement dans la pile
    // <Stack>
    //   <Stack.Screen name="index" options={{ title: "Pokédex" }} />
    //   <Stack.Screen name="profil" options={{ title: "Ma carte" }} />
    // </Stack>
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
