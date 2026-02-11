const upstreamTransformer = require("@expo/metro-config/babel-transformer");

module.exports.transform = async ({ src, filename, options }) => {
  if (filename.endsWith(".sql")) {
    return upstreamTransformer.transform({
      src: `export default ${JSON.stringify(src)};`,
      filename,
      options,
    });
  }
  return upstreamTransformer.transform({ src, filename, options });
};
