import { View, Text, Image, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { pokeDetailApi, Pokemon } from "@/api/pokeapi";

const TestPage = () => {
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const [pokemon, setPokemon] = useState<Pokemon>();
  const navigation = useNavigation();
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
