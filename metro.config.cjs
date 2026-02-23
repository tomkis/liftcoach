const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts = [...config.resolver.sourceExts, "sql"];
config.transformer.babelTransformerPath = require.resolve("./sql-transformer.cjs");

module.exports = config;
