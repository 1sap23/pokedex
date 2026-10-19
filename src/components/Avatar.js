import { Image } from "react-native";

export default function Avatar({ uri, size = 100 }) {
  return (
    <Image
      source={{ uri }}
      style={{ width: size, height: size, borderRadius: size / 2, marginBottom: 12 }}
    />
  );
}