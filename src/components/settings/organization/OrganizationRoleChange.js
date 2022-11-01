import React, {useEffect, useState} from "react";
import {Button, Form, message, PageHeader, Select} from 'antd';
import {OrganizationService} from "./organization.service";
import {FormItemLayout, FormTailItemLayout} from "../AppSettings";
import {AccessControlService} from "../../templates/settings/access-control/access.control.service";

const {Option} = Select;

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
export default OrganizationRoleChange;
