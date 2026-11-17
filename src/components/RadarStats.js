import Svg, { Polygon, Line, Text as SvgText } from "react-native-svg";

// carte holo : les 6 stats dessinées en hexagone, comme dans les jeux
const NOMS = ["PV", "Atq", "Déf", "Vit", "D.Spé", "A.Spé"];
// l'ordre des stats autour de l'hexagone (index dans pokemon.stats)
// pokemon.stats = PV, Attaque, Défense, Atq.Spé, Déf.Spé, Vitesse
const ORDRE = [0, 1, 2, 5, 4, 3];
const MAX = 180; // au-dessus, la pointe touche le bord

export default function RadarStats({ stats, color, taille = 150 }) {
  const centre = taille / 2;
  const rayon = taille / 2 - 22; // on garde de la place pour les noms

  // le point numéro i, à une distance r du centre
  // on commence en haut (-90°) et on tourne de 60° à chaque fois
  function point(i, r) {
    const angle = ((-90 + i * 60) * Math.PI) / 180;
    return [centre + r * Math.cos(angle), centre + r * Math.sin(angle)];
  }

  // un hexagone complet à une certaine distance, en texte "x,y x,y ..."
  function hexagone(r) {
    return [0, 1, 2, 3, 4, 5].map((i) => point(i, r).join(",")).join(" ");
  }

  // le polygone des vraies valeurs
  const valeurs = ORDRE.map((index, i) => {
    const v = Math.min(stats[index].base_stat, MAX);
    return point(i, (v / MAX) * rayon).join(",");
  }).join(" ");

  return (
    <Svg width={taille} height={taille}>
      {/* les 3 hexagones de fond */}
      {[1, 0.66, 0.33].map((k) => (
        <Polygon key={k} points={hexagone(rayon * k)} fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.5)" strokeWidth={1} />
      ))}
      {/* les 6 rayons */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const [x, y] = point(i, rayon);
        return <Line key={i} x1={centre} y1={centre} x2={x} y2={y} stroke="rgba(255,255,255,0.4)" strokeWidth={1} />;
      })}
      {/* les valeurs du Pokémon */}
      <Polygon points={valeurs} fill={color} fillOpacity={0.7} stroke="#ffffff" strokeWidth={2} />
      {/* les noms autour */}
      {NOMS.map((nom, i) => {
        const [x, y] = point(i, rayon + 13);
        return (
          <SvgText key={nom} x={x} y={y + 4} fontSize={10} fontWeight="bold" fontFamily="Arial" fill="#ffffff" textAnchor="middle">
            {nom}
          </SvgText>
        );
      })}
    </Svg>
  );
}
