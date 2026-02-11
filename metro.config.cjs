const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.unstable_enableSymlinks = true;
config.resolver.unstable_enablePackageExports = true;

config.resolver.sourceExts = [...config.resolver.sourceExts, "sql"];
config.transformer.babelTransformerPath = require.resolve("./sql-transformer.cjs");

module.exports = config;
