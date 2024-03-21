import {
  View,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { pokeapi } from "@/api/pokeapi";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";

const Page = () => {
  const query = useQuery({ queryKey: ["pokemons"], queryFn: pokeapi });

  // The old way of fetching data without using Tanstack React Query
  // const [pokemons, setPokemons] = useState<PokemonWithImage[]>([]);
  // useEffect(() => {
  //   const load = async (): Promise<void> => {
  //     const pokedata = await pokeapi();
  //     setPokemons(pokedata);
  //   };
  //   load();
  // }, []);
  return (
    <ScrollView>
      {query.isLoading && <ActivityIndicator style={{ marginTop: 30 }} />}
      {query.data &&
        query.data.map((poke) => (
          <Link key={poke.id} href={`/${poke.id}`} asChild>
            <TouchableOpacity>
              <View style={styles.pokeWrapper}>
                <Image style={styles.image} source={{ uri: poke.imageUri }} />
                <Text style={styles.pokeName}>{poke.name}</Text>
                <AntDesign name="caretright" size={24} color="black" />
              </View>
            </TouchableOpacity>
          </Link>
        ))}
      {/* <Text>{JSON.stringify(pokemons)}</Text> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  pokeWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  image: {
    height: 100,
    width: 100,
  },
  pokeName: {},
});

export default Page;
