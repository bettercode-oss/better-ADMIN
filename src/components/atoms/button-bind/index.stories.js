import React from 'react';
import { Button } from './index';
import { SearchOutlined, DiffOutlined, DeleteOutlined, DownloadOutlined, ReloadOutlined } from '@ant-design/icons';

export default {
  title: 'atoms/button-bind',
  component: Button,
  argTypes: {
    size: { options: ['small', 'medium', 'large'], control: { type: 'radio' } },
    classname: {options: ['sub-default','sub-light','sub-dark'], control: {type: 'select'}},
    // type: {options: ['primary','dashed','text','link','disabled'], control: {type: 'select'}},
    // icon: {options; [<SearchOutlined/>,<DiffOutlined/>,<DeleteOutlined/>,<DownloadOutlined/>,<ReloadOutlined/>], control: {type: 'select'}},
  },
};

const Template = (args) => <Button {...args}  className={args.classname} icon={args.icon} type={args.type}/>;

export const Registration = Template.bind({});
Registration.args = {
  type: 'primary',
  label: '등록',
  size: 'medium',
  classname: 'sub-default',
  icon: <DiffOutlined/>,
};

export const Download = Template.bind({});
Download.args = {
  type: 'default',
  label: '다운로드',
  size: 'medium',
  classname: 'sub-light',
  icon: <DownloadOutlined/>,
};

export const Delete = Template.bind({});
Delete.args = {
  type: 'default',
  label: '삭제',
  size: 'medium',
  classname: 'sub-light',
  icon: <DeleteOutlined/>,
};

export const Refresh = Template.bind({});
Refresh.args = {
  type: 'default',
  label: '초기화',
  size: 'medium',
  classname: 'sub-light',
  icon: <ReloadOutlined/>,
};

export const Search = Template.bind({});
Search.args = {
  type: 'default',
  label: '검색',
  size: 'medium',
  classname: 'sub-dark',
  icon: <SearchOutlined/>,
};