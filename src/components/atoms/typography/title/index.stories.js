import React from 'react';
import {Title} from "./index";

export default {
  title: 'atoms/Typography/Title',
};

const Template = (args) => <Title {...args} />;

export const Level1 = Template.bind({});
Level1.args = {
  level: 1,
  children: '가장 큰 타이틀 입니다.'
};

export const Level2 = Template.bind({});
Level2.args = {
  level: 2,
  children: '두 번째로 큰 타이틀 입니다.'
};

export const Level3 = Template.bind({});
Level3.args = {
  level: 3,
  children: '세 번째로 큰 타이틀 입니다.'
};



