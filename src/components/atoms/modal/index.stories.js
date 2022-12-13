import React from 'react';
import {Modal, SimpleModal} from "./index";

export default {
  title: 'atoms/Modal',
};

const SimpleModalTemplate = (args) => <SimpleModal {...args} />;

export const Simple = SimpleModalTemplate.bind({});
Simple.args = {
  title: '간단한 Modal',
  open: true,
  children: <><p>내용들...</p><p>내용들....</p></>
};

const BasicModalTemplate = (args) => <Modal {...args} />;

export const Basic = BasicModalTemplate.bind({});
Basic.args = {
  title: '기본 Modal',
  open: true,
  children: <><p>내용들...</p><p>내용들....</p></>
};