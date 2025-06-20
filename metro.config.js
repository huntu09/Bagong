const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config")

const defaultConfig = getDefaultConfig(__dirname)

const config = {
  transformer: {
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
  },
  resolver: {
    assetExts: defaultConfig.resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...defaultConfig.resolver.sourceExts, "svg"],
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
}

module.exports = mergeConfig(defaultConfig, config)
