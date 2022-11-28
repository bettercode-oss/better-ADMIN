import 'antd/dist/antd.less';
import { GlobalStyle } from '../src/shared/global';
import { addDecorator } from "@storybook/react";
import { themes } from '@storybook/theming';
import { withThemesProvider } from "storybook-addon-styled-component-theme";
import { ThemeProvider } from "styled-components";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  backgrounds: {
    values: [
      { name: 'light', value: '#fff' },
      { name: 'dark', value: '#212526' },
    ],
  },
}

export const decorators = [
  (Story, context) => (
    <ThemeProvider theme={themes}>
      <GlobalStyle />
      <Story {...context} />
    </ThemeProvider>
  ),
];

const defaultTheme = {
  name: "DEFAULT",
  backgroundColor: "white",
  textColor: "dimgrey",
  borderRadius: "30px"
};

const darkTheme = {
  name: "DARK",
  backgroundColor: "black",
  textColor: "seashell",
  borderRadius: "100px"
};

export const getAllThemes = () => {
  return [defaultTheme, darkTheme];
};

addDecorator(withThemesProvider(getAllThemes(), ThemeProvider));