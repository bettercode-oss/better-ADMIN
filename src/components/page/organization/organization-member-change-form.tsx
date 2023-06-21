import DefaultForm from "@/components/shared/form/ui/default-form";
import FormGroup from "@/components/shared/form/ui/form-group";
import FormSection from "@/components/shared/form/ui/form-section";
import {Button, Form, message, Select} from "antd";
import {useForm} from "antd/lib/form/Form";
import React, {useState} from "react";
import {assignMembers, IOrganizationMemberChangeFormValue} from "@/client/organization/organization";
import {IMember} from "@/client/member/member";

interface IOrganizationMemberChangeFormProps {
  id: number;
  name: string;
  initialValues?: Partial<IOrganizationMemberChangeFormValue>;
  allMembers: IMember[]
}

const OrganizationMemberChangeForm = ({id, name, initialValues, allMembers}: IOrganizationMemberChangeFormProps) => {
  const [form] = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleFinish = async (formValue: IOrganizationMemberChangeFormValue) => {
    try {
      setIsLoading(true);
      await assignMembers(id, formValue);
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
      <DefaultForm<IOrganizationMemberChangeFormValue> form={form} initialValues={initialValues}
                                                       onFinish={handleFinish}>
        <FormSection title={`${name} 멤버 변경`} description="조직에 할당할 멤버을 선택합니다.">
          <FormGroup title="멤버">
            <Form.Item
              name="memberIds"
            >
              <Select
                mode="multiple"
                allowClear
                showArrow
                style={{width: '100%'}}
                placeholder="멤버를 선택해 주세요.(여러명을 검색하여 선택할 수 있습니다)"
                filterOption={(input, option) =>
                  String(option?.children).toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {allMembers && allMembers.map(member => (
                  <Select.Option key={member.id}
                                 value={member.id}>{member.name + '(' + member.candidateId + ')'}</Select.Option>
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

export default React.memo(OrganizationMemberChangeForm);
