import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "../../global.css";
import { useEffect } from "react";
import { clearVideoCache } from "../utils/clearCache";
const queryClient = new QueryClient();

export default function RootLayout() {
  useEffect(() => {
    clearVideoCache()
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }} />
    </QueryClientProvider>
  );
}
