import DefaultForm from "@/components/shared/form/ui/default-form";
import FormGroup from "@/components/shared/form/ui/form-group";
import FormSection from "@/components/shared/form/ui/form-section";
import {Button, Form, message, Select} from "antd";
import {useForm} from "antd/lib/form/Form";
import React, {useState} from "react";
import {IRole} from "@/client/access-control/role";
import {assignRoles, IOrganizationRoleChangeFormValue} from "@/client/organization/organization";

interface IOrganizationRoleChangeFormProps {
  id: number;
  name: string;
  initialValues?: Partial<IOrganizationRoleChangeFormValue>;
  allRoles: IRole[]
}

const OrganizationRoleChangeForm = ({id, name, initialValues, allRoles}: IOrganizationRoleChangeFormProps) => {
  const [form] = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleFinish = async (formValue: IOrganizationRoleChangeFormValue) => {
    try {
      setIsLoading(true);
      await assignRoles(id, formValue);
      messageApi.success("저장했습니다.");
    } catch (error) {
      messageApi.error("에러가 발생했습니다");
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  return (
    <>
      {contextHolder}
      <DefaultForm<IOrganizationRoleChangeFormValue> form={form} initialValues={initialValues} onFinish={handleFinish}>
        <FormSection title={`${name} 역할 변경`} description="조직에 할당할 역할을 선택합니다.">
          <FormGroup title="역할">
            <Form.Item
              name="roleIds"
            >
              <Select
                mode="multiple"
                allowClear
                showArrow
                style={{width: '100%'}}
                placeholder="역할을 선택해 주세요.(여러 역할 검색하여 선택할 수 있습니다)"
                filterOption={(input, option) =>
                  String(option?.children).toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {allRoles && allRoles.map(role => (
                  <Select.Option key={role.id} value={role.id}>{role.name}</Select.Option>
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

export default React.memo(OrganizationRoleChangeForm);
