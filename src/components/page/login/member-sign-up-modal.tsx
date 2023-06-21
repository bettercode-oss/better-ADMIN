import React, {useState} from "react";
import DefaultModal from "@/components/shared/ui/default-modal";
import {Button, Divider, Form, Input, message} from "antd";
import DefaultForm from "@/components/shared/form/ui/default-form";
import FormSection from "@/components/shared/form/ui/form-section";
import FormGroup from "@/components/shared/form/ui/form-group";
import {FormOutlined, LockOutlined, UserOutlined} from "@ant-design/icons";
import {ISignUpMember, signUpMember} from "@/client/member/member";
import {HTTPError} from "ky/distribution/errors/HTTPError";

interface IMemberSignUpModalProps {
  open: boolean,
  onHide: () => void;
}

const MemberSignUpModal = ({open, onHide}: IMemberSignUpModalProps) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleFinish = async (formValue: ISignUpMember) => {
    try {
      setIsLoading(true);
      await signUpMember(formValue);
      message.success("신청되었습니다.");
    } catch (error) {
      const err = error as HTTPError;
      if (err.response?.status === 400) {
        const permissionError = await err.response.json();
        if (permissionError?.message === "duplicated") {
          message.error("이미 존재하는 아이디입니다.");
        } else {
          message.error("잘못된 요청입니다.");
        }
      } else {
        message.error("에러가 발생했습니다");
      }
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  }

  const handleAfterClose = () => {
    form.resetFields();
  };

  return <DefaultModal title="계정 신청" open={open} handleHide={onHide} width={600} afterClose={handleAfterClose}>
    <DefaultForm<ISignUpMember> form={form} onFinish={handleFinish}>
      <FormSection title="계정 정보" description="계정 정보를 입력해주세요">
        <FormGroup title="아이디*">
          <Form.Item name="signId" rules={[{required: true, message: "필수값입니다"}]}>
            <Input prefix={<UserOutlined/>}/>
          </Form.Item>
        </FormGroup>
        <Divider/>
        <FormGroup title="이름*">
          <Form.Item name="name" rules={[{required: true, message: "필수값입니다"}]}>
            <Input prefix={<FormOutlined/>}/>
          </Form.Item>
        </FormGroup>
        <Divider/>
        <FormGroup title="비밀번호*">
          <Form.Item name="password" rules={[{required: true, message: "필수값입니다"}]}>
            <Input type="password" prefix={<LockOutlined/>}/>
          </Form.Item>
        </FormGroup>
        <FormGroup title="비밀번호 확인">
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

                  return Promise.reject(new Error('입력한 비밀번호와 다릅니다. 동일하게 입력해주세요.'));
                },
              }),
            ]}
          >
            <Input type="password" prefix={<LockOutlined/>} placeholder="비밀번호 확인"/>
          </Form.Item>
        </FormGroup>
      </FormSection>
      <div className="text-center">
        <Button htmlType="submit" type="primary" loading={isLoading}>
          계정 신청
        </Button>
      </div>
    </DefaultForm>
  </DefaultModal>
}

export default React.memo(MemberSignUpModal);