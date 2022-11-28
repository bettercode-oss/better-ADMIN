import React from 'react';
import {UserOutlined} from '@ant-design/icons';
import {TextInput} from "../text-input";
import {Button} from "../button";
import {Form} from "antd";
import {FormItem} from "./form-item";
export default {
  title: 'atoms/Form',
};

const Template = (args) => <Form {...args} />;

export const SimpleForm = Template.bind({});
SimpleForm.args = {
  onFinish: (values) => {
    alert("id value: " + values.id);
  },
  children: <>
    <FormItem
      name="id"
      rules={[
        {
          required: true,
          message: '아이디를 입력해 주세요.',
        },
      ]}
    >
      <TextInput prefix={<UserOutlined/>} placeholder="아이디"/>
    </FormItem>
    <Form.Item>
      <Button label="Submit" type="primary" htmlType="submit"/>
    </Form.Item>
  </>
};