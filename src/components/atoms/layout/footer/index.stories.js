import React from 'react';
import {Footer} from "./index";

export default {
  title: 'atoms/Layout/Footer',
};

const Template = (args) => <Footer {...args} />;

export const BasicFooter = Template.bind({});
BasicFooter.args = {
  children: '푸터 영역입니다.'
};

export const TextAlignFooter = Template.bind({});
TextAlignFooter.args = {
  textAlign: "right",
  children: '푸터 영역입니다.'
};
