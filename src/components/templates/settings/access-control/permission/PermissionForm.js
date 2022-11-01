import React, {useEffect, useState} from "react";
import {Button, Form, Input, message, PageHeader} from 'antd';
import {AccessControlService} from "../access.control.service";
import {EventBroadcaster, SHOW_ERROR_MESSAGE_EVENT_TOPIC} from "../../../../../event/event.broadcaster";
import {adminConfig} from "../../../../../config/admin.config";
import {useNavigate, useParams} from "react-router-dom";
import {FormItemLayout, FormTailItemLayout} from "../../../../modules/layout/from-item";

let editPermissionId = null;
const PermissionForm = () => {
  const navigate = useNavigate();
  let params = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (params.permissionId) {
      setEditMode(true);
      AccessControlService.getPermissionById(params.permissionId).then((res) => {
        const permission = res.data;
        editPermissionId = permission.id;
        form.setFieldsValue({
          name: permission.name,
          description: permission.description,
        });
      });
    }
  }, [form, params]);

  const save = (values) => {
    const permission = {
      name: values.name,
      description: values.description,
    };

    setLoading(true);
    if (editMode) {
      AccessControlService.updatePermission(editPermissionId, permission).then(handleSuccess).catch(handleFailure).finally(() => {
        setLoading(false);
      });
    } else {
      AccessControlService.createPermission(permission)
        .then(handleSuccess)
        .catch(handleFailure).finally(() => {
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

  const handleBack = () => {
    navigate(-1);
  }

  return (
    <>
      <PageHeader
        title={editMode ? "권한 수정" : "권한 생성"}
        subTitle={editMode ? "권한을 수정합니다." : "권한을 생성합니다."}
        onBack={handleBack}
      >
        <Form {...FormItemLayout} form={form} onFinish={save}>
          <Form.Item
            name="name"
            label="권한 이름"
            rules={[{
              required: true,
              message: '권한 이름을 입력해 주세요.',
            }, {
              pattern: '^[a-zA-Z0-9_]+$',
              message: '영문자와 숫자 그리고 언더스코어(_)만 허용됩니다.'
            }]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            name="description"
            label="권한 설명"
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
export default PermissionForm;
