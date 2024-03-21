import { Stack } from "expo-router";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
          <Stack.Screen name="index" options={{ title: "Pokemon" }} />
          <Stack.Screen name="(pokemon)/[id]" options={{ title: "" }} />
        </Stack>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
};

export default Layout;
