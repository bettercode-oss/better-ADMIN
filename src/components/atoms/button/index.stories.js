import React from 'react';
import {Button} from "./index";
import {UserOutlined} from '@ant-design/icons';

export default {
  title: 'atoms/Button',
};

const Template = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: 'Default Button'
};

export const Primary = Template.bind({});
Primary.args = {
  label: 'Primary Button',
  type: 'primary'
};

export const Dashed = Template.bind({});
Dashed.args = {
  label: 'Dashed Button',
  type: 'dashed'
};

export const Link = Template.bind({});
Link.args = {
  label: 'Link Button',
  type: 'link'
};

export const PrimaryWithDanger = Template.bind({});
PrimaryWithDanger.args = {
  label: 'Danger Button',
  type: 'primary',
  danger: true
};

export const Loading = Template.bind({});
Loading.args = {
  label: 'Loading Button',
  type: 'primary',
  loading: true
};

export const Icon = Template.bind({});
Icon.args = {
  label: 'Icon Button',
  type: 'primary',
  icon: <UserOutlined/>
};


