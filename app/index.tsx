import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { PokemonWithImage, pokeapi } from "@/api/pokeapi";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";

const PokeRow = ({ poke }: { poke: PokemonWithImage }) => (
  <Link href={`/${poke.id}`} asChild>
    <TouchableOpacity>
      <View style={styles.pokeWrapper}>
        <Image style={styles.image} source={{ uri: poke.imageUri }} />
        <Text style={styles.pokeName}>{poke.name}</Text>
        <AntDesign name="caretright" size={24} color="black" />
      </View>
    </TouchableOpacity>
  </Link>
);

const Page = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["pokemons"],
    queryFn: pokeapi,
  });

  const renderItem: ListRenderItem<PokemonWithImage> = ({
    item,
  }: {
    item: PokemonWithImage;
  }) => <PokeRow poke={item} />;

  const Seperator = () => (
    <View style={{ height: 1, width: "100%", backgroundColor: "gray" }} />
  );
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
    <View style={{ flex: 1 }}>
      {isLoading && <ActivityIndicator style={{ marginTop: 30 }} />}
      {data && (
        <FlashList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          estimatedItemSize={150}
          ItemSeparatorComponent={Seperator}
        />
      )}
    </View>
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
