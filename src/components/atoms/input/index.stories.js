import React from 'react';
import { Input } from './index';

export default {
  title: 'atoms/input',
  component: Input,
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

const Tempelate = (args) => <Input {...args} />;

export const Default = Tempelate.bind({});
Default.args = {
  type: 'primary',
  holder: '입력하세요',
  size: 'medium',
};
