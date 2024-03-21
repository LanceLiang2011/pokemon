import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { pokeDetailApi, Pokemon } from "@/api/pokeapi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";

const TestPage = () => {
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const [pokemon, setPokemon] = useState<Pokemon>();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const navigation = useNavigation();

  const toggleFavorite = useCallback(() => {
    AsyncStorage.setItem(`favoriate-${id}`, isFavorite ? "false" : "true");
    setIsFavorite((cur) => !cur);
  }, [isFavorite, id, AsyncStorage]);

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
      {pokemon && (
        <>
          <View style={[styles.card, { alignItems: "center" }]}>
            <Image
              source={{ uri: pokemon.sprites.front_default }}
              style={styles.image}
            />
            <Text style={styles.pokeName}>
              {pokemon.id} - {pokemon.name}
            </Text>
          </View>
          <View style={styles.card}>
            {pokemon.stats.map((statGroup: any) => (
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

export default TestPage;
