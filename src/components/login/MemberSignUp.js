import React, {useState} from "react";
import {Button, Form, Input, Modal, message} from "antd";
import {LockOutlined, UserOutlined, FormOutlined} from "@ant-design/icons";
import {MemberService} from "../settings/member/member.service";

const MemberSignUp = ({show, onClose}) => {
  const [loading, setLoading] = useState(false);

  const signUp = (values) => {
    const signUpMember = {
      signId: values.id,
      name: values.name,
      password: values.password,
    }

    setLoading(true);
    MemberService.signUpMember(signUpMember).then(() => {
      setLoading(false);
      message.success("신청되었습니다.");
    }).catch(error => {
      if (error.response && error.response.status === 400 && error.response.data === "duplicated") {
        message.warn("이미 존재하는 아이디입니다.")
      }
    }).finally(() => {
      setLoading(false);
    });
  }

  return (
    <>
      <Modal title={[<div key={1}>계정 신청</div>]} visible={show} onCancel={onClose} footer={null} width={400}>
        <Form
          onFinish={signUp}
        >
          <Form.Item
            name="id"
            rules={[
              {
                required: true,
                message: '아이디를 입력해 주세요.',
              },
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="아이디"/>
          </Form.Item>
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: '이름을 입력해 주세요.',
              },
            ]}
          >
            <Input prefix={<FormOutlined className="site-form-item-icon"/>} placeholder="이름"/>
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: '비밀번호를 입력해 주세요.',
              },
            ]}
          >
            <Input.Password prefix={<LockOutlined className="site-form-item-icon"/>} placeholder="비밀번호"/>
          </Form.Item>
          <Form.Item
            name="confirm"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: '비밀번호를 다시 한번 입력해 주세요.',
              },
              ({getFieldValue}) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject('입력한 비밀번호와 다릅니다. 동일하게 입력해주세요.');
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined className="site-form-item-icon"/>} placeholder="비밀번호 확인"/>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button" loading={loading}>
              계정 신청
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
export default MemberSignUp;
