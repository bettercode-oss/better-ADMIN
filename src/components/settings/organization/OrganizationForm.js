import React, {useEffect, useState} from "react";
import {Button, Form, Input, message, PageHeader} from 'antd';
import {OrganizationService} from "./organization.service";

const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 7},
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 12},
    md: {span: 12},
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 10,
      offset: 7,
    }
  },
};

const OrganizationForm = ({mode, selectedOrganization, onBack}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === "NAME-CHANGE") {
      form.setFieldsValue({
        name: selectedOrganization.name,
      });
    }
  }, [form, mode, selectedOrganization]);

  const save = (values) => {
    const organization = {
      name: values.name,
    };

    if (mode === "NAME-CHANGE") {
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
        title={mode === "NAME-CHANGE" ? "조직/부서 수정" : "조직/부서 추가"}
        subTitle={mode === "NAME-CHANGE" ? "조직/부서를 수정합니다." : "조직/부서를 추가 합니다."}
        onBack={onBack}
      >
        <Form {...formItemLayout} form={form} onFinish={save}>
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
          <Form.Item {...tailFormItemLayout}>
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
