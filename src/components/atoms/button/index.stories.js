import React from 'react';
import {Button} from './index';

export default {
  title: 'atoms/Button',
  component: Button,
  argTypes: {
    // text: { defaultValue: 'button!!!', control: 'text' },
    size: { options: ['small','medium','large'], control: { type: 'radio' } },
    type: {options: ['primary','default','dashed','link','text'], control: {type: 'select'}},
    // className: { control: 'className' },
    // color: { defaultValue: '#abd', control: 'color' },
  },
};

const Template = (args) => <Button {...args} tooltipTitle={args.tooltip}/>;

export const Primary = Template.bind({});

Primary.args = {
  type: 'primary',
  label: 'Button',
  size: 'medium'
};
