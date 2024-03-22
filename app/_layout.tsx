import { Link, Stack } from "expo-router";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const Layout = () => {
  const queryChient = new QueryClient();
  return (
    <QueryClientProvider client={queryChient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: "#f4511e" },
            headerTintColor: "#fee",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              title: "Pokemon",
              headerRight: () => (
                <Link href={`/favorites`} asChild>
                  <TouchableOpacity>
                    <AntDesign name="heart" size={24} color="#fee" />
                  </TouchableOpacity>
                </Link>
              ),
            }}
          />
          <Stack.Screen name="(pokemon)/[id]" options={{ title: "" }} />
          <Stack.Screen
            name="favorites"
            options={{ title: "Favorites", presentation: "modal" }}
          />
        </Stack>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
};

export default Layout;
