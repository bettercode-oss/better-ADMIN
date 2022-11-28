import React from 'react';
import {Text} from "./index";

export default {
  title: 'atoms/Typography/Text',
};

const Template = (args) => <Text {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: '기본 Text 입니다.'
};

export const Secondary = Template.bind({});
Secondary.args = {
  type: 'secondary',
  children: 'Secondary Text 입니다.'
};

export const Success = Template.bind({});
Success.args = {
  type: 'success',
  children: 'Success Text 입니다.'
};

export const Warning = Template.bind({});
Warning.args = {
  type: 'warning',
  children: 'Warning Text 입니다.'
};

export const Danger = Template.bind({});
Danger.args = {
  type: 'danger',
  children: 'Danger Text 입니다.'
};

