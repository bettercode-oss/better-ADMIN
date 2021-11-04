import React, {useEffect, useState} from "react";
import {Button, Form, message, PageHeader, Select} from 'antd';
import {AccessControlService} from "../access-control/access.control.service";
import {OrganizationService} from "./organization.service";

const {Option} = Select;

const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 7},
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 12},
    md: {span: 24},
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

const OrganizationRoleChange = ({organization, onBack}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [allRoles, setAllRoles] = useState([]);

  useEffect(() => {
    AccessControlService.getRoles({page: 0}).then((response) => {
      setAllRoles(response.data.result);
      form.setFieldsValue({
        assignRoles: organization.roles ? organization.roles.map(role => String(role.id)) : []
      });
    });
  }, [form, organization]);

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

  return (
    <>
      <PageHeader
        title="역할 변경"
        subTitle="조직의 역할을 변경 합니다."
        onBack={onBack}
      >
        <Form {...formItemLayout} form={form} onFinish={save}>
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
export default OrganizationRoleChange;
