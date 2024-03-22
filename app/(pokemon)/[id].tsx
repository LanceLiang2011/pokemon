import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import Animated, {
  FadeIn,
  FlipInEasyX,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import React, { useState, useEffect, useCallback } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { pokeDetailApi } from "@/api/pokeapi";
import { storage } from "@/api/mmkv";
import { AntDesign } from "@expo/vector-icons";

const PokeDetailPage = () => {
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const [isFavorite, setIsFavorite] = useState<boolean>(
    storage.getBoolean(`favoriate-${id}`) || false
  );
  const navigation = useNavigation();

  const toggleFavorite = useCallback(() => {
    storage.set(`favoriate-${id}`, !isFavorite);
    if (isFavorite) storage.delete(`favoriate-${id}`);
    setIsFavorite((cur) => !cur);
  }, [isFavorite, id, storage]);

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

  /** old way of getting AsyncStorage
   useEffect(() => {
    const load = async () => {
      const storedFavorite = await AsyncStorage.getItem(`favoriate-${id}`);
      if (storedFavorite === "true") setIsFavorite(true);
    };
    load();
  }, []);
 */

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

  const width = useSharedValue(200);
  const handlePress = () => {
    width.value = withSpring(width.value + 80);
  };
  return (
    <View>
      {isLoading && <ActivityIndicator style={{ marginTop: 30 }} />}
      {data && (
        <>
          <Pressable onPress={handlePress}>
            <Animated.View
              style={[
                styles.card,
                { alignItems: "center" },
                { width, alignSelf: "center" },
              ]}
              entering={FadeIn.delay(200)}
            >
              <Image
                source={{ uri: data.sprites.front_default }}
                style={styles.image}
              />
              <Animated.Text
                style={styles.pokeName}
                entering={FlipInEasyX.delay(300)}
              >
                {data.id} - {data.name}
              </Animated.Text>
            </Animated.View>
          </Pressable>

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
