import React from 'react';
import {Card} from "./index";

export default {
  title: 'atoms/Card',
};

const Template = (args) => <Card {...args} />;

export const SimpleCard = Template.bind({});
SimpleCard.args = {
  children: "간단한 카드 예시"
};
