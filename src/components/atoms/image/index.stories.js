import React from 'react';
import {Image} from "./index";

export default {
  title: 'atoms/Image',
};

const Template = (args) => <Image {...args} />;

export const SimpleImage = Template.bind({});
SimpleImage.args = {
  alt: 'bettercode logo',
  src: 'https://user-images.githubusercontent.com/16472109/204207299-799ee249-2494-4c3a-b572-62a73e276989.png',
  width: 200
};

export const PreviewImage = Template.bind({});
PreviewImage.args = {
  alt: 'bettercode logo',
  src: 'https://user-images.githubusercontent.com/16472109/204207299-799ee249-2494-4c3a-b572-62a73e276989.png',
  width: 200,
  preview: true
};
