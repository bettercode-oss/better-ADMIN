import React, {useState} from "react";
import DefaultModal from "@/components/shared/ui/default-modal";
import {Button, Form, Input} from "antd";
import {signIn} from "next-auth/react";

interface ILoginWithDorrayAccountModalProps {
  open: boolean,
  onHide: () => void;
}

interface IDoorayLoginFormValue {
  id: string;
  password: string;
}

const LoginWithDoorayAccountModal = ({open, onHide}: ILoginWithDorrayAccountModalProps) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleFinish = async (formValue: IDoorayLoginFormValue) => {
    setIsLoading(true);

    try {
      await signIn("login-with-dooray-credentials", { id: formValue.id, password: formValue.password });
    } catch (error) {
      setIsLoading(false);
    }
  }

  const handleAfterClose = () => {
    form.resetFields();
  };

  return <DefaultModal title="두레이 계정으로 로그인" open={open} handleHide={onHide} width={500} afterClose={handleAfterClose}>
    <Form<IDoorayLoginFormValue>
      form={form}
      layout="vertical"
      onFinish={handleFinish}
    >
      <Form.Item name="id" rules={[{required: true, message: "아이디를 입력해주세요"}]}>
        <Input size="large" placeholder="아이디"/>
      </Form.Item>

      <Form.Item name="password" rules={[{required: true, message: "비밀번호를 입력해주세요"}]}>
        <Input placeholder="비밀번호" type="password" size="large"/>
      </Form.Item>

      <Button size="large" type="primary" htmlType="submit" className="w-full" loading={isLoading}>
        로그인
      </Button>
    </Form>
  </DefaultModal>
}

export default React.memo(LoginWithDoorayAccountModal);