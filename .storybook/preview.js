import 'antd/dist/antd.less';
// import styled from "styled-components";
import '../src/styles/main.less';
import { GlobalStyle } from '../src/shared/global';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}