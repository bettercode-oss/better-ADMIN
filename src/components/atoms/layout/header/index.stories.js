import React from 'react';
import {Header} from "./index";

export default {
  title: 'atoms/Layout/Header',
};

const Template = (args) => <Header {...args} />;

export const BasicHeader = Template.bind({});
BasicHeader.args = {
  children: '헤더 영역입니다.'
};

export const HeaderBackgroundColor = Template.bind({});
HeaderBackgroundColor.args = {
  backgroundColor: "#f90909",
  children: '헤더 영역입니다.'
};
