import React from 'react';
import {TextInput} from "./index";
import {UserOutlined} from '@ant-design/icons';

export default {
  title: 'atoms/TextInput',
};

const Template = (args) => <TextInput {...args} />;

export const Default = Template.bind({});
Default.args = {
};

export const Placeholder = Template.bind({});
Placeholder.args = {
  placeholder: '이곳에 입력하세요'
};

export const PasswordType = Template.bind({});
PasswordType.args = {
  type: 'password',
};

export const Prefix = Template.bind({});
Prefix.args = {
  prefix: <UserOutlined/>
};

export const Suffix = Template.bind({});
Suffix.args = {
  suffix: <UserOutlined/>
};

export const DefaultValue = Template.bind({});
DefaultValue.args = {
  defaultValue: '기본 값을 넣을 수 있어요'
};

