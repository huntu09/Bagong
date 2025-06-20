module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    [
      "module-resolver",
      {
        root: ["./src"],
        alias: {
          "@": "./src",
          "@components": "./src/components",
          "@screens": "./src/screens",
          "@hooks": "./src/hooks",
          "@services": "./src/services",
          "@constants": "./src/constants",
          "@types": "./src/types",
          "@utils": "./src/utils",
        },
      },
    ],
    "react-native-reanimated/plugin",
  ],
}
