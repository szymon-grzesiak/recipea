import React from "react";
import { Stack } from "expo-router";
import GlobalProvider from "../context/GlobalProvider";

const RootLayout = () => {
  return (
    <GlobalProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#89cff0",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerBackTitle: "Back"
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="search/[query]" options={{ headerShown: false }} />
        <Stack.Screen name="edit/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="info/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="license"  />
      </Stack>
    </GlobalProvider>
  );
};

export default RootLayout;
