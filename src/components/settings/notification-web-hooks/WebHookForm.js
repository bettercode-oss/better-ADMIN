import React, {useEffect, useState} from "react";
import {Button, Form, Input, message, PageHeader} from 'antd';
import {WebHookService} from "./webhook.service";
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

const WebHookForm = ({mode, selectedWebHook, onBack}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === EDIT_MODE) {
      form.setFieldsValue({
        name: selectedWebHook.name,
        description: selectedWebHook.description,
      });
    }
  }, [form, mode, selectedWebHook]);

  const save = (values) => {
    const webHook = {
      name: values.name,
      description: values.description,
    };

    setLoading(true);
    if (mode === EDIT_MODE) {
      WebHookService.updateWebHook(selectedWebHook.id, webHook).then(handleSuccess).finally(() => {
        setLoading(false);
      });
    } else if (mode === CREATE_MODE) {
      WebHookService.createWebHook(webHook).then(handleSuccess).finally(() => {
        setLoading(false);
      });
    }
  }

  const handleSuccess = () => {
    message.success("저장 되었습니다.");
  }

  return (
    <>
      <PageHeader
        title="웹훅(WebHook) 추가"
        subTitle="웹훅을 추가 합니다."
        onBack={onBack}
      >
        <Form {...formItemLayout} form={form} onFinish={save}>
          <Form.Item
            name="name"
            label="웹훅 이름"
            rules={[{
              required: true,
              message: '권한 이름을 입력해 주세요.',
            }]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            name="description"
            label="웹훅 설명"
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
export default WebHookForm;
