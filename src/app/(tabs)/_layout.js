import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    // ANCIEN (séance 5) : <Tabs>
    // le haut en rouge Poké Ball et l'onglet choisi en rouge
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: "#e3350d" },
        headerTintColor: "#ffffff",
        tabBarActiveTintColor: "#e3350d",
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
