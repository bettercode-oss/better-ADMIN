const fs = require("fs");
const CracoLessPlugin = require('craco-less');
const {getThemeVariables} = require('antd/dist/theme');
const themeConfig = JSON.parse(fs.readFileSync('./src/config/theme.config.json', 'utf-8'));

if (themeConfig.dark) {
  module.exports = {
    plugins: [
      {
        plugin: CracoLessPlugin,
        options: {
          lessLoaderOptions: {
            lessOptions: {
              modifyVars: getThemeVariables({
                dark: true,
                compact: themeConfig.compact,
              }),
              javascriptEnabled: true,
            },
          },
        },
      },
    ],
  };
} else {
  module.exports = {
    plugins: [
      {
        plugin: CracoLessPlugin,
        options: {
          lessLoaderOptions: {
            lessOptions: {
              modifyVars: {'@primary-color': '#5B71F3'},
              javascriptEnabled: true,
            },
          },
        },
      },
    ],
  };
}



