import React, {useEffect, useState} from "react";
import {Button, Form, Input, message, Select} from 'antd';
import {PageHeader} from '@ant-design/pro-layout';
import {AccessControlService} from "../../../../services/access.control.service";
import {EventBroadcaster, SHOW_ERROR_MESSAGE_EVENT_TOPIC} from "../../../../event/event.broadcaster";
import {adminConfig} from "../../../../config/admin.config";
import {FormItemLayout, FormTailItemLayout} from "../../../modules/layout/from-item";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";

const {Option} = Select;

let editRoleId = null;

const RoleForm = () => {
  const navigate = useNavigate();
  let params = useParams();
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [allPermissions, setAllPermissions] = useState([]);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    AccessControlService.getPermissions({page: 0}).then((response) => {
      setAllPermissions(response.data.result);
      if (params.roleId) {
        setEditMode(true);

        AccessControlService.getRoleById(params.roleId).then((res) => {
          const role = res.data;
          editRoleId = role.id;
          form.setFieldsValue({
            name: role.name,
            description: role.description,
            allowPermissions: role.permissions ? role.permissions.map(permission => String(permission.id)) : [],
          });
        });
      }
    });
  }, [params, form]);

  const save = (values) => {
    const role = {
      name: values.name,
      description: values.description,
      allowedPermissionIds: values.allowPermissions ? values.allowPermissions.map(id => Number(id)) : [],
    };

    setLoading(true);
    if (editMode) {
      AccessControlService.updateRole(editRoleId, role).then(handleSuccess).catch(handleFailure).finally(() => {
        setLoading(false);
      });

    } else {
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
      message.warn("이미 존재하는 역할입니다.");
    } else {
      EventBroadcaster.broadcast(SHOW_ERROR_MESSAGE_EVENT_TOPIC, adminConfig.errorMessage.serverInternalError);
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
        title={editMode ? "역할 수정" : "역할 생성"}
        subTitle={editMode ? "역할을 수정합니다." : "역할을 생성합니다."}
        onBack={handleBack}
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
