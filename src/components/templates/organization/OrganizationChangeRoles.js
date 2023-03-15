import React, {useEffect, useState} from "react";
import {Button, Descriptions, Form, message, Select} from 'antd';
import {PageHeader} from '@ant-design/pro-layout';
import OrganizationService from "../../../services/organization.service";
import AccessControlService from "../../../services/access.control.service";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {FormItemLayout, FormTailItemLayout} from "../../modules/layout/from-item";

const {Option} = Select;

const OrganizationChangeRoles = () => {
  const navigate = useNavigate();
  let params = useParams();
  const [searchParams] = useSearchParams();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [allRoles, setAllRoles] = useState([]);
  const [organization, setOrganization] = useState(null);

  useEffect(() => {
    AccessControlService.getRoles({page: 0}).then((response) => {
      setAllRoles(response.data.result);
      OrganizationService.getOrganizationById(params.organizationId).then((res) => {
        const organization = res.data;
        setOrganization(organization);
        form.setFieldsValue({
          assignRoles: organization.roles ? organization.roles.map(role => String(role.id)) : []
        });
      });
    });
  }, [form, params]);

  const save = (values) => {
    const assignRoles = {
      roleIds: values.assignRoles ? values.assignRoles.map(roleId => Number(roleId)) : [],
    };
    setLoading(true);
    OrganizationService.assignRoles(organization.id, assignRoles).then(() => {
      message.success("저장 되었습니다.");
    }).finally(() => {
      setLoading(false);
    });
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
        title="역할 변경"
        subTitle="조직의 역할을 변경 합니다."
        onBack={handleBack}
      >
        {organization &&
          <Descriptions>
            <Descriptions.Item label="조직 이름">{organization.name}</Descriptions.Item>
          </Descriptions>}
        <Form {...FormItemLayout} form={form} onFinish={save}>
          <Form.Item
            name="assignRoles"
          >
            <Select
              mode="multiple"
              allowClear
              showArrow
              style={{width: '100%'}}
              placeholder="역할을 선택해 주세요.(여러 역할 검색하여 선택할 수 있습니다)"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {allRoles && allRoles.map(role => (
                <Option key={role.id}>{role.name}</Option>
              ))}
            </Select>
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

export default OrganizationChangeRoles;
