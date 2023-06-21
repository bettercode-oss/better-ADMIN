import DefaultForm from "@/components/shared/form/ui/default-form";
import FormGroup from "@/components/shared/form/ui/form-group";
import FormSection from "@/components/shared/form/ui/form-section";
import {Button, Divider, Form, Input, message, Select} from "antd";
import {useForm} from "antd/lib/form/Form";
import React, {useState} from "react";
import {createRole, IRoleFormValue, updateRole} from "@/client/access-control/role";
import {IPermission} from "@/client/access-control/permission";
import {HTTPError} from "ky/distribution/errors/HTTPError";

interface IRoleFormProps {
  id?: string;
  initialValues?: Partial<IRoleFormValue>;
  allPermissions: IPermission[]
}

const RoleForm = ({id, initialValues, allPermissions}: IRoleFormProps) => {
  const [form] = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleFinish = async (formValue: IRoleFormValue) => {
    try {
      setIsLoading(true);

      if (id) {
        await updateRole(id, formValue);
        messageApi.success("수정되었습니다");
      } else {
        await createRole(formValue);
        messageApi.success("생성되었습니다");
      }
    } catch (error) {
      const err = error as HTTPError;
      if (err.response?.status === 400) {
        const permissionError = await err.response.json();
        if (permissionError?.message === "duplicated") {
          messageApi.error("이미 존재하는 역할입니다.");
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
      <DefaultForm<IRoleFormValue> form={form} initialValues={initialValues} onFinish={handleFinish}>
        <FormSection title="역할 정보" description="역할 정보를 입력해주세요">
          <FormGroup title="역할 이름*">
            <Form.Item name="name" rules={[{
              required: true,
              message: '역할 이름을 입력해 주세요.',
            }]}>
              <Input/>
            </Form.Item>
          </FormGroup>
          <Divider/>
          <FormGroup title="역할 설명">
            <Form.Item name="description">
              <Input/>
            </Form.Item>
          </FormGroup>
        </FormSection>

        <FormSection title="권한 할당" description="역할에 할당할 권한을 선택해 주세요.">
          <FormGroup title="권한">
            <Form.Item
              name="allowedPermissionIds"
              rules={[
                {
                  required: true,
                  message: '권한을 선택해 주세요.',
                },
              ]}
            >
              <Select
                mode="multiple"
                allowClear
                showArrow
                style={{width: '100%'}}
                placeholder="권한을 선택해 주세요.(여러 권한 검색하여 선택할 수 있습니다)"
                filterOption={(input, option) =>
                  String(option?.children).toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {allPermissions && allPermissions.map(permission => (
                  <Select.Option key={permission.id} value={permission.id}>{permission.name}</Select.Option>
                ))}
              </Select>
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

export default React.memo(RoleForm);
