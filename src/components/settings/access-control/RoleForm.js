import React, {useEffect, useState} from "react";
import {Button, Form, Input, message, PageHeader, Select} from 'antd';
import {AccessControlService} from "./access.control.service";
import {CREATE_MODE, EDIT_MODE, FormItemLayout, FormTailItemLayout} from "../AppSettings";
import {EventBroadcaster, SHOW_ERROR_MESSAGE_EVENT_TOPIC} from "../../../event/event.broadcaster";
import {adminConfig} from "../../../config/admin.config";

const {Option} = Select;

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
          allowPermissions: selectedRole.permissions ? selectedRole.permissions.map(permission => String(permission.id)) : [],
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
      allowedPermissionIds: values.allowPermissions ? values.allowPermissions.map(id => Number(id)) : [],
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
    } else {
      EventBroadcaster.broadcast(SHOW_ERROR_MESSAGE_EVENT_TOPIC, adminConfig.errorMessage.serverInternalError);
    }
  }

  return (
    <>
      <PageHeader
        title="역할 추가"
        subTitle="역할을 추가 합니다."
        onBack={onBack}
      >
        <Form {...FormItemLayout} form={form} onFinish={save}>
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
            <Select
              mode="multiple"
              allowClear
              showArrow
              style={{width: '100%'}}
              placeholder="권한을 선택해 주세요.(여러 권한 검색하여 선택할 수 있습니다)"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {allPermissions && allPermissions.map(permission => (
                <Option key={permission.id}>{permission.name}</Option>
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
export default RoleForm;
