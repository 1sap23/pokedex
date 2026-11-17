import { Tabs } from "expo-router";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/Theme";

export default function TabsLayout() {
  // thème : les couleurs de la barre du bas et le bouton soleil / lune
  const { couleurs: c, sombre, setMode } = useTheme();

  return (
    // ANCIEN (séance 5) : <Tabs>
    // le haut en rouge Poké Ball et l'onglet choisi en rouge
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: "#e3350d" },
        headerTintColor: "#ffffff",
        tabBarActiveTintColor: "#e3350d",
        // thème : la barre du bas suit le mode clair / sombre
        tabBarInactiveTintColor: c.texteDoux,
        tabBarStyle: { backgroundColor: c.barre, borderTopColor: c.bordure },
        // thème : un bouton en haut à droite de chaque onglet
        headerRight: () => (
          <Pressable style={{ marginRight: 16 }} onPress={() => setMode(sombre ? "clair" : "sombre")}>
            <Ionicons name={sombre ? "sunny" : "moon"} size={22} color="#ffffff" />
          </Pressable>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Pokédex",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
      />
      {/* cartes : la collection des cartes holo */}
      <Tabs.Screen
        name="cartes"
        options={{
          title: "Cartes",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="albums" size={size} color={color} />
          ),
        }}
      />
      {/* phase 2 : le calculateur de types */}
      <Tabs.Screen
        name="combat"
        options={{
          title: "Combat",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="flash" size={size} color={color} />
          ),
        }}
      />
      {/* phase 3 : l'équipe et les favoris */}
      <Tabs.Screen
        name="equipe"
        options={{
          title: "Équipe",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favoris"
        options={{
          title: "Favoris",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
