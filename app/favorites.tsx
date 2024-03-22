import { StyleSheet, Text, View, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { storage } from "@/api/mmkv";
import { Pokemon, pokeDetailApi } from "@/api/pokeapi";
import { useQueries } from "@tanstack/react-query";
import { AntDesign } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { TouchableOpacity } from "react-native-gesture-handler";

const PokeRow = ({ poke, onPress }: { poke: Pokemon; onPress?: any }) => (
  <View style={styles.pokeWrapper}>
    <Image style={styles.image} source={{ uri: poke.sprites.front_default }} />
    <Text style={styles.pokeName}>{poke.name}</Text>
    <TouchableOpacity onPress={onPress}>
      <AntDesign name="delete" size={24} color="black" />
    </TouchableOpacity>
  </View>
);

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  useEffect(() => {
    setFavorites(storage.getAllKeys());
  }, [storage]);

  const results = useQueries({
    queries: favorites.map((fav) => {
      const id = fav.split("-")[1];
      return {
        queryKey: ["pokemon", id],
        queryFn: () => pokeDetailApi(id),
        refetchOnWindowFocus: true,
      };
    }),
  });
  const deleteFav = (id: string | undefined) => {
    if (id) storage.delete(`favoriate-${id}`);
    setFavorites((cur) => cur.filter((f: string) => f !== `favoriate-${id}`));
  };
  return (
    <View style={{ flex: 1 }}>
      {results.every((r) => r.isFetched) && (
        <FlashList
          data={results.map((r) => r.data)}
          renderItem={({ item }) => (
            <PokeRow poke={item!} onPress={() => deleteFav(item?.id)} />
          )}
          estimatedItemSize={30}
        />
      )}
    </View>
  );
};

export default FavoritesPage;

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
