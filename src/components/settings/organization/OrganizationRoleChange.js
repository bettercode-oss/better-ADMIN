import React, {useEffect, useState} from "react";
import {Button, Checkbox, Form, PageHeader, Row, message} from 'antd';
import {AccessControlService} from "../access-control/access.control.service";
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

const OrganizationRoleChange = ({organization, onBack}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [allRoles, setAllRoles] = useState([]);

  useEffect(() => {
    AccessControlService.getRoles({page: 0}).then((response) => {
      setAllRoles(response.data.result);
      form.setFieldsValue({
        assignRoles: organization.roles ? organization.roles.map(role => role.id) : []
      });
    });
  }, [form, organization]);

  const save = (values) => {
    const assignRoles = {
      roleIds: values.assignRoles ? values.assignRoles : [],
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
            <Checkbox.Group style={{width: '100%'}}>
              {allRoles && allRoles.map(role => (
                <Row key={role.id} style={{textAlign: "center"}}>
                  <Checkbox value={role.id}>{role.name}</Checkbox>
                </Row>
              ))}
            </Checkbox.Group>
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
