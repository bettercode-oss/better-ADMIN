import DefaultForm from "@/components/shared/form/ui/default-form";
import FormGroup from "@/components/shared/form/ui/form-group";
import FormSection from "@/components/shared/form/ui/form-section";
import {Button, Form, Input, message} from "antd";
import {useForm} from "antd/lib/form/Form";
import React, {useState} from "react";
import {changeName, createOrganization, IOrganizationFormValue} from "@/client/organization/organization";
import {useRouter} from "next/router";

interface IOrganizationFormProps {
  id?: number;
  initialValues?: Partial<IOrganizationFormValue>;
}

const OrganizationForm = ({id, initialValues}: IOrganizationFormProps) => {
  const router = useRouter();
  const [form] = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleFinish = async (formValue: IOrganizationFormValue) => {
    try {
      setIsLoading(true);

      if (id) {
        await changeName(id, formValue);
        messageApi.success("수정 되었습니다");
      } else {
        if (router.query.parentId) {
          formValue.parentOrganizationId = Number(router.query.parentId);
        }
        await createOrganization(formValue);
        messageApi.success("생성 되었습니다");
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
      <DefaultForm<IOrganizationFormValue> form={form} initialValues={initialValues} onFinish={handleFinish}>
        <FormSection title="조직 정보" description="조직 정보를 입력해주세요">
          <FormGroup title="조직 이름*">
            <Form.Item name="name" rules={[{
              required: true,
              message: '조직 이름을 입력해 주세요.',
            }]}>
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

export default React.memo(OrganizationForm);
