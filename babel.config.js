module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@app": "./app",
            "@src": "./src",
            "@components": "./src/components",
            "@styles": "./src/styles",
            "@utils": "./src/utils",
            "@hooks": "./src/hooks",
            "@context": "./src/context",
          },
        },
      ],
       "react-native-worklets/plugin",
    ],
  };
};
