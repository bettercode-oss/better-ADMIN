import DefaultForm from "@/components/shared/form/ui/default-form";
import FormGroup from "@/components/shared/form/ui/form-group";
import FormSection from "@/components/shared/form/ui/form-section";
import {Button, Divider, Form, Input, message} from "antd";
import {useForm} from "antd/lib/form/Form";
import React, {useState} from "react";
import {createPermission, IPermissionFormValue, updatePermission} from "@/client/access-control/permission";
import {HTTPError} from "ky/distribution/errors/HTTPError";

interface IPermissionFormProps {
  id?: string;
  initialValues?: Partial<IPermissionFormValue>;
}

const PermissionForm = ({id, initialValues}: IPermissionFormProps) => {
  const [form] = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleFinish = async (formValue: IPermissionFormValue) => {
    try {
      setIsLoading(true);

      if (id) {
        await updatePermission(id, formValue);
        messageApi.success("수정되었습니다");
      } else {
        await createPermission(formValue);
        messageApi.success("생성되었습니다");
      }
    } catch (error) {
      const err = error as HTTPError;
      if (err.response?.status === 400) {
        const permissionError = await err.response.json();
        if (permissionError?.message === "duplicated") {
          messageApi.error("이미 존재하는 권한입니다.");
        } else {
          messageApi.error("잘못된 요청입니다.");
        }
      } else {
        messageApi.error("에러가 발생했습니다");
      }
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  return (
    <>
      {contextHolder}
      <DefaultForm<IPermissionFormValue> form={form} initialValues={initialValues} onFinish={handleFinish}>
        <FormSection title="권한 정보" description="권한 정보를 입력해주세요">
          <FormGroup title="권한 이름*">
            <Form.Item name="name" rules={[{
              required: true,
              message: '권한 이름을 입력해 주세요.',
            }, {
              pattern: RegExp('^[a-zA-Z0-9_]+$'),
              message: '영문자와 숫자 그리고 언더스코어(_)만 허용됩니다.'
            }]}>
              <Input/>
            </Form.Item>
          </FormGroup>
          <Divider/>
          <FormGroup title="권한 설명">
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

export default React.memo(PermissionForm);
