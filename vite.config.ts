import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: './',
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "react-native": "react-native-web",
      "react-native-safe-area-context": path.resolve(__dirname, "./src/mocks/SafeAreaContext.ts"),
      "react-native-screens": path.resolve(__dirname, "./src/mocks/Screens.ts"),
      "@react-native-async-storage/async-storage": path.resolve(__dirname, "./src/mocks/AsyncStorage.ts"),
    },
  },
  define: {
    global: 'globalThis',
  },
