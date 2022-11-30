import React, {useEffect, useState} from "react";
import {Button, Form, Input, message, PageHeader} from 'antd';
import {OrganizationService} from "./organization.service";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {FormItemLayout, FormTailItemLayout} from "../../modules/layout/from-item";

const OrganizationForm = () => {
  const navigate = useNavigate();
  let params = useParams();
  const [searchParams] = useSearchParams();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (params.organizationId) {
      setEditMode(true);
      OrganizationService.getOrganizationById(params.organizationId).then((res) => {
        form.setFieldsValue({
          name: res.data.name,
        });
      });
    }
  }, [form, params]);

  const save = (values) => {
    const organization = {
      name: values.name,
    };

    if (editMode) {
      setLoading(true);
      OrganizationService.changeName(params.organizationId, organization).then(() => {
        message.success("저장되었습니다.");
      }).finally(() => {
        setLoading(false);
      });
    } else {
      if (searchParams.get('parentId')) {
        organization.parentOrganizationId = Number(searchParams.get('parentId'));
      }

      setLoading(true);
      OrganizationService.createOrganization(organization).then(() => {
        message.success("저장되었습니다.");
      }).finally(() => {
        setLoading(false);
      });
    }
  }

  const handleBack = () => {
    if(searchParams.get('backUrl')) {
      navigate(searchParams.get('backUrl'));
    } else {
      navigate(-1);
    }
  }

  return (
    <>
      <PageHeader
        title={editMode ? "조직/부서 수정" : "조직/부서 추가"}
        subTitle={editMode ? "조직/부서를 수정합니다." : "조직/부서를 추가 합니다."}
        onBack={handleBack}
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
