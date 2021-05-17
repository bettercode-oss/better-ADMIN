import React, {useEffect, useState} from "react";
import {Button, Checkbox, Form, Input, message, PageHeader, Row} from 'antd';
import {AccessControlService} from "./access.control.service";
import {CREATE_MODE, EDIT_MODE} from "../AppSettings";

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

const RoleForm = ({mode, selectedRole, onBack}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [allPermissions, setAllPermissions] = useState([]);

  useEffect(() => {
    AccessControlService.getPermissions({page: 0}).then((response) => {
      setAllPermissions(response.data.result);
      if (mode === EDIT_MODE) {
        form.setFieldsValue({
          name: selectedRole.name,
          description: selectedRole.description,
          allowPermissions: selectedRole.permissions ? selectedRole.permissions.map(permission => permission.id) : [],
        });
      }
    }).catch((err) => {
      console.log(err);
    });
  }, [form, mode, selectedRole]);

  const save = (values) => {
    const role = {
      name: values.name,
      description: values.description,
      allowedPermissionIds: values.allowPermissions,
    };

    if (mode === EDIT_MODE) {
      setLoading(true);
      AccessControlService.updateRole(selectedRole.id, role).then(handleSuccess).catch(handleFailure).finally(() => {
        setLoading(false);
      });

    } else if (mode === CREATE_MODE) {
      setLoading(true);
      AccessControlService.createRole(role).then(handleSuccess).catch(handleFailure).finally(() => {
        setLoading(false);
      });
    }
  }

  const handleSuccess = () => {
    message.success("저장 되었습니다.");
  }

  const handleFailure = (err) => {
    if (err.response.status === 400 && err.response.data && err.response.data.message && err.response.data.message === "duplicated") {
      message.warn("이미 존재하는 권한입니다.");
    }
  }

  return (
    <>
      <PageHeader
        title="역할 추가"
        subTitle="역할을 추가 합니다."
        onBack={onBack}
      >
        <Form {...formItemLayout} form={form} onFinish={save}>
          <Form.Item
            name="name"
            label="역할 이름"
            rules={[
              {
                required: true,
                message: '역할 이름을 입력해 주세요.',
              },
            ]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            name="description"
            label="역할 설명"
          >
            <Input/>
          </Form.Item>
          <Form.Item
            name="allowPermissions"
            label="권한 할당"
            rules={[
              {
                required: true,
                message: '권한을 선택해 주세요.',
              },
            ]}
          >
            <Checkbox.Group style={{width: '100%'}}>
              {allPermissions && allPermissions.map(permission => (
                <Row key={permission.id}>
                  <Checkbox value={permission.id}>{permission.name}</Checkbox>
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
export default RoleForm;
