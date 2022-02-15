import React, {useEffect, useState} from "react";
import {Button, Form, Input, message, PageHeader} from 'antd';
import {OrganizationService} from "./organization.service";
import {EDIT_MODE, FormItemLayout, FormTailItemLayout} from "../AppSettings";

const OrganizationForm = ({mode, selectedOrganization, onBack}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === EDIT_MODE) {
      form.setFieldsValue({
        name: selectedOrganization.name,
      });
    }
  }, [form, mode, selectedOrganization]);

  const save = (values) => {
    const organization = {
      name: values.name,
    };

    if (mode === EDIT_MODE) {
      setLoading(true);
      OrganizationService.changeName(selectedOrganization.id, organization).then(() => {
        message.success("저장되었습니다.");
      }).finally(() => {
        setLoading(false);
      });
    } else {
      if(selectedOrganization && selectedOrganization.id) {
        organization.parentOrganizationId = selectedOrganization.id;
      }

      setLoading(true);
      OrganizationService.createOrganization(organization).then(() => {
        message.success("저장되었습니다.");
      }).finally(() => {
        setLoading(false);
      });
    }
  }

  return (
    <>
      <PageHeader
        title={mode === EDIT_MODE ? "조직/부서 수정" : "조직/부서 추가"}
        subTitle={mode === EDIT_MODE ? "조직/부서를 수정합니다." : "조직/부서를 추가 합니다."}
        onBack={onBack}
      >
        <Form {...FormItemLayout} form={form} onFinish={save}>
          <Form.Item
            name="name"
            label="이름"
            rules={[
              {
                required: true,
                message: '이름을 입력해 주세요.',
              },
            ]}
          >
            <Input/>
          </Form.Item>
          <Form.Item {...FormTailItemLayout}>
            <Button type="primary" loading={loading} htmlType="submit">
              저장
            </Button>
          </Form.Item>
        </Form>
      </PageHeader>
    </>
  )
};
export default OrganizationForm;
