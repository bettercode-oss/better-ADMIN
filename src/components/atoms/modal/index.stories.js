import React from 'react';
import {Modal} from "./index";
import {Form} from "../form";
import {TextInput} from "../text-input";
import {UserOutlined} from "@ant-design/icons";
import {FormItem} from "../form/form-item";
import {Button} from "../button";

export default {
  title: 'atoms/Modal',
};

const Template = (args) => <Modal {...args} />;

export const FooterNotUsed = Template.bind({});
FooterNotUsed.args = {
  title: '기본 Footer를 사용하지 않고 Modal 에 Form 사용 예시',
  open: true,
  footer: null,
  children: <Form onFinish={(values) => {window.alert("입력 값" + values.id)}}>
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
    <FormItem>
      <Button label="신청" type="primary" htmlType="submit"/>
    </FormItem>
  </Form>
};
