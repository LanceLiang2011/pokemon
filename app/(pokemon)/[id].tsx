import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { pokeDetailApi } from "@/api/pokeapi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";

const PokeDetailPage = () => {
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const navigation = useNavigation();

  const toggleFavorite = useCallback(() => {
    AsyncStorage.setItem(`favoriate-${id}`, isFavorite ? "false" : "true");
    setIsFavorite((cur) => !cur);
  }, [isFavorite, id, AsyncStorage]);

  const { data, isLoading } = useQuery({
    queryKey: ["pokemon", id],
    queryFn: () => pokeDetailApi(id),
    refetchOnMount: false,
  });
  useEffect(() => {
    if (data) {
      navigation.setOptions({
        title: data.name[0].toUpperCase() + data.name.slice(1),
      });
    }
  }, [data]);
  /** Old way of fetching data
  const [pokemon, setPokemon] = useState<Pokemon>();
  useEffect(() => {
    const load = async () => {
      const data = await pokeDetailApi(id);
      setPokemon(data);
      navigation.setOptions({
        title: data.name[0].toUpperCase() + data.name.slice(1),
      });
    };
    load();
  }, [id]);
*/
  useEffect(() => {
    const load = async () => {
      const storedFavorite = await AsyncStorage.getItem(`favoriate-${id}`);
      if (storedFavorite === "true") setIsFavorite(true);
    };
    load();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={toggleFavorite}>
          <AntDesign
            name={isFavorite ? "star" : "staro"}
            size={24}
            color="black"
          />
        </Pressable>
      ),
    });
  }, [isFavorite, toggleFavorite]);
  return (
    <View>
      {isLoading && <ActivityIndicator style={{ marginTop: 30 }} />}
      {data && (
        <>
          <View style={[styles.card, { alignItems: "center" }]}>
            <Image
              source={{ uri: data.sprites.front_default }}
              style={styles.image}
            />
            <Text style={styles.pokeName}>
              {data.id} - {data.name}
            </Text>
          </View>
          <View style={styles.card}>
            {data.stats.map((statGroup: any) => (
              <Text key={statGroup.stat.url}>
                {statGroup.stat.name} : {statGroup.base_stat}
              </Text>
            ))}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 10,
    margin: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 1,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
  image: {
    height: 150,
    width: 150,
  },
  pokeName: {
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
});

export default PokeDetailPage;
