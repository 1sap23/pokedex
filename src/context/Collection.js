import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// phase 3 : la collection est partagée par tous les écrans (Context)
// et sauvegardée dans le téléphone (AsyncStorage), elle reste après fermeture.

const CollectionContext = createContext(null);

// le nom sous lequel on range la collection dans le téléphone
const CLE = "collection";

export function CollectionProvider({ children }) {
  const [captured, setCaptured] = useState([]); // des numéros
  const [favoris, setFavoris] = useState([]); // des { number, name, types }
  const [equipe, setEquipe] = useState([]); // 6 { number, name, types } au plus
  // tant que la sauvegarde n'est pas relue, on ne doit pas l'écraser
  const [charge, setCharge] = useState(false);

  // 1. à l'ouverture de l'app, on relit la sauvegarde
  async function lire() {
    const texte = await AsyncStorage.getItem(CLE);
    if (texte !== null) {
      // la sauvegarde est un texte JSON, on le retransforme en objet
      const data = JSON.parse(texte);
      setCaptured(data.captured);
      setFavoris(data.favoris);
      setEquipe(data.equipe);
    }
    setCharge(true);
  }

  useEffect(() => {
    lire();
  }, []);

  // 2. à chaque changement, on sauvegarde tout en texte JSON
  useEffect(() => {
    if (charge) {
      AsyncStorage.setItem(CLE, JSON.stringify({ captured, favoris, equipe }));
    }
  }, [captured, favoris, equipe, charge]);

  // capturer ou relâcher (même code qu'avant dans index.js)
  function toggleCapture(number) {
    if (captured.includes(number)) {
      setCaptured(captured.filter((n) => n !== number));
    } else {
      setCaptured([...captured, number]);
    }
  }

  function estFavori(number) {
    return favoris.some((p) => p.number === number);
  }

  function toggleFavori(pokemon) {
    if (estFavori(pokemon.number)) {
      setFavoris(favoris.filter((p) => p.number !== pokemon.number));
    } else {
      setFavoris([...favoris, pokemon]);
    }
  }

  function estDansEquipe(number) {
    return equipe.some((p) => p.number === number);
  }

  function toggleEquipe(pokemon) {
    if (estDansEquipe(pokemon.number)) {
      setEquipe(equipe.filter((p) => p.number !== pokemon.number));
    } else if (equipe.length < 6) {
      // une équipe, c'est 6 Pokémon au maximum
      setEquipe([...equipe, pokemon]);
    }
  }

  // tout ce que les écrans peuvent utiliser
  const valeur = {
    captured,
    toggleCapture,
    favoris,
    estFavori,
    toggleFavori,
    equipe,
    estDansEquipe,
    toggleEquipe,
  };

  return <CollectionContext.Provider value={valeur}>{children}</CollectionContext.Provider>;
}

// raccourci pour les écrans : const { captured } = useCollection();
export function useCollection() {
  return useContext(CollectionContext);
}
