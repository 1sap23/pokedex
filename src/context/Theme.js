import { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// thème : toutes les couleurs qui changent entre le mode clair et le mode sombre.
// les pages ne disent plus "#ffffff", elles disent couleurs.surface.
const CLAIR = {
  fond: "#f3f4f6", // le fond des pages
  surface: "#ffffff", // les cartes, les blocs, les champs
  surfaceDouce: "#e5e7eb", // les fonds gris (onglets, places vides)
  texte: "#111827",
  texteDoux: "#6b7280",
  bordure: "#d1d5db",
  barre: "#ffffff", // la barre d'onglets en bas
};

const SOMBRE = {
  fond: "#0f172a",
  surface: "#1e293b",
  surfaceDouce: "#334155",
  texte: "#f1f5f9",
  texteDoux: "#94a3b8",
  bordure: "#475569",
  barre: "#111827",
};

const ThemeContext = createContext(null);
const CLE = "theme";

export function ThemeProvider({ children }) {
  // "auto" : on suit le réglage du téléphone
  const [mode, setModeState] = useState("auto");
  // ce que le téléphone demande : "light" ou "dark"
  const systeme = useColorScheme();

  // on relit le choix sauvegardé au démarrage
  async function lire() {
    const texte = await AsyncStorage.getItem(CLE);
    if (texte !== null) {
      setModeState(texte);
    }
  }

  useEffect(() => {
    lire();
  }, []);

  // changer de mode, et le sauvegarder
  function setMode(nouveau) {
    setModeState(nouveau);
    AsyncStorage.setItem(CLE, nouveau);
  }

  const sombre = mode === "sombre" || (mode === "auto" && systeme === "dark");
  const couleurs = sombre ? SOMBRE : CLAIR;

  return (
    <ThemeContext.Provider value={{ mode, setMode, sombre, couleurs }}>
      {children}
    </ThemeContext.Provider>
  );
}

// raccourci : const { couleurs, sombre } = useTheme();
export function useTheme() {
  return useContext(ThemeContext);
}
