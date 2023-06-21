import DefaultForm from "@/components/shared/form/ui/default-form";
import FormGroup from "@/components/shared/form/ui/form-group";
import FormSection from "@/components/shared/form/ui/form-section";
import {Button, Divider, Form, Input, message} from "antd";
import {useForm} from "antd/lib/form/Form";
import React, {useState} from "react";
import {createWebHook, IWebHookFormValue, updateWebHook} from "@/client/settings/webhook-settings";

interface IWebHookFormValueProps {
  id?: number;
  initialValues?: Partial<IWebHookFormValue>;
}

const NotificationWebHookForm = ({id, initialValues}: IWebHookFormValueProps) => {
  const [form] = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleFinish = async (formValue: IWebHookFormValue) => {
    try {
      setIsLoading(true);

      if (id) {
        await updateWebHook(id, formValue);
        messageApi.success("수정되었습니다");
      } else {
        await createWebHook(formValue);
        messageApi.success("생성되었습니다");
      }
    } catch (error) {
      messageApi.error("에러가 발생했습니다");
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  return (
    <>
      {contextHolder}
      <DefaultForm<IWebHookFormValue> form={form} initialValues={initialValues} onFinish={handleFinish}>
        <FormSection title="웹훅 정보" description="웹훅 정보를 입력해주세요">
          <FormGroup title="이름*">
            <Form.Item name="name" rules={[{
              required: true,
              message: '이름을 입력해 주세요.',
            }]}>
              <Input/>
            </Form.Item>
          </FormGroup>
          <Divider/>
          <FormGroup title="설명">
            <Form.Item name="description">
              <Input/>
            </Form.Item>
          </FormGroup>
        </FormSection>
        <div className="text-center">
          <Button htmlType="submit" type="primary" loading={isLoading}>
            저장
          </Button>
        </div>
      </DefaultForm>
    </>
  );
};

export default React.memo(NotificationWebHookForm);