import React, {useEffect, useState} from "react";
import {Button, Form, Input, message, PageHeader} from 'antd';
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

const PermissionForm = ({mode, selectedPermission, onBack}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === EDIT_MODE) {
      form.setFieldsValue({
        name: selectedPermission.name,
        description: selectedPermission.description,
      });
    }
  }, [form, mode, selectedPermission]);

  const save = (values) => {
    const permission = {
      name: values.name,
      description: values.description,
    };

    if (mode === EDIT_MODE) {
      setLoading(true);
      AccessControlService.updatePermission(selectedPermission.id, permission).then(handleSuccess).catch(handleFailure).finally(() => {
        setLoading(false);
      });
    } else if (mode === CREATE_MODE) {
      setLoading(true);
      AccessControlService.createPermission(permission).then(handleSuccess).catch(handleFailure).finally(() => {
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
      message.error("오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    }
  }

  return (
    <>
      <PageHeader
        title="권한 추가"
        subTitle="권한을 추가 합니다."
        onBack={onBack}
      >
        <Form {...formItemLayout} form={form} onFinish={save}>
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
export default PermissionForm;
