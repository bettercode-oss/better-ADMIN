import React from 'react';
import { BtnRegist, BtnDown, BtnDelete, BtnRefresh, BtnSearch } from './index';

export default {
  title: 'atoms/button',
  component: BtnRegist,
  argTypes: {
    size: { options: ['small', 'medium', 'large'], control: { type: 'radio' } },
  },
 /*  decorators: [
    (Story) => (
      <div style={{ margin: '1em' }}>
        <Story/>
      </div>
    ),
  ], */
};

const TempA = (args) => <BtnRegist {...args} tooltip={args.tooltip} />;
const TempB = (args) => <BtnDown {...args} tooltip={args.tooltip} />;
const TempC = (args) => <BtnDelete {...args} tooltip={args.tooltip} />;
const TempD = (args) => <BtnRefresh {...args} tooltip={args.tooltip} />;
const TempE = (args) => <BtnSearch {...args} tooltip={args.tooltip} />;

export const Registration = TempA.bind({});
Registration.args = {
  type: 'primary',
  label: '등록',
  size: 'medium',
};

export const Download = TempB.bind({});
Download.args = {
  type: 'default',
  label: '다운로드',
  size: 'medium'
};

export const Delete = TempC.bind({});
Delete.args = {
  type: 'default',
  label: '삭제',
  size: 'medium'
};

export const Refresh = TempD.bind({});
Refresh.args = {
  type: 'default',
  label: '초기화',
  size: 'medium'
};

export const Search = TempE.bind({});
Search.args = {
  type: 'dark',
  label: '검색',
  size: 'medium'
};
